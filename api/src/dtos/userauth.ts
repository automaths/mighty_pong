export interface UserAuth {
    id_42: number,
    token?: string,
    email: string,
    user_id: string,
    avatar: string,
    nickname: string,
    two_factor_enabled: boolean,
    first_connexion: boolean
}