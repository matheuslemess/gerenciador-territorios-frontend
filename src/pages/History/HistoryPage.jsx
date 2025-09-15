import React from 'react';
import { useHistory } from '../../hooks/useHistory';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  useTheme, useMediaQuery, Stack // 1. Importar hooks e Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Função auxiliar permanece a mesma
const calcularDuracao = (saida, devolucao) => {
  if (!saida || !devolucao) return '-';
  const dataSaida = new Date(saida);
  const dataDevolucao = new Date(devolucao);
  const diffTime = Math.abs(dataDevolucao - dataSaida);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Mesmo dia';
  return `${diffDays} dia(s)`;
};

// --- COMPONENTE PARA A VISUALIZAÇÃO EM DESKTOP (TABELA) ---
const HistoryTableDesktop = ({ historico }) => (
  <TableContainer component={Paper}>
    <Table size="small" aria-label="histórico do território">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Trabalhado por</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Campanha</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Data de Saída</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Data de Devolução</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Duração</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {historico.map((reg, index) => (
          <TableRow key={index}>
            <TableCell>{reg.pessoa_nome}</TableCell>
            <TableCell>{reg.campanha_titulo || '-'}</TableCell>
            <TableCell>{new Date(reg.data_saida).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell>{reg.data_devolucao ? new Date(reg.data_devolucao).toLocaleDateString('pt-BR') : 'Em campo'}</TableCell>
            <TableCell>{calcularDuracao(reg.data_saida, reg.data_devolucao)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// --- COMPONENTE PARA A VISUALIZAÇÃO EM MOBILE (LISTA DE CARDS) ---
const HistoryListMobile = ({ historico }) => (
  <Stack spacing={2}>
    {historico.map((reg, index) => (
      <Paper key={index} variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Box>
            <Typography variant="body2" color="text.secondary">Trabalhado por:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{reg.pessoa_nome}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Campanha:</Typography>
            <Typography variant="body1">{reg.campanha_titulo || '-'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Saída:</Typography>
              <Typography variant="body1">{new Date(reg.data_saida).toLocaleDateString('pt-BR')}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Devolução:</Typography>
              <Typography variant="body1">{reg.data_devolucao ? new Date(reg.data_devolucao).toLocaleDateString('pt-BR') : 'Em campo'}</Typography>
            </Box>
             <Box>
              <Typography variant="body2" color="text.secondary">Duração:</Typography>
              <Typography variant="body1">{calcularDuracao(reg.data_saida, reg.data_devolucao)}</Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    ))}
  </Stack>
);


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const HistoryPage = () => {
  const { historyData, loading } = useHistory();
  
  // 2. Detectar se a tela é pequena (mobile)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Histórico Completo de Territórios
      </Typography>

      {historyData.length === 0 && !loading ? (
        <Alert severity="info">Nenhum dado de histórico encontrado.</Alert>
      ) : (
        historyData.map((territorio) => (
          <Accordion key={territorio.id} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ width: { xs: '35%', sm: '20%' }, flexShrink: 0, fontWeight: 'bold' }}>Nº: {territorio.numero}</Typography>
              <Typography sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {territorio.descricao}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {territorio.historico.length > 0 ? (
                // 3. Renderização condicional: Tabela para desktop, Lista para mobile
                isMobile 
                  ? <HistoryListMobile historico={territorio.historico} /> 
                  : <HistoryTableDesktop historico={territorio.historico} />
              ) : (
                <Typography>Este território nunca foi trabalhado.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default HistoryPage;