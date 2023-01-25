import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Live } from "src/entities/live.entity";
import { LiveRequest } from '../dtos/live.dto';

@Injectable()
export class LiveService {
    constructor(@Inject("PG_CONNECTION") private db: any, private readonly httpService: HttpService, @InjectRepository(Live) private liveRepository: Repository<Live>) {}

    async addLive(id_one:number, id_two:number, player_one:string, player_two:string): Promise<LiveRequest> {
        const live = new Live();
        live.id_one = id_one;
        live.id_two = id_two;
        live.player_one = player_one;
        live.player_two = player_two;
        const res = await this.liveRepository.save(live);
        return (res);
    }

    async cancelLive(id_one:number): Promise<null> {
        await this.db.query(`DELETE FROM public.live WHERE id_one='${id_one}'`);
        return (null);
    }

    async findLive(): Promise<LiveRequest> {
        const res = await this.db.query(`SELECT * FROM public.live ORDER BY created_at ASC`)
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