import { useEffect, useState } from "react";

import "./Pong.scss";
import React from "react";
import { io } from "socket.io-client";

import Helpers from "../../../helpers/Helpers";
import Power from "./Power";
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
let collision_power_tmp = false;
let unique_match = 0;
let winner: boolean = false;

let power: any = null;
let playerPower: any = null;
let computerPower: any = null;
let playerTime: number = 0;
let computerTime: number = 0;
// let stopAdd: boolean = false;

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

    const poweringUp = (side: number) => {
        const random = Math.floor(Math.random() * 10);
        if (random < 5) {
            if (side === 1) playerPower.textContent = "no speed increase";
            else computerPower.textContent = "no speed increase";
        } else if (random < 7) {
            if (side === 1) playerPower.textContent = "immunity";
            else computerPower.textContent = "immunity";
        } else {
            if (side === 1)
                playerPower.textContent = "opponent double speed increase";
            else computerPower.textContent = "opponent double speed increase";
        }
    };

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
        if (
            playerPower.textContent === "no speed increase" &&
            computerPower.textContent === "no speed increase"
        )
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                1
            );
        else if (
            playerPower.textContent === "opponent double speed increase" &&
            computerPower.textContent === "opponent double speed increase"
        )
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                2
            );
        else if (
            playerPower.textContent === "no speed increase" &&
            computerPower.textContent === "opponent double speed increase"
        )
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                3
            );
        else if (
            playerPower.textContent === "opponent double speed increase" &&
            computerPower.textContent === "no speed increase"
        )
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                4
            );
        else if (playerPower.textContent === "opponent double speed increase")
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                5
            );
        else if (playerPower.textContent === "no speed increase")
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                6
            );
        else if (computerPower.textContent === "opponent double speed increase")
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                7
            );
        else if (computerPower.textContent === "no speed increase")
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                8
            );
        else
            ball.update(
                delta,
                [playerPaddle.rect(), computerPaddle.rect()],
                collision,
                0
            );
    };

    const timeoutPowerUps = (time: number) => {
        if (time > playerTime + 8000) playerPower.textContent = "no powerups";
        if (time > computerTime + 8000)
            computerPower.textContent = "no powerups";
    };

    const checkPowerUps = (time: number) => {
        if (isCollision(playerPaddle.rect(), power.rect())) {
            if (playerPower.textContent === "no powerups") {
                poweringUp(1);
                playerTime = time;
            }
        }
        if (isCollision(computerPaddle.rect(), power.rect())) {
            if (computerPower.textContent === "no powerups") {
                poweringUp(2);
                computerTime = time;
            }
        }
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

    const updatingPower = (delta: number) => {
        if (
            (power.rect().right >= window.innerWidth ||
                power.rect().left <= 0) &&
            collision_power_tmp === false
        ) {
            power.update(delta, 1);
            collision_power_tmp = true;
        } else {
            power.update(delta, 0);
            collision_power_tmp = false;
        }
    };

    async function update(time: any) {
        if (stop) return;
        if (forfait === true) {
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
            if (props.player === 1) await Helpers.Live.liveCancel(props.my_id);
            else await Helpers.Live.liveCancel(props.opp_id);
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
                checkPowerUps(time);
                timeoutPowerUps(time);
                updatingPower(delta);
                socket.emit("ball", {
                    data: {
                        target: props.opp_id,
                        x: ball.get_x(),
                        y: ball.get_y(), //emit also power coordinates, power ups
                        p_x: power.get_x(),
                        p_y: power.get_y(),
                        p_l: playerPower.textContent,
                        p_r: computerPower.textContent,
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
        if (rect.right >= window.innerWidth) {
            if (
                props.player === 2 &&
                computerPower.textContent === "immunity"
            ) {
                ball.invert();
                computerPower.textContent = "";
                return;
            }
            if (props.player === 1)
            {
                playerScoreElem.textContent =
                    parseInt(playerScoreElem.textContent) + 1;
            }
        } else {
            if (props.player === 1 && playerPower.textContent === "immunity") {
                ball.invert();
                playerPower.textContent = "";
                return;
            }
            if (props.player === 1)
            {
                computerScoreElem.textContent =
                    parseInt(computerScoreElem.textContent) + 1;
            }
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
                            type: 1,
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
        power.reset();
        computerPower.textContent = "no powerups";
        playerPower.textContent = "no powerups";
        playerTime -= 4000;
        computerTime -= 4000;
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
            if (socket_position != data.position && data.position !== null) renderStop = 0;
            if (socket_position !== null && data.position !== null)
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
                id_one: props.my_id,
                id_two: props.opp_id,
                player_one: props.nickname,
                player_two: props.opp_nickname,
                score_one: parseInt(playerScoreElem.textContent),
                score_two: parseInt(computerScoreElem.textContent),
                pongs: playerPongs,
                winner: data.winner,
                is_one: 0,
                type: 1,
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
            power.set_x(data.p_x);
            power.set_y(data.p_y);
            playerPower.textContent = data.p_l;
            computerPower.textContent = data.p_r;
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
        collision_power_tmp = false;
        unique_match = 0;
        power = null;
        playerPower = null;
        computerPower = null;
        playerTime = 0;
        computerTime = 0;
        renderStop = 0;
        winner = false;
        forfait = false;
        // stopAdd = false;

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
        power = new Power(document.getElementById("power"));
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
        playerPower = document.getElementById("power-left");
        computerPower = document.getElementById("power-right");
        playerPower.textContent = "no powerups";
        computerPower.textContent = "no powerups";
        playerScoreElem = document.getElementById("player-score");
        computerScoreElem = document.getElementById("computer-score");
        window.requestAnimationFrame(update);
    }, [false]);

    return (
        <section id="pong-section">
            <>
                <div className="powerleft">
                    <div id="power-left">bloup</div>
                </div>
                <div className="powerright">
                    <div id="power-right">bloup</div>
                </div>
                <div className="score">
                    <div id="player-score">0</div>
                    <div id="computer-score">0</div>
                </div>
            </>
            <div className="ball" id="ball"></div>
            <div className="power" id="power"></div>
            <div className="paddle left" id="player-paddle"></div>
            <div className="paddle right" id="computer-paddle"></div>
        </section>
    );
};

export default Pong;
