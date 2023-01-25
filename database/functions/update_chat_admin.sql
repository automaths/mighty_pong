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