// src/hooks/useTerritories.js

import { useContext } from 'react';
import { TerritoryContext } from '../contexts/TerritoryContext';

// 1. Cria e exporta o Hook
export function useTerritories() {
  const context = useContext(TerritoryContext);
  if (!context) {
    // Esta mensagem de erro é importante para garantir o uso correto
    throw new Error('useTerritories deve ser usado dentro de um TerritoryProvider');
  }
  return context;
}