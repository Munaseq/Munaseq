import GradientText from "@/components/common/text/gradient-text";
import Image from "next/image";
import rightDeco from "@/assets/new-landing-assets/work-team/right-side.png";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import linkdinIcon from '@/assets/icons/linkedin-icon.svg'
import { FileTextIcon } from "lucide-react";


export default function MemberCard({
    name,
    role,
    linkedin,
    image,
    cv,
}: {
    name: string;
    role: string;
    linkedin: string;
    image: StaticImport;
    cv: string;
}) {
    return (
        <div className="w-full shadow-custom rounded-2xl grid place-items-center py-10">
            <div className="flex flex-col items-center justify-center relative text-center z-10">
                <Image src={image} alt="user icon" className="w-28" />
                <div className="pt-5 px-5 flex flex-col relative">
                    <h2 className="font-semibold text-2xl z-10">{name}</h2>
                    <GradientText className={"text-3xl font-semibold"}>
                        {role}
                    </GradientText>
                </div>
                <div className="flex gap-1 mt-4">
                    <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={linkdinIcon}
                            alt="linkedin"
                            className="w-8 h-8"
                        />
                    </a>
                    <a href={cv} target="_blank" rel="noopener noreferrer">
                        <FileTextIcon className="w-8 h-8"/>
                    </a>

                </div>
            </div>
            <Image
                src={rightDeco}
                alt="deco"
                className="absolute top-0 right-0"
            />
        </div>
    );
}
