import GradientText from "@/components/common/text/gradient-text";
import Image from "next/image";
import bottomLeftDeco from "@/assets/new-landing-assets/steps/bottom-left-deco.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Step({
    icon,
    title,
    desc,
    number,
}: {
    icon: StaticImport;
    title: string;
    desc: string;
    number: string;
}) {
    return (
        <div className="max-w-96 h-80 shadow-custom rounded-2xl grid grid-rows-2">
            <div className="relative px-5">
                <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-white from-[60%] right-0" />
                <Image
                    src={icon}
                    alt="user icon"
                    className="absolute left-10 top-5 w-36"
                ></Image>
                <GradientText className={"text-[9em] font-semibold"}>
                    {number}
                </GradientText>
            </div>
            <div className="pt-5 px-5 gap-2 flex flex-col relative">
                <h2 className="font-semibold text-2xl z-10">{title}</h2>
                <p className="text-custom-gray z-10">{desc}</p>
                <Image
                    src={bottomLeftDeco}
                    alt="deco"
                    className="absolute bottom-0 left-0"
                />
            </div>
        </div>
    );
}
