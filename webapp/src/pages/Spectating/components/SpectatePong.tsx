import { useEffect } from "react";

import "./Pong.scss";

import React from "react";
import { io } from "socket.io-client";

import Power from "./Power";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Paddle from "./Paddle";
import Ball from "./Ball";

let lastTime: any = null;
let ball: any = null;
let playerPaddle: any = null;
let computerPaddle: any = null;
let socket_position: any = null;
let another_socket_position: any = null;
let playerScoreElem: any = null;
let computerScoreElem: any = null;
let computerPongs: number = 0;
let playerPongs: number = 0;
let stop: boolean = false;
let collision_tmp = false;
let collision_power_tmp = false;

let power: any = null;
let playerPower: any = null;
let computerPower: any = null;
let playerTime: number = 0;
let computerTime: number = 0;

let renderStop: number = 0;

const SpectatePong = (props: {
    my_id: number;
    opp_id: number;
    nickname: string;
    player: number;
    opp_nickname: string;
}) => {
    const socket = io(`http://${window.location.hostname}:5000`, { transports: ["websocket"] });

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

    const user = {
        id_42: props.opp_id,
        email: "",
        nickname: "",
        avatar: "",
    };

    const navigate = useNavigate();

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

    function update(time: any) {
        if (stop) return;
        renderStop += 1;
        if (renderStop > 50) {
            navigate("/play/live", {});
        }
        if (lastTime != null) {
            const delta = time - lastTime;
            if (props.player === 1) {
                updatingBall(delta);
                checkPowerUps(time);
                timeoutPowerUps(time);
                updatingPower(delta);
            }
            if (socket_position !== null)
                computerPaddle.position = socket_position;
            if (another_socket_position !== null)
                playerPaddle.position = another_socket_position;
            // if (isLose()) {
            //     handleLose();
            // }
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

    // function isLose() {
    //     const rect = ball.rect();
    //     return rect.right >= window.innerWidth || rect.left <= 0;
    // }

    // function handleLose() {
    //     if (stop) return;
    //     const rect = ball.rect();
    //     if (rect.right >= window.innerWidth) {
    //         if (
    //             props.player === 2 &&
    //             computerPower.textContent === "immunity"
    //         ) {
    //             ball.invert();
    //             computerPower.textContent = "";
    //             return;
    //         }
    //         playerScoreElem.textContent =
    //             parseInt(playerScoreElem.textContent) + 1;
    //     } else {
    //         if (props.player === 1 && playerPower.textContent === "immunity") {
    //             ball.invert();
    //             playerPower.textContent = "";
    //             return;
    //         }
    //         computerScoreElem.textContent =
    //             parseInt(computerScoreElem.textContent) + 1;
    //     }
    //     if (
    //         parseInt(computerScoreElem.textContent) > 1 ||
    //         parseInt(playerScoreElem.textContent) > 1
    //     ) {
    //         navigate("/play/live", {});
    //         stop = true;
    //     }
    //     ball.reset();
    //     power.reset();
    //     computerPower.textContent = "no powerups";
    //     playerPower.textContent = "no powerups";
    //     playerTime -= 4000;
    //     computerTime -= 4000;
    //     computerPaddle.reset();
    // }

    socket.on(
        user.id_42.toString() + "paddle",
        (data: { position: number }) => {
            socket_position = data.position;
        }
    );

    socket.on(
        props.my_id.toString() + "paddle",
        (data: { position: number }) => {
            another_socket_position = data.position;
        }
    );

    socket.on(
        user.id_42.toString() + "score",
        (data: { player: number; computer: number }) => {
            computerScoreElem.textContent = data.computer;
            playerScoreElem.textContent = data.player;
        }
    );

    socket.on(user.id_42.toString() + "endgame", () => {
        stop = true;
        navigate("/play/live", {});
    });

    socket.on(props.my_id.toString() + "endgame", () => {
        stop = true;
        navigate("/play/live", {});
    });

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
            renderStop = 0;
        }
    );

    useEffect(() => {
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
    });

    return (
        <>
            <Button href="/play/live">Exit</Button>
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
        </>
    );
};

export default SpectatePong;
