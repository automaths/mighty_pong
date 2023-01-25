BEGIN;

    SELECT plan(1);

    SELECT throws_ok(
        '
            INSERT INTO
                public.users (
                    email,
                    nickname,
                    pass,
                    avatar
                )
            VALUES(
                ''demo@42.fr'',
                ''demo test'',
                ''password'',
                ''https://cdn.intra.42.fr/users/a899eb9e2861522b8beead0baf1a38db/sserbin.jpg''
            )
        ',
        '23505',
        'duplicate key value violates unique constraint "users_email_key"',
        'Assert that unique constaint on public.users.email is working properly'
    );

    SELECT * FROM finish();
ROLLBACK;