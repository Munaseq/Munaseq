'use client'

import { EventDataDto } from '@/dtos/event-data.dto';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the EventDataDto type


// Define the context type
interface EventContextType {
    events: EventDataDto[];
    setEvents: React.Dispatch<React.SetStateAction<EventDataDto[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const EventContext = createContext<EventContextType | undefined>(undefined);

// Create a provider component
export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<EventDataDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <EventContext.Provider value={{ events, setEvents , loading, setLoading }}>
            {children}
        </EventContext.Provider>
    );
};

// Create a custom hook to use the EventContext
export const useEventContext = (): EventContextType => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
};