import { InboxIcon } from "lucide-react";
import Title from "@/components/common/text/title";
import LogoLoading from "@/components/common/logo-loading";
import { Suspense } from "react";
import Inbox from "@/components/authenticated-content/invites/inbox";

export default async function InvitesPage() {
    return (
        <div>
            <Title>
                <InboxIcon className="text-custom-light-purple" size={32} />
                الدعوات
            </Title>
            <div className="grid place-items-center w-full mt-8">
                <div className="max-w-[1050px] w-full shadow-lg rounded-2xl p-4 ">
                    <Suspense
                        fallback={
                            <div className="grid place-items-center w-full">
                                <LogoLoading className="w-20 aspect-square" />
                            </div>
                        }
                    >
                        <Inbox />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
