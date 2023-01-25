import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import Helpers from "../../helpers/Helpers";
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";

const ClassicMatch = () => {

    const [waiting, setWaiting] = useState<boolean>(false);
    const socket = io(`http://${window.location.hostname}:5000`, { transports: ['websocket'] });
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id_42: 0,
        email: '',
        nickname: '',
        avatar: '',
    });

    useEffect(() => {
        Helpers.Users.me().then((res) => setUser(res!));
    }, []);

    const match_request = () => {
        Helpers.Matchmaking.getRequests(2).then((res) => {
            if (res?.result.length === 0)
            {
                setWaiting(true);
                // eslint-disable-next-line no-unused-vars
                Helpers.Matchmaking.matchRequest(user.id_42, 2).then((res) => {res = res;});
            }
            else
            {
                if (res?.result[0].id_42 === user.id_42 && res?.result.length === 1)
                    return ;
                else if (res?.result[0].id_42 === user.id_42)
                {
                    socket.emit('classic', {
                        data: {
                            target: res?.result[1].id_42.toString(),
                            callback: user.id_42,
                            nickname: user.nickname,
                        }
                    });
                }
                socket.emit('classic', {
                    data: {
                        target: res?.result[0].id_42.toString(),
                        callback: user.id_42,
                        nickname: user.nickname,
                    }
                });
            }
        });
    };

    const match_cancel = () => {
        setWaiting(false);
        Helpers.Matchmaking.matchCancel(user.id_42, 2).then((res) => res = res);
    };

    socket.on(user.id_42.toString() + 'classic', (data: { id_incoming: number, confirmation:boolean, nickname: string }) => {
        if (!data.confirmation)
        {
            Helpers.Matchmaking.matchCancel(user.id_42, 2).then((res) => res = res);
            socket.emit('confirmation_classic', {
                data: {
                    target: data.id_incoming.toString(),
                    callback: user.id_42,
                    nickname: user.nickname,
                }
            });
            navigate('/play/classic', {
                state: {
                    my_id: user.id_42,
                    opp_id: data.id_incoming,
                    opp_nickname: data.nickname,
                    nickname: user.nickname,
                    player: 1,
                }
            });
        }
        else
        {
            navigate('/play/classic', {
                state: {
                    my_id: user.id_42,
                    opp_id: data.id_incoming,
                    opp_nickname: data.nickname,
                    nickname: user.nickname,
                    player: 2,
                }
            });
        }
    });

    return (
        <>

            <Typography component="h1" variant="h3" color="secondary"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    mb: '200px',
                }}
            >
                    This is the matchmaking friend
            </Typography>
            {
                waiting ?
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <CircularProgress color="secondary" sx={{mb: '50px'}} />
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Waiting for opponent ...
                        </Typography>
                        <Button onClick={match_cancel} color='error'>
                            <CancelIcon />
                        </Button>
                    </Box>
                    :
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Button onClick={match_request} color="primary" variant="contained" sx={{mt:'90px'}} >
                                Find opponent for classic
                        </Button>
                    </Box>
            }
        </>
    );
};

export default ClassicMatch;