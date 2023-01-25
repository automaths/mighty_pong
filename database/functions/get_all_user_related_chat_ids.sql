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