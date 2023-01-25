import { Controller, Post, Body, Get, HttpException, Inject, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserConnected } from 'src/configs/userconnected.decorator';
import { UserDTO } from 'src/dtos/profile.dto';
import { UserAuth } from 'src/dtos/userauth';
import { Users } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { v4 as uuid } from 'uuid';

@Controller('users')
@Injectable()
export class UsersController {
    constructor(@Inject("PG_CONNECTION") private db: any, private userService: UserService) {}

    @Post('/auth')
    authAction(@Body() body: { code: string, hostname: string }): Promise<UserAuth> {
        return this.userService.authUser(body.code, body.hostname);
    }

    @Get('/me')
    getOwnProfileAction(@UserConnected() user: Users): UserDTO {
        return this.userService.getOwnProfile(user);
    }

    @Get('/error')
    sendError(): null {
        return null;
    }

    @Get('/id')
    getUserId(@UserConnected() user: Users): UserDTO {
        return this.db.query(`SELECT * FROM users WHERE id_42='${user.id_42}'`)
            .then((result: { rows: any }) => {
                if (result.rows.length === 0) {
                    throw new HttpException('No user is associated with this 42 id', 500);
                } else {
                    return ({user_id: result.rows[0].id,});
                }
            })
            .catch(() => {
                throw new HttpException('Problem occured while fetching user_id', 500);
            });
    }

    @Post('/toggle_two_factor')
    async toggleTwoFactor(@Body() body: { twoFactor:boolean, id_42:number }): Promise<UserDTO> {
        await this.db.query(`UPDATE users SET two_factor_enabled='${body.twoFactor}' WHERE id_42='${body.id_42}'`);
        const req = await this.db.query(`SELECT * FROM users WHERE id_42=${body.id_42}`);
        if (!req || req.rows.length === 0){
            return (null);
        }
        return req.rows[0];
    }

    @Post('/checkNickname')
    checkNickname(@Body() body: { nickname: string }): Promise<boolean> {
        return this.db.query(`SELECT * FROM users WHERE nickname='${body.nickname}'`)
            .then((result: { rows: any }) => {
                if (result.rows.length === 0) {
                    return (true);
                }
                return (false);
            })
            .catch(() => {
                throw new HttpException('Problem occured while checking nickname in db', 500);
            });
    }

    @Post('/checkEmail')
    checkEmail(@Body() body: { email: string }): Promise<boolean> {
        return this.db.query(`SELECT * FROM users WHERE email='${body.email}'`)
            .then((result: { rows: any }) => {
                if (result.rows.length === 0) {
                    return (true);
                }
                return (false);
            })
            .catch(() => {
                throw new HttpException('Problem occured while checking email in db', 500);
            });
    }

    @Post('/update')
    async changeUserData(@Body() body: { email: string, nickname: string, id_42: number}): Promise<UserDTO> {
        await this.db.query(`UPDATE users SET email='${body.email}' WHERE id_42='${body.id_42}'`);
        await this.db.query(`UPDATE users SET nickname='${body.nickname}' WHERE id_42='${body.id_42}'`);
        return this.db.query(`SELECT * FROM users WHERE id_42=${body.id_42}`);
    }

    @Post('/update_picture')
    async updateProfilePicture(@Body() body: { avatar: string, id_42: number}): Promise<UserDTO> {
        await this.db.query(`UPDATE users SET avatar='${body.avatar}' WHERE id_42='${body.id_42}'`);
        const req = await this.db.query(`SELECT * FROM users WHERE id_42=${body.id_42}`);
        if (!req || req.rows.length === 0){
            return (null);
        }
        return req.data.rows[0];
    }

    @Post('/status')
    updateStatusAction(@Body() body: { nickname: string, current_status: string}): Promise<void> {
        return this.userService.updateStatus(body.nickname, body.current_status);
    }

    @Get('all')
    getAllUsers(): Promise<UserDTO> {
        return this.db.query('SELECT * FROM users').then((result: {rows: any}) => {
            return (result);
        })
            .catch(() => {
                throw new HttpException('Problem occured when fetching all users', 500);
            });
    }

    @Get('/:nickname')
    getUserProfileAction(@Param('nickname') nickname: string) : Promise<UserDTO> {
        return this.userService.getUserProfile(nickname);
    }

    @Get('/email/:email')
    async getUserByEmail(@Param('email') email: string) : Promise<UserDTO> {
        const req = await this.db.query('SELECT * from public.users WHERE email=$1', [email]);
        if (!req || req.rows.length === 0){
            return (null);
        }
        return ({
            id: req.rows[0].id,
            id_42: req.rows[0].id_42,
            email: req.rows[0].email,
            nickname: req.rows[0].nickname,
            avatar: req.rows[0].avatar,
            current_status: req.rows[0].current_status,
            two_factor_enabled: req.rows[0].two_factor_enabled,
            two_factor_secret: req.rows[0].two_factor_secret,
        });
    }

    @Post('/auth/login')
    Login(@Body() body:{email:string, password:string}): string {
        return this.db.query("SELECT * FROM public.login($1, $2)", [body.email, body.password])
            .then((result: { rows: any }) => {
                if (result.rows.length === 0) {
                    throw new HttpException('User does not exist', 500);
                } else {
                    return ({
                        user_id: result.rows[0].id,
                        email: result.rows[0].email,
                        token: result.rows[0].access_token,
                        nickname: result.rows[0].nickname,
                    });
                }
            })
            .catch(() => {
                throw new HttpException('Email or password incorrect', 500);
            });
    }

    @UseInterceptors(FileInterceptor('file', {
        limits: {
            files: 1,
            fileSize: 5 * 10 * 10 * 10 * 10 * 10 * 10 * 10 // 50 mb in bytes
        },
        storage: diskStorage({
            destination: (req, file, cb) => cb(null, './public'),
            filename: (req, file, cb) => cb(null, `${uuid() + '.' + file.originalname.split('.').pop()}`)
        })
    }))

    @Post('picture')
    uploadFile(
      @Body() body: {name: string},
      @UploadedFile() file: Express.Multer.File,
    ) {
        return {
            file,
        };
    }

    @Post('/blocked')
    async blockUserById(@Body() body:{user_id:string, blocked_user_id:string}) {
        try {
            const is_user_already_blocked = await this.db.query(
                `
                    SELECT
                        id
                    FROM
                        public.blocked_users
                    WHERE
                        user_id = $1
                    AND
                        blocked_user_id = $2;
                `,
                [body?.user_id, body?.blocked_user_id]
            );
            if (is_user_already_blocked?.rows?.length > 0) {
                await this.db.query(
                    `
                        DELETE FROM
                            public.blocked_users
                        WHERE
                            user_id = $1
                        AND
                            blocked_user_id = $2;
                    `,
                    [body?.user_id, body?.blocked_user_id]
                );
            } else {
                await this.db.query(
                    `
                        INSERT INTO
                            blocked_users (
                                user_id,
                                blocked_user_id
                            )
                        VALUES (
                            $1,
                            $2
                        );
                    `,
                    [body?.user_id, body?.blocked_user_id]
                );
            }
            return (true);
        } catch (e) {
            throw new HttpException('There was an error from our side, please try again later', 500);
        }
    }
}
