import { Button, Avatar, TextField, Typography } from '@mui/material';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Config from "../../config/Config";
import Helpers from "../../helpers/Helpers";
import Cookies from 'universal-cookie';

//update status to online
const TwoFactorAuth = () => {

    const [user, setUser] = useState({
        id_42: 0,
        email: '',
        nickname: '',
        avatar: '',
        two_factor_secret: '',
    });

    const [qr, setQr] = useState<boolean>(false);
    const [qrLink, setQrLink] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [wrongCode, setWrongCode] = useState<boolean>(false);

    const navigate = useNavigate();
    const cookies = new Cookies();

    const generateQr = async () => {
        try {
            const req = await axios.post(`${Config.Api.url}/2fa/generate`, {
                id_42: user.id_42,
            });
            setQrLink(req.data);
        } catch (e) {
            return (null);
        }
        setQr(true);
    };

    useEffect(() => {
        Helpers.Users.me().then((res) => setUser(res!));
    }, []);

    const checkCode = async (e:any) => {
        e.preventDefault();
        try {
            const req = await axios.post(`${Config.Api.url}/2fa/authenticate`, {
                id_42: user.id_42,
                secret: user.two_factor_secret,
                code: code,
            });
            await axios.post(`${Config.Api.url}/2fa/add_token`, {
                id_42: user.id_42,
                token: req.data.access_token,
            });
            cookies.set('token', req.data.access_token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + req?.data?.access_token;
            navigate('/home');
        } catch (e) {
            setWrongCode(true);
        }
    };

    const updateCode = (event:any) => {
        event.preventDefault();
        setCode(event.target.value);
    };

    const regenerate = () => {
        navigate('/2fa/setup');
    };

    return (
        <>
            {
                user.two_factor_secret === null
                    ?
                    <div>
                        First connection, welcome !
                        {
                            qr ?
                                <Avatar src={qrLink} sx={{ width: 256, height: 256 }} variant="square" >
                                </Avatar>
                                :
                                <div>coucou</div>
                        }


                        <Button onClick={generateQr}>
                            Generate the 2FA Qr code
                        </Button>
                    </div>
                    :
                    <div>
                        Enter the Google Authenticator code
                        <form onSubmit={checkCode}>
                            <TextField
                                label="Code"
                                name="code"
                                onChange={updateCode}
                                value={code}
                                variant="outlined"
                            />
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={checkCode}
                            >
                                Submit code
                            </Button>
                        </form>
                        {
                            wrongCode?
                                <Typography variant='body2' color='red'>
                            please enter the correct code
                                </Typography>
                                :
                                <div></div>

                        }
                        <Button onClick={regenerate}>
                            Regenerate Qr Code
                        </Button>
                    </div>
            }
        </>
    );
};

export default TwoFactorAuth;