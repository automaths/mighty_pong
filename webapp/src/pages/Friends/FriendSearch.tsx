import { Container } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import Helpers from '../../helpers/Helpers';
import { FriendList } from './customer/friend-list';
import { Box, Card, CardContent, TextField, Typography, } from '@mui/material';
import { FriendRequests } from './customer/friend-requests';
import { FriendRequestsSent } from './customer/friend-requests-sent';
import { UserFriendList } from './customer/user-friend-list';

const FriendSearch = () => {

    const [users, setUsers] = useState([{
        nickname: '',
        avatar: '',
        email: '',
        id_42: 0,
    }]);

    const [friendRequests, setFriendRequests] = useState([{
        nickname: '',
        avatar: '',
    }]);

    const [requestsSent, setRequestsSent] = useState([{
        nickname: '',
        avatar: '',
    }]);

    const [user, setUser] = useState({
        email: '',
        nickname: '',
        avatar: '',
        current_status: '',
        id_42: 0,
    });

    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        Helpers.Users.getAllUsers().then((res) => {
            setUsers(res.rows);
        });
        Helpers.Users.me().then((res) => setUser(res!));
        Helpers.Friends.getReceivedFriendRequests().then((requests) => setFriendRequests(requests));
        Helpers.Friends.getSentRequests().then((requests) => setRequestsSent(requests));
    }, [false]);
    const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    };
    return (
        <>
            <Box sx={{ mt: 3 }}>
                <Container maxWidth={false}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            m: -1
                        }}
                    >
                        <Typography
                            sx={{ m: 1 }}
                            variant="h4"
                        >
                            Friends
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <UserFriendList />
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            m: -1
                        }}
                    >
                        <Typography
                            sx={{ m: 1, mt:5 }}
                            variant="h4"
                        >
                                Requests Sent
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <FriendRequestsSent requests={requestsSent}/>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            m: -1
                        }}
                    >
                        <Typography
                            sx={{ m: 1, mt: 5 }}
                            variant="h4"
                        >
                            Requests Received
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <FriendRequests requests={friendRequests} />
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                m: -1
                            }}
                        >
                            <Typography
                                sx={{ m: 1, mt: 5 }}
                                variant="h4"
                            >
                                Search friend
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ maxWidth: 500 }}>
                                        <TextField
                                            value={search}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Search player"
                                            variant="outlined"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <FriendList users={users.filter((value) => value.nickname.includes(search) && value.id_42 != user.id_42)} />
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default FriendSearch;