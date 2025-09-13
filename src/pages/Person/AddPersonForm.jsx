// src/pages/Person/AddPersonForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePersons } from '../../hooks/usePersons';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

const AddPersonForm = ({ onSuccess, id }) => {
  const { fetchPersons } = usePersons();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

const API_URL = import.meta.env.VITE_API_URL;

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!nome) {
    toast.error('O nome é obrigatório.');
    return;
  }
  setLoading(true);
  try {
    await axios.post(`${API_URL}/pessoas`, { nome, email, telefone });
    toast.success('Dirigente cadastrado com sucesso!');
    setNome('');
    setEmail('');
    setTelefone('');
    fetchPersons();
    if (onSuccess) onSuccess(); // fecha modal se prop for passada
  } catch (error) {
    console.error('Erro ao cadastrar dirigente:', error);
    toast.error(error.response?.data?.error || 'Falha ao cadastrar dirigente.');
  } finally {
    setLoading(false);
  }
};


  return (
  <Box
    component="form"
    id={id} // importante para o requestSubmit funcionar
    onSubmit={handleSubmit}
    noValidate
    sx={{ mt: 1 }}
  >
    <TextField
      margin="normal"
      required
      fullWidth
      label="Nome Completo"
      name="nome"
      autoFocus
      value={nome}
      onChange={(e) => setNome(e.target.value)}
      disabled={loading}
    />
    <TextField
      margin="normal"
      fullWidth
      label="Endereço de Email"
      name="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      disabled={loading}
    />
    <TextField
      margin="normal"
      fullWidth
      name="telefone"
      label="Telefone"
      type="text"
      value={telefone}
      onChange={(e) => setTelefone(e.target.value)}
      disabled={loading}
    />
  </Box>
);

};

export default AddPersonForm;
