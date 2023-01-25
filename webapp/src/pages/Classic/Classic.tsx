import { Fragment, useRef, useState } from 'react';
import Pong from './components/Pong';
import { Box, Button, Card, CardContent, Toolbar, Typography } from '@mui/material';
import { useLocation } from "react-router-dom";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import "./styles.css";
import Helpers from '../../helpers/Helpers';

const Classic = () => {

    const Time = (props: { remainingTime: any }) => {
        const currentTime = useRef(props.remainingTime);
        const prevTime = useRef(null);
        const isNewTimeFirstTick = useRef(false);
        const [, callRerender] = useState(0);
        if (currentTime.current !== props.remainingTime) {
            isNewTimeFirstTick.current = true;
            prevTime.current = currentTime.current;
            currentTime.current = props.remainingTime;
        } else {
            isNewTimeFirstTick.current = false;
        }
        if (props.remainingTime === 0) {
            setTimeout(() => {
                callRerender((val) => val + 1);
            }, 20);
        }
        const isTimeUp = isNewTimeFirstTick.current;
        return (
            <div className="time-wrapper">
                <div key={props.remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
                    {props.remainingTime}
                </div>
                {prevTime.current !== null && (
                    <div
                        key={prevTime.current}
                        className={`time ${!isTimeUp ? "down" : ""}`}
                    >
                        {prevTime.current}
                    </div>
                )}
            </div>
        );
    };

    const CountDown = () => {
        return (
            <div className="App">
                <h1>
                    CountDown until match
                    <br />
                    Opponent: {location?.state?.opp_nickname}
                </h1>
                <div className="timer-wrapper">
                    <CountdownCircleTimer
                        isPlaying
                        duration={3}
                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                        colorsTime={[5, 3, 2, 1]}
                        onComplete={() => setEnd(true)}
                    >
                        {Time}
                    </CountdownCircleTimer>
                </div>
            </div>
        );
    };

    const [end, setEnd] = useState<boolean>(false);
    const location = useLocation();

    const properQuit = async () => {
        if (location?.state?.player === 1) await Helpers.Live.liveCancel(location?.state?.my_id);
    };

    return (
        <Fragment>
                	{
                    	end?
                    <>
                        <Button href="/play/classic_search" onClick={properQuit}>
                                    Exit
                        </Button>
                        <Pong my_id={location?.state?.my_id} opp_id={location?.state?.opp_id} nickname={location?.state?.nickname} player={location?.state?.player} opp_nickname={location?.state?.opp_nickname}/>
                    </>
                    :
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <CountDown/>
                                <Toolbar>
                                    <Typography
                                        color="inherit" style={{ borderRight: "0.1em solid black", padding: "0.5em" }}
                                    >
                                                Left : { location?.state?.player === 1 ? location?.state?.nickname : location?.state?.opp_nickname }
                                    </Typography>
                                    <Typography color="inherit" style={{ padding: "0.5em" }}>
                                            Right : { location?.state?.player === 1 ? location?.state?.opp_nickname : location?.state?.nickname }
                                    </Typography>
                                </Toolbar>
                            </Box>
                        </CardContent>
                    </Card>
            }
        </Fragment>
    );
};
export default Classic;