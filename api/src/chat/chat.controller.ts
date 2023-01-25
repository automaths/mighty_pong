import { Controller, Post, Body, HttpException, Param, Get, Put, Patch, Delete } from '@nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { isValidUUIDV4 } from 'is-valid-uuid-v4';
import { Users } from 'src/entities/user.entity';

@Controller('chat')
@Injectable()

export class ChatController {
    constructor(@Inject("PG_CONNECTION") private db: any){}

    async findUserByEmail(email: string){
        try {
            const req = await this.db.query('SELECT * from public.users WHERE email=$1', [email]);
            if (req.rows.lenght === 0){
                return (null);
            }
            return (req.rows[0]?.id ?? null);
        } catch (e){
            return (null);
        }
    }
    async findUserById(id: string): Promise<Users | null>{
        try {
            const req = await this.db.query('SELECT * from public.users WHERE id=$1', [id]);
            if (req.rows.lenght === 0){
                return (null);
            }
            return (req.rows[0] ?? null);
        } catch (e){
            return (null);
        }
    }

    @Post()
    async CreateOrGetChatId(@Body() body: {email: string, from:string}): Promise<{ chat_id: string }> {
        if (!body?.email || !body?.from) {
            throw new HttpException('Missing body params', 500);
        }
        const email = await this.findUserByEmail(body.email);
        const from = await this.findUserByEmail(body.from);
        if (!from || !email) {
            throw new HttpException('One of the user do not exist', 500);
        }
        const chat_id = await this.db.query(
            'SELECT * FROM public.create_or_get_chat_id($1, $2);',
            [email, from]
        );
        return ({
            chat_id: chat_id.rows[0].create_or_get_chat_id
        });
    }

    @Post('/send')
    async sendMessageToChat(@Body() body: {chat_id: string, sender_id: string, content: string}): Promise<boolean> {
        if (!body?.chat_id || !body?.sender_id || !body?.content) {
            throw new HttpException('Missing params', 500);
        }
        if (!isValidUUIDV4(body.chat_id)) {
            throw new HttpException('Wrong format for params, expecting UUID', 500);
        }
        const type_chat = await this.db.query(
            `
                SELECT
                    type
                FROM
                    public.chat
                WHERE
                    id = $1;
            `,
            [body?.chat_id]
        );
        if (type_chat?.rows[0].type === 'private') {
            const check_blocked = await this.db.query(
                `
                    WITH id_dest AS (
                        SELECT
                            user_id
                        FROM
                            public.chat_member
                        WHERE
                            user_id != $1
                        AND
                            chat_id = $2
                    )
                    SELECT
                        id
                    FROM
                        public.blocked_users
                    WHERE (
                            user_id = $1
                        AND
                            blocked_user_id = (
                                SELECT
                                    user_id
                                FROM
                                    public.chat_member
                                WHERE
                                    user_id != $1
                                AND
                                    chat_id = $2
                            )
                    ) OR (
                            user_id = (
                                SELECT
                                    user_id
                                FROM
                                    public.chat_member
                                WHERE
                                    user_id != $1
                                AND
                                    chat_id = $2
                            )
                        AND
                            blocked_user_id = $1
                    )
                `,
                [body?.sender_id, body?.chat_id]
            );
            if (check_blocked?.rows.length > 0) {
                throw new HttpException('cannot send msg because user is blocked', 500);
            }
        } else {
            const check_blocked_in_public_chat = await this.db.query(
                `
                    SELECT
                        *
                    FROM
                        public.blocked_users
                    WHERE
                        blocked_user_id=$1
                    AND
                        chat_id=$2
                    AND
                        type='public';
                `,
                [body?.sender_id, body?.chat_id]
            );
            if (check_blocked_in_public_chat?.rows.length > 0) {
                throw new HttpException('cannot send msg because user is blocked', 500);
            }
        }
        const message_created = await this.db.query(
            'INSERT INTO chat_message (chat_id, sent_by, content) VALUES($1, $2, $3) RETURNING id',
            [body.chat_id, body.sender_id, body.content]
        );
        return (message_created?.rows[0]?.id);
    }

    @Get('/:chat_id')
    async getMessagesByChatId(@Param() params: {chat_id:string}) {
        const get_messages = await this.db.query(
            'SELECT * FROM public.chat_message WHERE chat_id=$1 ORDER BY created_at ASC LIMIT 25',
            [params.chat_id]
        );
        const messages_with_email = await Promise.all(
            get_messages.rows.map(async(msg: {sent_by: string, email:string, nickname: string, avatar: string}) => {
                const usr = await this.findUserById(msg?.sent_by);
                msg['email'] = usr?.email;
                msg['nickname'] = usr?.nickname;
                msg['avatar'] = usr?.avatar;
                return (msg);
            })
        );
        return (messages_with_email);
    }

    @Get('/all/:user_id')
    async getAllChatByUserId(@Param() params: {user_id:string}) {
        const all_chats = await this.db.query(
            `
                WITH all_privates_chats AS (
                    SELECT
                        DISTINCT(chat.id) AS chat_id,
                        chat.name,
                        chat.type,
                        chat_member.user_id
                    FROM
                        public.chat
                    JOIN
                        public.chat_member
                    ON
                        chat.id = chat_member.chat_id
                    WHERE
                        type = 'private'
                    AND
                        user_id = $1
                ),
                user_of_private_chat AS (
                    SELECT
                        all_privates_chats.chat_id,
                        all_privates_chats.name,
                        all_privates_chats.type,
                        all_privates_chats.user_id,
                        users.nickname,
                        users.avatar
                    FROM
                        public.chat_member
                    JOIN
                        all_privates_chats
                    ON
                        all_privates_chats.chat_id = chat_member.chat_id
                    JOIN
                        public.users
                    ON
                        chat_member.user_id = users.id
                    WHERE
                        chat_member.user_id != $1
                ),
                all_publics_chats AS (
                    SELECT
                        id AS chat_id,
                        name,
                        type,
                        password,
                        (CASE
                            WHEN (
                                SELECT
                                    id
                                FROM
                                    public.chat_member
                                WHERE
                                    chat_member.chat_id = chat.id
                                AND
                                    chat_member.user_id = $1
                            ) IS NULL THEN false
                            ELSE true
                        END) AS member
                    FROM
                        public.chat
                    WHERE
                        type = 'public'
                )
                SELECT
                    chat_id AS id,
                    name,
                    type,
                    NULL AS password,
                    NULL AS member,
                    user_id,
                    nickname,
                    avatar AS picture
                FROM
                    user_of_private_chat
                UNION ALL
                SELECT
                    chat_id AS id,
                    name,
                    type,
                    CASE
                        WHEN password IS NULL THEN NULL
                        ELSE true
                    END CASE,
                    member,
                    NULL AS user_id,
                    NULL AS nickname,
                    NULL AS picture
                FROM
                    all_publics_chats
                LIMIT
                    25;
            `,
            [params.user_id]
        );
        return (all_chats.rows);
    }

    @Put()
    async createNewPublicChat(@Body() body: {chat_name: string, user_id:string}){
        if (!body?.chat_name || !body?.user_id)
            throw new HttpException('Missing body parameters', 500);
        try {
            const publicChatCreated = await this.db.query(
                'SELECT public.create_new_chat($1, $2);',
                [body.chat_name, body.user_id]
            );
            return (publicChatCreated.rows[0].create_new_chat);
        } catch (e) {
            return (null);
        }
    }

    @Patch('/password')
    async updatePasswordChat(@Body() body: {chat_id:string, user_id:string, password:string}){
        const checkUserOwnerOfChat = await this.db.query(
            `
                SELECT
                    user_id
                FROM
                    public.chat_admin
                WHERE
                    chat_id = $1
                AND
                    user_id = $2
            `,
            [body?.chat_id, body?.user_id]
        );
        if (!checkUserOwnerOfChat.rows[0]) {
            throw new HttpException('Wrong permissions', 500);
        }

        if (body?.password === '') {
            const updatePasswordChat = await this.db.query(
                `
                    UPDATE
                        public.chat
                    SET
                        password = NULL
                    WHERE
                        id = $1
                `,
                [body?.chat_id]
            );
            if (updatePasswordChat?.rowCount === 0) {
                throw new HttpException('Did not update', 500);
            }
        } else {
            const updatePasswordChat = await this.db.query(
                `
                    UPDATE
                        public.chat
                    SET
                        password = crypt($1, gen_salt('bf',11))
                    WHERE
                        id = $2
                `,
                [body?.password, body?.chat_id]
            );
            if (updatePasswordChat?.rowCount === 0) {
                throw new HttpException('Did not update', 500);
            }
        }
        return (true);
    }

    @Get('/owner/:chat_id')
    async getOwnerByChatId(@Param() params: {chat_id:string}){
        try {
            const owner_chan = await this.db.query(
                `
                    SELECT
                        users.nickname,
                        users.id
                    FROM
                        public.chat
                    JOIN
                        public.users
                    ON
                        users.id = chat.created_by
                    WHERE
                        chat.id = $1;
                `,
                [params?.chat_id]
            );
            return (owner_chan?.rows[0]);
        } catch (e) {
            throw new HttpException('There was an error from our side', 500);
        }
    }

    @Get('/admin/:chat_id/:user_id')
    async IsUserAdmin(@Param() params: {chat_id:string, user_id:string}){
        try {
            const isUserAdm = await this.db.query(
                `
                    SELECT
                        *
                    FROM
                        public.chat_admin
                    WHERE
                        chat_id = $1
                    AND
                        user_id = $2
                `,
                [params?.chat_id, params?.user_id]
            );
            if (!isUserAdm.rows[0]) {
                return (false);
            }
            return (true);
        } catch (e) {
            return (false);
        }
    }

    @Post('/join')
    async joinChat(@Body() body:{chat_id:string, user_id:string, password:string}){
        try {
            const can_it_join = await this.db.query (
                `
                    SELECT
                        *
                    FROM
                        public.banned_user
                    WHERE
                        chat_id = $1
                    AND
                        user_id = $2;
                `,
                [body?.chat_id, body?.user_id]
            );
            console.log('**', can_it_join);
            if ((can_it_join?.rows ?? []).length > 0){
                throw new HttpException('You are banned from this chat', 500);
            }
            const join_chat = await this.db.query(
                'SELECT * FROM public.join_public_chat($1::UUID, $2::INT, $3::VARCHAR)',
                [body?.chat_id, body?.user_id, body?.password]
            );
            return (join_chat.rows[0].join_public_chat);
        } catch (e) {
            return (false);
        }
    }

    @Get('/members/:chat_id')
    async getAllMembers(@Param() params: {chat_id:string}) {
        try {
            const all_members = await this.db.query(
                `
                    SELECT
                        users.id,
                        users.nickname,
                        users.email,
                        (CASE
                            WHEN user_id = ANY(
                                SELECT
                                    user_id
                                FROM
                                    public.chat_admin
                                WHERE
                                    chat_id = $1
                            ) THEN true
                            ELSE false
                        END) AS admin
                    FROM
                        public.chat_member
                    JOIN
                        public.users
                    ON
                        users.id = chat_member.user_id
                    WHERE
                        chat_member.chat_id = $1;
                `,
                [params?.chat_id]
            );
            return (all_members.rows);
        } catch (e) {
            return (false);
        }
    }

    @Post('/admin')
    async updateChatAdmin(@Body() body:{list_to_add: number[], list_to_delete: number[], chat_id:string, user_id:string}){
        try {
            const updated_list = await this.db.query(
                `
                    SELECT * FROM public.update_chat_admin(
                        $1,
                        $2,
                        $3,
                        $4
                    );
                `,
                [body?.list_to_delete, body?.list_to_add, body?.chat_id, body?.user_id]
            );
            if (!updated_list?.rows[0]?.update_chat_admin) {
                throw new HttpException('Wront permissions', 500);
            }
            return (true);
        } catch (e) {
            throw new HttpException('Wront permissions', 500);
        }
    }

    @Get('/info/:chat_id')
    async getInfoChat(@Param() params:{chat_id:string}) {
        try {
            const req = await this.db.query(
                `
                    SELECT
                        *
                    FROM
                        public.chat
                    WHERE
                        id = $1;
                `,
                [params?.chat_id]
            );
            if (req.rows.length === 0)
                throw new HttpException('Chat not found', 500);
            const members = await this.db.query(
                `
                    SELECT
                        *
                    FROM
                        public.chat_member
                    JOIN
                        public.users
                    ON
                        users.id = chat_member.user_id
                    WHERE
                        chat_id = $1;
                `,
                [req.rows[0].id]
            );
            return ({
                chat: req.rows[0],
                members: members.rows,
            });
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }

    @Post('/public/leave')
    async leavePublicChat(@Body() body:{chat_id:string, user_id:string}) {
        try {
            const is_admin = await this.db.query(
                `
                    SELECT
                        user_id
                    FROM
                        public.chat_admin
                    WHERE
                        chat_id = $1;
                `,
                [body?.chat_id]
            );
            if (is_admin.rows.length === 1 && parseInt(is_admin.rows[0].user_id, 10) === parseInt(body?.user_id, 10)) {
                throw new HttpException('You cannot leave the chat if you are the only admin', 500);
            }
            await this.db.query(
                `
                DELETE FROM
                    public.chat_admin
                WHERE
                    user_id = $1
                AND
                    chat_id = $2;
                `,
                [body?.user_id, body?.chat_id]
            );
            await this.db.query(
                `
                DELETE FROM
                    public.chat_member
                WHERE
                    user_id = $1
                AND
                    chat_id = $2;
                `,
                [body?.user_id, body?.chat_id]
            );
            return (true);
        } catch (e) {
            throw new HttpException('There was an error from our side, please try again later', 500);
        }
    }

    @Get('/block/:user_id')
    async getAllUserBlockedByUserId(@Param() params: {user_id:string}) {
        try {
            const get_all_user_block_by_user_id = await this.db.query(
                `
                    SELECT
                        users.nickname
                    FROM
                        public.blocked_users
                    JOIN
                        public.users
                    ON
                        users.id = blocked_users.blocked_user_id
                    WHERE
                        user_id = $1;
                `,
                [params?.user_id]
            );
            return (get_all_user_block_by_user_id?.rows ?? []);
        } catch (e) {
            throw new HttpException('There was an error from our side, please try again later', 500);
        }
    }

    @Post('/public/block')
    async BlockUserInPublicChat(@Body() body:{chat_id:string, user_to_block:string, user_id:string}){
        try {
            const is_user_admin = await this.db.query(
                `
                    SELECT
                        user_id
                    FROM
                        public.chat_admin
                    WHERE
                        chat_id = $1
                `,
                [body?.chat_id]
            );
            if (
                is_user_admin?.rows?.length === 0 ||
                !is_user_admin?.rows.find((chat_admin:{user_id:string}) => chat_admin.user_id == body?.user_id)
            ){
                throw new HttpException('User is not admin or chat does not exist', 500);
            }
            const is_user_member = await this.db.query(
                `
                    SELECT
                        user_id
                    FROM
                        public.chat_member
                    WHERE
                        chat_id=$1
                    AND
                        user_id=(
                            SELECT
                                id
                            FROM
                                public.users
                            WHERE
                                nickname = $2
                        )
                `,
                [body?.chat_id, body?.user_to_block]
            );
            if (is_user_member?.rows?.length === 0){
                throw new HttpException('User is not member of the chat', 500);
            }
            await this.db.query(
                `
                    INSERT INTO
                        public.blocked_users (
                            chat_id,
                            blocked_user_id,
                            type
                        )
                    VALUES(
                        $1,
                        (
                            SELECT
                                id
                            FROM
                                public.users
                            WHERE
                                nickname = $2
                        ),
                        'public'
                    );
                `,
                [body?.chat_id, body?.user_to_block]
            );
            return (true);
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }

    @Get('/public/:chat_id/blocked')
    async getAllUsersBlockByChatId(@Param() params:{chat_id:string}){
        try {
            const all_users_blocked = await this.db.query(
                `
                    SELECT
                        blocked_users.id,
                        users.nickname
                    FROM
                        public.blocked_users
                    JOIN
                        public.users
                    ON
                        users.id = blocked_users.blocked_user_id
                    WHERE
                        chat_id = $1
                    LIMIT
                        25;
                `,
                [params?.chat_id]
            );
            return (all_users_blocked?.rows ?? []);
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }

    @Post('/public/blocked')
    async deleteBlockedUsers(@Body() body:{chat_id:string, blocked_row_id: string, user_id:string}){
        try {
            const is_user_admin = await this.db.query(
                `
                    SELECT
                        user_id
                    FROM
                        public.chat_admin
                    WHERE
                        chat_id = $1
                `,
                [body?.chat_id]
            );
            if (
                is_user_admin?.rows?.length === 0 ||
                !is_user_admin?.rows.find((chat_admin:{user_id:string}) => chat_admin.user_id == body?.user_id)
            ){
                throw new HttpException('User is not admin or chat does not exist', 500);
            }
            await this.db.query(
                `
                    DELETE FROM
                        public.blocked_users
                    WHERE
                        id=$1
                `,
                [body?.blocked_row_id]
            );
            return (true);
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }

    @Get('/:chat_id/ban')
    async getAllBannedUsers(@Param() params:{chat_id:string}){
        try {
            const all_banned_users = await this.db.query(
                `
                    SELECT
                        users.nickname,
                        banned_user.id AS id
                    FROM
                        public.banned_user
                    JOIN
                        public.users
                    ON
                        banned_user.user_id = users.id
                    WHERE
                        chat_id = $1;
                `,
                [params?.chat_id]
            );
            return (all_banned_users?.rows ?? []);
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }

    @Post('/:chat_id/ban/:nickname')
    async createAllBannedUsers(@Param() params:{nickname:string, chat_id:string}){
        try {
            await this.db.query(
                `
                    INSERT INTO
                        public.banned_user (
                            user_id,
                            chat_id
                        )
                    VALUES (
                        (
                            SELECT
                                id
                            FROM
                                public.users
                            WHERE
                                nickname = $1
                        ),
                        $2
                    );
                `,
                [params?.nickname, params?.chat_id]
            );
            await this.db.query(
                `
                    DELETE FROM
                        public.chat_member
                    WHERE
                        user_id = (
                            SELECT
                                id
                            FROM
                                public.users
                            WHERE
                                nickname = $1
                        )
                    AND
                        chat_id = $2;
                `,
                [params?.nickname, params?.chat_id]
            );
            return (true);
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }

    @Delete('/:chat_id/ban/:ban_id')
    async patchAllBannedUsers(@Param() params:{ban_id:string}){
        try {
            await this.db.query(
                `
                    DELETE FROM
                        public.banned_user
                    WHERE
                        id = $1;
                `,
                [params?.ban_id]
            );
            return (true);
        } catch (e) {
            throw new HttpException('Error from our side', 500);
        }
    }
}
