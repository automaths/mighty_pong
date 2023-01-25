import { useEffect, useState } from "react";

import "./Pong.scss";

import React from "react";
import { io } from "socket.io-client";

import Helpers from "../../../helpers/Helpers";
import { useNavigate } from "react-router-dom";
import Ball from "./Ball";
import Paddle from "./Paddle";

let renderStop: number = 0;
let lastTime: any = null;
let ball: any = null;
let playerPaddle: any = null;
let computerPaddle: any = null;
let socket_position: any = null;
let playerScoreElem: any = null;
let computerScoreElem: any = null;
let computerPongs: number = 0;
let playerPongs: number = 0;
let stop: boolean = false;
let collision_tmp = false;
let unique_match = 0;
let winner: boolean = false;

let forfait: boolean = false;

const Pong = (props: {
    my_id: number;
    opp_id: number;
    nickname: string;
    player: number;
    opp_nickname: string;
}) => {
    const socket = io(`http://${window.location.hostname}:5000`, { transports: ["websocket"] });
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id_42: 0,
        email: "",
        nickname: "",
        avatar: "",
    });

    window.addEventListener("beforeunload", async () => {
        if (props.player === 1) await Helpers.Live.liveCancel(props.my_id);
        else await Helpers.Live.liveCancel(props.opp_id);
    });

    useEffect(() => {
        Helpers.Users.me().then((res) => setUser(res!));
    }, []);

    const updating_ball = (delta: number, collision: number) => {
        ball.update(
            delta,
            [playerPaddle.rect(), computerPaddle.rect()],
            collision,
            0
        );
    };

    const updatingBall = (delta: number) => {
        if (
            (isCollision(playerPaddle.rect(), ball.rect()) ||
                isCollision(computerPaddle.rect(), ball.rect())) &&
            collision_tmp === false
        ) {
            if (isCollision(playerPaddle.rect(), ball.rect()))
                playerPongs = playerPongs + 1;
            if (isCollision(computerPaddle.rect(), ball.rect()))
                computerPongs = computerPongs + 1;
            updating_ball(delta, 1);
            collision_tmp = true;
        } else {
            updating_ball(delta, 0);
            collision_tmp = false;
        }
    };

    async function update(time: any) {
        if (stop) return;
        if (forfait === true) {
            if (props.player === 1) await Helpers.Live.liveCancel(props.my_id);
            else await Helpers.Live.liveCancel(props.opp_id);
            socket.emit("forfait", {
                data: {
                    target: props.opp_id.toString(),
                },
            });
            return;
        }
        renderStop += 1;
        if (renderStop > 600) {
            forfait = true;
            navigate("/play/forfait", {
                state: {
                    opp_nickname: props.opp_nickname,
                },
            });
        }
        if (lastTime != null) {
            const delta = time - lastTime;
            if (props.player === 1) {
                updatingBall(delta);
                socket.emit("ball", {
                    data: {
                        target: props.opp_id,
                        x: ball.get_x(),
                        y: ball.get_y(), //emit also power coordinates, power ups
                    },
                });
            }
            if (computerPaddle.position !== null)
                computerPaddle.position = socket_position;
            if (isLose()) {
                handleLose();
            }
            const hue = parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                    "--hue"
                )
            );
            document.documentElement.style.setProperty(
                "--hue",
                (hue + delta * 0.01).toString()
            );
        }
        lastTime = time;
        window.requestAnimationFrame(update);
    }

    function isCollision(rect1: any, rect2: any) {
        return (
            rect1.left <= rect2.right &&
            rect1.right >= rect2.left &&
            rect1.top <= rect2.bottom &&
            rect1.bottom >= rect2.top
        );
    }

    function isLose() {
        const rect = ball.rect();
        return rect.right >= window.innerWidth || rect.left <= 0;
    }

    async function handleLose() {
        if (stop) return;
        const rect = ball.rect();
        if (rect.right >= window.innerWidth && props.player === 1) {
            playerScoreElem.textContent =
                parseInt(playerScoreElem.textContent) + 1;
        } else if (props.player === 1) {
            computerScoreElem.textContent =
                parseInt(computerScoreElem.textContent) + 1;
        }
        if (
            parseInt(computerScoreElem.textContent) > 1 ||
            parseInt(playerScoreElem.textContent) > 1
        ) {
            if (parseInt(computerScoreElem.textContent) > 1)
                winner = false;
            else
                winner = true;
            if (props.player === 1) await Helpers.Live.liveCancel(props.my_id);
            if (props.player === 1) {
                if (forfait !== true) {
                    if (props.player === 1)
                        await Helpers.Live.liveCancel(props.my_id);
                    else await Helpers.Live.liveCancel(props.opp_id);
                    socket.emit("score", {
                        data: {
                            target: props.opp_id.toString(),
                            player: parseInt(playerScoreElem.textContent),
                            computer: parseInt(computerScoreElem.textContent),
                        },
                    });
                    socket.emit("endgame", {
                        data: {
                            target: props.opp_id.toString(),
                            endgame: 1,
                            winner: winner,
                        },
                    });
                    navigate("/play/endgame", {
                        state: {
                            id_one: props.my_id,
                            id_two: props.opp_id,
                            player_one: props.nickname,
                            player_two: props.opp_nickname,
                            score_one: parseInt(playerScoreElem.textContent),
                            score_two: parseInt(computerScoreElem.textContent),
                            pongs: playerPongs,
                            is_one: 1,
                            winner: winner,
                            type: 2,
                        },
                    });
                }
            }
            stop = true;
        }
        socket.emit("score", {
            data: {
                target: props.opp_id.toString(),
                player: parseInt(playerScoreElem.textContent),
                computer: parseInt(computerScoreElem.textContent),
            },
        });
        ball.reset();
        computerPaddle.reset();
    }

    document.addEventListener("mousemove", (e) => {
        playerPaddle.position = (e.y / window.innerHeight) * 100;
        socket.emit("paddle", {
            data: {
                target: props.opp_id.toString(),
                position: playerPaddle.position,
            },
        });
    });

    socket.on(
        user.id_42.toString() + "paddle",
        (data: { position: number }) => {
            if (socket_position != data.position) renderStop = 0;
            if (socket_position !== null)
                socket_position = data.position;
        }
    );

    socket.on(user.id_42.toString() + "forfait", () => {
        forfait = true;
        navigate("/play/forfait", {
            state: {
                opp_nickname: props.opp_nickname,
            },
        });
    });

    socket.on(user.id_42.toString() + "endgame", (data: { winner: boolean }) => {
        navigate("/play/endgame", {
            state: {
                id_one: props.opp_id,
                id_two: props.my_id,
                player_one: props.nickname,
                player_two: props.opp_nickname,
                score_one: parseInt(playerScoreElem.textContent),
                score_two: parseInt(computerScoreElem.textContent),
                pongs: playerPongs,
                winner: data.winner,
                is_one: 0,
                type: 2,
            },
        });
    });

    socket.on(
        user.id_42.toString() + "score",
        (data: { player: number; computer: number }) => {
            computerScoreElem.textContent = data.computer;
            playerScoreElem.textContent = data.player;
        }
    );

    socket.on(
        user.id_42.toString() + "ball",
        (data: {
            x: number;
            y: number;
            p_x: number;
            p_y: number;
            p_l: string;
            p_r: string;
        }) => {
            ball.set_x(data.x);
            ball.set_y(data.y);
        }
    );

    useEffect(() => {
        lastTime = null;
        ball = null;
        playerPaddle = null;
        computerPaddle = null;
        socket_position = 0;
        playerScoreElem = 0;
        computerScoreElem = 0;
        computerPongs = 0;
        playerPongs = 0;
        stop = false;
        collision_tmp = false;
        unique_match = 0;
        renderStop = 0;
        winner = false;
        forfait = false;

        if (props.player === 1 && unique_match == 0) {
            Helpers.Live.liveAdd(
                props.my_id,
                props.opp_id,
                props.nickname,
                props.opp_nickname
            );
            unique_match = 1;
        }
        ball = new Ball(document.getElementById("ball"));
        if (props.player === 1) {
            playerPaddle = new Paddle(document.getElementById("player-paddle"));
            computerPaddle = new Paddle(
                document.getElementById("computer-paddle")
            );
        } else {
            playerPaddle = new Paddle(
                document.getElementById("computer-paddle")
            );
            computerPaddle = new Paddle(
                document.getElementById("player-paddle")
            );
        }
        playerScoreElem = document.getElementById("player-score");
        computerScoreElem = document.getElementById("computer-score");
        window.requestAnimationFrame(update);
    }, [false]);

    return (
        <section id="pong-section">
            <>
                <div className="score">
                    <div id="player-score">0</div>
                    <div id="computer-score">0</div>
                </div>
            </>
            <div className="ball" id="ball"></div>
            <div className="paddle left" id="player-paddle"></div>
            <div className="paddle right" id="computer-paddle"></div>
        </section>
    );
};

export default Pong;
