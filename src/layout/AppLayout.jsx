/* CÓDIGO FINAL E SIMPLIFICADO - O MENU SÓ APARECE AO CLICAR */
import React, { useState, useMemo } from 'react';
import { NavLink as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton,
  List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, Tooltip
} from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Ícones
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/GroupWork';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CampaignIcon from '@mui/icons-material/Campaign';

const DRAWER_WIDTH = 260;

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
  const [drawerOpen, setDrawerOpen] = useState(false); // Um único estado para controlar o menu
  const theme = useMemo(() => getTheme(mode), [mode]);
  const location = useLocation();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const drawerContent = (
    <div onClick={handleDrawerToggle}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          G.T.
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ mx: '12px', borderRadius: '8px' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000,
          style: { background: theme.palette.background.paper, color: theme.palette.text.primary, backdropFilter: 'blur(10px)' },
        }}
      />
      <Box sx={{ display: 'flex' }}>
        {/* O AppBar agora ocupa 100% da largura sempre */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {/* O Ícone do menu agora é visível em todas as telas para acionar o Drawer */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Gerenciador de Territórios
            </Typography>
            <Tooltip title="Alternar tema">
              <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box component="nav">
          {/* O Drawer agora é SEMPRE temporário, para todas as telas */}
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }} // Melhora performance de abrir/fechar em mobile
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AppLayout;