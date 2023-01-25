import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invitations {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        nullable: false
    })
        game_id: string;

    @Column({
        default: new Date(),
        nullable: false
    })
        created_at: Date;
}