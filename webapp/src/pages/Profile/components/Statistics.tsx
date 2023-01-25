import { Container, Typography, Grid, Card, CardContent, Avatar, LinearProgress, Box } from "@mui/material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SickIcon from '@mui/icons-material/Sick';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
const Statistics = (props:any) => {

    const statistics_list = ['wins', 'loses'];

    return (
        <Container maxWidth={false}>
            <Typography sx={{ mb: 3 }} variant="h4">
                Statistics
            </Typography>
            <Grid container spacing={3}>
                {
                    statistics_list.map((achievement) => (
                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
                                        {achievement === 'ratio' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">RATIO WIN/LOSE</Typography>
                                                    <Typography color="textPrimary" variant="h4">{Number((props.values.matchWon / (props.values.matchLost + props.values.matchWon)) * 100).toFixed(2)}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar sx={{ backgroundColor: '#E4E70A', height: 56, width: 56}}><WorkspacePremiumIcon /></Avatar>
                                                </Grid>
                                                <Box sx={{ pt: 3 }}>
                                                    <LinearProgress value={(props.values.matchWon / (props.values.matchLost + props.values.matchWon)) * 100} variant="determinate"/>
                                                </Box>
                                            </>
                                        }
                                        {achievement === 'wins' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">MATCH WON</Typography>
                                                    <Typography color="textPrimary" variant="h4">{props.values.matchWon}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><EmojiEmotionsIcon /></Avatar>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'loses' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">MATCH LOST</Typography>
                                                    <Typography color="textPrimary" variant="h4">{props.values.matchLost}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar sx={{ backgroundColor: 'error.main', height: 56, width: 56}}><SickIcon /></Avatar>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'pongs' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">NUMBER PONGS</Typography>
                                                    <Typography color="textPrimary" variant="h4">{props.values.numberPongs}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar sx={{ backgroundColor: '#E4E70A', height: 56, width: 56}}><AirlineStopsIcon /></Avatar>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'scored' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">GOALS SCORED</Typography>
                                                    <Typography color="textPrimary" variant="h4">{props.values.goalsScored}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56}}><BookmarkAddIcon /></Avatar>
                                                </Grid>
                                            </>
                                        }
                                        {achievement === 'taken' &&
                                            <>
                                                <Grid item>
                                                    <Typography color="textSecondary" gutterBottom variant="overline">GOALS TAKEN</Typography>
                                                    <Typography color="textPrimary" variant="h4">{props.values.goalsTaken}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar sx={{ backgroundColor: 'error.main', height: 56, width: 56}}><BookmarkAddIcon /></Avatar>
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

export default Statistics;