// src/hooks/useDashboard.js
import { useContext } from 'react';
import { DashboardContext } from '../contexts/DashboardContext';

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
}