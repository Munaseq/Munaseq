"use client";

import { useEventContext } from "@/store/event-context";
import { useEffect } from "react";

export default function StoreEventData({
    data,
    children,
}: {
    children: React.ReactNode;
    data: any;
}) {
    const { setEvents, setLoading } = useEventContext();
    useEffect(() => {
        setEvents(data);
        setLoading(false);
    }, [data]);
    return children;
}
