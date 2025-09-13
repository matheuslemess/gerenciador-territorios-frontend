// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';

// Importe TODOS os Provedores
import { DashboardProvider } from './contexts/DashboardProvider';
import { TerritoryProvider } from './contexts/TerritoryProvider';
import { PersonProvider } from './contexts/PersonProvider';
import { HistoryProvider } from './contexts/HistoryProvider';
import { GroupProvider } from './contexts/GroupProvider';
import { CampaignProvider } from './contexts/CampaignProvider'; // O que faltava

// Importe TODAS as Páginas
import Dashboard from './pages/Dashboard/Dashboard';
import TerritoryPage from './pages/Territory/TerritoryPage';
import AssignmentsPage from './pages/Assignments/AssignmentsPage';
import CampaignsPage from './pages/Campaigns/CampaignsPage'; // O que faltava
import HistoryPage from './pages/History/HistoryPage';
import PersonPage from './pages/Person/PersonPage';
import GroupsPage from './pages/Groups/GroupsPage';


function App() {
  return (
    // Envolvemos todos os provedores no topo da aplicação.
    // A ordem entre eles não importa, contanto que todos estejam aqui.
    <DashboardProvider>
      <TerritoryProvider>
        <PersonProvider>
          <HistoryProvider>
            <GroupProvider>
              <CampaignProvider>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/designacoes" element={<AssignmentsPage />} />
                    <Route path="/territorios" element={<TerritoryPage />} />
                    <Route path="/campanhas" element={<CampaignsPage />} />
                    <Route path="/historico" element={<HistoryPage />} />
                    <Route path="/pessoas" element={<PersonPage />} />
                    <Route path="/grupos" element={<GroupsPage />} />
                  </Route>
                </Routes>
              </CampaignProvider>
            </GroupProvider>
          </HistoryProvider>
        </PersonProvider>
      </TerritoryProvider>
    </DashboardProvider>
  );
}

export default App;