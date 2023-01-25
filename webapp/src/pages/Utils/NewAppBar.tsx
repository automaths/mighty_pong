import { styled, useTheme } from '@mui/material/styles';;
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import MainListItems from '../Utils/listItems';
import { Box } from '@mui/material';
import Cookies from 'universal-cookie';

import Login from '../Login/Login';
import EmailLogin from '../Login/EmailLogin';
import 'react-toastify/dist/ReactToastify.css';
import { Play } from '../Play';
import Account from '../User/Account';
import Profile from '../Profile/Profile';
import Messaging from '../messagerie/Messagerie';
import Home from '../Home/Home';
import Chat from '../chat/Chat';
import Matchmaking from '../Matchmaking/Matchmaking';
import TwoFactorAuth from '../TwoFactor/TwoFactorAuth';
import TwoFactorSetUp from '../TwoFactor/TwoFactorSetUp';
import FriendSearch from '../Friends/FriendSearch';

import Badge from '@mui/material/Badge';
import Helpers from '../../helpers/Helpers';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar } from '@mui/material';
import Bonus from '../Bonus/Bonus';
import Settings from '../chat/Settings';
import Live from '../Live/Live';
import Spectating from '../Spectating';
import Endgame from '../Endgame/Endgame';
import Forfait from '../Forfait/Forfait';
import PrivateGame from '../Matchmaking/PrivateGame';
import Classic from '../Classic/Classic';
import ClassicMatch from '../Matchmaking/ClassicMatch';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const cookies = new Cookies();

    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [user, setUser] = useState({
        email: '',
        nickname: '',
        avatar: '',
    });

    const disconnectUser = () => {
        Helpers.Users.updateStatus(cookies.get('nickname')!, 'offline');
        cookies.remove('token');
        cookies.remove('email');
        cookies.remove('user_id');
        cookies.remove('nickname');
        cookies.remove('avatar');
        navigate('/');
    };

    const is_public_page = [
        '/', '/login/email', '/oauth2-redirect', '/2fa', '/login/email/', '/oauth2-redirect/', '/2fa/', '/play/pong', '/play/plong/', '/play/bonus', '/login', '/play/spectating', '/play/classic'].includes(window.location.pathname);

    const handleCloseTab = () => {
        Helpers.Users.updateStatus(cookies.get('nickname')!, 'offline');
    };

    useEffect(() => {
        if (!is_public_page) {
            if (user.nickname === '') {
                Helpers.Users.me().then((res:any) => {
                    if (!res)
                        navigate('/');
                    else
                        setUser(res);
                });
            }
        }
        window.addEventListener('unload', handleCloseTab);
        return () => {
            window.removeEventListener('unload', handleCloseTab);
        };
    }, [window.location.pathname]);


    return (
        <Box sx={{ display: is_public_page ? 'row' : 'flex' }}>
            {!is_public_page &&
                <Fragment>
                    <AppBar position="fixed" open={open}>
                        <Toolbar
                            sx={{
                                pr: '24px', // keep right padding when drawer closed
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => setOpen(!open)}
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                <Button onClick={() => navigate(`/home`)}>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="white"
                                        noWrap
                                        sx={{ flexGrow: 1, }}
                                    >
                                        Mighty Pong
                                    </Typography>
                                </Button>
                            </Typography>
                            { user?.nickname &&
                                <Fragment>
                                    <IconButton onClick={() => navigate(`/users/${user?.nickname}`)}>
                                        <Avatar alt={user?.nickname} src={user?.avatar} sx={{height: '40px', width: '40px' }}></Avatar>
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' } }}
                                    >
                                        { user?.nickname === '' ? 'invité' :
                                            <Button id="button-nickname" onClick={() => navigate(`/users/${user?.nickname}`)}>
                                                { user?.nickname }
                                            </Button>
                                        }
                                    </Typography>
                                    <IconButton color="inherit">
                                        <Badge color="secondary">
                                            <ExitToAppIcon onClick={disconnectUser}/>
                                        </Badge>
                                    </IconButton>
                                </Fragment>
                            }
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={open}
                    >
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        <List component="nav">
                            <MainListItems/>
                        </List>
                    </Drawer>
                </Fragment>
            }
            {is_public_page ? (
                <Routes>

                    {/* Not connected */}
                    <Route path='/' element={<Login/>} />
                    <Route path='/2fa' element={<TwoFactorAuth/>} />
                    <Route path='/login' element={<EmailLogin/>} />
                    <Route path='/oauth2-redirect' element={<Login/>} />

                    {/* Connected */}
                    <Route path='/2fa/setup' element={<TwoFactorSetUp/>} />
                    <Route path='/home' element={<Home/>} />
                    <Route path='/messagerie' element={<Messaging/>} />
                    <Route path='/chat/:chat_id' element={<Chat/>} />
                    <Route path="/play" element={<Play />} />
                    <Route path="/play/bonus" element={<Bonus />} />
                    <Route path="/user" element={<Account />} />
                    <Route path='/users/:nickname' element={<Profile/>} />
                    <Route path="/friends" element={<FriendSearch />} />
                    <Route path="/login/email" element={<EmailLogin />} />
                    <Route path="/play/matchmaking" element={<Matchmaking/>}/>
                    <Route path="/play/matchmaking/:game_id" element={<PrivateGame/>}/>
                    <Route path="/play/live" element={<Live/>}/>
                    <Route path="/play/spectating" element={<Spectating/>}/>
                    <Route path="/play/endgame" element={<Endgame/>}/>
                    <Route path="/play/forfait" element={<Forfait/>}/>
                    <Route path="/play/classic" element={<Classic/>}/>
                    <Route path="/play/classic_search" element={<ClassicMatch/>}/>
                </Routes>
            ) : (
                <Main open={open}>
                    <DrawerHeader />
                    <Routes>

                        {/* Not connected */}
                        <Route path='/' element={<Login/>} />
                        <Route path='/2fa' element={<TwoFactorAuth/>} />
                        <Route path='/login' element={<EmailLogin/>} />
                        <Route path='/oauth2-redirect' element={<Login/>} />

                        {/* Connected */}
                        <Route path='/2fa/setup' element={<TwoFactorSetUp/>} />
                        <Route path='/home' element={<Home/>} />
                        <Route path='/messagerie' element={<Messaging/>} />
                        <Route path='/chat/:chat_id' element={<Chat/>} />
                        <Route path='/chat/:chat_id/settings' element={<Settings/>} />
                        <Route path="/play" element={<Play />} />
                        <Route path="/play/bonus" element={<Bonus />} />
                        <Route path="/user" element={<Account />} />
                        <Route path='/users/:nickname' element={<Profile/>} />
                        <Route path="/friends" element={<FriendSearch />} />
                        <Route path="/login/email" element={<EmailLogin />} />
                        <Route path="/play/matchmaking" element={<Matchmaking/>}/>
                        <Route path="/play/matchmaking/:game_id" element={<PrivateGame/>}/>
                        <Route path="/play/live" element={<Live/>}/>
                        <Route path="/play/spectating" element={<Spectating/>}/>
                        <Route path="/play/endgame" element={<Endgame/>}/>
                        <Route path="/play/forfait" element={<Forfait/>}/>
                        <Route path="/play/classic" element={<Classic/>}/>
                        <Route path="/play/classic_search" element={<ClassicMatch/>}/>
                    </Routes>
                </Main>
            )}
        </Box>
    );
}