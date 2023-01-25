import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UserConnected } from 'src/configs/userconnected.decorator';
import { Match } from 'src/dtos/match.dto';
import { Users } from 'src/entities/user.entity';
import { HistoryService } from 'src/services/history.service';
import { UserService } from '../services/user.service';

@Controller('history')
@Injectable()
export class HistoryController {
    constructor(@Inject("PG_CONNECTION") private db: any, private historyService: HistoryService, private userService: UserService) {}

    @Post('/match')
    addMatch(@Body() body: {player_id:number, player_score:number, player_pongs:number, opp_score: number, opp_name: string}): Promise<Match> {
        return this.historyService.addMatch(body.player_id, body.player_score, body.player_pongs, body.opp_score, body.opp_name);
    }

    @Get('/all/:nickname')
    async getMatch(@UserConnected() user: Users, @Param() params: { nickname: string }) {
        const user_id = await this.userService.findUserFromNickname(params?.nickname);
        return this.historyService.findHistoryFromId(user_id);
    }
}