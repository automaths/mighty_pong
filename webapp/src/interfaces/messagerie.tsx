export interface MessagerieInterface {
    id: string,
    name: string,
    type: string,
    nickname: string,
    created_by: string,
    picture: string,
    password?: boolean,
    member: boolean,
};