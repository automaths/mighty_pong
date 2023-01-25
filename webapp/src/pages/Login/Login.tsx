import { Button } from '@mui/material';
import './Login.scss';
import { useEffect } from 'react';
import Helpers from '../../helpers/Helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

function Login() {
    const code_url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;
    const search = useLocation().search;
    const code = new URLSearchParams(search).get('code');
    const navigate = useNavigate();
    const cookies = new Cookies();

    const loggUser = async(): Promise<void> => {
        if (code){
            const req = await Helpers.Users.login(code);
            if (req) {
                cookies.set('token', req.token);
                cookies.set('email', req.email);
                cookies.set('user_id', req.user_id);
                cookies.set('nickname', req.nickname);
                cookies.set('avatar', req.avatar);
                //check if user has two factor auth
                const user = await Helpers.Users.me();
                if (user?.two_factor_enabled === true)
                {
                    navigate('/2fa');
                }
                else
                {
                    toast.success('Successfully logged!', {
                        position: "bottom-left",
                    });
                    if (req.first_connexion === true) {
                        navigate('/user');
                    }
                    else {
                        navigate('/home');
                    }
                    Helpers.Users.updateStatus(req.nickname, 'online');
                }
            }
        }
    };

    useEffect(() => {
        loggUser();
    });
    return (
        <div className="login-page">
            <form>
                <Button id="button-submit-login" type="submit" href={ code_url }>Sign up with 42</Button>
            </form>
        </div>
    );
}
export default Login;