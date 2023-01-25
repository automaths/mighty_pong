import { Box, Button, Container, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MatchHistory } from './match-history';
import Helpers from '../../../helpers/Helpers';
import Achievements from './Achievements';
import Statistics from './Statistics';
import { useParams } from "react-router-dom";

const UserInfos = () => {

    const { nickname } = useParams();

    const [values, setValues] = useState({
        numberPongs: '',
        matchWon: '',
        matchLost: '',
        goalsScored: '',
        goalsTaken: '',
    });

    const [achievements, setAchievements] = useState({
        sparta: false,
        legendary: false,
        devil: false,
        friend: false,
        veteran: false,
        effort: false,
        winner: false,
        alone: false,
    });

    const calculateStats = (props:any) => {
        const check = {
            sparta: false,
            legendary: false,
            devil: false,
            friend: false,
            veteran: false,
            effort: false,
            winner: false,
            alone: false,
        };
        let pongs = 0;
        let won = 0;
        let lost = 0;
        let scored = 0;
        let taken = 0;
        props.map((value:any) => {
            pongs += value.player_pongs;
            if (value.player_score === 2)
                won += 1;
            else if (value.opp_score === 2)
                lost += 1;
            scored += value.player_score;
            taken += value.opp_score;
            if (value.player_score === 2 && value.opp_score === 0)
            {
                check.sparta = true;
                check.effort = true;
            }
            if (value.player_pongs > 10)
                check.legendary = true;
            if (value.player_pongs === 666)
                check.devil = true;
            if (won + lost === 5)
                check.veteran = true;
            if (won === 2)
                check.winner = true;
        });
        setAchievements(check);
        setValues({
            numberPongs: pongs.toString(),
            matchWon: won.toString(),
            matchLost: lost.toString(),
            goalsScored: scored.toString(),
            goalsTaken: taken.toString(),
        });
        setLevel(Math.floor(Math.sqrt(won)) + 1);
        setRest((Math.sqrt(won) + 1) - (Math.floor(Math.sqrt(won)) + 1));
    };

    const getHistory = async () => {
        const res = await Helpers.History.get_match(nickname ?? '');
        calculateStats(res.data.result.reverse());
    };

    const [level, setLevel] = useState<number>(1);
    const [rest, setRest] = useState<number>(0);
    const [panel, setPanel] = useState<string>('statistics');

    useEffect(() => {getHistory();}, []);

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={false} sx={{mb:'50px'}}>
                    <Typography
                        sx={{ mb: 3 }}
                        variant="h4"
                        color="secondary"
                    >
						Level {level}
                    </Typography>
                    <LinearProgress
                        value={rest * 100}
                        variant="determinate"
                        color="secondary"
                        sx={{mb:'50px'}}
                    />
                    <Button color={panel === 'statistics' ? "inherit" : "secondary"} variant="contained" size="large" sx={{mr:'20px'}} onClick={() => setPanel('statistics')}>Statistics</Button>
                    <Button color={panel === 'achievements' ? "inherit" : "secondary"} variant="contained" size="large" sx={{mr:'20px'}} onClick={() => setPanel('achievements')}>Achievements</Button>
                    <Button color={panel === 'history' ? "inherit" : "secondary"} variant="contained" size="large" sx={{mr:'20px'}} onClick={() => setPanel('history')}>History</Button>
                </Container>
                { panel === 'statistics' && <Statistics values={values}/>}
                { panel === 'achievements' && <Achievements achievements={achievements}/> }
                { panel === 'history' &&
                    <Container maxWidth={false}>
                        <Typography
                            sx={{ mb: 3, }}
                            variant="h4"
                        >
                            History
                        </Typography>
                        <MatchHistory	/>
                    </Container>
                }
            </Box>
        </>
    );
};

export default UserInfos;