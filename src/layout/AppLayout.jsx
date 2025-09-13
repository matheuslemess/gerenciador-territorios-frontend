// src/layout/AppLayout.jsx

import React, { useState, useMemo } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import {
  AppBar, Box, Button, CssBaseline, Divider, Drawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, Tooltip
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/GroupWork';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // LINHA FALTANTE ADICIONADA AQUI
import CampaignIcon from '@mui/icons-material/Campaign';

const navItems = [
  { text: 'Painel', path: '/', icon: <DashboardIcon /> },
  { text: 'Designações', path: '/designacoes', icon: <AssignmentIndIcon /> },
  { text: 'Territórios', path: '/territorios', icon: <MapIcon /> },
   { text: 'Campanhas', path: '/campanhas', icon: <CampaignIcon /> }, 
  { text: 'Histórico', path: '/historico', icon: <HistoryIcon /> },
  { text: 'Dirigentes', path: '/pessoas', icon: <PeopleIcon /> },
  { text: 'Grupos', path: '/grupos', icon: <GroupIcon /> },
];

function AppLayout() {
  const [mode, setMode] = useState('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useMemo(() => getTheme(mode), [mode]);

  const handleDrawerToggle = () => setMobileOpen(prevState => !prevState);
  const toggleTheme = () => setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Menu
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
            <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000,
        }}
      />
      <Box sx={{ display: 'flex' }}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Gerenciador de Territórios
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {navItems.map((item) => (
                <Button key={item.text} sx={{ color: '#fff' }} component={RouterLink} to={item.path}>
                  {item.text}
                </Button>
              ))}
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'inherit' }} />
            <Tooltip title="Alternar tema">
              <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        
        <Box component="main" sx={{ p: 3, width: '100%' }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AppLayout;