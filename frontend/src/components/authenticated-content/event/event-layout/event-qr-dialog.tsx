"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import { QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function EventQRDialog() {
    const [qrValue, setQrValue] = useState<string>("");
    useEffect(() => {
        const currentUrl = window.location.href;
        setQrValue(currentUrl.match(/^(.*?\/event\/[a-f0-9\-]+)/)?.[1] || "");
    }, [qrValue]);
    return (
        <Dialog>
            <DialogTrigger className="">
                <QrCodeIcon
                    size={32}
                    className="text-white hover:scale-105 transition-transform"
                />
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader className="!text-right ps-4">
                    <DialogTitle>رمز الاستجابة السريعة</DialogTitle>
                    <DialogDescription>
                        يمكنك استخدام هذا الرمز للدخول إلى الفعالية
                    </DialogDescription>
                </DialogHeader>
                <div className="grid place-items-center my-5">
                    <QRCodeSVG
                        value={qrValue}
                        fgColor="white"
                        bgColor="transparent"
                        size={200}
                        // imageSettings={{
                        //     src: "/logo-small-white.svg",
                        //     height: 40,
                        //     width: 40,
                        //     excavate: true,
                        // }}
                        marginSize={2}
                        className="rounded-lg bg-gradient-to-r from-custom-light-purple to-custom-dark-purple"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
