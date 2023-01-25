import PerfectScrollbar from "react-perfect-scrollbar";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import Helpers from "../../helpers/Helpers";
import { useNavigate } from "react-router-dom";

export const Live = () => {
    const [values, setValues] = useState([
        {
            id_one: 0,
            id_two: 0,
            player_one: "",
            player_two: "",
        },
    ]);

    const getLive = async () => {
        try {
            const res = await Helpers.Live.liveRequest();
            if (res != undefined) setValues(res);
        } catch (e) {}
    };

    useEffect(() => {
        getLive();
    }, [false]);

    const navigate = useNavigate();

    const goToLive = (id_one:number, id_two:number, player_one:string, player_two:string) => {
        navigate('/play/spectating', {
            state: {
                id_one: id_one,
                id_two: id_two,
                player_one: player_one,
                player_two: player_two,
            }
        });
    };

    return (
        <Card>
            <CardHeader />
            <PerfectScrollbar>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Player One</TableCell>
                                <TableCell>Player Two</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {values.map((value) => (
                                <TableRow hover key={value.id_one}>
                                    <TableCell>{value.player_one}</TableCell>
                                    <TableCell>{value.player_two}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => {goToLive(value.id_one, value.id_two, value.player_one, value.player_two);}}>
                                            view game
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
        </Card>
    );
};

export default Live;
