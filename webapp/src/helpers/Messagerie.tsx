import Config from "../config/Config";
import axios from 'axios';
import { MessagerieInterface } from "../interfaces/messagerie";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const create_or_get_discussion = async (email: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/`, {
            email: email,
            from: cookies.get('email')
        }, {
            headers: {
                token: cookies.get('token'),
            }
        });
        return (req.data);
    } catch (e) {
    }
};

const send_message_to_discussion = async (chat_id: string, content: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/send`, {
            chat_id: chat_id,
            sender_id: cookies.get('user_id'),
            content: content,
        });
        return (req.data);
    } catch (e) {
        toast.error('Error, cannot send msg because you are blocked');
    }
};

const get_message_of_discussion = async (chat_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/${chat_id}`, {
            headers: {
                token: cookies.get('token'),
            }
        });
        return (req.data);
    } catch (e) {
    }
};

const   get_all_chat_by_user_id = async (user_id: string): Promise<MessagerieInterface[]> => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/all/${user_id}`);
        return (req.data);
    } catch (e) {
        return ([]);
    }
};

const   create_new_public_chat = async (
    chat_name: string,
    user_id: string
): Promise<MessagerieInterface | null> => {
    try {
        const req = await axios.put(`${Config.Api.url}/chat/`, {
            chat_name: chat_name,
            user_id: user_id,
        });
        return (req.data);
    } catch (e) {
        return (null);
    }
};

const   update_password_chat = async(chat_id: string, password: string, user_id: string) => {
    try {
        const req = await axios.patch(`${Config.Api.url}/chat/password`, {
            chat_id: chat_id,
            password: password,
            user_id: user_id
        });
        return (req.data);
    } catch (e) {
        toast.error('There was an error, you may not have enought permissions');
        return (null);
    }
};

const   is_user_admin = async (chat_id: string, user_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/admin/${chat_id}/${user_id}`);
        return (req.data);
    } catch (e) {
        return (null);
    }
};

const   join_chat = async (chat_id: string, password: string, user_id: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/join`, {
            chat_id: chat_id,
            password: password,
            user_id: user_id,
        });
        return (req.data);
    } catch (e) {
        return (null);
    }
};

const   get_all_members_and_admin = async (chat_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/members/${chat_id}`);
        return (req.data);
    } catch (e) {
        return (null);
    }
};

const   update_admin_list = async (chat_id: string, list_to_add: number[], list_to_delete: number[]) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/admin`, {
            chat_id: chat_id,
            list_to_add: list_to_add,
            list_to_delete: list_to_delete,
            user_id: cookies.get('user_id') ?? '',
        });
        return (req.data);
    } catch (e) {
        toast.error('There was an error, please try again later');
        return (null);
    }
};

const   get_chat_info = async (chat_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/info/${chat_id}`);
        return (req.data);
    } catch (e) {
        toast.error('There was an error from our side, please try again later');
    }
};

const   leave_public_chat = async (chat_id: string, user_id: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/public/leave`, {
            chat_id: chat_id,
            user_id: user_id,
        });
        return (req.data);
    } catch (e) {
        return (null);
    }
};

const   block_user_in_public_chat = async (chat_id: string, user_to_block: string, user_id: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/public/block`, {
            chat_id: chat_id,
            user_to_block: user_to_block,
            user_id: user_id,
        });
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   get_all_users_blocked_by_public_chat = async(chat_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/public/${chat_id}/blocked`);
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   delete_blocked_users = async (chat_id: string, blocked_row_id: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/public/blocked`, {
            blocked_row_id: blocked_row_id,
            chat_id: chat_id,
            user_id: cookies.get('user_id') ?? '',
        });
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   get_all_baned_users = async(chat_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/${chat_id}/ban`);
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   add_baned_users = async(chat_id: string, nickname: string) => {
    try {
        const req = await axios.post(`${Config.Api.url}/chat/${chat_id}/ban/${nickname}`);
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   delete_baned_users = async(chat_id: string, ban_id: string) => {
    try {
        const req = await axios.delete(`${Config.Api.url}/chat/${chat_id}/ban/${ban_id}`);
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   get_all_user_blocked_by_user_id = async(user_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/block/${user_id}`);
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const   get_owner_chat = async (chat_id: string) => {
    try {
        const req = await axios.get(`${Config.Api.url}/chat/owner/${chat_id}`);
        return (req.data);
    } catch (e) {
        toast.error("There was an error from our side, please try again later");
        return (null);
    }
};

const Messagerie = {
    create_or_get_discussion,
    send_message_to_discussion,
    get_message_of_discussion,
    get_all_chat_by_user_id,
    create_new_public_chat,
    update_password_chat,
    is_user_admin,
    join_chat,
    get_all_members_and_admin,
    update_admin_list,
    get_chat_info,
    leave_public_chat,
    block_user_in_public_chat,
    get_all_users_blocked_by_public_chat,
    delete_blocked_users,
    get_all_baned_users,
    add_baned_users,
    delete_baned_users,
    get_all_user_blocked_by_user_id,
    get_owner_chat,
};

export default Messagerie;
