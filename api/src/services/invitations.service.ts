import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InvitationsRequest } from "src/dtos/invitations.dto";
import { Invitations } from "src/entities/invitations.entity";

@Injectable()
export class InvitationsService {
    constructor(@Inject("PG_CONNECTION") private db: any, private readonly httpService: HttpService, @InjectRepository(Invitations) private invitationsRepository: Repository<Invitations>) {}

    async addInvitations(game_id:string): Promise<InvitationsRequest> {
        const invitation = new Invitations();
        invitation.game_id = game_id;
        const res = await this.invitationsRepository.save(invitation);
        return (res);
    }

    async findInvitations(game_id:string): Promise<InvitationsRequest> {
        const res = await this.db.query(`SELECT * FROM public.invitations WHERE game_id='${game_id}'`)
            .then((result: { rows: any }) => {
                return ({
                    result: result.rows,
                });
            })
            .catch(() => {
                return ({
                    result: [{}],
                });
            });
        return (res);
    }
}