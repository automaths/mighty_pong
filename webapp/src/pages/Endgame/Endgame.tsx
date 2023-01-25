import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Helpers from "../../helpers/Helpers";

const Endgame = () => {
    const location = useLocation();
    const socket = io(`http://${window.location.hostname}:5000`, { transports: ["websocket"] });
    const navigate = useNavigate();

    const [locations, setLocations] = useState({
        my_id: 0,
        opp_id: 0,
        my_nickname: "",
        opp_nickname: "",
        type: 0,
    });

    useEffect(() => {
        if (location?.state?.is_one && location?.state?.winner)
        {
            Helpers.History.add_match(
                2,
                location?.state?.pongs,
                0,
                location?.state?.player_one,
            );
        } else if (!location?.state?.is_one && !location?.state?.winner) {
            Helpers.History.add_match(
                2,
                location?.state?.pongs,
                0,
                location?.state?.player_two,
            );
        }
        else
        {
            if (location?.state?.is_one)
            {
                Helpers.History.add_match(
                    0,
                    location?.state?.pongs,
                    2,
                    location?.state?.player_two,
                );
            }
            else
            {
                Helpers.History.add_match(
                    0,
                    location?.state?.pongs,
                    2,
                    location?.state?.player_one,
                );
            }
        }

        if (location?.state?.is_one) {
            setLocations({
                my_id: location?.state?.id_one,
                opp_id: location?.state?.id_two,
                my_nickname: location?.state?.player_one,
                opp_nickname: location?.state?.player_two,
                type: location?.state?.type,
            });
        } else {
            setLocations({
                my_id: location?.state?.id_two,
                opp_id: location?.state?.id_one,
                my_nickname: location?.state?.player_two,
                opp_nickname: location?.state?.player_one,
                type: location?.state?.type,
            });
        }
    }, [false]);

    socket.on(
        locations.my_id.toString() + "replay",
        (data: {
            incoming_id: number;
            incoming_nickname: string;
            nickname: string;
            cancel: boolean;
            confirmation: boolean;
        }) => {
            if (data.confirmation) {
                if (locations.type == 1) {
                    navigate("/play/bonus", {
                        state: {
                            my_id: locations.my_id,
                            opp_id: locations.opp_id,
                            opp_nickname: locations.opp_nickname,
                            nickname: locations.my_nickname,
                            player: 1,
                        },
                    });
                } else {
                    navigate("/play/classic", {
                        state: {
                            my_id: locations.my_id,
                            opp_id: locations.opp_id,
                            opp_nickname: locations.opp_nickname,
                            nickname: locations.my_nickname,
                            player: 1,
                        },
                    });
                }
            }
        }
    );

    return (
        <>
            <Box
                sx={{
                    mt: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Button
                    href="/play"
                    color="primary"
                    variant="contained"
                    size="large"
                >
                    Exit
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {/* <Button
                    onClick={replay_on}
                    color="primary"
                    variant="contained"
                    sx={{ mt: "50px" }}
                    size="large"
                >
                    Replay Match
                </Button> */}
            </Box>
        </>
    );
};

export default Endgame;
