import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const MainListItems = () => {

    const navigate = useNavigate();

    return (
        <React.Fragment>
            <ListItemButton onClick={() => navigate('/home')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/play')}>
                <ListItemIcon>
                    <NetworkPingIcon />
                </ListItemIcon>
                <ListItemText primary="Play" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/play/live')}>
                <ListItemIcon>
                    <LiveTvIcon />
                </ListItemIcon>
                <ListItemText primary="Live" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
            </ListSubheader>
            <ListItemButton onClick={() => navigate('/messagerie')}>
                <ListItemIcon>
                    <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Messaging" id='messagerie-menu' />
            </ListItemButton>
            <ListItemButton  onClick={() => navigate('/friends')}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Friends" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/user')}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="User" />
            </ListItemButton>
        </React.Fragment>
    );
};

export default MainListItems;