import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn("uuid")
        id: string;

    @Column({
        nullable: false
    })
        chat_id: string;

    @Column({
        nullable: false
    })
        sent_by: string;

    @Column({
        nullable: false
    })
        content: string;

    @Column({
        nullable: false
    })
        created_at: string;
}