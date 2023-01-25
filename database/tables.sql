CREATE TYPE public.current_status_enum as ENUM (
    'offline',
    'online',
    'in-game'
);

CREATE TYPE public.friend_request_status_enum as ENUM (
    'accepted',
    'pending',
    'cancelled'
);

CREATE TYPE public.chat_type as ENUM (
    'public',
    'private'
);

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