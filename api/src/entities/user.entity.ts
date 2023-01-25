import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/* By default, the field nullable is set by true. To be more explicit
on the scope of this project, we add this field*/

export enum userStatus {
    OFFLINE = 'offline',
    ONLINE = 'online',
    IN_GAME = 'in-game'
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        nullable: false
    })
        id_42: number;

    @Column({
        nullable: false,
        unique: true
    })
        email: string;

    @Column({
        nullable: false,
        unique: true
    })
        nickname: string;

    @Column({
        nullable: true
    })
        two_factor_access_token: string;

    @Column({
        nullable: true
    })
        two_factor_enabled: boolean;

    @Column({
        nullable: true
    })
        two_factor_secret: string;

    @Column({
        nullable: false
    })
        access_token: string;

    @Column({
        nullable: false
    })
        refresh_token: string;

    @Column({
        nullable: false
    })
        token_expires_at: Date;

    @Column({
        nullable: true
    })
        pass: string;

    @Column({
        default: new Date(),
        nullable: false
    })
        created_at: Date;

    @Column({
        nullable: false
    })
        avatar: string;

    @Column({
        type: "enum",
        enum: userStatus,
        default: userStatus.OFFLINE,
        nullable: false
    })
        current_status: string;
}