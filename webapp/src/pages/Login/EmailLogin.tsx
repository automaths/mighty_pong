import { useState } from 'react';
import Helpers from '../../helpers/Helpers';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import './EmailLogin.scss';
import Cookies from 'universal-cookie';

function EmailLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const cookies = new Cookies();

    const handleSubmit = async(e: { preventDefault: any }): Promise<void> => {
        e.preventDefault();
        const req = await Helpers.Users.login_with_email(email, password);
        if (req){
            setEmail('');
            setPassword('');
            cookies.set('token', req.token);
            cookies.set('email', req.email);
            cookies.set('user_id', req.user_id);
            cookies.set('nickname', req.nickname);
            navigate('/home');
            Helpers.Users.updateStatus(req.nickname, 'online');
        } else {
            toast.error('Wrong email or wrong password!');
        }
    };

    return (
        <div className='login-email-page'>
            <form className='login-form'
                onSubmit={handleSubmit}
            >
                <Typography variant="h2" textAlign={'center'}>
                    Login
                </Typography>
                <TextField
                    inputProps={{
                        'id': "email-input-login"
                    }}
                    label="Email"
                    variant="standard"
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <TextField
                    inputProps={{
                        'id': "password-input-login"
                    }}
                    data-testid='password-input-login' label="Password" variant="standard" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br /><br />
                <Button id='login-email-submit' data-testid='buttom-submit-login' type="submit">Submit</Button>
            </form>
        </div>
    );
}

export default EmailLogin;