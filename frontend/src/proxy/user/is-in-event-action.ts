import { UserDataDto } from "@/dtos/user-data.dto";

const isInEventAction = async (eventId: string, username: string) => {
    try {
        const eventAttendeesReq = await fetch(
            `${process.env.BACKEND_URL}/event/allUsers/` + eventId,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!eventAttendeesReq.ok) {
            throw new Error("Failed to fetch event attendees");
        }

        const eventAttendees: {
            eventCreator: UserDataDto;
            joinedUsers: UserDataDto[];
            presenters: UserDataDto[];
            moderators: UserDataDto[];
        } = await eventAttendeesReq.json();
        

        return (
            eventAttendees.eventCreator.username === username ||
            eventAttendees.joinedUsers.some(
                user => user.username === username
            ) ||
            eventAttendees.presenters.some(
                user => user.username === username
            ) ||
            eventAttendees.moderators.some(user => user.username === username)
        );
        
    } catch (error) {
        return false;
    }
};

export default isInEventAction;
