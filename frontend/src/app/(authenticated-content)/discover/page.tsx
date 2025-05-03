import Subtitle from "@/components/common/text/subtitle";
import Title from "@/components/common/text/title";
import { Metadata } from "next";
import { SparklesIcon } from "lucide-react";
import HighestRatedEvents from "@/components/authenticated-content/discover/highest-rated-events";
import { Suspense } from "react";
import LogoLoading from "@/components/common/logo-loading";
import PreferredCategoriesEvents from "@/components/authenticated-content/discover/preferred-categories-events";

export const metadata: Metadata = {
    title: "اكتشف",
};

export default async function Discover() {
    return (
        <div>
            <Title>
                <SparklesIcon size={32} color="var(--custom-light-purple)" />
                اكتشف فعاليات المنسقين
            </Title>
            <Subtitle>من أعلى المنسقين تقييما </Subtitle>
            <Suspense
                fallback={
                    <div className="grid place-items-center w-full">
                        <LogoLoading className="w-20 aspect-square" />
                    </div>
                }
            >
                <HighestRatedEvents />
                <PreferredCategoriesEvents/>
            </Suspense>
        </div>
    );
}
