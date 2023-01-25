import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './config';
import { LoggerMiddleware } from './middleware';
import { ChatController } from './chat/chat.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { History } from './entities/history.entity';
import { Matchmaking } from './entities/matchmaking.entity';
import { UserService } from './services/user.service';
import { SocketGateway } from './socket.gateway';
import { HistoryController } from './history/history.controller';
import { HistoryService } from './services/history.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MatchmakingController } from './matchmaking/matchmaking.controller';
import { MatchmakingService } from './services/matchmaking.service';
import { TwoFactorAuthController } from './two_factor_auth/two_factor_auth.controller';
import { TwoFactorAuthService } from './services/two_factor_auth.service';
import { JwtModule } from '@nestjs/jwt';
import { FriendRequest } from './entities/friendrequest.entity';
import { Live } from './entities/live.entity';
import { FriendRequestController } from './friendrequest/friendrequest.controller';
import { FriendRequestService } from './services/friend_request.service';
import { LiveController } from './live/live.controller';
import { LiveService } from './services/live.service';
import { Invitations } from './entities/invitations.entity';
import { InvitationsController } from './invitations/invitations.controller';
import { InvitationsService } from './services/invitations.service';

@Module({
    imports:
        [ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env", ".env.prod"],
        }),
        DbModule,
        HttpModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            password: '',
            entities: [Users, History, Matchmaking, FriendRequest, Live, Invitations],               // On renseigne ici les entités voulant être mappées en base de données
        }),
        TypeOrmModule.forFeature([Users, History, Matchmaking, FriendRequest, Live, Invitations]),     // On renseigne ici les entités possédant un repository
        MulterModule.register({dest: './public',}),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        TypeOrmModule.forFeature([Users, History, FriendRequest, Live, Invitations]),     // On renseigne ici les entités possédant un repository
        MulterModule.register({dest: './public',}),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1d' },
        }),
        ],
    controllers: [AppController, UsersController, ChatController, HistoryController, MatchmakingController, TwoFactorAuthController, FriendRequestController, LiveController, InvitationsController],
    providers: [AppService, UserService, SocketGateway, HistoryService, MatchmakingService, TwoFactorAuthService, FriendRequestService, LiveService, InvitationsService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({
                path: '/users/:email',
                method: RequestMethod.GET
            }, {
                path: '/chat*',
                method: RequestMethod.GET
            }, {
                path: '/chat*',
                method: RequestMethod.POST
            }, {
                path: '/friends*',
                method: RequestMethod.POST
            }, {
                path: '/friends*',
                method: RequestMethod.GET
            }, {
                path: '/history*',
                method: RequestMethod.GET,
            });
    }
}
