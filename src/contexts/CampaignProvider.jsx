// src/contexts/CampaignProvider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CampaignContext } from './CampaignContext';
import dayjs from 'dayjs';

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

const API_URL = import.meta.env.VITE_API_URL;

const fetchCampaigns = useCallback(async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/campanhas`);
    setCampaigns(response.data);
  } catch (error) {
    console.error("Falha ao carregar campanhas:", error);
    toast.error("Não foi possível carregar as campanhas.");
  } finally {
    setLoading(false);
  }
}, [API_URL]); // adicionamos aqui


useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

const createCampaign = async (campaignData) => {
  try {
    await axios.post(`${API_URL}/campanhas`, campaignData);
    toast.success('Campanha criada com sucesso!');
    await fetchCampaigns();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Falha ao criar campanha.');
    throw error;
  }
};

const updateCampaign = async (id, campaignData) => {
  try {
    await axios.put(`${API_URL}/campanhas/${id}`, campaignData);
    toast.success('Campanha atualizada com sucesso!');
    await fetchCampaigns();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Falha ao atualizar campanha.');
    throw error;
  }
};

const deleteCampaign = async (id) => {
  try {
    await axios.delete(`${API_URL}/campanhas/${id}`);
    toast.success('Campanha deletada com sucesso!');
    await fetchCampaigns();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Falha ao deletar campanha.');
    throw error;
  }
};


    useEffect(() => {
    const today = dayjs();
    const active = campaigns.filter(c => 
      today.isAfter(dayjs(c.data_inicio).subtract(1, 'day')) && today.isBefore(dayjs(c.data_fim).add(1, 'day'))
    );
    setActiveCampaigns(active);
  }, [campaigns]);

  const value = { campaigns, activeCampaigns, loading, fetchCampaigns, createCampaign, updateCampaign, deleteCampaign };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}