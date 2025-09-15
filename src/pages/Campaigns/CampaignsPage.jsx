import React, { useState, useEffect } from 'react';
import { useCampaigns } from '../../hooks/useCampaigns';
import {
  Box,
  Button,
  Typography,
  TextField,
  // 1. Novas importações para o layout de Card
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
import CustomModal from '../../components/ui/CustomModal';

const CampaignsPage = () => {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  // 2. Estados para controlar o Menu de Ações
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

  // 3. A definição de "columns" do DataGrid foi removida.

  // Card de Progresso da Campanha aninhado para reutilização
  const CampaignProgressCard = ({ campaign }) => {
    const trabalhados = parseInt(campaign.trabalhados_count, 10) || 0;
    const total = parseInt(campaign.total_territorios, 10) || 0;
    const faltam = total - trabalhados;
    const progresso = total > 0 ? (trabalhados / total) * 100 : 0;
  
    return (
      <Card key={campaign.id} variant="outlined">
        <CardHeader
          action={
            <IconButton onClick={(e) => handleMenuOpen(e, campaign)}>
              <MoreVertIcon />
            </IconButton>
          }
          title={campaign.titulo}
          titleTypographyProps={{ variant: 'h6' }}
          subheader={`De ${dayjs(campaign.data_inicio).format('DD/MM/YY')} a ${dayjs(campaign.data_fim).format('DD/MM/YY')}`}
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

      {/* 4. DataGrid substituído por Stack de Cards e Skeletons */}
      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={180} />
          <Skeleton variant="rounded" height={180} />
        </Stack>
      ) : (
        <Stack spacing={2}>
          {campaigns.map((campaign) => (
            <CampaignProgressCard key={campaign.id} campaign={campaign} />
          ))}
        </Stack>
      )}

      {/* 5. Menu de Ações para os cards */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenModal(currentCampaignForMenu)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteCampaign(currentCampaignForMenu.id)} sx={{ color: 'error.main' }}>
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