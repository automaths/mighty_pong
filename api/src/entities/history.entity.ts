import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class History {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        nullable: false
    })
        player_id: number;

    @Column({
        nullable: true
    })
        player_score: number;

    @Column({
        nullable: true
    })
        player_pongs: number;

    @Column({
        nullable: true
    })
        opp_score: number;

    @Column({
        nullable: false
    })
        opp_name: string;

    @Column({
        default: new Date(),
        nullable: false
    })
        created_at: Date;
}