import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Live {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        nullable: false
    })
        id_one: number;

    @Column({
        nullable: false
    })
        id_two: number;

    @Column({
        nullable: false
    })
        player_one: string;

    @Column({
        nullable: false
    })
        player_two: string;

    @Column({
        default: new Date(),
        nullable: false
    })
        created_at: Date;
}