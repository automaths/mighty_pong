import { Controller, Post, Get, Inject, Body } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LiveService } from '../services/live.service';
import { LiveRequest } from '../dtos/live.dto';

@Controller('live')
@Injectable()
export class LiveController {
    constructor(@Inject("PG_CONNECTION") private db: any, private liveService: LiveService) {}

    @Post('/add')
    addMatch(@Body() body: {id_one:number, id_two:number, player_one:string, player_two:string}): Promise<LiveRequest> {
        return this.liveService.addLive(body.id_one, body.id_two, body.player_one, body.player_two);
    }

    @Post('/cancel')
    cancelMatch(@Body() body: {id_one:number}): Promise<null> {
        return this.liveService.cancelLive(body.id_one);
    }

    @Get('/requests')
    getMatch(): Promise<LiveRequest> {
        return this.liveService.findLive();
    }
}