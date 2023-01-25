CREATE OR REPLACE FUNCTION public.login (
    email_user VARCHAR(255),
    password_user VARCHAR(255)
) RETURNS public.users AS $$
DECLARE
    user_to_find public.users;
BEGIN
    SELECT
        *
    INTO
        user_to_find
    FROM
        public.users
    WHERE
        users.email=email_user;

    IF user_to_find IS NULL THEN
        RAISE EXCEPTION 'USER NOT FOUND';
    END IF;

    IF NOT REPLACE(user_to_find.pass, '$2b$', '$2a$') = crypt(password_user, REPLACE(user_to_find.pass, '$2b$', '$2a$'))
        THEN RAISE EXCEPTION 'Wrong password';
    END IF;
    RETURN user_to_find;
END;
$$ language plpgsql;