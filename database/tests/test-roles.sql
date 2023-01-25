BEGIN;

    SELECT plan(2);

    DO $$ BEGIN
        SET ROLE default_users;
    END $$;

    SELECT throws_ok(
        $$
            TRUNCATE TABLE public.chat CASCADE;
        $$,
        'permission denied for table chat',
        'Assert that default_user role cannot delete public.chat rows'
    );

    DO $$ BEGIN
        SET ROLE postgres;
    END $$;

    SELECT lives_ok(
        $$
            TRUNCATE TABLE public.chat CASCADE;
        $$,
        'Assert that postgres role can delete public.chat rows'
    );


ROLLBACK;