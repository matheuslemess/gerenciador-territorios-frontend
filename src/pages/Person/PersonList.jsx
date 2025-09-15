// src/pages/Person/PersonList.jsx

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
  // 1. Novas importações para o layout de Card
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Divider,
  CircularProgress,
  Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// 2. Ícones para detalhes no card
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

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
      toast.success('Dirigente excluído com sucesso!');
      fetchPersons();
    } catch (error) {
      console.error('Erro ao excluir dirigente:', error);
      toast.error(error.response?.data?.error || 'Falha ao excluir dirigente.');
    } finally {
      setIsConfirmOpen(false);
      setPersonToDelete(null);
    }
  };
  
  // 3. A definição de "columns" do DataGrid foi removida.
  
  // 4. Se estiver carregando, mostra "esqueletos" de cards para melhor UX
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={150} />
      </Stack>
    );
  }

  return (
    <>
      {/* 5. O DataGrid foi substituído por um Stack de Cards */}
      <Stack spacing={2}>
        {persons.map((person) => (
          <Card key={person.id} variant="outlined">
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {person.nome}
              </Typography>
              <Stack spacing={1} sx={{ color: 'text.secondary' }}>
                {person.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">{person.email}</Typography>
                  </Box>
                )}
                {person.telefone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">{person.telefone}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Tooltip title="Editar">
                <IconButton onClick={() => handleEditClick(person)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton onClick={() => handleDeleteClick(person.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
      </Stack>

      {/* Os modais de edição e exclusão continuam funcionando da mesma forma */}
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