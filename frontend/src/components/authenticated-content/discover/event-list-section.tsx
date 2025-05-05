import LogoLoading from "@/components/common/logo-loading";
import Subtitle from "@/components/common/text/subtitle";
import React, { Suspense } from "react";

export default async function EventListSection({
    message,
    children,
}: {
    message?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="mt-6">
            <Subtitle>{message}</Subtitle>
            <Suspense
                fallback={
                    <div className="grid place-items-center w-full">
                        <LogoLoading className="w-20 aspect-square" />
                    </div>
                }
            >
                {children}
            </Suspense>
        </div>
    );
}
