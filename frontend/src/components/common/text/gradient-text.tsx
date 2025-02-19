import { ReactElement, ReactNode } from "react";

export default function GradientText({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) {
    return (
        <span
            className={
                "bg-custom-gradient text-transparent bg-clip-text " + className
            }
        >
            {children}
        </span>
    );
}
