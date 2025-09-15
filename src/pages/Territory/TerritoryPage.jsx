// src/pages/Territory/TerritoryPage.jsx
import React, { useState } from 'react';
import { Box, Divider, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTerritoryForm from './AddTerritoryForm';
import TerritoryList from './TerritoryList';
import CustomModal from '../../components/ui/CustomModal';

export default function TerritoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    const form = document.getElementById('add-territory-form');
    if (form) form.requestSubmit();
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box>
      {/* MELHORIA 1: Cabeçalho agora é responsivo */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Empilha no celular
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' }, // Alinhamento ajustado
        mb: 3,
        gap: 2, // Espaçamento para quando empilhar
      }}>
        <Typography variant="h4"  component="h1">Gerenciar Territórios</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenModal}
          // Botão ocupa toda a largura no celular
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Novo Território
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" component="h2" gutterBottom>
        Todos os Territórios
      </Typography>
      <TerritoryList />

      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Novo Território"
        onConfirm={handleConfirm}
        confirmText="Salvar"
      >
        <AddTerritoryForm id="add-territory-form" onSuccess={handleCloseModal} />
      </CustomModal>
    </Box>
  );
}