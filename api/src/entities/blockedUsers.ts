import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class blocked_users {
    @PrimaryGeneratedColumn("uuid")
        id: string;

    @Column({
        nullable: false
    })
        user_id: string;

    @Column({
        nullable: false
    })
        blocked_user_id: string;
}