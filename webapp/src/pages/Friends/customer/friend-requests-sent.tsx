import { Avatar, Button, Card, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PerfectScrollbar from 'react-perfect-scrollbar';
import Helpers from '../../../helpers/Helpers';
import { useState } from "react";
import Cookies from 'universal-cookie';

export const RequestSentButton = (props: {otherUser:any}) => {
    const [cancelled, setCancelled] = useState(0);
    const cookies = new Cookies();

    return (cancelled === 0 ?
        <Button sx={{ ml: 2 }}
            size="small"
            variant="contained"
            color="error"
            onClick={() => {
                Helpers.Friends.acceptFriendRequest(cookies.get('nickname'), props.otherUser, false);
                setCancelled(1);
            }}>
                Cancel
        </Button>
        :
        <Button sx={{ ml: 2 }}
            size="small"
            variant="contained" disabled
        >
                Cancelled
        </Button>
    );
};
export const FriendRequestsSent = (props: {requests:any}) => {
    const toUserProfile = (nickname:any) => {
        window.location.href = `users/${nickname}`;
    };
    return (props.requests.length === 0 ?
        <Card>
            <Box>
                <Table  >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                >
                                    No requests sent...
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
                                            <RequestSentButton key={req.nickname} otherUser={req.nickname} />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button sx={{mr: 70}}
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