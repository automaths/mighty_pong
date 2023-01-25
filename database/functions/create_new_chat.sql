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
