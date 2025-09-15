import React, { useState, useEffect } from 'react';
import { useCampaigns } from '../../hooks/useCampaigns';
import {
  Box,
  Button,
  Typography,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomModal from '../../components/ui/CustomModal';

const CampaignsPage = () => {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  useEffect(() => {
    if (editingCampaign) {
      setTitulo(editingCampaign.titulo);
      setDataInicio(dayjs(editingCampaign.data_inicio));
      setDataFim(dayjs(editingCampaign.data_fim));
    } else {
      setTitulo('');
      setDataInicio(null);
      setDataFim(null);
    }
  }, [editingCampaign]);

  const handleOpenModal = (campaign = null) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleSubmit = async () => {
    const campaignData = {
      titulo,
      data_inicio: dataInicio ? dataInicio.format('YYYY-MM-DD') : null,
      data_fim: dataFim ? dataFim.format('YYYY-MM-DD') : null,
    };

    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, campaignData);
      } else {
        await createCampaign(campaignData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Falha ao salvar campanha:', error);
    }
  };

  const columns = [
    { field: 'titulo', headerName: 'Título da Campanha', flex: 1, minWidth: 250 },
    {
      field: 'trabalhados_count',
      headerName: 'Trabalhados',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'faltam_count',
      headerName: 'Faltam',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'data_inicio',
      headerName: 'Início',
      width: 130,
      renderCell: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : '',
    },
    {
      field: 'data_fim',
      headerName: 'Fim',
      width: 130,
      renderCell: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : '',
    },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleOpenModal(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton onClick={() => deleteCampaign(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {/* ATUALIZAÇÃO 1: Cabeçalho se torna responsivo */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Empilha em telas pequenas, fica em linha em telas maiores
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' }, // Alinhamento ajustado para cada modo
          mb: 3,
          gap: 2, // Espaçamento entre os itens (útil quando empilhado)
        }}
      >
        <Typography variant="h4" component="h1">
          Campanhas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => handleOpenModal()}
        >
          Nova Campanha
        </Button>
      </Box>

      {/* ATUALIZAÇÃO 2: Container da tabela agora permite rolagem horizontal */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={campaigns}
          columns={columns}
          loading={loading}
          autoHeight
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          // Garante que a tabela tenha uma largura mínima, forçando a rolagem a aparecer
          sx={{ minWidth: 700 }}
        />
      </Box>

      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
        onConfirm={handleSubmit}
        confirmText="Salvar"
      >
        <TextField
          autoFocus
          margin="dense"
          label="Título da Campanha"
          type="text"
          fullWidth
          variant="outlined"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          sx={{ mt: 1 }}
        />
        <DatePicker
          label="Data de Início"
          value={dataInicio}
          onChange={(newValue) => setDataInicio(newValue)}
          sx={{ mt: 2, width: '100%' }}
        />
        <DatePicker
          label="Data de Fim"
          value={dataFim}
          onChange={(newValue) => setDataFim(newValue)}
          sx={{ mt: 2, width: '100%' }}
        />
      </CustomModal>
    </LocalizationProvider>
  );
};

export default CampaignsPage;