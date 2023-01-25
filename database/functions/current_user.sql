CREATE OR REPLACE FUNCTION public.current_user() RETURNS public.users as $$
DECLARE
    user_return public.users;
BEGIN

    SELECT
        *
    INTO
        user_return
    FROM
        public.users
    WHERE
        id='1';

    RETURN user_return;
END;
$$ language plpgsql strict security definer;