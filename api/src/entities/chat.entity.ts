import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum chatType {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

@Entity()
export class Chat {
    @PrimaryGeneratedColumn("uuid")
        id: string;

    @Column({
        nullable: false
    })
        name: string;

    @Column({
        type: "enum",
        enum: chatType,
        default: chatType.PRIVATE,
        nullable: false
    })
        type: string;

    @Column({
        nullable: false
    })
        created_by: string;
}