import { InvitationType, RoleType } from '@prisma/client';
export declare class SendInvitationDTO {
    receiverId: string;
    invitationType: InvitationType;
    roleType?: RoleType;
}
