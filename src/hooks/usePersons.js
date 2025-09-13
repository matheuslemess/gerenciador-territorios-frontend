// src/hooks/usePersons.js
import { useContext } from 'react';
import { PersonContext } from '../contexts/PersonContext';

export function usePersons() {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error('usePersons deve ser usado dentro de um PersonProvider');
  }
  return context;
}