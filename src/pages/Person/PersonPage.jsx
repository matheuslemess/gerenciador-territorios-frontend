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

  const handleConfirm = () => {
    const form = document.getElementById('add-person-form');
    if (form) form.requestSubmit();
  };

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
        <Typography variant="h4" component="h1">
          Gerenciar Dirigentes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenModal}
          // Botão ocupa toda a largura no celular para melhor toque
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Novo Dirigente
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />
      <PersonList />

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