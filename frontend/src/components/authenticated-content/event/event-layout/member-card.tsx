import TooltipWrapper from "@/components/common/tooltip";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";

export default function MemberCard({
    firstName,
    lastName,
    username,
    showContact = true,
}: {
    firstName: string;
    lastName: string;
    username: string;
    showContact?: boolean;
}) {
    return (
        <div className="flex items-center gap-3 p-2 shadow-md rounded-lg">
            <div>
                <div className="font-bold text-lg">
                    {firstName + " " + lastName}{" "}
                    {!showContact && <span className="opacity-40 text-sm">{"(انت)"}</span>}
                </div>
                <div className="text-sm text-custom-gray">@{username}</div>
            </div>
            {showContact && (
                <TooltipWrapper text={`التواصل مع ${firstName} ${lastName}`}>
                    <Link
                        href={"/chat/" + username}
                        className="hover:text-custom-light-purple transition-colors duration-200"
                    >
                        <MessagesSquareIcon />
                    </Link>
                </TooltipWrapper>
            )}
        </div>
    );
}
