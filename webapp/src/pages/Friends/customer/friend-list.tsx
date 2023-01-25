import PerfectScrollbar from 'react-perfect-scrollbar';
import { Avatar, Box, Card, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Helpers from '../../../helpers/Helpers';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useState, useEffect } from 'react';

const AddFriendButton = ( props: { friendUser:any }) => {

    const [friendStatus, setFriendStatus] = useState('initial');
    const cookies = new Cookies();

    useEffect(() => {
        Helpers.Friends.getFriendRequestStatus(props.friendUser).then((res) => setFriendStatus(res));
    }, [false]);

    switch (friendStatus) {
    case 'accepted':
        return (
            <Box>
                <Button sx={{ ml: 2 }}
                    size="small"
                    variant="contained" disabled>
                    Friends
                </Button>
            </Box>);
    case 'pending':
        return(
            <Box>
                <Button sx={{ ml: 2 }}
                    size="small"
                    variant="contained" disabled>
                    Request sent
                </Button>
            </Box>);
    case 'to_accept':
        return(
            <Box>
                <Button sx={{ ml: 2 }}
                    size="small"
                    variant="contained" disabled>
                    Request sent
                </Button>
            </Box>);
    default:
        return (
            <Box>
                <Button
                    onClick={() => {
                        Helpers.Friends.sendFriendRequest(props.friendUser, cookies.get('nickname'));
                        setFriendStatus('pending');
                    }}
                    size="small"
                    color="primary"
                    variant="outlined">
                    Add Friend
                </Button>
            </Box>);
    }
};

export const FriendList = (props: { users:any }) => {

    const navigate = useNavigate();

    return (
        <Card>
            <PerfectScrollbar>
                <Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.users.map((users:any) => (
                                <TableRow key={users.id}>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex'
                                            }}
                                        >
                                            <Avatar
                                                src={users.avatar}
                                                sx={{ mr: 2 }}
                                            >
                                            </Avatar>
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {users.nickname}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {users.email}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => navigate(`/users/${users.nickname}`)}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        >
                                        View Profile
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <AddFriendButton key={users.id} friendUser={users.nickname} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
        </Card>
    );
};