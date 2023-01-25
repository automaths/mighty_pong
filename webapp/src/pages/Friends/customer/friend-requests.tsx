import PerfectScrollbar from 'react-perfect-scrollbar';
import { Avatar, Box, Card, Button, Table, TableBody, TableCell, TableRow, Typography, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import Helpers from '../../../helpers/Helpers';
import { useState } from 'react';
import Cookies from 'universal-cookie';

export const RequestButton = (props: {otherUser:any}) => {
    const [requestStatus, setRequestStatus] = useState('');
    const cookies = new Cookies();

    Helpers.Friends.getFriendRequestStatus(props.otherUser).then(res => {
        setRequestStatus(res);});
    switch (requestStatus) {
    case 'accepted':
        return(
            <Box>
                <Button sx={{ ml: 2 }}
                    size="small"
                    variant="contained" disabled>
                        Friends
                </Button>
            </Box>);
    case 'cancelled':
        return(
            <Box>
                <Button sx={{ ml: 2 }}
                    size="small"
                    variant="contained" disabled>
                        Declined
                </Button>
            </Box>);
    default:
        return(
            <Box>
                <IconButton sx={{ml: 2}} onClick={() => {
                    Helpers.Friends.acceptFriendRequest(props.otherUser, cookies.get('nickname'), true);
                    setRequestStatus('accepted');
                }}>
                    <DoneIcon/>
                </IconButton>
                <IconButton onClick={() => {
                    Helpers.Friends.acceptFriendRequest(props.otherUser, cookies.get('nickname'), false);
                    setRequestStatus('cancelled');
                }}>
                    <ClearIcon/>
                </IconButton>
            </Box>);
    }
};
export const FriendRequests = (props: { requests:any }) => {
    const toUserProfile = (nickname:any) => {
        window.location.href = `users/${nickname}`;
    };
    return (props.requests.length === 0 ?
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
                                    No requests yet...
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
                            {props.requests.map((req:any) => (
                                <TableRow key={req.nickname}>
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
                                            <RequestButton key={req.nickname} otherUser={req.nickname} />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button sx={{mr: 55}}
                                            onClick={() => {toUserProfile(req.nickname);}}
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