import { Injectable, OnModuleInit, Inject } from '@nestjs/common';

@Injectable()
export class AppService  implements OnModuleInit {

    constructor(@Inject("PG_CONNECTION") private db: any) {

    }

    create_new_chat = async() => {
        await this.db.query(
            `
                CREATE OR REPLACE FUNCTION public.create_new_chat (
                    public_chat_name VARCHAR,
                    user_id INTEGER
                ) RETURNS UUID AS $$
                DECLARE
                    messagerie_created public.chat;
                BEGIN
                    INSERT INTO
                        public.chat (
                            name,
                            type,
                            created_by
                        )
                    VALUES (
                        public_chat_name,
                        'public',
                        user_id
                    )
                    RETURNING
                        *
                    INTO
                        messagerie_created;

                    INSERT INTO
                        public.chat_member (
                            chat_id,
                            user_id
                        )
                    VALUES (
                        messagerie_created.id,
                        user_id
                    );

                    INSERT INTO public.chat_admin (
                        chat_id,
                        user_id
                    ) VALUES (
                        messagerie_created.id,
                        user_id
                    );

                    RETURN messagerie_created.id;
                END;
                $$ LANGUAGE PLPGSQL;
            `
        );
    };

    create_or_get_chat_id = async() => {
        await this.db.query(
            `
                CREATE OR REPLACE FUNCTION public.create_or_get_chat_id(
                    id_user_from INT,
                    id_user_dest INT
                ) RETURNS UUID AS $$
                DECLARE
                    search_existing_chat public.chat;
                    new_row_chat        public.chat;
                BEGIN
                    SELECT
                        chat.id
                    INTO
                        search_existing_chat
                    FROM
                        public.chat
                    WHERE
                        id = ANY(
                            SELECT
                                chat_id
                            FROM
                                chat_member
                            WHERE
                                user_id = id_user_from
                        )
                    AND
                        id = ANY(
                            SELECT
                                chat_id
                            FROM
                                chat_member
                            WHERE
                                user_id = id_user_dest
                        )
                    AND
                        type = 'private';


                    IF search_existing_chat.id IS NOT NULL THEN
                        RETURN search_existing_chat.id;
                    END IF;

                    INSERT INTO
                        chat DEFAULT VALUES
                    RETURNING
                        *
                    INTO
                        new_row_chat;

                    INSERT INTO
                        chat_member (chat_id, user_id)
                    VALUES(
                        new_row_chat.id, id_user_from
                    ), (
                        new_row_chat.id, id_user_dest
                    );

                    RETURN new_row_chat.id;
                END;
                $$ language plpgsql;
            `
        );
    };

    get_all_user_related_chat_ids = async() => {
        await this.db.query(
            `
                CREATE OR REPLACE FUNCTION public.get_all_user_related_chat_ids() RETURNS UUID[] as $$
                DECLARE
                    chat_ids UUID[];
                BEGIN
                    SELECT
                        array_agg(chat_id)
                    INTO
                        chat_ids
                    FROM
                        public.chat_member
                    WHERE
                        chat_member.user_id = (SELECT current_setting('app.current_user_id'))::INTEGER;

                    RETURN chat_ids;
                END;
                $$ language plpgsql strict security definer;
            `
        );
    };

    join_public_chat = async() => {
        await this.db.query(
            `
                CREATE OR REPLACE FUNCTION public.join_public_chat (
                    chat_id UUID,
                    user_id INT,
                    user_input_pass VARCHAR(255) DEFAULT NULL
                ) RETURNS BOOLEAN AS $$
                DECLARE
                    password_chat   VARCHAR(255);
                BEGIN
                    SELECT
                        password
                    INTO
                        password_chat
                    FROM
                        public.chat
                    WHERE
                        id = chat_id;

                    IF (
                        (password_chat IS NOT NULL)
                    AND
                        (REPLACE(password_chat, '$2b$', '$2a$') != crypt(user_input_pass, REPLACE(password_chat, '$2b$', '$2a$')))
                    ) THEN
                        RETURN FALSE;
                    END IF;

                    INSERT INTO
                        public.chat_member (
                            chat_id,
                            user_id
                        )
                    VALUES (
                        chat_id,
                        user_id
                    );

                    RETURN TRUE;

                END;
                $$ LANGUAGE PLPGSQL STRICT SECURITY INVOKER;
            `
        );
    };

    login = async() => {
        await this.db.query(
            `
                CREATE OR REPLACE FUNCTION public.login (
                    email_user VARCHAR(255),
                    password_user VARCHAR(255)
                ) RETURNS public.users AS $$
                DECLARE
                    user_to_find public.users;
                BEGIN
                    SELECT
                        *
                    INTO
                        user_to_find
                    FROM
                        public.users
                    WHERE
                        users.email=email_user;

                    IF user_to_find IS NULL THEN
                        RAISE EXCEPTION 'USER NOT FOUND';
                    END IF;

                    IF NOT REPLACE(user_to_find.pass, '$2b$', '$2a$') = crypt(password_user, REPLACE(user_to_find.pass, '$2b$', '$2a$'))
                        THEN RAISE EXCEPTION 'Wrong password';
                    END IF;
                    RETURN user_to_find;
                END;
                $$ language plpgsql;
            `
        );
    };

    update_chat_admin = async() => {
        await this.db.query(
            `
                CREATE OR REPLACE FUNCTION public.update_chat_admin(
                    list_to_delete INT[],
                    list_to_add INT[],
                    _chat_id UUID,
                    _user_id INT
                ) RETURNS BOOLEAN AS $$
                DECLARE
                    to_delete INT;
                    to_add INT;
                    admin_user public.chat_admin;
                BEGIN

                    SELECT
                        *
                    INTO
                        admin_user
                    FROM
                        public.chat_admin
                    WHERE
                        chat_id = _chat_id
                    AND
                        user_id = _user_id;

                    IF admin_user IS NULL THEN
                        RETURN FALSE;
                    END IF;

                    FOREACH to_delete IN ARRAY list_to_delete
                    LOOP
                        DELETE FROM
                            public.chat_admin
                        WHERE
                            chat_id = _chat_id
                        AND
                            user_id = to_delete;
                    END LOOP;
                    FOREACH to_add IN ARRAY list_to_add
                    LOOP
                        INSERT INTO
                            public.chat_admin (
                                chat_id,
                                user_id
                            )
                        VALUES (
                            _chat_id,
                            to_add
                        );
                    END LOOP;
                    RETURN TRUE;
                END;
                $$ LANGUAGE PLPGSQL SECURITY INVOKER;
            `
        );
    };

    setupTables = async() => {
        await this.db.query(
            `
                DO $$ BEGIN
                    CREATE TYPE public.current_status_enum as ENUM (
                        'offline',
                        'online',
                        'in-game'
                    );
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;

                DO $$ BEGIN
                    CREATE TYPE public.friend_request_status_enum as ENUM (
                        'accepted',
                        'pending',
                        'cancelled'
                    );
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;

                DO $$ BEGIN
                    CREATE TYPE public.chat_type as ENUM (
                        'public',
                        'private'
                    );
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;

                DO $$ BEGIN
                    CREATE TABLE IF NOT EXISTS public.users(
                        id                              SERIAL PRIMARY KEY NOT NULL UNIQUE,
                        id_42                           INT DEFAULT NULL,
                        email                           VARCHAR(255) NOT NULL UNIQUE,
                        nickname                        VARCHAR(255) NOT NULL UNIQUE,
                        two_factor_access_token         VARCHAR(255) DEFAULT NULL,
                        two_factor_enabled              BOOLEAN DEFAULT NULL,
                        two_factor_secret               VARCHAR(255) DEFAULT NULL,
                        access_token                    VARCHAR(255) DEFAULT NULL,
                        refresh_token                   VARCHAR(255) DEFAULT NULL,
                        token_expires_at                DATE DEFAULT NULL,
                        pass                            VARCHAR(255) NOT NULL,
                        token                           UUID DEFAULT uuid_generate_v4() NOT NULL,
                        created_at                      DATE DEFAULT NULL,
                        avatar                          VARCHAR(255) NOT NULL,
                        current_status                  public.current_status_enum DEFAULT 'offline'
                    );

                    CREATE TABLE IF NOT EXISTS public.history(
                        id                  SERIAL PRIMARY KEY NOT NULL UNIQUE,
                        player_id           INT NOT NULL,
                        player_score        INT DEFAULT NULL,
                        player_pongs        INT DEFAULT NULL,
                        opp_score           INT DEFAULT NULL,
                        opp_name            VARCHAR(255) DEFAULT NULL,
                        created_at          DATE DEFAULT NOW() NOT NULL,

                        CONSTRAINT          fk_player_id FOREIGN KEY (player_id) REFERENCES public.users (id)
                    );

                    CREATE TABLE IF NOT EXISTS public.matchmaking(
                        id                  SERIAL PRIMARY KEY NOT NULL UNIQUE,
                        id_42               INT NOT NULL,
                        type                INT NOT NULL,
                        created_at          DATE DEFAULT NOW() NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS public.invitations(
                        id                  SERIAL PRIMARY KEY NOT NULL UNIQUE,
                        game_id             VARCHAR(255) NOT NULL,
                        created_at          DATE DEFAULT NOW() NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS public.live(
                        id                  SERIAL PRIMARY KEY NOT NULL UNIQUE,
                        id_one              INT NOT NULL,
                        id_two              INT NOT NULL,
                        player_one          VARCHAR(255) NOT NULL,
                        player_two          VARCHAR(255) NOT NULL,
                        created_at          DATE DEFAULT NOW() NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS public.chat(
                        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
                        name        VARCHAR(200) DEFAULT NULL,
                        type        public.chat_type DEFAULT 'private' NOT NULL,
                        password    VARCHAR(255),
                        created_by  INTEGER DEFAULT NULL,

                        CONSTRAINT  fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id)
                    );

                    CREATE TABLE IF NOT EXISTS public.chat_member(
                        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
                        chat_id     UUID NOT NULL,
                        user_id     INTEGER NOT NULL,
                        created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

                        CONSTRAINT  fk_chat_id FOREIGN KEY (chat_id) REFERENCES public.chat (id),
                        CONSTRAINT  fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id)
                    );

                    CREATE TABLE IF NOT EXISTS public.chat_message(
                        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
                        chat_id     UUID NOT NULL,
                        sent_by     INTEGER NOT NULL,
                        content     TEXT NOT NULL,
                        created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

                        CONSTRAINT  fk_chat_id FOREIGN KEY (chat_id) REFERENCES public.chat (id),
                        CONSTRAINT  fk_send_by FOREIGN KEY (sent_by) REFERENCES public.users (id)
                    );

                    CREATE TABLE IF NOT EXISTS public.friend_request(
                        id                  SERIAL PRIMARY KEY NOT NULL UNIQUE,
                        sender              INTEGER NOT NULL,
                        receiver            INTEGER NOT NULL,
                        current_status      public.friend_request_status_enum DEFAULT 'pending',
                        created_at          DATE DEFAULT NOW() NOT NULL,

                        CONSTRAINT          fk_sender_id FOREIGN KEY (sender) REFERENCES public.users (id),
                        CONSTRAINT          fk_receiver_id FOREIGN KEY (receiver) REFERENCES public.users (id)
                    );

                    CREATE TABLE IF NOT EXISTS public.chat_admin(
                        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
                        chat_id     UUID NOT NULL,
                        user_id     INTEGER NOT NULL,

                        CONSTRAINT  fk_chat_id FOREIGN KEY (chat_id) REFERENCES public.chat (id),
                        CONSTRAINT  fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id)
                    );

                    CREATE TABLE IF NOT EXISTS public.blocked_users(
                        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
                        user_id         INT,
                        blocked_user_id INT NOT NULL,
                        chat_id         UUID,
                        type            public.chat_type DEFAULT 'private',

                        CONSTRAINT  fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id),
                        CONSTRAINT  fk_blocked_user FOREIGN KEY (blocked_user_id) REFERENCES public.users (id),
                        CONSTRAINT  fk_chat_id FOREIGN KEY (chat_id) REFERENCES public.chat (id)
                    );

                    CREATE TABLE IF NOT EXISTS public.banned_user(
                        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
                        user_id         INT,
                        chat_id         UUID,
                    
                        CONSTRAINT  fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id),
                        CONSTRAINT  fk_chat_id FOREIGN KEY (chat_id) REFERENCES public.chat (id)
                    );

                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                TRUNCATE TABLE public.users CASCADE;
            `
        );
    };

    async onModuleInit() {
        await this.db.query(
            `
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                CREATE EXTENSION IF NOT EXISTS pgcrypto;
                
            `
        );
        await this.setupTables();
        await this.create_new_chat();
        await this.create_or_get_chat_id();
        await this.get_all_user_related_chat_ids();
        await this.join_public_chat();
        await this.login();
        await this.update_chat_admin();
    }

    getHello(): string {
        return 'API is running';
    }
}
