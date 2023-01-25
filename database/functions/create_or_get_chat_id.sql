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