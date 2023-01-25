import { Body, Controller, Get, Injectable, Param, Post, Inject, HttpException } from "@nestjs/common";
import { UserConnected } from "src/configs/userconnected.decorator";
import { Users } from "src/entities/user.entity";
import { FriendRequestService } from "src/services/friend_request.service";

@Controller('friends')
@Injectable()
export class FriendRequestController {
    constructor(private friendRequestService: FriendRequestService, @Inject("PG_CONNECTION") private db: any) {}

    @Get('/requests/sent')
    getSentRequestsAction(@UserConnected() user: Users): Promise<any> {
        return this.friendRequestService.getSentRequests(user);
    }

    @Get('/requests/friendlist')
    getFriendList(@UserConnected() user: Users): Promise<any> {
        return this.friendRequestService.getFriendList(user);
    }

    @Get('/requests/:user')
    getFriendshipStatusAction(@Param('user') otherUser: string, @UserConnected() user: Users): Promise<any> {
        return this.friendRequestService.getFriendshipStatus(otherUser, user);
    }

    @Post('/sendrequest/:friend')
    sendFriendRequestAction(@Param('friend') friend: string, @Body() body: { nickname: string }): Promise<void> {
        return this.friendRequestService.sendFriendRequest(friend, body.nickname);
    }

    @Get('/requests')
    getReceivedFriendRequestsAction(@UserConnected() user: Users): Promise<any> {
        return this.friendRequestService.getReceivedFriendRequests(user);
    }

    @Post('/requests/:user/accept')
    acceptDeclineFriendRequestAction(@Param('user') otherUser: string, @Body() body: { nickname: string, accept: boolean }): Promise<void> {
        return this.friendRequestService.acceptDeclineFriendRequest(otherUser, body.nickname, body.accept);
    }

    @Get('/blocked/:user_id/:user_id_friend')
    async isUserBlocked(@Param() params: {user_id: number, user_id_friend: number}){
        try {
            const is_blocked = await this.db.query(
                `
                    SELECT
                        *
                    FROM
                        public.blocked_users
                    WHERE
                        user_id = $1
                    AND
                        blocked_user_id = $2;
                `,
                [params?.user_id, params?.user_id_friend]
            );
            if (is_blocked?.rows?.length == 0)
                return (false);
            return (true);
        } catch (e) {
            throw new HttpException('There was an error from our side, please try again later', 500);
        }
    }
}