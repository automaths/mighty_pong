-- Create public chat
INSERT INTO
    public.chat(id, name, type, created_by)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2db',
    'test-public-chat',
    'public',
    1
);
INSERT INTO
    public.chat_member(chat_id, user_id)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2db',
    1
);
INSERT INTO
    public.chat_admin (chat_id, user_id)
VALUES (
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2db',
    1
);


-- Create private chat
INSERT INTO
    public.chat(id, created_by)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dc',
    1
);
INSERT INTO
    public.chat(id, created_by)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dd',
    2
);
INSERT INTO
    public.chat_member(chat_id, user_id)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dc',
    1
);
INSERT INTO
    public.chat_member(chat_id, user_id)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dc',
    2
);
INSERT INTO
    public.chat_member(chat_id, user_id)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dd',
    2
);
INSERT INTO
    public.chat_member(chat_id, user_id)
VALUES(
    '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dd',
    3
);

INSERT INTO
    public.chat_message(chat_id, sent_by, content)
VALUES(
    (
        SELECT
            id
        FROM
            public.chat
        WHERE
            created_by = '2'
        LIMIT
            1
    )::UUID,
    2,
    'Hello world'
)