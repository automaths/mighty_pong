import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Matchmaking {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        nullable: false
    })
        id_42: number;

    @Column({
        nullable: false
    })
        type: number;

    @Column({
        default: new Date(),
        nullable: false
    })
        created_at: Date;
}