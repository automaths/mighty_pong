import { useParams } from "react-router-dom";
import { Button, Checkbox, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Helpers from "../../helpers/Helpers";
import { toast } from "react-toastify";
import './Settings.scss';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';

const socket = io(`http://${window.location.hostname}:5000`, { transports: ['websocket'] });

const Settings = () => {

    const { chat_id } = useParams();
    const cookies = new Cookies();

    const [chatPassword, setChatPassword] = useState<string>('');
    const [allMembers, setAllMembers] = useState([]);
    const [checkedIndex, setCheckedIndex] = useState<number[]>([]);
    const [initialIndexAdmin, setInitialIndexAdmin] = useState<number[]>([]);
    const [blockUserInput, setBlockUserInput] = useState<string>('');
    const [banUserInput, setBanUserInput] = useState<string>('');
    const [allUsersBlocked, setAllUsersBlocked] = useState<{id: string, nickname: string}[]>([]);
    const [allBannedUser, setAllBannedUser] = useState<{id: string, nickname: string}[]>([]);
    const [chatOwner, setChatOwner] = useState<{nickname: string, chat_id: string}>();

    const handleSubmit = async() => {
        const req = await Helpers.Messagerie.update_password_chat(
            chat_id ?? '',
            chatPassword,
            cookies.get('user_id') ?? ''
        );
        if (req) {
            toast.success('The password for this chat has been update');
        }
    };

    const get_owner_chat = async () => {
        const req = await Helpers.Messagerie.get_owner_chat(chat_id ?? '');
        if (req) {
            setChatOwner(req);
        }
    };

    const getMembersAndAdmin = async() => {
        const req = await Helpers.Messagerie.get_all_members_and_admin(chat_id ?? '');
        if (req) {
            setAllMembers(req);
            const output: number[] = [];
            req.map((members: any) => {
                if (members.admin){
                    output.push(members?.id);
                }
            });
            setCheckedIndex(output);
            setInitialIndexAdmin(output);
        }
    };

    const handleAdmin = async() => {
        const list_to_delete: number[] = [];
        const list_to_add: number[] = [];
        checkedIndex.map((index) => {
            if (initialIndexAdmin.indexOf(index) == -1 && checkedIndex.indexOf(index) >= 0) {
                list_to_add.push(index);
            }
        });
        initialIndexAdmin.map((index) => {
            if (checkedIndex.indexOf(index) == -1) {
                list_to_delete.push(index);
            }
        });
        const req = await Helpers.Messagerie.update_admin_list(chat_id ?? '', list_to_add, list_to_delete);
        if (req) {
            toast.success('Admin listed updated');
        }
    };

    const handleBlockUserSubmit = async(): Promise<void> => {
        if (blockUserInput === chatOwner?.nickname) {
            toast.error('You cannot block the chanel owner');
            return ;
        }
        const req = await Helpers.Messagerie.block_user_in_public_chat(
            chat_id ?? '',
            blockUserInput,
            cookies.get('user_id') ?? '',
        );
        if (req){
            toast.success('User successfully blocked from the public chat');
            getAllUsersBlocked();
            setBlockUserInput('');
        }
    };

    const get_all_banned_users = async() => {
        const req = await Helpers.Messagerie.get_all_baned_users(chat_id ?? '');
        if (req) {
            setAllBannedUser(req);
        }
    };

    const handleBanUserSubmit = async() => {
        if (banUserInput === chatOwner?.nickname) {
            toast.error('You cannot ban the chanel owner');
            return ;
        }
        const req = await Helpers.Messagerie.add_baned_users(chat_id ?? '', banUserInput);
        if (req) {
            toast.success('user succefully banned');
            get_all_banned_users();
            socket.emit('ban_user', {
                nickname: banUserInput,
                chat_id: chat_id,
            });
            setBanUserInput('');
        }
    };

    const getAllUsersBlocked = async () => {
        const req = await Helpers.Messagerie.get_all_users_blocked_by_public_chat(
            chat_id ?? ''
        );
        if (req){
            setAllUsersBlocked(req);
        }
    };

    useEffect(() => {
        getMembersAndAdmin();
        getAllUsersBlocked();
        get_all_banned_users();
        get_owner_chat();
    }, [false]);

    return (
        <>
            <div>
                <p>Set a password for this chat</p>
                <TextField
                    inputProps={{
                        'id': "email-input-login"
                    }}
                    label="Enter here the new password"
                    variant="standard"
                    type="password"
                    value={chatPassword}
                    onChange={(e) => setChatPassword(e.target.value)}
                />
                <br/><br/>
                <Button
                    variant='contained'
                    onClick={handleSubmit}
                >
                    Validate
                </Button>
            </div>
            <hr/>
            <div>
                <p>Add or drop admin permissions to members</p>
                {allMembers.map((member: any) => {
                    return (
                        <div key={member?.id}>
                            <Checkbox
                                checked={checkedIndex.find((index) => index === member?.id) ? true : false}
                                onClick={() => {
                                    if (checkedIndex.find((index) => index === member?.id)) {
                                        setCheckedIndex(checkedIndex.filter((uid) => uid !== member?.id));
                                    } else {
                                        setCheckedIndex([...checkedIndex, member?.id]);
                                    }
                                }}
                            />
                            {`${member?.nickname} - ${member?.email}`}
                        </div>
                    );
                })}
                <Button
                    variant='contained'
                    onClick={handleAdmin}
                >
                    Validate
                </Button>
            </div>
            <hr/>
            <div>
                <p>Block member</p>
                <TextField
                    label="Enter the name of the users you want to block"
                    variant="standard"
                    value={blockUserInput}
                    onChange={(e) => setBlockUserInput(e.target.value)}
                />
                <Button
                    variant='contained'
                    onClick={handleBlockUserSubmit}
                >
                    Validate
                </Button>
                <br/>
                <br/>
                {allUsersBlocked.map((item) => {
                    return (
                        <li>{item?.nickname} <span className='span-user-blocked' onClick={async() => {
                            const req = await Helpers.Messagerie.delete_blocked_users(chat_id ?? '', item?.id);
                            if (req){
                                toast.success('User succefully unblocked');
                                getAllUsersBlocked();
                            }
                        }}>Unblock</span></li>
                    );
                })}
            </div>
            <hr/>
            <div>
                <p>Ban user</p>
                <TextField
                    label="Enter the name of the users you want to ban"
                    variant="standard"
                    value={banUserInput}
                    onChange={(e) => setBanUserInput(e.target.value)}
                />
                <Button
                    variant='contained'
                    onClick={handleBanUserSubmit}
                >
                    Ban this user
                </Button>
                <br/>
                <br/>
                {allBannedUser.map((item) => {
                    return (
                        <li>{item?.nickname} <span className='span-user-blocked' onClick={async() => {
                            const req = await Helpers.Messagerie.delete_baned_users(chat_id ?? '', item.id);
                            if (req) {
                                toast.success('User succefully unban');
                                get_all_banned_users();
                            }
                        }}>Unban</span></li>
                    );
                })}
            </div>
        </>
    );
};

export default Settings;
