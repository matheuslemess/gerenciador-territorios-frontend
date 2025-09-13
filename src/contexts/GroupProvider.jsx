// src/contexts/GroupProvider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GroupContext } from './GroupContext';

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

const fetchGroups = useCallback(async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/grupos`);
    setGroups(response.data);
  } catch (error) {
    console.error("Falha ao buscar grupos:", error);
    toast.error("Não foi possível carregar a lista de grupos.");
  } finally {
    setLoading(false);
  }
}, [API_URL]);

useEffect(() => { fetchGroups(); }, [fetchGroups]);

// Ações que modificam os dados (mutações)
const createGroup = async (groupName) => {
  try {
    await axios.post(`${API_URL}/grupos`, { nome: groupName });
    toast.success('Grupo criado com sucesso!');
    await fetchGroups(); // Re-busca a lista atualizada
  } catch (error) {
    toast.error(error.response?.data?.error || 'Falha ao criar grupo.');
    throw error;
  }
};

const updateGroupName = async (groupId, newName) => {
  try {
    await axios.put(`${API_URL}/grupos/${groupId}`, { nome: newName });
    toast.success('Nome do grupo atualizado com sucesso!');
    await fetchGroups();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Falha ao editar o nome do grupo.');
    throw error;
  }
};

const associateTerritories = async (groupId, territoryIds) => {
  try {
    await axios.put(`${API_URL}/grupos/${groupId}/associar-territorios`, {
      territorio_ids: territoryIds
    });
    toast.success('Associações salvas com sucesso!');
    await fetchGroups();
  } catch (error) {
    toast.error('Falha ao salvar associações.');
    throw error;
  }
};

const deleteGroup = async (groupId) => {
  try {
    await axios.delete(`${API_URL}/grupos/${groupId}`);
    toast.success('Grupo excluído com sucesso!');
    await fetchGroups(); // Re-busca a lista atualizada
  } catch (error) {
    toast.error(error.response?.data?.error || 'Falha ao excluir grupo.');
    throw error;
  }
};


  const value = {
    groups,
    loading,
    fetchGroups,
    createGroup,
    updateGroupName,
    associateTerritories,
    deleteGroup 
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
}