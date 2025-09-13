// src/pages/Assignments/AssignmentsPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTerritories } from '../../hooks/useTerritories';
import { usePersons } from '../../hooks/usePersons';
import {
  Box, Button, Card, CardContent, CardActions, CardHeader, Grid, Typography, TextField,
  Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Chip, Divider, Stack,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useCampaigns } from '../../hooks/useCampaigns';

const AssignmentsPage = () => {
  const { territories, loading, fetchTerritories, searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy, notWorkedInCampaignId, setNotWorkedInCampaignId } = useTerritories();
  const { persons } = usePersons(); // Busca a lista de pessoas do contexto
    const { activeCampaigns } = useCampaigns();

  // Estados locais para controle da UI
  const [selectedPessoa, setSelectedPessoa] = useState({});
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [viewingMap, setViewingMap] = useState({ numero: '', url: '' });

  // Ações de designar/devolver
  const handlePessoaSelect = (territorioId, pessoaId) => setSelectedPessoa(prev => ({ ...prev, [territorioId]: pessoaId }));

const API_URL = import.meta.env.VITE_API_URL;

const handleAssign = async (territorioId) => {
  const pessoaId = selectedPessoa[territorioId];
  if (!pessoaId) return toast.error('Por favor, selecione um dirigente.');

  const campanhaId = selectedCampaign[territorioId] || null; // Pega a campanha ou null

  try {
    await axios.post(`${API_URL}/designacoes`, {
      territorio_id: territorioId,
      pessoa_id: pessoaId,
      data_saida: new Date().toISOString().split('T')[0],
      campanha_id: campanhaId // <<< ENVIA O ID DA CAMPANHA
    });
    toast.success('Território designado com sucesso!');
    fetchTerritories();
  } catch (error) { 
    toast.error(error.response?.data?.error || 'Falha ao designar território.'); 
  }
};

const handleReturn = async (territorioId) => {
  try {
    await axios.put(`${API_URL}/designacoes/devolver`, {
      territorio_id: territorioId,
      data_devolucao: new Date().toISOString().split('T')[0]
    });
    toast.success('Território devolvido com sucesso!');
    fetchTerritories();
  } catch (error) { 
    toast.error(error.response?.data?.error || 'Falha ao devolver território.'); 
  }
};

  // Funções do Modal de Mapa
  const handleViewMapClick = (territorio) => {
    setViewingMap({ numero: territorio.numero, url: territorio.url_imagem });
    setIsMapModalOpen(true);
  };
  const handleCloseMapModal = () => setIsMapModalOpen(false);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Designar Territórios</Typography>
      
      <Card sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Filtros e Ordenação</Typography>
        <Grid container spacing={2} alignItems="center">
  <Grid size={{ xs: 12, md: 2 }}>
    <TextField
      fullWidth
      label="Buscar..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
    <FormControl fullWidth size="small">
      <InputLabel>Status</InputLabel>
      <Select
        value={statusFilter}
        label="Status"
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="Disponível">Disponíveis</MenuItem>
        <MenuItem value="Em campo">Em Campo</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <FormControl fullWidth size="small">
      <InputLabel>Ordenar por</InputLabel>
      <Select
        value={sortBy}
        label="Ordenar por"
        onChange={(e) => setSortBy(e.target.value)}
      >
        <MenuItem value="numero_asc">Número (Crescente)</MenuItem>
        <MenuItem value="devolucao_desc">Data de Conclusão (Recentes)</MenuItem>
      </Select>
    </FormControl>
  </Grid>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Não trabalhado na Campanha</InputLabel>
              <Select
                value={notWorkedInCampaignId}
                label="Não trabalhado na Campanha"
                onChange={(e) => setNotWorkedInCampaignId(e.target.value)}
              >
                <MenuItem value="">Nenhum filtro</MenuItem>
                {activeCampaigns.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
</Grid>

      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {territories.map((territorio) => (
            <Grid key={territorio.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  action={
                    <Tooltip title="Ver Mapa"><IconButton size="small" onClick={() => handleViewMapClick(territorio)}><MapIcon /></IconButton></Tooltip>
                  }
                  title={`Território Nº: ${territorio.numero}`}
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Stack spacing={1.5}>
                    <Box><Chip label={territorio.status} color={territorio.status === 'Disponível' ? 'success' : 'warning'} size="small" /></Box>
                    <Typography variant="body2" color="text.secondary">{territorio.descricao}</Typography>
{territorio.status === 'Em campo' ? (
                      <Box sx={{ background: (theme) => theme.palette.action.hover, p: 1.5, borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Com: {territorio.pessoa_nome}</Typography>
                        {territorio.campanha_titulo && (
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, color: 'text.secondary' }}>
                            <CampaignIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {territorio.campanha_titulo}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      territorio.ultima_devolucao && (
                        <Typography variant="caption" color="text.secondary">
                          Última conclusão: {new Date(territorio.ultima_devolucao).toLocaleDateString('pt-BR')}
                        </Typography>
                      )
                    )}
                  </Stack>
                </CardContent>
                <Divider />
<CardActions sx={{ p: 2 }}>
  {territorio.status === 'Disponível' ? (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth size="small">
        <InputLabel id={`label-${territorio.id}`}>Designar para...</InputLabel>
        <Select
          labelId={`label-${territorio.id}`}
          label="Designar para..."
          value={selectedPessoa[territorio.id] || ''}
          onChange={(e) => handlePessoaSelect(territorio.id, e.target.value)}
        >
          {persons.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
{activeCampaigns.length > 0 && (
                     <FormControl sx={{ mt: 2 }} fullWidth size="small">
                        <InputLabel>Designar na Campanha</InputLabel>
                        <Select
                          value={selectedCampaign[territorio.id] || ''}
                          label="Designar na Campanha"
                          onChange={(e) => setSelectedCampaign(prev => ({ ...prev, [territorio.id]: e.target.value }))}
                        >
                          <MenuItem value="">Nenhuma</MenuItem>
                          {activeCampaigns.map(c => (
                            <MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                  )}
      <Button
        fullWidth
        variant="contained"
        size="small"
        sx={{ mt: 2 }}
        onClick={() => handleAssign(territorio.id)}
      >
        Designar
      </Button>
    </Box>
  ) : (
    <Button
      fullWidth
      variant="outlined"
      size="small"
      onClick={() => handleReturn(territorio.id)}
    >
      Devolver
    </Button>
  )}
</CardActions>

              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de Mapa */}
<Dialog open={isMapModalOpen} onClose={handleCloseMapModal} maxWidth="md">
  <DialogTitle>Mapa do Território Nº: {viewingMap.numero}</DialogTitle>
  <DialogContent>
    {viewingMap.url ? (
      <img src={`${API_URL}/${viewingMap.url}`} alt={`Mapa`} style={{ width: '100%' }} />
    ) : (
      <Typography>Nenhuma imagem cadastrada.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseMapModal}>Fechar</Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default AssignmentsPage;