import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { useTerritories } from '../../hooks/useTerritories';
import { useCampaigns } from '../../hooks/useCampaigns';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Typography,
  Skeleton,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  Stack,
  CardContent,
  LinearProgress,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import ExploreIcon from '@mui/icons-material/Explore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CampaignIcon from '@mui/icons-material/Campaign';

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, loading: dashboardLoading } = useDashboard();
  const { setSearchTerm } = useTerritories();
  const { activeCampaigns, loading: campaignsLoading } = useCampaigns();

  const handleNavigateAndSearch = (numeroTerritorio) => {
    setSearchTerm(numeroTerritorio.numero);
    navigate('/designacoes');
  };
  
  const currentCampaign = activeCampaigns?.[0];

  if (dashboardLoading || campaignsLoading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Não foi possível carregar as informações do dashboard.
        </Typography>
      </Box>
    );
  }

  const { counts, overdueTerritories, assignmentSuggestions } = stats;

  return (
    <Stack spacing={4}>
      
      {currentCampaign && <CampaignProgressCard campaign={currentCampaign} />}

      <Card variant="outlined">
        <CardHeader title="Visão Geral dos Territórios"/>
        <Divider />
        <Grid container spacing={3} justifyContent="space-around" columns={12}>
  <Grid size={{ xs: 12, sm: 4 }}>
    <KPICard
      title="Total de Territórios"
      value={counts.total}
      icon={<PublicIcon fontSize="large" color="primary" />}
    />
  </Grid>
  <Grid size={{ xs: 12, sm: 4 }}>
    <KPICard
      title="Em Campo"
      value={counts.em_campo}
      icon={<ExploreIcon fontSize="large" color="warning" />}
    />
  </Grid>
  <Grid size={{ xs: 12, sm: 4 }}>
    <KPICard
      title="Disponíveis"
      value={counts.disponivel}
      icon={<CheckCircleOutlineIcon fontSize="large" color="success" />}
    />
  </Grid>
</Grid>

      </Card>

      <ActionList
        title={`Territórios Atrasados (${overdueTerritories.length})`}
        items={overdueTerritories}
        icon={<WarningAmberRoundedIcon sx={{ color: 'warning.main' }} />}
        primaryText={t => `Território Nº ${t.numero}`}
        secondaryText={t => `Com ${t.pessoa_nome} desde ${new Date(t.data_saida).toLocaleDateString()}`}
        emptyText="Nenhum território atrasado. Bom trabalho!"
        onItemClick={handleNavigateAndSearch}
      />
      
      <ActionList
        title={`Sugestões para Designação (${assignmentSuggestions.length})`}
        items={assignmentSuggestions}
        icon={<StarBorderRoundedIcon sx={{ color: 'info.main' }} />}
        primaryText={t => `Território Nº ${t.numero}`}
        secondaryText={t => t.ultima_devolucao ? `Última devolução em: ${new Date(t.ultima_devolucao).toLocaleDateString()}` : 'Nunca trabalhado'}
        emptyText="Nenhum território disponível para sugerir no momento."
        onItemClick={handleNavigateAndSearch}
      />
    </Stack>
  );
};

// --- NOVOS E ANTIGOS COMPONENTES AUXILIARES ---

const CampaignProgressCard = ({ campaign }) => {
  const trabalhados = parseInt(campaign.trabalhados_count, 10);
  const total = parseInt(campaign.total_territorios, 10);
  const faltam = total - trabalhados;
  const progresso = total > 0 ? (trabalhados / total) * 100 : 0;

  return (
    <Card sx={{ }}>
      <CardHeader
        avatar={<CampaignIcon />}
        title={`Campanha Ativa: ${campaign.titulo}`}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Progresso</Typography>
          <Typography variant="body2">{progresso.toFixed(0)}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progresso}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: 'text.secondary',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              bgcolor: 'primary.main',
            },
          }}
        />
<Grid container sx={{ mt: 2, textAlign: 'center' }} columns={12}>
  <Grid size={6} sx={{ borderRight: '1px solid rgba(255, 255, 255, 0.3)' }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{trabalhados}</Typography>
    <Typography variant="caption" sx={{ px: 1 }}>Trabalhados</Typography>
  </Grid>
  <Grid size={6}>
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{faltam}</Typography>
    <Typography variant="caption" sx={{ px: 1 }}>Faltam</Typography>
  </Grid>
</Grid>

      </CardContent>
    </Card>
  );
};

const KPICard = ({ title, value, icon }) => (
  <Box sx={{ textAlign: 'center', p: 2 }}>
    <Box sx={{ mb: 1 }}>{icon}</Box>
    <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
    <Typography color="text.secondary">{title}</Typography>
  </Box>
);

const ActionList = ({ title, items, icon, primaryText, secondaryText, emptyText, onItemClick }) => (
  <Card variant="outlined">
    <CardHeader title={title} />
    <Divider />
    <List disablePadding>
      {items.length > 0 ? (
        items.map((item, index) => (
          <ListItemButton key={index} onClick={() => onItemClick(item)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primaryText(item)} secondary={secondaryText(item)} />
          </ListItemButton>
        ))
      ) : (
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <SentimentSatisfiedAltIcon />
          <Typography variant="body2">{emptyText}</Typography>
        </Box>
      )}
    </List>
  </Card>
);

const DashboardSkeleton = () => (
  <Stack spacing={4} sx={{ maxWidth: 1200, margin: '0 auto', px: { xs: 1, sm: 2, md: 3 }, py: 3 }}>
    <Skeleton variant="rounded" height={160} />
    <Skeleton variant="rounded" height={100} />
    <Skeleton variant="rounded" height={200} />
    <Skeleton variant="rounded" height={200} />
  </Stack>
);

export default Dashboard;