// src/pages/Territory/TerritoryList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTerritories } from '../../hooks/useTerritories';
import { Box, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';

const TerritoryList = () => {
  const { territories, loading, fetchTerritories } = useTerritories();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [territoryToDelete, setTerritoryToDelete] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [viewingMap, setViewingMap] = useState({ numero: '', url: '' });

  const handleEditClick = (territory) => {
    setEditingTerritory(territory);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (territoryId) => {
    setTerritoryToDelete(territoryId);
    setIsConfirmOpen(true);
  };
  
  const API_URL = import.meta.env.VITE_API_URL;

  const handleConfirmDelete = async () => {
    if (!territoryToDelete) return;
    try {
      await axios.delete(`${API_URL}/territorios/${territoryToDelete}`);
      toast.success('Território excluído com sucesso!');
      fetchTerritories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Falha ao excluir território.');
    } finally {
      setIsConfirmOpen(false);
      setTerritoryToDelete(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTerritory) return;
    try {
      await axios.put(`${API_URL}/territorios/${editingTerritory.id}`, {
        numero: editingTerritory.numero,
        descricao: editingTerritory.descricao,
      });
      toast.success('Território atualizado com sucesso!');
      handleCloseEditModal();
      fetchTerritories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Falha ao atualizar território.');
    }
  };

  const handleFieldChange = (event) => setEditingTerritory({ ...editingTerritory, [event.target.name]: event.target.value });
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTerritory(null);
  };

  const handleViewMapClick = (territorio) => {
    setViewingMap({ numero: territorio.numero, url: territorio.url_imagem });
    setIsMapModalOpen(true);
  };
  
  const handleCloseMapModal = () => setIsMapModalOpen(false);

  const columns = [
    { field: 'numero', headerName: 'Número', width: 100 },
    { field: 'descricao', headerName: 'Descrição', flex: 1, minWidth: 250 },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      filterable: false,
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box>
          <Tooltip title="Ver Mapa">
            <IconButton onClick={() => handleViewMapClick(params.row)}>
              <MapIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      {/* MELHORIA 2: Container da tabela com rolagem horizontal */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={territories}
          columns={columns}
          loading={loading}
          autoHeight
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
           sx={{
            // Largura mínima para garantir que a rolagem funcione bem
            minWidth: 650,
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
          }}
        />
      </Box>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Território</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="numero" label="Número" type="text" fullWidth variant="outlined" value={editingTerritory?.numero || ''} onChange={handleFieldChange} sx={{ mb: 2, mt: 1 }} />
          <TextField margin="dense" name="descricao" label="Descrição" type="text" fullWidth variant="outlined" value={editingTerritory?.descricao || ''} onChange={handleFieldChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><DialogContentText>Tem certeza que deseja excluir este território?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal do Mapa */}
      <Dialog open={isMapModalOpen} onClose={handleCloseMapModal} maxWidth="md">
        <DialogTitle>Mapa do Território Nº: {viewingMap.numero}</DialogTitle>
        <DialogContent>
          {viewingMap.url ? (
            <img 
              src={`${API_URL}/${viewingMap.url}`} 
              alt={`Mapa do Território ${viewingMap.numero}`} 
              style={{ width: '100%', height: 'auto' }} 
            />
          ) : (
            <Typography>Nenhuma imagem de mapa cadastrada para este território.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMapModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TerritoryList;