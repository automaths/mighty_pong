import { Controller, Post, Get, Inject, Body, Param } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { MatchmakingService } from '../services/matchmaking.service';
import { MatchmakingRequest } from 'src/dtos/matchmaking.dto';

@Controller('matchmaking')
@Injectable()
export class MatchmakingController {
    constructor(@Inject("PG_CONNECTION") private db: any, private matchmakingService: MatchmakingService) {}

    @Post('/add')
    addMatch(@Body() body: {id_42:number, type:number}): Promise<MatchmakingRequest> {
        return this.matchmakingService.addMatchmaking(body.id_42, body.type);
    }

    @Post('/cancel')
    cancelMatch(@Body() body: {id_42:number, type:number}): Promise<null> {
        return this.matchmakingService.cancelMatchmaking(body.id_42, body.type);
    }

    @Get('/requests/:type')
    getMatch(@Param('type') type: number): Promise<MatchmakingRequest> {
        return this.matchmakingService.findMatchmaking(type);
    }
}