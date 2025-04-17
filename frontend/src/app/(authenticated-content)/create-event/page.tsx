import { PlusCircle } from "lucide-react";
import { RolesProvider } from "@/store/rolesContext";
import CreateEventForm from "@/components/authenticated-content/create-event/create-event-form";
import Title from "@/components/common/text/title";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "انشاء فعالية",
};

export default function CreateEvent() {
   
    return (
        <div className="">
            <Title>
                <PlusCircle size={32} className="text-custom-light-purple" />
                نسق فعاليتك
            </Title>
            <RolesProvider>
                <CreateEventForm/>
            </RolesProvider>
        </div>
    );
}
