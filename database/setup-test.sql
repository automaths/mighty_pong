CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

\i tables.sql;

TRUNCATE TABLE public.users;
TRUNCATE TABLE public.chat;
TRUNCATE TABLE public.chat_message;
TRUNCATE TABLE public.chat_member;

\i fixtures/users-fixtures.sql
\i fixtures/messagerie-fixtures.sql

\i functions/login.sql
\i functions/create_or_get_chat_id.sql
\i functions/current_user.sql
\i functions/get_all_user_related_chat_ids.sql
\i functions/join_public_chat.sql

\i roles.sql
\i rls.sql
\i functions/create_new_chat.sql
\i functions/update_chat_admin.sql