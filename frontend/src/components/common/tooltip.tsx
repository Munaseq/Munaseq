import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./shadcn-ui/tooltip";

import { ReactNode } from "react";

export default function TooltipWrapper(props: {
    children: ReactNode;
    text: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>{props.children}</TooltipTrigger>
                <TooltipContent>
                    <p>{props.text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
