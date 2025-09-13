// src/contexts/PersonProvider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { PersonContext } from './PersonContext';

export function PersonProvider({ children }) {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

const API_URL = import.meta.env.VITE_API_URL;

const fetchPersons = useCallback(async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/pessoas`);
    setPersons(response.data);
  } catch (error) {
    console.error("Falha ao buscar pessoas:", error);
    setPersons([]);
  } finally {
    setLoading(false);
  }
}, [API_URL]);


  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  const value = {
    persons,
    loading,
    fetchPersons,
  };

  return (
    <PersonContext.Provider value={value}>
      {children}
    </PersonContext.Provider>
  );
}