import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum friendRequestStatus {
    ACCEPTED = 'accepted',
    PENDING = 'pending',
    CANCELLED = 'cancelled'
}

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        nullable: false
    })
        sender: number;

    @Column({
        nullable: false
    })
        receiver: number;

    @Column({
        type: "enum",
        enum: friendRequestStatus,
        default: friendRequestStatus.PENDING,
        nullable: false
    })
        current_status: string;

    @Column({
        default: new Date(),
        nullable: false
    })
        created_at: Date;
}