"use client";
import { CornerDownLeftIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TooltipWrapper from "@/components/common/tooltip";

export default function Return({ className }: { className?: string }) {
    const router = useRouter();
    return (
        <motion.div
            whileHover={"appear"}
            initial={"disapper"}
            className={
                "cursor-pointer z-10 grid place-items-center " + className
            }
        >
            <TooltipWrapper text="العودة">
                <CornerDownLeftIcon
                
                    onClick={() => router.push("/discover")}
                />
            </TooltipWrapper>
        </motion.div>
    );
}
