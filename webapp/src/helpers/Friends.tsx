import axios from "axios";
import { toast } from "react-toastify";
import Config from "../config/Config";

const sendFriendRequest = async(friend: string, nickname: string): Promise<any> => {
    try {
        const res = await axios.post(`${Config.Api.url}/friends/sendrequest/${friend}`, {
            nickname: nickname
        });
        toast.success(`Friend request to ${friend} has been sent`);
        return (res.data);
    } catch (e) {
        return (null);
    }
};

const getReceivedFriendRequests = async(): Promise<any> => {
    return await axios.get(`${Config.Api.url}/friends/requests`).then((res) => res.data);
};

const getFriendRequestStatus = async(otherUser: string): Promise<any> => {
    return await axios.get(`${Config.Api.url}/friends/requests/${otherUser}`).then((res) => res.data);
};

const acceptFriendRequest = async(otherUser: string, nickname: string, accept: boolean): Promise<any> => {
    try {
        const res = await axios.post(`${Config.Api.url}/friends/requests/${otherUser}/accept`, {
            nickname: nickname,
            accept: accept
        });
        return (res.data);
    } catch (e) {
        return (null);
    }
};

const getSentRequests = async(): Promise<any> => {
    return await axios.get(`${Config.Api.url}/friends/requests/sent`).then((res) => res.data);
};

const getFriendList = async(): Promise<any> => {
    return await axios.get(`${Config.Api.url}/friends/requests/friendlist`).then((res) => res.data);
};

const is_user_blocked = async(user_id: string, user_id_profile: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/friends/blocked/${user_id}/${user_id_profile}`);
        return (req.data);
    } catch (e) {
        toast.error('There was an error from ou side, please try again later');
    }
};

const Friends = {
    sendFriendRequest,
    getReceivedFriendRequests,
    getFriendRequestStatus,
    acceptFriendRequest,
    getSentRequests,
    getFriendList,
    is_user_blocked,
};

export default Friends;