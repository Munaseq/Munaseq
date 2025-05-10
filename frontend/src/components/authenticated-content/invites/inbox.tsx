import Subtitle from "@/components/common/text/subtitle";
import TooltipWrapper from "@/components/common/tooltip";
import { UserDataDto } from "@/dtos/user-data.dto";
import getEventAction from "@/proxy/event/get-event-using-id-action";
import getInvitesAction from "@/proxy/user/get-invites-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import {
    CheckCircle2Icon,
    CircleUserRoundIcon,
    MailboxIcon,
    SendIcon,
    XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import ActionButtons from "./invite-action-buttons";

enum InviteType {
    ROLE_INVITATION = "ROLE_INVITATION",
    EVENT_INVITATION = "EVENT_INVITATION",
}

export enum Status {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED_BY_SYSTEM = "CANCELED_BY_SYSTEM",
}

enum InviteRole {
    PRESENTER = "PRESENTER",
    MODERATOR = "MODERATOR",
}

type Invite = {
    id: string;
    invitationType: InviteType;
    status: Status;
    roleType: InviteRole;
    sender_id: string;
    receiver_id: string;
    event_id: string;
    updatedAt: string;
    createdAt: string;
    Sender: { id: string; username: string; profilePictureUrl: string };
    Receiver: { id: string; username: string; profilePictureUrl: string };
};

const translateInviteRole = (role: InviteRole) => {
    switch (role) {
        case InviteRole.PRESENTER:
            return "مقدم";
        case InviteRole.MODERATOR:
            return "منظم";
        default:
            return "غير محدد";
    }
};

export default async function Inbox() {
    const invites: {
        sentInvitations: Invite[];
        receivedInvitations: Invite[];
    } = await getInvitesAction();

    if (
        !invites ||
        (invites.sentInvitations.length === 0 &&
            invites.receivedInvitations.length === 0)
    ) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <p className="text-sm text-gray-500">لا توجد دعوات حالياً</p>
            </div>
        );
    }

    return (
        <>
            {invites.receivedInvitations.length !== 0 && (
                <>
                    <Subtitle>
                    <div className="flex gap-1 items-center">
                        <MailboxIcon />
                        <span>الدعوات الواردة</span>
                    </div>
                    </Subtitle>
                    <div className="flex flex-col pt-4 gap-5">
                        {invites.receivedInvitations.map(
                            async (invite: Invite, index) => {
                                const event = await getEventAction(
                                    invite.event_id
                                );
                                return (
                                    <div
                                        key={index}
                                        className="flex justify-between flex-row gap-2"
                                    >
                                        <div className="flex gap-5">
                                            <div className="w-14 h-14 aspect-square relative rounded-full overflow-hidden">
                                                {invite.Sender
                                                    .profilePictureUrl ? (
                                                    <Image
                                                        src={
                                                            invite.Sender
                                                                .profilePictureUrl
                                                        }
                                                        priority
                                                        fill
                                                        sizes="100%"
                                                        className="object-cover"
                                                        alt="User profile picture"
                                                    />
                                                ) : (
                                                    <CircleUserRoundIcon className="w-full h-full aspect-square" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden max-w-40">
                                                <p className="text-sm font-semibold">
                                                    من: {invite.Sender.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(
                                                        invite.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {invite.invitationType ===
                                                    InviteType.ROLE_INVITATION
                                                        ? "دعوة للانضمام كـ " +
                                                          translateInviteRole(
                                                              invite.roleType
                                                          )
                                                        : "دعوة للانضمام للفعالية"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {"الفعالية: "}
                                                    <span className=" font-bold">
                                                        {event.title}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <ActionButtons
                                            id={invite.id}
                                            senderUsername={
                                                invite.Sender.username
                                            }
                                            status={invite.status}
                                            isSent={false}
                                            eventId={invite.event_id}
                                            isInvite={true}
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                </>
            )}
            {invites.sentInvitations.length !== 0 && (
                <>
                    <Subtitle>
                        <div className="flex gap-1 items-center">
                            <SendIcon />
                            الدعوات المرسلة
                        </div>
                    </Subtitle>
                    <div className="flex flex-col pt-4 gap-5">
                        {invites.sentInvitations.map(
                            async (invite: Invite, index) => {
                                const event = await getEventAction(
                                    invite.event_id
                                );
                                return (
                                    <div
                                        key={index}
                                        className="flex justify-between flex-row gap-2"
                                    >
                                        <div className="flex gap-5">
                                            <div className="w-14 h-14 aspect-square relative rounded-full overflow-hidden">
                                                {invite.Receiver
                                                    .profilePictureUrl ? (
                                                    <Image
                                                        src={
                                                            invite.Receiver
                                                                .profilePictureUrl
                                                        }
                                                        priority
                                                        fill
                                                        sizes="100%"
                                                        className="object-cover"
                                                        alt="User profile picture"
                                                    />
                                                ) : (
                                                    <CircleUserRoundIcon className="w-full h-full aspect-square" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 max-w-40 overflow-hidden">
                                                <p className="text-sm font-semibold">
                                                    الى:{" "}
                                                    {invite.Receiver.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(
                                                        invite.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {invite.invitationType ===
                                                    InviteType.ROLE_INVITATION
                                                        ? "دعوة للانضمام كـ " +
                                                          translateInviteRole(
                                                              invite.roleType
                                                          )
                                                        : "دعوة للانضمام للفعالية"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {"الفعالية: "}
                                                    <span className=" font-bold">
                                                        {event.title}
                                                    </span>
                                                </p>
                                                    
                                            </div>
                                        </div>
                                        <ActionButtons
                                            id={invite.id}
                                            senderUsername={
                                                invite.Sender.username
                                            }
                                            status={invite.status}
                                            isSent={true}
                                            isInvite={true}
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                </>
            )}
        </>
    );
}
