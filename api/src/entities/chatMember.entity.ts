import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatMember {
    @PrimaryGeneratedColumn("uuid")
        id: string;

    @Column({
        nullable: false
    })
        chat_id: string;

    @Column({
        nullable: false
    })
        user_id: string;
}