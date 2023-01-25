INSERT INTO
    public.users (
        id_42,
        email,
        pass,
        nickname,
        access_token,
        refresh_token,
        token_expires_at,
        avatar
    )
VALUES (
    123456,
    'demo@42.fr',
    crypt('password', gen_salt('bf',11)),
    'demo',
    'e1042321-38d2-4f87-ba7c-5f3c8d53c71d',
    '',
    '2022-11-24 22:06:26',
    'https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png'
), (
    45678,
    'staff@transcendence.fr',
    crypt('password', gen_salt('bf',11)),
    'staff',
    '5c0eb6e8-962f-4bac-95b8-7dc330fe4d21',
    '',
    '2022-11-24 22:06:26',
    'https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png'
), (
    5301,
    'test@42.fr',
    crypt('password', gen_salt('bf',11)),
    'test',
    'a15d82b0-55fd-4f41-b447-d6be982d997b',
    '',
    '2022-11-24 22:06:26',
    'https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png'
);