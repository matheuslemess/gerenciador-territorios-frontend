import React, { useState, useEffect } from 'react';
import { useCampaigns } from '../../hooks/useCampaigns';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Skeleton,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// NOVO: Importação do ícone para o estado vazio
import CampaignIcon from '@mui/icons-material/Campaign'; 
import CustomModal from '../../components/ui/CustomModal';


const CampaignProgressCard = ({ campaign, onMenuOpen }) => {
  const trabalhados = parseInt(campaign.trabalhados_count, 10) || 0;
  const total = parseInt(campaign.total_territorios, 10) || 0;
  const faltam = total - trabalhados;
  const progresso = total > 0 ? (trabalhados / total) * 100 : 0;

  return (
    <Card variant="outlined">
      <CardHeader
        action={
          <IconButton onClick={(e) => onMenuOpen(e, campaign)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={campaign.titulo}
        titleTypographyProps={{ variant: 'h6' }}
        subheader={campaign.data_inicio && campaign.data_fim ? `De ${dayjs(campaign.data_inicio).format('DD/MM/YY')} a ${dayjs(campaign.data_fim).format('DD/MM/YY')}` : 'Datas não definidas'}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Progresso</Typography>
          <Typography variant="body2">{progresso.toFixed(0)}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progresso} sx={{ height: 8, borderRadius: 5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, textAlign: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{trabalhados}</Typography>
            <Typography variant="caption">Trabalhados</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{faltam}</Typography>
            <Typography variant="caption">Faltam</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{total}</Typography>
            <Typography variant="caption">Total</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


const CampaignsPage = () => {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentCampaignForMenu, setCurrentCampaignForMenu] = useState(null);

  const handleMenuOpen = (event, campaign) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentCampaignForMenu(campaign);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentCampaignForMenu(null);
  };

  useEffect(() => {
    if (editingCampaign) {
      setTitulo(editingCampaign.titulo);
      setDataInicio(editingCampaign.data_inicio ? dayjs(editingCampaign.data_inicio) : null);
      setDataFim(editingCampaign.data_fim ? dayjs(editingCampaign.data_fim) : null);
    } else {
      setTitulo('');
      setDataInicio(null);
      setDataFim(null);
    }
  }, [editingCampaign]);

  const handleOpenModal = (campaign = null) => {
    handleMenuClose();
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaignId) => {
    handleMenuClose();
    deleteCampaign(campaignId);
  }

  const handleSubmit = async () => {
    const campaignData = {
      titulo,
      data_inicio: dataInicio ? dataInicio.format('YYYY-MM-DD') : null,
      data_fim: dataFim ? dataFim.format('YYYY-MM-DD') : null,
    };

    if (editingCampaign) {
      await updateCampaign(editingCampaign.id, campaignData);
    } else {
      await createCampaign(campaignData);
    }
    handleCloseModal();
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Campanhas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => handleOpenModal()}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Nova Campanha
        </Button>
      </Box>

      {/* LÓGICA DE RENDERIZAÇÃO ATUALIZADA */}
      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={180} />
          <Skeleton variant="rounded" height={180} />
        </Stack>
      ) : campaigns.length === 0 ? (
        // NOVO: Bloco para quando a lista de campanhas está vazia
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" component="p" gutterBottom>
            Nenhuma campanha encontrada
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Clique no botão "Nova Campanha" acima para criar a sua primeira.
          </Typography>
        </Box>
      ) : (
        // Bloco original que renderiza a lista quando ela tem itens
        <Stack spacing={2}>
          {campaigns.map((campaign) => (
            <CampaignProgressCard 
              key={campaign.id} 
              campaign={campaign} 
              onMenuOpen={handleMenuOpen}
            />
          ))}
        </Stack>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenModal(currentCampaignForMenu)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => currentCampaignForMenu && handleDeleteCampaign(currentCampaignForMenu.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
        onConfirm={handleSubmit}
        confirmText="Salvar"
      >
        <TextField autoFocus margin="dense" label="Título da Campanha" type="text" fullWidth variant="outlined" value={titulo} onChange={(e) => setTitulo(e.target.value)} sx={{ mt: 1 }} />
        <DatePicker label="Data de Início" value={dataInicio} onChange={(newValue) => setDataInicio(newValue)} sx={{ mt: 2, width: '100%' }} />
        <DatePicker label="Data de Fim" value={dataFim} onChange={(newValue) => setDataFim(newValue)} sx={{ mt: 2, width: '100%' }} />
      </CustomModal>
    </LocalizationProvider>
  );
};

export default CampaignsPage;