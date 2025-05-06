export type ChatUser = {
    id: string;
    username: string;
    profilePictureUrl: string;
    firstName: string;
    lastName: string;
};

export type Message = {
    content: string;
    Sender: ChatUser;
    createdAt: string;
};

export type Chat = {
    id: string;
    Users: ChatUser[];
    Messages: Message[];
    isAttendeesAllowed: boolean;
};
