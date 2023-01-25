import { Fragment, useEffect, useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import Helpers from "../../helpers/Helpers";
import { io } from 'socket.io-client';
import './Chat.scss';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MessagerieInterface } from "../../interfaces/messagerie";
import Cookies from 'universal-cookie';
const socket = io(`http://${window.location.hostname}:5000`, { transports: ['websocket'] });

const Chat = () => {

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [chatInfo, setChatInfo] = useState<MessagerieInterface>();
    const [chatMembers, setChatMembers] = useState<{ nickname: string, avatar: string }[]>();
    const [allMessages, setAllMessages] = useState<{content: string, nickname: string}[]>([]);
    const [answer, setAnswer] = useState<string>('');
    const [user42, setUser42] = useState<number>(0);
    const [alllUsersBlocked, setAllUsersBlocked] = useState<{nickname: string}[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { chat_id } = useParams();
    const cookies = new Cookies();

    const handleSubmit = async(): Promise<void> => {
        if (!answer.replaceAll(' ', '')){
            return;
        }
        const req = await Helpers.Messagerie.send_message_to_discussion(location?.state?.chat_id ?? '', answer);
        if (req) {
            setAnswer('');
            socket.emit('message', {
                data: {
                    chat_id: location?.state?.chat_id,
                    content: answer,
                    nickname: cookies.get('nickname'),
                    msg_id: req,
                }
            });
        }
    };

    const getAllMessages = async(): Promise<void> => {
        const req = await Helpers.Messagerie.get_message_of_discussion(location?.state?.chat_id ?? '');
        if (req) {
            setAllMessages(req);
        }
    };

    const isUserAdmin = async(): Promise<void> => {
        const req = await Helpers.Messagerie.is_user_admin(
            location?.state?.chat_id,
            cookies.get('user_id') ?? ''
        );
        if (req) {
            setIsAdmin(true);
        }
    };

    const getChatInfo = async() => {
        const req = await Helpers.Messagerie.get_chat_info(chat_id ?? '');
        if (req) {
            setChatInfo(req?.chat);
            setChatMembers(req?.members);
        }
    };

    const get42Ids = async() => {
        const data = await Helpers.Users.me();
        if (data?.id_42 !== undefined)
            setUser42(data?.id_42);
    };

    socket.on(location?.state?.chat_id, (data: { content: string, nickname: string, chat_id: string, avatar: string, msg_id: string }) => {
        setAllMessages([...allMessages, {
            content: data?.content,
            nickname: data?.nickname,
        }]);
    });

    socket.on(`ban-${chat_id}-${cookies.get('nickname')}`, () => {
        navigate('/messagerie');
    });
    const get_all_users_blocked = async(): Promise<void> => {
        const req = await Helpers.Messagerie.get_all_user_blocked_by_user_id(cookies.get('user_id'));
        if (req) {
            setAllUsersBlocked(req);
        }
    };

    useEffect(() => {
        getAllMessages();
        isUserAdmin();
        getChatInfo();
        get42Ids();
        get_all_users_blocked();
    }, [false]);

    return (
        <Fragment>
            { isAdmin &&
                <Button onClick={() => navigate(`/chat/${location?.state?.chat_id}/settings`)}>Settings</Button>
            }
            {(chatInfo && chatInfo?.type === 'private') &&
                <div
                    id='dest-private-chat'
                    onClick={() => navigate(`/users/${chatMembers?.find((member) => member?.nickname !== cookies.get('nickname'))?.nickname}`)}
                >
                    <div id='div-avatar-private-chat'>
                        <img
                            id='avatar-dest-private-chat'
                            src={chatMembers?.find((member) => member?.nickname !== cookies.get('nickname'))?.avatar}
                        />
                    </div>
                    <p id='name-dest-private-chat'>
                        {chatMembers?.find((member) => member?.nickname !== cookies.get('nickname'))?.nickname}
                    </p>
                </div>
            }
            <hr/>
            <div
                style={{height: (window.innerHeight * 0.7)}}
            >
                <Box sx={{
                    overflowY: "scroll",
                    height: '90%'
                }}>
                    {allMessages.map((msg, index) => {
                        return (
                            <div
                                key={index}
                                id={`msg-chat-${index}`}
                                className='chat-item'
                            >
                                <div className={`content-message-${msg?.nickname === cookies.get('nickname') ? 'right' : 'left'}`}>
                                    { (msg?.content.indexOf(`http://${window.location.hostname}:3000/play/matchmaking/`) >= 0) ? (
                                        <div>
                                            Do you want to play a pong game ?&nbsp;
                                            <u
                                                className='invitation-chat-ling'
                                                onClick={() => navigate(msg?.content.split(`http://${window.location.hostname}:3000`)[1], {
                                                    state: {
                                                        my_id: user42,
                                                        nickname: cookies.get('nickname'),
                                                    }
                                                })}
                                            >
                                                Click here to join
                                            </u>
                                        </div>
                                    ): (
                                        <div>
                                            { alllUsersBlocked.find((usr) => usr.nickname === msg?.nickname) ? (
                                                <span><i>You cannot see this message because you blocked this user</i></span>
                                            ) : (
                                                msg?.content
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={`nickname-message-${msg?.nickname === cookies.get('nickname') ? 'right' : 'left'}`}>
                                    Posted by <span onClick={() => navigate(`/users/${msg?.nickname}`)}>{ msg?.nickname }</span>
                                </div>
                            </div>
                        );
                    })}
                </Box>
                <div
                    id='div-submit-button'
                >
                    <TextField
                        variant="standard"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e: { key: string }) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        inputProps={{
                            'id': "answer-chat-input"
                        }}
                    />
                    <Button
                        onClick={() => handleSubmit()}
                        id='button-answer-chat-submit'
                        variant='contained'
                    >
                        Send
                    </Button>
                </div>
            </div>
        </Fragment>
    );
};

export default Chat;