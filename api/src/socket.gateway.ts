import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class SocketGateway {
    @WebSocketServer()
        server: any;

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: { data: { content: string, nickname: string, chat_id: string, avatar: string } }): void {
        this.server.emit(message.data.chat_id, {
            content: message.data?.content,
            nickname: message.data?.nickname,
            chat_id: message.data?.chat_id,
            avatar: message.data?.avatar,
        });
    }

    @SubscribeMessage('matchmaking')
    handleMatch(@MessageBody() message: { data: { target: string, callback: number, nickname:string } }): void {
        this.server.emit(message.data.target + 'matchmaking', {
            id_incoming: message.data?.callback,
            nickname: message.data?.nickname,
            confirmation: false,
        });
    }

    @SubscribeMessage('classic')
    handleClassic(@MessageBody() message: { data: { target: string, callback: number, nickname:string } }): void {
        this.server.emit(message.data.target + 'classic', {
            id_incoming: message.data?.callback,
            nickname: message.data?.nickname,
            confirmation: false,
        });
    }

    @SubscribeMessage('confirmation')
    handleConfirmation(@MessageBody() message: { data: { target: string, callback: number, nickname:string } }): void {
        this.server.emit(message.data.target + 'matchmaking', {
            id_incoming: message.data?.callback,
            nickname:message.data?.nickname,
            confirmation: true,
        });
    }

    @SubscribeMessage('private_game')
    handlePrivateGame(@MessageBody() message: { data: { game_id: string, confirmation: boolean, opp_id:number, opp_nickname: string } }): void {
        this.server.emit('private_game', {
            game_id: message.data?.game_id,
            confirmation: message.data?.confirmation,
            opp_id: message.data?.opp_id,
            opp_nickname: message.data?.opp_nickname,
        });
    }

    @SubscribeMessage('confirmation_classic')
    handleConfirmationClassic(@MessageBody() message: { data: { target: string, callback: number, nickname:string } }): void {
        this.server.emit(message.data.target + 'classic', {
            id_incoming: message.data?.callback,
            nickname:message.data?.nickname,
            confirmation: true,
        });
    }

    @SubscribeMessage('paddle')
    updatePosition(@MessageBody() message: { data: { target: string, position:number } }): void {
        this.server.emit(message.data.target + 'paddle', {
            position:message.data?.position,
        });
    }

    @SubscribeMessage('endgame')
    announceEndgame(@MessageBody() message: { data: { target: string, endgame:number, winner:boolean } }): void {
        this.server.emit(message.data.target + 'endgame', {
            endgame:message.data?.endgame,
            winner:message.data?.winner,
        });
    }

    @SubscribeMessage('forfait')
    announceForfait(@MessageBody() message: { data: { target: string, forfait:boolean } }): void {
        this.server.emit(message.data.target + 'forfait', {
            forfait:message.data?.forfait,
        });
    }

    @SubscribeMessage('replay')
    announceReplay(@MessageBody() message: { data: { target: string, incoming_id:number, incoming_nickname:string, nickname:string, cancel:boolean, confirmation:boolean } }): void {
        this.server.emit(message.data.target + 'replay', {
            incoming_id:message.data?.incoming_id,
            incoming_nickname:message.data?.incoming_nickname,
            nickname:message.data?.nickname,
            cancel:message.data?.cancel,
            confirmation:message.data?.confirmation,
        });
    }

    @SubscribeMessage('score')
    updateScore(@MessageBody() message: { data: { target: string, player: number, computer: number } }): void {
        this.server.emit(message.data.target + 'score', {
            player:message.data?.player,
            computer:message.data?.computer,
        });
    }

    @SubscribeMessage('ball')
    updateBall(@MessageBody() message: { data: { target: string, x: number, y: number, p_x: number, p_y: number, p_l: string, p_r: string } }): void {
        this.server.emit(message.data.target + 'ball', {
            x: message.data?.x,
            y: message.data?.y,
            p_x: message.data?.p_x,
            p_y: message.data?.p_y,
            p_l: message.data?.p_l,
            p_r: message.data?.p_r,
        });
    }

    @SubscribeMessage('ban_user')
    banUser(@MessageBody() message: { nickname: string, chat_id: string } ): void {
        this.server.emit(`ban-${message?.chat_id}-${message?.nickname}`);
    }
}
