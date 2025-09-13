// src/pages/Person/PersonPage.jsx
import React, { useState } from 'react';
import { Box, Divider, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddPersonForm from './AddPersonForm';
import PersonList from './PersonList';
import CustomModal from '../../components/ui/CustomModal';

export default function PersonPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // dispara o form de dentro do modal quando clicar em "Salvar"
  const handleConfirm = () => {
    const form = document.getElementById('add-person-form');
    if (form) form.requestSubmit();
  };

  return (
    <Box>
      {/* Header com botão Novo Dirigente */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gerenciar Dirigentes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenModal}
        >
          Novo Dirigente
        </Button>
      </Box>

      {/* Lista */}
      <Divider sx={{ my: 2 }} />
      <PersonList />

      {/* Modal padronizado */}
      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Novo Dirigente"
        onConfirm={handleConfirm}
        confirmText="Salvar"
      >
        <AddPersonForm id="add-person-form" onSuccess={handleCloseModal} />
      </CustomModal>
    </Box>
  );
}
