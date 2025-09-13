// src/hooks/useCampaigns.js
import { useContext } from 'react';
import { CampaignContext } from '../contexts/CampaignContext';

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns deve ser usado dentro de um CampaignProvider');
  }
  return context;
}