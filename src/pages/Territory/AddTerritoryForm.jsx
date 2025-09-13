// src/pages/Territory/AddTerritoryForm.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTerritories } from '../../hooks/useTerritories';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const AddTerritoryForm = ({ onSuccess, id }) => {
  const { fetchTerritories } = useTerritories();

  const [numero, setNumero] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // só permite números no campo "numero"
  const handleNumeroChange = (event) => {
    const { value } = event.target;
    const numeroApenas = value.replace(/[^0-9]/g, '');
    setNumero(numeroApenas);
  };

const API_URL = import.meta.env.VITE_API_URL;

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!numero || !imagem) {
    toast.error('Número e Imagem do Mapa são obrigatórios.');
    return;
  }

  setLoading(true);
  const formData = new FormData();
  formData.append('numero', numero);
  formData.append('descricao', descricao);
  formData.append('imagem', imagem);

  try {
    await axios.post(`${API_URL}/territorios`, formData);
    toast.success('Território cadastrado com sucesso!');

    setNumero('');
    setDescricao('');
    setImagem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    fetchTerritories();
    if (onSuccess) onSuccess(); // fecha o modal se for passado pelo parent
  } catch (error) {
    console.error('Erro ao cadastrar território:', error);
    toast.error(error.response?.data?.error || 'Falha ao cadastrar território.');
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {loading ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            Enviando dados, por favor aguarde...
          </Box>
        </Alert>
      ) : (
        <Box component="form" id={id} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Número do Território"
            value={numero}
            onChange={handleNumeroChange}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome do Território"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Selecionar Imagem do Mapa
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={(e) => setImagem(e.target.files[0])}
                accept="image/png, image/jpeg"
              />
            </Button>
            {imagem && (
              <Typography sx={{ display: 'inline', ml: 2 }}>
                {imagem.name}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddTerritoryForm;
