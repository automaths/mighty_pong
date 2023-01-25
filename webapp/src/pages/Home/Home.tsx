import {
    // Box,
    Button,
    Container,
    FormControlLabel,
    Grid,
    Paper,
    Switch,
    Typography,
    TextField
} from "@mui/material";
// import { MatchHistory } from "./components/match-history";
import Copyright from "../Utils/Copyright";
// import Choose from "./components/Choose";
// import Connected from "./components/Connected";
import { useEffect, useState } from "react";
import Helpers from "../../helpers/Helpers";
import Live from "../Live/Live";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Home = () => {
    useEffect(() => {
        Helpers.Users.me().then((res: any) => (res = res));
    }, []);

    const [checked, setChecked] = useState(true);
    const [invit, setInvit] = useState(true);
    const [urlToCopy, setUrlToCopy] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const handleInvit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvit(event.target.checked);
    };

    const navigate = useNavigate();

    const handleMatchType = () => {
        if (checked) navigate("/play/matchmaking");
        else navigate("/play/classic_search");
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                height: 220,
                                mt: "50px",
                            }}
                        >
                            <Button
                                color="secondary"
                                variant="contained"
                                size="large"
                                onClick={handleMatchType}
                            >
                                Quick Game
                            </Button>
                            <FormControlLabel
                                sx={{
                                    ml: "15px",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                                control={
                                    <Switch
                                        checked={checked}
                                        onChange={handleChange}
                                        color='secondary'
                                        inputProps={{
                                            "aria-label": "controlled",
                                        }}
                                    />
                                }
                                label="Bonus"
                            />
                            <Button
                                sx={{ mt: "30px" }}
                                color="secondary"
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setUrlToCopy(`http://${window.location.hostname}:3000/play/matchmaking/${v4()}-${invit}`);
                                    toast.success(
                                        "New link created"
                                    );
                                }}
                            >
                                Create Game
                            </Button>
                            <TextField
                                variant="standard"
                                value={urlToCopy}
                            />
                            <FormControlLabel
                                sx={{
                                    ml: "15px",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                                control={
                                    <Switch
                                        checked={invit}
                                        onChange={handleInvit}
                                        color='secondary'
                                        inputProps={{
                                            "aria-label": "controlled",
                                        }}
                                    />
                                }
                                label="Bonus"
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                height: 220,
                                mt: "35px",
                            }}
                        >
                            <Button
                                color="warning"
                                onClick={() => {
                                    window.location.href =
                                        "https://github.com/JulesMaisonneuve";
                                }}
                            >
                                JulesMaisonneuve
                            </Button>
                            <Button
                                sx={{ justifyContent: "center" }}
                                color="warning"
                                onClick={() => {
                                    window.location.href =
                                        "https://github.com/Anysiia";
                                }}
                            >
                                Anysiia
                            </Button>
                            <Button
                                color="warning"
                                onClick={() => {
                                    window.location.href =
                                        "https://github.com/S-Stanley";
                                }}
                            >
                                S-Stanley
                            </Button>
                            <Button
                                color="warning"
                                onClick={() => {
                                    window.location.href =
                                        "https://github.com/automaths";
                                }}
                            >
                                Automaths
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography sx={{ m: 1, mt: 5 }} variant="h5">
                                Watch Live
                            </Typography>
                            <Live />
                        </Paper>
                    </Grid>
                </Grid>
                <br></br>
                <Copyright />
            </Container>
        </>
    );
};

export default Home;
