export interface UserDTO {
    id: number,
    id_42: number,
    email: string;
    nickname: string;
    avatar: string;
    current_status: string;
    two_factor_enabled: boolean;
    two_factor_secret: string,
}