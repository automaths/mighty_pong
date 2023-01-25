import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "src/entities/friendrequest.entity";
import { Users } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendRequestService {
    constructor(@InjectRepository(Users) private userRepository: Repository<Users>, @InjectRepository(FriendRequest) private friendRequestRepository: Repository<FriendRequest>) {}

    async sendFriendRequest(friend: string, nickname: string): Promise<void> {
        const user = await this.userRepository.findOneBy({
            nickname: nickname
        });
        const toFriend = await this.userRepository.findOneBy({
            nickname: friend
        });
        let friendRequest = await this.friendRequestRepository.findOneBy({
            sender: user.id,
            receiver: toFriend.id
        });
        const existingFriendRequest = await this.friendRequestRepository.findOneBy({
            sender: toFriend.id,
            receiver: user.id
        });
        if (existingFriendRequest && existingFriendRequest.current_status === 'pending') {
            existingFriendRequest.current_status = 'accepted';
            await this.friendRequestRepository.save(existingFriendRequest);
            return ;
        }
        if (!friendRequest) {
            friendRequest = new FriendRequest();
            friendRequest.sender = user.id;
            friendRequest.receiver = toFriend.id;
        }
        else {
            friendRequest.current_status = 'pending';
        }
        await this.friendRequestRepository.save(friendRequest);
    }

    async getReceivedFriendRequests(user: Users): Promise<any> {
        const allReceivedRequests = await this.friendRequestRepository.findBy({
            receiver: user.id,
            current_status: 'pending'
        });
        const usersProfile = [];
        let sender;
        const senderIds = allReceivedRequests.map(req => req.sender);
        for (let i = 0; i < senderIds.length; i++) {
            sender = await this.userRepository.findOneBy({
                id: senderIds[i]
            });
            usersProfile.push({
                nickname: sender.nickname,
                avatar: sender.avatar
            });
        }
        return usersProfile;
    }

    async getFriendshipStatus(otherUser: string, user: Users): Promise<string> {
        const otherUserInfos = await this.userRepository.findOneBy({
            nickname: otherUser
        });
        const received = await this.friendRequestRepository.findOneBy({
            sender: otherUserInfos.id,
            receiver: user.id
        });
        const sent = await this.friendRequestRepository.findOneBy({
            sender: user.id,
            receiver: otherUserInfos.id
        });
        if (!received && !sent) {
            return 'cancelled';
        }
        if (received && received.current_status === 'accepted') {
            return received.current_status;
        }
        if (received && received.current_status === 'pending') {
            return 'to_accept';
        }
        return sent ? sent.current_status : received.current_status;
    }

    async acceptDeclineFriendRequest(otherUser: string, nickname: string, accept: boolean): Promise<void> {
        const otherUserInfos = await this.userRepository.findOneBy({
            nickname: otherUser
        });
        const user = await this.userRepository.findOneBy({
            nickname: nickname
        });
        const request = await this.friendRequestRepository.findOneBy({
            sender: otherUserInfos.id,
            receiver: user.id
        });
        if (accept) {
            request.current_status = 'accepted';
        }
        else {
            request.current_status = 'cancelled';
        }
        await this.friendRequestRepository.save(request);
    }

    async getSentRequests(user: Users): Promise<any> {
        const requestsSent = await this.friendRequestRepository.findBy({
            sender: user.id,
            current_status: 'pending'
        });
        const usersProfile = [];
        let receiver;
        const receiverIds = requestsSent.map(req => req.receiver);
        for (let i = 0; i < receiverIds.length; i++) {
            receiver = await this.userRepository.findOneBy({
                id: receiverIds[i]
            });
            usersProfile.push({
                nickname: receiver.nickname,
                avatar: receiver.avatar
            });
        }
        return usersProfile;
    }

    async getFriendList(user: Users): Promise<any> {
        const usersProfile = [];
        const friendSender = await this.friendRequestRepository.findBy({
            sender: user.id,
            current_status: 'accepted'
        });
        let sender;
        const senderId = friendSender.map(friend => friend.receiver);
        for (let i = 0; i < senderId.length; i++) {
            sender = await this.userRepository.findOneBy({
                id: senderId[i]
            });
            usersProfile.push({
                nickname: sender.nickname,
                avatar: sender.avatar
            });
        }
        const friendReceiver = await this.friendRequestRepository.findBy({
            receiver: user.id,
            current_status: 'accepted'
        });
        let receiver;
        const receiverIds = friendReceiver.map(req => req.sender);
        for (let i = 0; i < receiverIds.length; i++) {
            receiver = await this.userRepository.findOneBy({
                id: receiverIds[i]
            });
            usersProfile.push({
                nickname: receiver.nickname,
                avatar: receiver.avatar
            });
        }
        return usersProfile;
    }
}