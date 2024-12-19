


import { useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { useNavigate, useLocation } from 'react-router';
import { Schedule, ExitToApp } from '@mui/icons-material';
import Logo from '../../assets/img/catexpress.jpg';
import { ModalLogoutContext } from '../../context/ModalContext';

function FixedDrawer({ drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current path
  const { setShowModal } = useContext(ModalLogoutContext);

  const menuItems = [
    { name: 'Dashboard', icon: <SpaceDashboardIcon sx={{ color: '#00000099' }} />, path: '/home' },
    { name: 'Conductor Profile', icon: <ManageAccountsIcon sx={{ color: '#00000099' }} />, path: '/manage-users' },
    { name: 'Reports', icon: <ExitToApp sx={{ color: '#00000099' }} />, path: '/reports' },
    { name: 'Schedule', icon: <Schedule sx={{ color: '#00000099' }} />, path: '/schedule' },
    { name: 'Logout', icon: <ExitToApp sx={{ color: '#00000099' }} />, path: null },
  ];

  const handleNavigation = (path, itemName) => {
    if (itemName === 'Logout') {
      setShowModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar style={{ padding: '0 20px', marginBottom: 10 }}>
        <div
          style={{
            position: 'relative',
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={Logo}
            alt="Catexpress Logo"
            style={{
              position: 'absolute',
              height: '70%',
              width: '70%',
              left: 0,
              objectFit: 'cover',
            }}
          />
        </div>
      </Toolbar>
      <List>
        {menuItems.map(({ name, icon, path }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(path, name)}
              sx={{
                backgroundColor: location.pathname === path ? 'lightgray' : 'transparent',
                '&:hover': { backgroundColor: 'lightgray' },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default FixedDrawer;
