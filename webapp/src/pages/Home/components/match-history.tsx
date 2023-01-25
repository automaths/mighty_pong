import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Button, Card, CardHeader, Table, TableBody, TableCell, TableHead, TableRow, } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from './severity-pill';
import { useEffect, useState } from 'react';
import Helpers from '../../../helpers/Helpers';
import { useParams } from "react-router-dom";

export const MatchHistory = (props:any) => {

    const [values, setValues] = useState([]);
    const { nickname } = useParams();

    const getHistory = async () => {
        try{
            const res = await Helpers.History.get_match(nickname ?? '');
            setValues(res.data.result.reverse());
        } catch (e) {}
    };

    useEffect(() => {getHistory();}, []);

    return (
        <Card {...props}>
            <CardHeader />
            <PerfectScrollbar>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                Date
                                </TableCell>
                                <TableCell>
                                Opponent
                                </TableCell>
                                <TableCell>
                                Number Pongs
                                </TableCell>
                                <TableCell>
                                Score
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {values.map((value:any) => (
                                <TableRow
                                    hover
                                    key={value.id}
                                >
                                    <TableCell>
                                        01/12/2022 (hc)
                                    </TableCell>
                                    <TableCell>
                                        {value.opp_name}
                                    </TableCell>
                                    <TableCell>
                                        {value.player_pongs}
                                    </TableCell>
                                    <TableCell>
                                        <SeverityPill
                                            color={
                                                ((value.player_score === 1) && 'success')
                                            || ((value.player_score === 0) && 'error')
                                            || 'secondary'}
                                        >
                                            {value.player_score.toString() + " - " + value.opp_score.toString()}
                                        </SeverityPill>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2
                }}
            >
                <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small" />}
                    size="small"
                    variant="text"
                >
                View all
                </Button>
            </Box>
        </Card>

    );};
