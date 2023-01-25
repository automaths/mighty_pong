import { Body, Controller, HttpCode, Inject, Injectable, Post, Response, UnauthorizedException } from '@nestjs/common';
import { TwoFactorAuthService } from '../services/two_factor_auth.service';

@Controller('2fa')
@Injectable()
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService,
		@Inject("PG_CONNECTION") private db: any,
    ) {}

    @Post('/generate')
    async register(@Response() response:any, @Body() body: { id_42: number}) {
        const { otpAuthUrl } =
            await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
                body.id_42,
            );
        return response.json(
            await this.twoFactorAuthService.generateQrCodeDataURL(otpAuthUrl),
        );
    }

    @Post('/authenticate')
    @HttpCode(200)
    async authenticate(@Body() body: { secret: string, code: string, id_42: number }) {
        const isCodeValid =
            await this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
                body.code,
                body.secret,
            );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        return this.twoFactorAuthService.loginWith2fa(body.id_42);
    }

    @Post('/add_token')
    @HttpCode(200)
    add_token(@Body() body: { token: string, id_42: number }) {
        return this.db.query(`UPDATE users SET two_factor_access_token='${body.token}' WHERE id_42='${body.id_42}'`);
    }

}
