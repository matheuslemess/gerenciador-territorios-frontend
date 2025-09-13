// src/hooks/useHistory.js
import { useContext } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory deve ser usado dentro de um HistoryProvider');
  }
  return context;
}