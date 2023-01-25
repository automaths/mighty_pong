import { Fragment, useEffect, useState } from "react";
import { Button, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import Helpers from "../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import { ListItem, List, ListItemText, Avatar, ListItemAvatar } from '@mui/material';

import './Messagerie.scss';
import { MessagerieInterface } from "../../interfaces/messagerie";
import { toast } from "react-toastify";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Cookies from 'universal-cookie';

const Messaging = () => {

    const [destinationChatName, setDestinationChatName] = useState<string>("");
    const [allDiscussions, setAllDiscussions] = useState<MessagerieInterface[]>([]);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [discussionSelected, setDiscussionSelected] = useState<MessagerieInterface>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const cookies = new Cookies();

    const handleSubmit = async(): Promise<void> => {
        if (destinationChatName === cookies.get('email')) {
            alert('Error, you cannot send an message to yourself');
            return ;
        }
        const req = await Helpers.Users.findUserByEmail(destinationChatName);
        const chat = await Helpers.Messagerie.create_or_get_discussion(destinationChatName);
        if (req && chat) {
            setDestinationChatName('');
            navigate(`/chat/${chat?.chat_id}`, {
                state: {
                    chat_id:  chat?.chat_id
                }
            });
        }
    };

    const createNewChat = async(): Promise<void> => {
        if (!destinationChatName) {
            toast.error('You cannot create a chat with an empty name');
            return ;
        }
        const req = await Helpers.Messagerie.create_new_public_chat(
            destinationChatName,
            cookies.get('user_id') ?? '',
        );
        if (req) {
            setDestinationChatName('');
            navigate(`/chat/${req}`, {
                state: {
                    chat_id: req
                }
            });
        }
    };

    const navigateToChat = (chat_id: string) => {
        navigate(`/chat/${chat_id}`, {
            state: {
                chat_id:  chat_id
            }
        });
    };

    const get_all_discussions = async(): Promise<void> => {
        const data = await Helpers.Messagerie.get_all_chat_by_user_id(cookies.get('user_id') ?? '');
        if (data) {
            setAllDiscussions(data);
        }
    };

    useEffect(() => {
        get_all_discussions();
    }, [false]);

    return (
        <Fragment>
            <Menu
                anchorEl={anchorEl}
                open={settingsOpen}
                onClose={() => {
                    setSettingsOpen(false);
                }}
            >
                <MenuItem
                    onClick={async() => {
                        if (discussionSelected?.type === 'private') {
                            toast.error('You cannot leave a private chat');
                        } else {
                            const req = await Helpers.Messagerie.leave_public_chat(
                                discussionSelected?.id ?? '',
                                cookies.get('user_id') ?? ''
                            );
                            if (req) {
                                toast.success('Succefully left the chat');
                            } else {
                                toast.error('You cannot left the chat if you are the only one admin');
                            }
                        }
                        get_all_discussions();
                    }}
                >
                    Leave
                </MenuItem>
            </Menu>
            <div
                id='div-message-messaging'
            >
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {allDiscussions.map((discussion: MessagerieInterface) => {
                        return (
                            <ListItem
                                alignItems="flex-start"
                                key={discussion.id}
                                secondaryAction={
                                    <IconButton
                                        onClick={(event) => {
                                            setDiscussionSelected(discussion);
                                            setAnchorEl(event.currentTarget);
                                            setSettingsOpen(!settingsOpen);
                                        }}
                                    >
                                        <MoreVertIcon/>
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={discussion.type === 'public' ? undefined : discussion?.picture} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={ discussion.type === 'public' ? discussion.name : discussion.nickname }
                                    onClick={async() => {
                                        if (discussion.type === 'private') {
                                            navigateToChat(discussion.id);
                                        } else {
                                            if (discussion?.member) {
                                                navigateToChat(discussion.id);
                                            } else {
                                                let pass = '';
                                                if (discussion.password) {
                                                    pass = prompt('Please, enter the password requested') ?? '';
                                                }
                                                if (await Helpers.Messagerie.join_chat(
                                                    discussion.id,
                                                    pass,
                                                    cookies.get('user_id') ?? ''
                                                )) {
                                                    navigateToChat(discussion.id);
                                                } else {
                                                    toast.error('Wrong password or banned from chat');
                                                }
                                            }
                                        }
                                    }}
                                    secondary={
                                        <Fragment>
                                            {discussion?.type === 'public' &&
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    { discussion?.member ? 'member' : 'not-member' } { discussion?.password && ' - need password' }
                                                </Typography>
                                            }
                                        </Fragment>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </div>
            <div id='div-input-messagerie-email'>
                <TextField
                    label="Email of user to send a message"
                    variant="standard"
                    type='email'
                    value={destinationChatName}
                    onChange={(e) => setDestinationChatName(e.target.value)}
                    inputProps={{
                        'id': 'input-messagerie-email'
                    }}
                />
            </div>
            <br />
            <div id='button-group-new-chat'>
                <Button
                    variant="contained"
                    type="submit"
                    id='submit-button-messagerie'
                    onClick={handleSubmit}
                >
                    Validate
                </Button>
                <br/>
                <Button
                    variant="contained"
                    type="submit"
                    id='submit-button-new-chat'
                    color='secondary'
                    onClick={createNewChat}
                >
                    Create new chat
                </Button>
            </div>
        </Fragment>
    );
};

export default Messaging;
