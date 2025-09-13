// src/contexts/TerritoryProvider.jsx

import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { TerritoryContext } from './TerritoryContext';

export function TerritoryProvider({ children }) {
  // Estado dos dados
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado dos filtros (agora vivem no contexto!)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('numero_asc');
   const [notWorkedInCampaignId, setNotWorkedInCampaignId] = useState('');

  // Função de busca agora é mais inteligente
const API_URL = import.meta.env.VITE_API_URL;

const fetchTerritories = useCallback(async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (searchTerm) params.append('search', searchTerm);
    if (notWorkedInCampaignId) params.append('nao_trabalhado_na_campanha', notWorkedInCampaignId); // <<< USA O NOVO FILTRO
    params.append('sort', sortBy);

    const response = await axios.get(`${API_URL}/territorios?${params.toString()}`);
    setTerritories(response.data);
  } catch (error) {
    console.error("Falha ao buscar territórios:", error);
    setTerritories([]);
  } finally {
    setLoading(false);
  }
}, [searchTerm, statusFilter, sortBy, notWorkedInCampaignId, API_URL]);


  // useEffect para buscar os dados quando os filtros mudam
  // Adicionamos um debounce (atraso) para não fazer requisições a cada letra digitada
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchTerritories();
    }, 500); // Atraso de 500ms

    return () => clearTimeout(timerId); // Limpa o timer se o usuário continuar digitando
  }, [fetchTerritories]);


  // O 'value' agora expõe os estados dos filtros e as funções para alterá-los
  const value = {
    territories,
    loading,
    fetchTerritories,
    // Filtros e seus setters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    notWorkedInCampaignId,
    setNotWorkedInCampaignId 
  };

  return (
    <TerritoryContext.Provider value={value}>
      {children}
    </TerritoryContext.Provider>
  );
}