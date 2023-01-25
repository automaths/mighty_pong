import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Helpers from "../../helpers/Helpers";

const PrivateGame = () => {
    const { game_id } = useParams();
    const socket = io(`http://${window.location.hostname}:5000`, { transports: ["websocket"] });
    const navigate = useNavigate();
    const location = useLocation();

    const [brokenLink, setBrokenLink] = useState<boolean>(false);

    useEffect(() => {
        if (game_id !== undefined) {
            Helpers.Invitations.getInvitations(game_id).then(async (res) => {
                if (res?.result.length > 1) {
                    setBrokenLink(true);
                } else {
                    await Helpers.Invitations.invitationsRequest(game_id);
                    socket.emit("private_game", {
                        data: {
                            game_id: game_id,
                            confirmation: false,
                            opp_id: parseInt(location?.state?.my_id),
                            opp_nickname: location?.state?.nickname,
                        },
                    });
                }
            });
        }
    });

    socket.on(
        "private_game",
        (data: {
            game_id: string;
            confirmation: boolean;
            opp_id: number;
            opp_nickname: string;
        }) => {
            if (brokenLink === true) return;
            if (
                data.game_id === game_id &&
                data.opp_id !== parseInt(location?.state?.my_id) &&
                data.confirmation
            ) {
                if (game_id.slice(-2) === "ue") {
                    navigate("/play/bonus", {
                        state: {
                            my_id: parseInt(location?.state?.my_id),
                            nickname: location?.state?.nickname,
                            opp_id: data.opp_id,
                            opp_nickname: data.opp_nickname,
                            player: 2,
                        },
                    });
                } else {
                    navigate("/play/classic", {
                        state: {
                            my_id: parseInt(location?.state?.my_id),
                            nickname: location?.state?.nickname,
                            opp_id: data.opp_id,
                            opp_nickname: data.opp_nickname,
                            player: 2,
                        },
                    });
                }
            } else if (
                data.game_id === game_id &&
                data.opp_id !== parseInt(location?.state?.my_id)
            ) {
                socket.emit("private_game", {
                    data: {
                        game_id: game_id,
                        confirmation: true,
                        opp_id: parseInt(location?.state?.my_id),
                        opp_nickname: location?.state?.nickname,
                    },
                });
                if (game_id.slice(-2) === "ue") {
                    navigate("/play/bonus", {
                        state: {
                            my_id: parseInt(location?.state?.my_id),
                            nickname: location?.state?.nickname,
                            opp_id: data.opp_id,
                            opp_nickname: data.opp_nickname,
                            player: 1,
                        },
                    });
                } else {
                    navigate("/play/classic", {
                        state: {
                            my_id: parseInt(location?.state?.my_id),
                            nickname: location?.state?.nickname,
                            opp_id: data.opp_id,
                            opp_nickname: data.opp_nickname,
                            player: 1,
                        },
                    });
                }
            }
        }
    );

    return (
        <div>
            {brokenLink
                ? "The link is broken my friend"
                : "This is private game number { game_id }"
            }
        </div>
    );
};

export default PrivateGame;
