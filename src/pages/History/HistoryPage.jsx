// src/pages/History/HistoryPage.jsx
import React from 'react';
import { useHistory } from '../../hooks/useHistory';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HistoryPage = () => {
  const { historyData, loading } = useHistory();
  
  const calcularDuracao = (saida, devolucao) => {
     if (!saida || !devolucao) return '-';
     const dataSaida = new Date(saida);
     const dataDevolucao = new Date(devolucao);
     const diffTime = Math.abs(dataDevolucao - dataSaida);
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
     if (diffDays === 0) return 'Mesmo dia';
     return `${diffDays} dia(s)`;
  };

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
              <Typography sx={{ width: '20%', flexShrink: 0, fontWeight: 'bold' }}>Nº: {territorio.numero}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{territorio.descricao}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {territorio.historico.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table size="small" aria-label={`histórico do território ${territorio.numero}`}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Trabalhado por</TableCell>
                        <TableCell>Campanha</TableCell>
                        <TableCell>Data de Saída</TableCell>
                        <TableCell>Data de Devolução</TableCell>
                        <TableCell>Duração</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {territorio.historico.map((reg, index) => (
                        <TableRow key={index}>
                          <TableCell>{reg.pessoa_nome}</TableCell>
                          <TableCell>{reg.campanha_titulo || '-'}</TableCell>
                          <TableCell>{new Date(reg.data_saida).toLocaleDateString()}</TableCell>
                          <TableCell>{reg.data_devolucao ? new Date(reg.data_devolucao).toLocaleDateString() : 'Em campo'}</TableCell>
                          <TableCell>{calcularDuracao(reg.data_saida, reg.data_devolucao)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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