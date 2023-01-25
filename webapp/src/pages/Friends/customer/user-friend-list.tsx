import { Avatar, Box, Card, Button, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Helpers from '../../../helpers/Helpers';

export const UserFriendList = () => {

    const navigate = useNavigate();

    const [userFriend, setUserFriends] = useState([{
        nickname: '',
        avatar: '',
    }]);

    useEffect(() => {
        Helpers.Friends.getFriendList().then((res:any) => setUserFriends(res));
    }, [false]);

    return (userFriend.length === 0 ?
        <Card>
            <Box>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                >
                                    You haven't any friend yet
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Card>
        :
        <Card>
            <PerfectScrollbar>
                <Box>
                    <Table>
                        <TableBody>
                            {userFriend.map((req:any) => (
                                <TableRow key={req.id ? req.id : 'def'}>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex'
                                            }}
                                        >
                                            <Avatar
                                                src={req.avatar}
                                                sx={{ mr: 2 }}
                                            >
                                            </Avatar>
                                            <Typography
                                                color="textPrimary"
                                                variant="body1"
                                            >
                                                {req.nickname}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button sx={{mr: 55}}
                                            onClick={() => navigate(`/users/${req.nickname}`)}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        >
                                        View Profile
                                        </Button>
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
