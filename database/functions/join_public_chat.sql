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