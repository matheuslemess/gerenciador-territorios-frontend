// src/contexts/HistoryProvider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HistoryContext } from './HistoryContext';

export function HistoryProvider({ children }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

const API_URL = import.meta.env.VITE_API_URL;

const fetchHistory = useCallback(async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/historico-completo`);
    setHistoryData(response.data);
  } catch (error) {
    console.error("Falha ao buscar histórico:", error);
    toast.error("Não foi possível carregar o histórico.");
    setHistoryData([]);
  } finally {
    setLoading(false);
  }
}, [API_URL]);


  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const value = {
    historyData,
    loading,
    fetchHistory,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}