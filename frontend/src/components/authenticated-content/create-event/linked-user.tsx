import TooltipWrapper from "@/components/common/tooltip";
import { UserDataDto } from "@/dtos/user-data.dto";
import { motion } from "framer-motion";
import { UserRoundIcon, XIcon } from "lucide-react";
import Image from "next/image";

export default function LinkedUser(props: { user: UserDataDto }) {
    return (
        <TooltipWrapper key={props.user.username} text={props.user.username}>
            <motion.div
                layout
                key={props.user.username}
                className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 group"
            >
                <div className="group-hover:opacity-100 absolute bg-opacity-50 z-20 opacity-0 transition-opacity duration-200 cursor-pointer bg-gray-900 w-full h-full grid place-items-center">
                    <XIcon size={24} color="white" />
                </div>
                {props.user.profilePictureUrl ? (
                    <Image
                        src={props.user.profilePictureUrl}
                        alt={props.user.username}
                        fill
                        sizes="100%"

                        className="z-10 object-cover"
                    />
                ) : (
                    <UserRoundIcon className="z-10 w-full h-full" />
                )}
            </motion.div>
        </TooltipWrapper>
    );
}
