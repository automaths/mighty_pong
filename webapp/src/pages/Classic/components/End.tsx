import { Button, Typography } from "@mui/material";
import React from "react";
import Helpers from "../../../helpers/Helpers";

export const End = ( props: { scoreOne: number, scoreTwo: number, player: number, nickname: string, opp_nickname: string  } ) => {

    return (
        <React.Fragment>
            <Typography
                component="h2"
                variant="h6"
                color="primary"
                sx={{ ml:'750px', }}
            >
                {
                    props.player === 1
                        ? `End of game ! Final Score: ${props.nickname} ${props.scoreOne} - ${props.opp_nickname} ${props.scoreTwo}`
                        : `End of game ! Final Score: ${props.opp_nickname} ${props.scoreOne} - ${props.nickname} ${props.scoreTwo}`
                }
            </Typography>
            <br></br>
            <br></br>
            <Button
                color="secondary"
                variant="contained"
                size="large"
                sx={{ ml:'730px', }}
                href='/home'
                onClick={() => Helpers.Users.updateStatus(localStorage.getItem('nickname')!, 'online')}
            >
				Menu
            </Button>
            <Button
                color="secondary"
                variant="contained"
                size="large"
                sx={{ ml:'100px', }}
                href='/play/matchmaking'
            >
				Again
            </Button>
        </React.Fragment>
    );
};