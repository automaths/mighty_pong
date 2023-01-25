import {
    Button,
    FormControlLabel,
    Paper,
    Switch,
    TextField
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 } from "uuid";

export const Play = () => {
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
            <Paper
                sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: 220,
                    mt: "200px",
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
                <Button
                    sx={{ mt: "30px" }}
                    color="secondary"
                    variant="contained"
                    size="large"
                    href="/play/live"
                >
                    Watch Live
                </Button>
            </Paper>
        </>
    );
};
