import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePersons } from '../../hooks/usePersons';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';

const PersonList = () => {
  const { persons, loading, fetchPersons } = usePersons();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);

  const handleEditClick = (pessoa) => {
    setEditingPerson(pessoa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSaveEdit = async () => {
    if (!editingPerson || !editingPerson.nome) {
      toast.error('O nome não pode ficar em branco.');
      return;
    }
    try {
      await axios.put(`${API_URL}/pessoas/${editingPerson.id}`, {
        nome: editingPerson.nome,
        email: editingPerson.email,
        telefone: editingPerson.telefone,
      });
      toast.success('Dirigente atualizado com sucesso!');
      handleCloseModal();
      fetchPersons();
    } catch (error) {
      console.error('Erro ao atualizar dirigente:', error);
      toast.error(error.response?.data?.error || 'Falha ao atualizar dirigente.');
    }
  };

  const handleFieldChange = (event) => {
    setEditingPerson({ ...editingPerson, [event.target.name]: event.target.value });
  };

  const handleDeleteClick = (personId) => {
    setPersonToDelete(personId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;
    try {
      await axios.delete(`${API_URL}/pessoas/${personToDelete}`);
      toast.success('Dirigente excluída com sucesso!');
      fetchPersons();
    } catch (error) {
      console.error('Erro ao excluir dirigente:', error);
      toast.error(error.response?.data?.error || 'Falha ao excluir dirigente.');
    } finally {
      setIsConfirmOpen(false);
      setPersonToDelete(null);
    }
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 220 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
    { field: 'telefone', headerName: 'Telefone', flex: 0.5, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      filterable: false,
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box>
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
      {/* MELHORIA 2: Container da tabela agora permite rolagem horizontal */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={persons}
          columns={columns}
          loading={loading}
          autoHeight
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            // Garante uma largura mínima para a tabela, forçando a rolagem
            minWidth: 700,
            '--DataGrid-overlayHeight': '300px',
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
          }}
        />
      </Box>

      {/* Modal de Edição */}
      {editingPerson && (
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Editar Dirigente</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Altere os dados do dirigente abaixo e clique em "Salvar".
            </DialogContentText>
            <TextField autoFocus margin="dense" name="nome" label="Nome Completo" type="text" fullWidth variant="standard" value={editingPerson.nome} onChange={handleFieldChange} />
            <TextField margin="dense" name="email" label="Endereço de Email" type="email" fullWidth variant="standard" value={editingPerson.email || ''} onChange={handleFieldChange} />
            <TextField margin="dense" name="telefone" label="Telefone" type="text" fullWidth variant="standard" value={editingPerson.telefone || ''} onChange={handleFieldChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSaveEdit} variant="contained">Salvar</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta pessoa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PersonList;