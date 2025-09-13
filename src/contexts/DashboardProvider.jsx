// src/contexts/DashboardProvider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DashboardContext } from './DashboardContext';

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

const API_URL = import.meta.env.VITE_API_URL;

const fetchDashboardData = useCallback(async () => {
  setLoading(true);
  try {
    // O delay foi removido, mas o skeleton ainda aparecerá durante a chamada real da API
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    setStats(response.data);
  } catch (err) {
    toast.error('Não foi possível carregar os dados do dashboard.');
    console.error("Erro ao carregar dados do dashboard:", err);
    setStats(null); // Garante que a tela de erro apareça se a busca falhar
  } finally {
    setLoading(false);
  }
}, [API_URL]);


  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const value = {
    stats,
    loading,
    fetchDashboardData, // Exposto caso você queira um botão de "Atualizar" no futuro
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}