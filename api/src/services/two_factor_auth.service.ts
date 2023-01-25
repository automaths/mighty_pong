import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
    constructor(
		@Inject("PG_CONNECTION") private db: any,
        private jwtService: JwtService,
    ) {}

    loginWith2fa(id_42: number) {
        const payload = {
            id_42: id_42.toString(),
        };
        return {
            id_42: id_42,
            access_token: this.jwtService.sign(payload),
        };
    }

    async generateTwoFactorAuthenticationSecret(id_42: number) {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(
            id_42.toString(),
            'AUTH_APP_NAME',
            secret,
        );
        await this.db.query(`UPDATE users SET two_factor_secret='${secret}' WHERE id_42='${id_42}'`);
        return {
            secret,
            otpAuthUrl,
        };
    }

    generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    isTwoFactorAuthenticationCodeValid(
        code: string,
        secret: string,
    ) {
        return authenticator.verify({
            token: code,
            secret: secret,
        });
    }
}
