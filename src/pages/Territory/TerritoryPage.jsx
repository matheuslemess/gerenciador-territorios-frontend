// src/pages/Territory/TerritoryPage.jsx
import React, { useState } from 'react';
import { Box, Divider, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
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
      {/* Header com botão Novo Território */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Gerenciar Territórios</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenModal}
        >
          Novo Território
        </Button>
      </Box>

      {/* Lista */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" component="h2" gutterBottom>
        Todos os Territórios
      </Typography>
      <TerritoryList />

      {/* Modal */}
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
