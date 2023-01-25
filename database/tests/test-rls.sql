BEGIN;

    SELECT plan(2);

    DO $$ BEGIN
        SET ROLE default_users;
        PERFORM set_config('app.current_user_id'::TEXT, 1::TEXT, false);
    END $$;

    SELECT is(
        (
            SELECT
                count(*)
            FROM
                public.chat_member
        ),
        3::BIGINT,
        'Assert that RLS on chat_member is working properly'
    );

    SELECT is(
        (
            SELECT
                count(*)
            FROM
                public.chat_message
        ),
        0::BIGINT,
        'Assert that RLS on chat_message is working properly'
    );

ROLLBACK;