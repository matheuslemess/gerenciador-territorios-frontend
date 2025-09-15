import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGroups } from '../../hooks/useGroups';
import { useTerritories } from '../../hooks/useTerritories';
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid,
  CircularProgress, List, ListItem, ListItemText, Checkbox, Paper,
  Tooltip, IconButton, Divider, Chip, Stack, ListItemButton, Menu, MenuItem,
  ListItemIcon
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomModal from '../../components/ui/CustomModal';

const GroupsPage = () => {
  const { groups, loading: loadingGroups, createGroup, updateGroupName, associateTerritories, deleteGroup } = useGroups();
  const { territories: allTerritories, loading: loadingTerritories } = useTerritories();

  // Estados
  const [newGroupName, setNewGroupName] = useState('');
  const [isAssociating, setIsAssociating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [checkedTerritories, setCheckedTerritories] = useState(new Set());
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [newEditedName, setNewEditedName] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentGroupForMenu, setCurrentGroupForMenu] = useState(null);

  const handleMenuOpen = (event, group) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentGroupForMenu(group);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentGroupForMenu(null);
  };
  
  // Handlers
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return toast.error('O nome do grupo não pode ser vazio.');
    await createGroup(newGroupName);
    setNewGroupName('');
  };

  const handleOpenEditNameModal = (grupo) => {
    handleMenuClose();
    setEditingGroup(grupo);
    setNewEditedName(grupo.nome);
    setIsEditNameModalOpen(true);
  };

  const handleConfirmEditName = async () => {
    if (!editingGroup || !newEditedName.trim()) return;
    await updateGroupName(editingGroup.id, newEditedName);
    setIsEditNameModalOpen(false);
  };

  const handleEditAssociationsClick = (grupo) => {
    handleMenuClose();
    setEditingGroup(grupo);
    setCheckedTerritories(new Set(grupo.territorio_ids || []));
    setIsAssociating(true);
  };

  const handleToggleTerritory = (territoryId) => {
    const newChecked = new Set(checkedTerritories);
    newChecked.has(territoryId) ? newChecked.delete(territoryId) : newChecked.add(territoryId);
    setCheckedTerritories(newChecked);
  };

  const handleSaveChanges = async () => {
    if (!editingGroup) return;
    await associateTerritories(editingGroup.id, Array.from(checkedTerritories));
    setIsAssociating(false);
  };

  const handleDeleteClick = (group) => {
    handleMenuClose();
    setGroupToDelete(group);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    await deleteGroup(groupToDelete.id);
    setIsConfirmOpen(false);
    setGroupToDelete(null);
  };

  const territoriesForModal = useMemo(() => {
    if (!editingGroup) return [];
    const idsInCurrentGroup = new Set(editingGroup.territorio_ids || []);
    const idsInOtherGroups = new Set();
    groups.forEach(g => {
      if (g.id !== editingGroup.id && g.territorio_ids) {
        g.territorio_ids.forEach(id => idsInOtherGroups.add(id));
      }
    });
    return allTerritories
      .filter(t => idsInCurrentGroup.has(t.id) || !idsInOtherGroups.has(t.id))
      .sort((a, b) => parseInt(a.numero, 10) - parseInt(b.numero, 10));
  }, [allTerritories, groups, editingGroup]);

  if (loadingGroups || loadingTerritories) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Gerenciar Grupos</Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Criar Novo Grupo</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }} onSubmit={handleCreateGroup}>
            <TextField label="Nome do Grupo" variant="outlined" size="small" fullWidth value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
            <Button type="submit" variant="contained">Criar</Button>
          </Box>
        </CardContent>
      </Card>
      
      <Typography variant="h5" gutterBottom>Grupos Existentes</Typography>
      
      {/* ALTERAÇÃO AQUI: Trocamos o Grid pelo Stack para criar a lista vertical */}
      <Stack spacing={2}>
        {groups.map(grupo => {
          const territoriesInGroup = allTerritories.filter(t => (grupo.territorio_ids || []).includes(t.id));
          return (
            // O <Grid item> foi removido
            <Card key={grupo.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5">{grupo.nome}</Typography>
                  <IconButton onClick={(e) => handleMenuOpen(e, grupo)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Territórios ({territoriesInGroup.length}):</Typography>
                  {territoriesInGroup.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {territoriesInGroup.sort((a, b) => parseInt(a.numero) - parseInt(b.numero)).map(t => <Chip key={t.id} label={t.numero} size="small" />)}
                    </Box>
                  ) : ( <Typography variant="body2" color="text.secondary">Nenhum território associado.</Typography> )}
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenEditNameModal(currentGroupForMenu)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar Nome</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEditAssociationsClick(currentGroupForMenu)}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Associar Territórios</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(currentGroupForMenu)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Excluir Grupo</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modals */}
      {editingGroup && (
        <CustomModal
          open={isAssociating}
          onClose={() => setIsAssociating(false)}
          onConfirm={handleSaveChanges}
          title={`Editando associações: ${editingGroup.nome}`}
          confirmText="Salvar"
        >
          <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List dense>
              {territoriesForModal.map(t => (
                <ListItem key={t.id} dense disablePadding>
                  <ListItemButton onClick={() => handleToggleTerritory(t.id)}>
                    <Checkbox edge="start" checked={checkedTerritories.has(t.id)} tabIndex={-1} disableRipple />
                    <ListItemText primary={`Nº: ${t.numero}`} secondary={t.descricao} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </CustomModal>
      )}

      {editingGroup && (
        <CustomModal
          open={isEditNameModalOpen}
          onClose={() => setIsEditNameModalOpen(false)}
          onConfirm={handleConfirmEditName}
          title="Editar Nome do Grupo"
          confirmText="Salvar"
        >
          <TextField
            autoFocus
            margin="dense"
            label="Novo nome"
            type="text"
            fullWidth
            variant="standard"
            value={newEditedName}
            onChange={e => setNewEditedName(e.target.value)}
          />
        </CustomModal>
      )}

      <CustomModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        confirmText="Confirmar Exclusão"
      >
        <Typography>
            Tem certeza que deseja excluir o grupo "<strong>{groupToDelete?.nome}</strong>"? Os territórios pertencentes a ele ficarão sem grupo, mas não serão apagados.
        </Typography>
      </CustomModal>
    </Box>
  );
};

export default GroupsPage;