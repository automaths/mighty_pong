import Config from "../config/Config";
import axios from 'axios';
import { InvitationsRequest } from '../interfaces/invitations';

const invitationsRequest = async (game_id:string): Promise<InvitationsRequest | null> => {
    try {
        const res = await axios.post(`${Config.Api.url}/invitations/add`, {
            game_id: game_id,
        });
        return (res.data);
    } catch (e) {
        return (null);
    }
};

const getInvitations = async (game_id:string): Promise<any> => {
    try {
        const res = await axios.get(`${Config.Api.url}/invitations/${game_id}`);
        return (res.data);
    } catch (e) {
        return (null);
    }
};

const Invitations = {
    invitationsRequest,
    getInvitations,
};

export default Invitations;
