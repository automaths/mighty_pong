import { Container, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AssistWalkerIcon from '@mui/icons-material/AssistWalker';
import DiamondIcon from '@mui/icons-material/Diamond';

const Achievements = (props:any) => {

    const achievements_list = ['veteran', 'winner'];

    return (
        <Container maxWidth={false}>
            <Typography sx={{ mb: 3 }} variant="h4">
                Achievements
            </Typography>
            <Grid container spacing={3}>
                {
                    achievements_list.map((achievement) => (
                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
                                        {achievement === 'sparta' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">This is sparta</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {props.achievements.sparta
                                                        ?
                                                        <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56 }}><LocalPoliceIcon /></Avatar>
                                                        :
                                                        <Avatar sx={{ backgroundColor: 'text.disabled', height: 56, width: 56 }}><LocalPoliceIcon /></Avatar>}
                                                </Grid>
                                                <Grid item>
                                                    <Typography color="textPrimary" gutterBottom variant="overline">Win a game 1 to 0</Typography>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'legendary' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">Legendary Battle</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {props.achievements.legendary
                                                        ?
                                                        <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><AirlineStopsIcon /></Avatar>
                                                        :
                                                        <Avatar sx={{ backgroundColor: 'text.disabled', height: 56, width: 56}}><AirlineStopsIcon /></Avatar>
                                                    }
                                                </Grid>
                                                <Grid item>
                                                    <Typography color="textPrimary" gutterBottom variant="overline">Win a game with 10 pongs</Typography>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'devil' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">The devil is with us</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {props.achievements.devil
                                                        ?
                                                        <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><LocalFireDepartmentIcon /></Avatar>
                                                        :
                                                        <Avatar sx={{ backgroundColor: 'text.disabled', height: 56, width: 56}}><LocalFireDepartmentIcon /></Avatar>
                                                    }
                                                </Grid>
                                                <Grid item>
                                                    <Typography color="textPrimary" gutterBottom variant="overline">Win a game with 66 pongs</Typography>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'veteran' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">I am veteran</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {props.achievements.veteran
                                                        ?
                                                        <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><MilitaryTechIcon /></Avatar>
                                                        :
                                                        <Avatar sx={{ backgroundColor: 'text.disabled', height: 56, width: 56}}><MilitaryTechIcon /></Avatar>
                                                    }
                                                </Grid>
                                                <Grid item>
                                                    <Typography color="textPrimary" gutterBottom variant="overline">Play 5 games</Typography>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'effort' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">Last effort</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {props.achievements.effort
                                                        ?
                                                        <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><AssistWalkerIcon /></Avatar>
                                                        :
                                                        <Avatar sx={{ backgroundColor: 'text.disabled', height: 56, width: 56}}><AssistWalkerIcon /></Avatar>
                                                    }
                                                </Grid>
                                                <Grid item>
                                                    <Typography color="textPrimary" gutterBottom variant="overline">Win a game 1 to 0</Typography>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'winner' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">What a winner</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {props.achievements.winner
                                                        ?
                                                        <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><DiamondIcon /></Avatar>
                                                        :
                                                        <Avatar sx={{ backgroundColor: 'text.disabled', height: 56, width: 56}}><DiamondIcon /></Avatar>
                                                    }
                                                </Grid>
                                                <Grid item>
                                                    <Typography color="textPrimary" gutterBottom variant="overline">Win 2 games</Typography>
                                                </Grid>
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Container>
    );
};

export default Achievements;