import Config from "../config/Config";
import axios from 'axios';
import { LiveRequest } from "../interfaces/live";

const liveAdd = async (id_one:number, id_two:number, player_one: string, player_two: string): Promise<LiveRequest | null> => {
    try {
        const res = await axios.post(`${Config.Api.url}/live/add`, {
            id_one: id_one,
            id_two: id_two,
            player_one: player_one,
            player_two: player_two
        });
        return (res.data);
    } catch (e) {
        return (null);
    }
};

const liveRequest = async (): Promise<LiveRequest[] | undefined> => {
    try {
        const res = await axios.get(`${Config.Api.url}/live/requests`);
        return (res.data.result);
    } catch (e) {}
};

const liveCancel = async (id_one:number): Promise<null> => {
    try {
        await axios.post(`${Config.Api.url}/live/cancel`, {
            id_one: id_one,
        });
        return (null);
    } catch (e) {
        return (null);
    }
};

const Live = {
    liveAdd,
    liveRequest,
    liveCancel,
};

export default Live;
