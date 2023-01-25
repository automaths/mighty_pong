import { HttpException, Inject, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from "@nestjs/typeorm";
import { History } from "src/entities/history.entity";
import { Repository } from "typeorm";
import { Match } from 'src/dtos/match.dto';

@Injectable()
export class HistoryService {
    constructor(@Inject("PG_CONNECTION") private db: any, private readonly httpService: HttpService, @InjectRepository(History) private historyRepository: Repository<History>) {}

    async addMatch(player_id:number, player_score:number, player_pongs:number, opp_score: number, opp_name:string): Promise<Match> {
        const match = new History();
        match.player_id = player_id;
        match.player_score = player_score;
        match.player_pongs = player_pongs;
        match.opp_score = opp_score;
        match.opp_name = opp_name;
        const res = await this.historyRepository.save(match);
        return (res);
    }

    async findHistoryFromId(id:number): Promise<Match> {
        const res = await this.db.query(`SELECT * FROM public.history WHERE player_id='${id}' ORDER BY created_at DESC`)
            .then((result: { rows: any }) => {
                if (result.rows.length === 0) {
                    throw new HttpException('No history to display', 500);
                } else {
                    return ({
                        result: result.rows,
                    });
                }
            })
            .catch(() => {
                return ({
                    result: [{}],
                });
            });
        return (res);
    }
}