import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Helpers from '../../../helpers/Helpers';
import CancelIcon from '@mui/icons-material/Cancel';

export const AccountProfile = () => {

    const [user, setUser] = useState({
        id_42: 0,
        email: '',
        nickname: '',
        avatar: '',
    });

    const [upload, setUpload] = useState<boolean>(false);

    useEffect(() => {
        Helpers.Users.me().then((res) => setUser(res!));
    }, []);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        try {
            const res = await Helpers.Users.uploadPicture(file);
            await Helpers.Users.saveProfilePicture(`http://${window.location.hostname}:5000/` + res.data.file.filename, user.id_42);
            window.location.href = `/users/${user.nickname}`;
        } catch (e) {
            return (null);
        }
    };

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Avatar
                        src={user.avatar}
                        sx={{
                            height: 128,
                            mb: 2,
                            width: 128
                        }}
                    />
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h5"
                    >
                        {user.nickname}
                    </Typography>
                </Box>
            </CardContent>
            <Divider />
            <CardActions
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                {
                    upload?
                        <>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <input type="file" name="picture" accept="image/*"/>
                                <button type="submit">Upload</button>
                            </form>
                            <Button onClick={() => setUpload(false)} color='error'>
                                <CancelIcon />
                            </Button>
                        </>
                        :
                        <>
                            <Button
                                color="primary"
                                variant="text"
                                onClick={() => setUpload(true)}
                            >
                            Upload picture
                            </Button>
                        </>
                }
            </CardActions>
        </Card>

    );};
