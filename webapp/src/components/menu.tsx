import { Fragment, useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Helpers from '../helpers/Helpers';
import Cookies from 'universal-cookie';

const MenuComponent = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        nickname: ''
    });

    const cookies = new Cookies();

    const disconnectUser = () => {
        cookies.remove('token');
        cookies.remove('email');
        cookies.remove('user_id');
        cookies.remove('nickname');
        cookies.remove('avatar');
        navigate('/');
    };

    useEffect(() => {
        if (user.nickname === '') {
            Helpers.Users.me().then((res) => setUser(res!));
        }
    });

    return (
        <Fragment key='menu'>
            <Box m={2} pt={7}>
                <AppBar
                    component="nav"
                    sx={{ bgcolor: "grey" }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                        Transcendence
                        </Typography>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                        Bonjour { user.nickname === '' ? 'invité' : user.nickname }
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            { window.location.pathname.includes('/home') ? (
                                <Fragment>
                                    <Button key='Home' sx={{ color: '#fff' }} onClick={() => navigate('/home')}>
                                        Home
                                    </Button>
                                    <Button key='Messagerie' sx={{ color: '#fff' }} onClick={() => navigate('/home/messagerie')}>
                                        Messagerie
                                    </Button>
                                    <Button key='Disconnect' sx={{ color: '#fff' }} onClick={disconnectUser} >
                                        Disconnect
                                    </Button>
                                </Fragment>
                            ) : (
                                <Fragment>
                                </Fragment>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </Fragment>
    );
};

export default MenuComponent;