'use server'
import { cookies } from 'next/headers';

export default async function changeChatState(eventId: string, isAttendeesAllowed: boolean) {
    const cookiesList = cookies();
    const token = cookiesList.get("token")?.value;
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/event/chat/${eventId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`

            },
            body: JSON.stringify({ isAttendeesAllowed }),
        });

        if (!response.ok) {
            throw new Error('ERROR');
        }
    } catch (error: any) {
        return {
            message: error.message,
        };
    }
}