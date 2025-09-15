// src/pages/Territory/TerritoryList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTerritories } from '../../hooks/useTerritories';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  TextField, 
  Typography,
  // 1. Novas importações para o layout de Card
  Card,
  CardHeader,
  CardContent,
  Stack,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Ícone do menu de ações

const TerritoryList = () => {
  const { territories, loading, fetchTerritories } = useTerritories();

  // Estados para os modais existentes
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [territoryToDelete, setTerritoryToDelete] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [viewingMap, setViewingMap] = useState({ numero: '', url: '' });

  // 2. Estados para controlar o Menu de Ações de cada card
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentTerritory, setCurrentTerritory] = useState(null);

  const handleMenuOpen = (event, territory) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentTerritory(territory);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentTerritory(null);
  };

  const handleEditClick = (territory) => {
    handleMenuClose();
    setEditingTerritory(territory);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (territoryId) => {
    handleMenuClose();
    setTerritoryToDelete(territoryId);
    setIsConfirmOpen(true);
  };

  const handleViewMapClick = (territorio) => {
    handleMenuClose();
    setViewingMap({ numero: territorio.numero, url: territorio.url_imagem });
    setIsMapModalOpen(true);
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
  
  const handleCloseMapModal = () => setIsMapModalOpen(false);

  // 3. A constante "columns" do DataGrid foi removida.

  // 4. Se estiver carregando, mostra esqueletos de cards
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={120} />
      </Stack>
    );
  }

  return (
    <>
      {/* 5. DataGrid substituído por um Stack de Cards */}
      <Stack spacing={2}>
        {territories.map((territory) => (
          <Card key={territory.id} variant="outlined">
            <CardHeader
              action={
                <IconButton onClick={(e) => handleMenuOpen(e, territory)}>
                  <MoreVertIcon />
                </IconButton>
              }
              title={`Território Nº: ${territory.numero}`}
              subheader={territory.descricao}
            />
            <CardContent sx={{ pt: 0 }}>
              <Chip 
                label={territory.status} 
                color={territory.status === 'Disponível' ? 'success' : 'warning'}
                size="small" 
              />
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* 6. Menu de Ações para os cards */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewMapClick(currentTerritory)}>
          <ListItemIcon><MapIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver Mapa</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEditClick(currentTerritory)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(currentTerritory.id)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modais existentes (não precisam de alteração) */}
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
      
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><DialogContentText>Tem certeza que deseja excluir este território?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

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