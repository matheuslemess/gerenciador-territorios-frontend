import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTerritories } from '../../hooks/useTerritories';
import { usePersons } from '../../hooks/usePersons';
import {
  Box, Button, Card, Typography, TextField, Select, MenuItem, FormControl, 
  InputLabel, IconButton, Chip, Divider, Stack, Dialog, DialogActions, 
  DialogContent, DialogTitle, CircularProgress, Grid, Tooltip
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useCampaigns } from '../../hooks/useCampaigns';

const AssignmentsPage = () => {
  const { territories, loading, fetchTerritories, searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy, notWorkedInCampaignId, setNotWorkedInCampaignId } = useTerritories();
  const { persons } = usePersons();
  const { activeCampaigns } = useCampaigns();

  const [selectedPessoa, setSelectedPessoa] = useState({});
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [viewingMap, setViewingMap] = useState({ numero: '', url: '' });

  const handlePessoaSelect = (territorioId, pessoaId) => setSelectedPessoa(prev => ({ ...prev, [territorioId]: pessoaId }));

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAssign = async (territorioId) => {
    const pessoaId = selectedPessoa[territorioId];
    if (!pessoaId) return toast.error('Por favor, selecione um dirigente.');
    const campanhaId = selectedCampaign[territorioId] || null;
    try {
      await axios.post(`${API_URL}/designacoes`, {
        territorio_id: territorioId,
        pessoa_id: pessoaId,
        data_saida: new Date().toISOString().split('T')[0],
        campanha_id: campanhaId
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

  const handleViewMapClick = (territorio) => {
    setViewingMap({ numero: territorio.numero, url: territorio.url_imagem });
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => setIsMapModalOpen(false);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom >Designar Territórios</Typography>

      <Card sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Filtros e Ordenação</Typography>
        
        {/*
          AGORA VAI: Trocamos o Grid por um Stack responsivo.
          - direction={{ xs: 'column', md: 'row' }}:
            - 'column' (um embaixo do outro) em telas de celular (xs).
            - 'row' (um ao lado do outro) em telas de tablet/desktop (md).
        */}
        <Stack spacing={2} sx={{ mt: 2 }} direction={{ xs: 'column', md: 'row' }}>
            <TextField fullWidth label="Buscar..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            
            <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Disponível">Disponíveis</MenuItem>
                    <MenuItem value="Em campo">Em Campo</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select value={sortBy} label="Ordenar por" onChange={(e) => setSortBy(e.target.value)}>
                    <MenuItem value="numero_asc">Número (Crescente)</MenuItem>
                    <MenuItem value="devolucao_desc">Data de Conclusão (Recentes)</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Não trabalhado na Campanha</InputLabel>
                <Select value={notWorkedInCampaignId} label="Não trabalhado na Campanha" onChange={(e) => setNotWorkedInCampaignId(e.target.value)}>
                    <MenuItem value="">Nenhum filtro</MenuItem>
                    {activeCampaigns.map(c => (<MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>))}
                </Select>
            </FormControl>
        </Stack>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {territories.map((territorio) => (
            <Card key={territorio.id} variant="outlined">
              <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', lg: 'row' },
                  alignItems: { xs: 'stretch', lg: 'center' }
              }}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, p: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div">Território Nº: {territorio.numero}</Typography>
                        <Typography color="text.secondary">{territorio.descricao}</Typography>
                        <Chip label={territorio.status} color={territorio.status === 'Disponível' ? 'success' : 'warning'} size="small" sx={{ mt: 1 }}/>
                    </Box>
                    <Tooltip title="Ver Mapa">
                        <IconButton onClick={() => handleViewMapClick(territorio)}>
                            <MapIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', lg: 'block' } }} />
                <Divider sx={{ display: { xs: 'block', lg: 'none' } }} />

                <Box sx={{ p: 2, width: { xs: '100%', lg: '50%' }, display: 'flex', alignItems: 'center' }}>
                  {territorio.status === 'Disponível' ? (
                    <Stack spacing={2} sx={{ width: '100%' }} direction={{ xs: 'column', sm: 'row' }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Designar para...</InputLabel>
                        <Select label="Designar para..." value={selectedPessoa[territorio.id] || ''} onChange={(e) => handlePessoaSelect(territorio.id, e.target.value)}>
                          {persons.map((p) => (<MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>))}
                        </Select>
                      </FormControl>
                      {activeCampaigns.length > 0 && (
                          <FormControl fullWidth size="small">
                          <InputLabel>Campanha</InputLabel>
                          <Select value={selectedCampaign[territorio.id] || ''} label="Campanha" onChange={(e) => setSelectedCampaign(prev => ({ ...prev, [territorio.id]: e.target.value }))}>
                            <MenuItem value="">Nenhuma</MenuItem>
                            {activeCampaigns.map(c => (<MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>))}
                          </Select>
                        </FormControl>
                      )}
                      <Button variant="contained" size="small" onClick={() => handleAssign(territorio.id)}>
                        Designar
                      </Button>
                    </Stack>
                  ) : (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Com: {territorio.pessoa_nome}</Typography>
                            {territorio.campanha_titulo && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <CampaignIcon sx={{ fontSize: 16, mr: 0.5 }} /> {territorio.campanha_titulo}
                            </Typography>
                            )}
                        </Box>
                        <Button variant="outlined" size="small" onClick={() => handleReturn(territorio.id)} sx={{ whiteSpace: 'nowrap' }}>
                            Devolver
                        </Button>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
      
      <Dialog open={isMapModalOpen} onClose={handleCloseMapModal} maxWidth="md">
        <DialogTitle>Mapa do Território Nº: {viewingMap.numero}</DialogTitle>
        <DialogContent>
          {viewingMap.url ? ( <img src={`${API_URL}/${viewingMap.url}`} alt={`Mapa`} style={{ width: '100%' }} /> ) : ( <Typography>Nenhuma imagem cadastrada.</Typography> )}
        </DialogContent>
        <DialogActions><Button onClick={handleCloseMapModal}>Fechar</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentsPage;