export interface User {
    id: string,
    id_42: number,
    email: string,
    two_factor_enabled: boolean,
    two_factor_secret: string,
    nickname: string,
    avatar: string,
    user_id: string,
    token: string,
    current_status: string,
    first_connexion: boolean
}