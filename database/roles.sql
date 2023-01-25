CREATE ROLE default_users;

-- public.users

GRANT SELECT ON
    public.users
TO
    default_users;

GRANT INSERT ON
    public.users
TO
    default_users;

GRANT UPDATE ON
    public.users
TO
    default_users;

-- public.history

GRANT SELECT ON
    public.history
TO
    default_users;

GRANT UPDATE ON
    public.history
TO
    default_users;

GRANT INSERT ON
    public.history
TO
    default_users;

-- public.matchmaking

GRANT SELECT ON
    public.matchmaking
TO
    default_users;

GRANT UPDATE ON
    public.matchmaking
TO
    default_users;

GRANT INSERT ON
    public.matchmaking
TO
    default_users;

GRANT DELETE ON
    public.matchmaking
TO
    default_users;

-- public.chat

GRANT SELECT ON
    public.chat
TO
    default_users;

GRANT UPDATE ON
    public.chat
TO
    default_users;

GRANT INSERT ON
    public.chat
TO
    default_users;

-- public.chat_message

GRANT SELECT ON
    public.chat_message
TO
    default_users;

GRANT UPDATE ON
    public.chat_message
TO
    default_users;

GRANT INSERT ON
    public.chat_message
TO
    default_users;

-- public.chat_member

GRANT SELECT ON
    public.chat_member
TO
    default_users;

GRANT UPDATE ON
    public.chat_member
TO
    default_users;

GRANT INSERT ON
    public.chat_member
TO
    default_users;

-- public.friend_request

GRANT SELECT ON
    public.friend_request
TO
    default_users;

GRANT UPDATE ON
    public.friend_request
TO
    default_users;

GRANT INSERT ON
    public.friend_request
TO
    default_users;