"use client";

import Button from "@/components/common/buttons/button";
import LoadingWrapper from "@/components/common/loading-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import { Input } from "@/components/common/shadcn-ui/input";
import addMateiralAction from "@/proxy/material/add-material-action";
import { motion } from "framer-motion";
import { CirclePlus } from "lucide-react";
import { useState, useRef } from "react";

export default function AddMaterial({ eventId }: { eventId: string }) {
    const [file, setFile] = useState("");
    const [error, setError] = useState("");
    const ref = useRef({} as HTMLInputElement);
    const handleUpload = (e: any) => {
        if (e.target.files.length === 0) {
            return;
        }
        setFile(URL.createObjectURL(e.target.files[0]));
    };
    return (
        <Dialog>
            <DialogTrigger>
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#666666" }}
                    className="border-2 border-[#949494] border-dashed w-48 h-48 aspect-square rounded-2xl grid place-items-center cursor-pointer group"
                >
                    <div className="grid place-items-center group-hover:text-[#666666] transition-colors text-custom-gray">
                        <CirclePlus size={32} />
                        <p className="text-lg mt-2">أضف محتوى</p>
                    </div>
                </motion.div>
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>اضافة محتوى</DialogTitle>
                    <DialogDescription>
                        <form
                            className="grid gap-4"
                            action={async (formData: FormData) => {
                                if (!ref.current.value) {
                                    setError("يجب اختيار ملف");
                                    return;
                                }

                                const error: { message: string } | undefined =
                                    await addMateiralAction(eventId, formData);
                                if (error?.message) {
                                    setError("حدث خطأ ما");
                                }
                            }}
                        >
                            <label htmlFor="Materials">
                                ارفق الملف الذي تريد اضافته للفعالية
                            </label>
                            <div className="grid gap-3 mt-5">
                                {file ? (
                                    <div className="flex items-center gap-5">
                                        <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-custom-gray"
                                        >
                                            عرض الملف
                                        </a>
                                        <button
                                            className="rounded-3xl p-2"
                                            onClick={e => {
                                                e.preventDefault();
                                                ref.current.click();
                                            }}
                                        >
                                            تغيير الملف
                                        </button>
                                    </div>
                                ) : null}
                                <Input
                                    name="materials"
                                    id="materials"
                                    type="file"
                                    className={
                                        "cursor-pointer " +
                                        (file ? "hidden" : "")
                                    }
                                    onChange={handleUpload}
                                    ref={ref}
                                />
                            </div>

                            {error && <p className="text-red-500">{error}</p>}

                            <LoadingWrapper>
                                <Button className="mt-2" gradient>
                                    تثبيت
                                </Button>
                            </LoadingWrapper>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
