BEGIN;

    SELECT plan(2);

    SELECT results_eq(
        '
            SELECT
                *
            FROM
                public.create_or_get_chat_id(
                    1,
                    2
                )
        ',
        $$
            VALUES (
                '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dc'::UUID
            )
        $$,
        'Assert that create_or_get_chat_id do not recreate a new row in public.chat'
    );

    TRUNCATE TABLE public.chat CASCADE;

    SELECT results_ne(
        '
            SELECT
                *
            FROM
                public.create_or_get_chat_id(
                    1,
                    2
                )
        ',
        $$
            VALUES (
                '7e87fdf9-cfd2-4ded-b5f4-988d26daf2dc'::UUID
            )
        $$,
        'Assert that create_or_get_chat_id do create a new row on public.chat'
    );

    SELECT * FROM finish();
ROLLBACK;