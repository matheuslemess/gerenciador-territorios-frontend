// src/hooks/useGroups.js
import { useContext } from 'react';
import { GroupContext } from '../contexts/GroupContext';

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroups deve ser usado dentro de um GroupProvider');
  }
  return context;
}