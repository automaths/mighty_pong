import { Controller, Post, Get, Inject, Body, Param } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InvitationsService } from '../services/invitations.service';
import { InvitationsRequest } from '../dtos/invitations.dto';

@Controller('invitations')
@Injectable()
export class InvitationsController {
    constructor(@Inject("PG_CONNECTION") private db: any, private invitationsService: InvitationsService) {}

    @Post('/add')
    addInvitations(@Body() body: {game_id: string}): Promise<InvitationsRequest> {
        return this.invitationsService.addInvitations(body.game_id);
    }

    @Get('/:game_id')
    getInvitations(@Param('game_id') game_id: string): Promise<InvitationsRequest> {
        return this.invitationsService.findInvitations(game_id);
    }
}