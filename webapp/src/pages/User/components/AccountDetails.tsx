/* eslint-disable indent */
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import Helpers from '../../../helpers/Helpers';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export const AccountProfileDetails = (props:any) => {

    const [user, setUser] = useState({
        email: '',
        nickname: '',
        avatar: '',
        id_42: 0,
        two_factor_enabled: false,
    });

    const [original, setOriginal] = useState({
        email: '',
        nickname: '',
        avatar: '',
        id_42: 0,
        two_factor_enabled: false,
    });

	const navigate = useNavigate();
    const cookies = new Cookies();

    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [check, setCheck] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (user.nickname === '') {
            Helpers.Users.me().then((res) => setUser(res!));
            Helpers.Users.me().then((res) => {
                setOriginal(res!);
                if (res?.two_factor_enabled === true || res?.two_factor_enabled === false)
                    setCheck(res?.two_factor_enabled);
            });
        }
    }, []);

    const handleChange = (event:any) => {
        event.preventDefault();
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    };

    const changeUser = async () => {
        if (user.nickname === original.nickname && user.email === original.email)
        {
            setMessage('change at least one field');
            setError(true);
            return ;
        }
        if (user.nickname !== original.nickname)
        {
            const checkNickname = await Helpers.Users.checkNickname(user.nickname);
            if (checkNickname === false)
            {
                setMessage('nickname is already taken');
                setError(true);
                return ;
            }
        }
        if (user.email !== original.email)
        {
            const checkEmail = await Helpers.Users.checkEmail(user.email);
            if (checkEmail === false)
            {
                setMessage('email already taken');
                setError(true);
                return ;
            }
        }
        cookies.set('nickname', user.nickname);
        cookies.set('email', user.email);
        await Helpers.Users.changeUserData(user.email, user.nickname);
        window.location.href = `/users/${user.nickname}`;
    };

    const toggleFactorChange = () => {
		if (user.two_factor_enabled === false)
			setOpen(true);
		else
		{
			setCheck(!check);
			// eslint-disable-next-line no-unused-vars
			Helpers.Users.toggleTwoFactor(false, user.id_42).then((res) => {res = res;});
            cookies.remove('token');
            cookies.remove('email');
            cookies.remove('user_id');
            cookies.remove('nickname');
            cookies.remove('avatar');
		    navigate('/');
		}
	};

	const confirmationToggleFactorChange = () => {
		navigate('/2fa/setup');
		setCheck(!check);
	};

    return (
        <>
            <form
                autoComplete="off"
                noValidate
                {...props}
            >
                <Card>
                    <CardHeader
                        subheader="The information can be edited"
                        title="Profile"
                    />
                    <Divider />
                    <CardContent>

                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Nickname"
                                    name="nickname"
                                    onChange={handleChange}
                                    required
                                    value={user.nickname}
                                    variant="outlined"
                                />
                                {
                                    error ?
                                        <Typography variant='body2' color='red'>
                                    *{message}
                                        </Typography>
                                        :
                                        <div>
                                        </div>
                                }
                            </Grid>
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    onChange={handleChange}
                                    required
                                    value={user.email}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <FormControlLabel
                        control={(
                            <Checkbox
                                color="primary"
                                checked={check}
                                onChange={toggleFactorChange}
                            />
                        )}
                        label="2FA Authentication"
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                        }}
                    >
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={changeUser}
                        >
                        Save details
                        </Button>
                    </Box>
                </Card>
            </form>
            {
                open?
                    <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
			  >
                        <DialogTitle id="alert-dialog-title">
				  {"Turn on 2FA authentication ?"}
                        </DialogTitle>
                        <DialogContent>
				  <DialogContentText id="alert-dialog-description">
					You will be redirected to the 2FA setup page
				  </DialogContentText>
                        </DialogContent>
                        <DialogActions>
				  <Button onClick={() => setOpen(false)}>Disagree</Button>
				  <Button onClick={confirmationToggleFactorChange} autoFocus>
					Agree
				  </Button>
                        </DialogActions>
			  </Dialog>
                    :
                    <div>
                    </div>
            }
        </>
    );
};
