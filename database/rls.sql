ALTER TABLE public.chat_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message ENABLE ROW LEVEL SECURITY;

CREATE POLICY
    chat_member_policy
ON
    public.chat_member
FOR
    SELECT
TO
    default_users
USING (
    chat_id = ANY(public.get_all_user_related_chat_ids()::UUID[])
);

CREATE POLICY
    chat_message_policy
ON
    public.chat_message
FOR
    SELECT
TO
    default_users
USING (
    chat_id = ANY(public.get_all_user_related_chat_ids()::UUID[])
);

CREATE POLICY
    chat_message_insert_policy
ON
    public.chat_message
FOR
    INSERT
TO
    default_users
WITH CHECK (
    chat_id = ANY(public.get_all_user_related_chat_ids()::UUID[])
);
