"use client";

import Button from "@/components/common/buttons/button";
import LoadingWrapper from "@/components/common/loading-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/common/shadcn-ui/dialog";
import { Input } from "@/components/common/shadcn-ui/input";
import TooltipWrapper from "@/components/common/tooltip";
import addMateiralAction from "@/proxy/material/add-material-action";
import { motion } from "framer-motion";
import {
    CirclePlus,
    FileTextIcon,
    PencilIcon,
    XCircleIcon,
} from "lucide-react";
import { useState, useRef } from "react";

export default function AddMaterial({ eventId }: { eventId: string }) {
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const ref = useRef({} as HTMLInputElement);
    const handleUpload = (e: any) => {
        setError("");
        setFileName(e.target.files[0].name);
        if (e.target.files.length === 0) {
            return;
        }
        setFile(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                if (!isOpen) {
                    setFile("");
                    setFileName("");
                    setError("");
                }
                setIsOpen(!isOpen);
            }}
        >
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
                        ارفق الملف الذي تريد اضافته للفعالية
                    </DialogDescription>
                    <form
                        className="grid gap-4"
                        action={async (formData: FormData) => {
                            if (!file) {
                                setError("يجب اختيار ملف");
                                return;
                            }

                            const error: { message: string } | undefined =
                                await addMateiralAction(eventId, formData);
                            if (error?.message) {
                                setError("حدث خطأ ما");
                                return
                            }
                            setIsOpen(!isOpen);
                        }}
                    >
                        <div className="grid gap-3 mt-5">
                            {file && (
                                <div className="flex items-center gap-5">
                                    <TooltipWrapper text="عرض الملف">
                                        <a
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-custom-gray flex gap-1 items-center"
                                        >
                                            <FileTextIcon className="cursor-pointer" />
                                            <span className="max-w-56 truncate">
                                                {/* display file name */}
                                                {fileName}
                                            </span>
                                        </a>
                                    </TooltipWrapper>
                                    <TooltipWrapper text="تعديل الملف">
                                        <motion.div
                                            layout
                                            className="ms-5"
                                            onClick={e => {
                                                e.preventDefault();
                                                ref.current.click();
                                            }}
                                        >
                                            <PencilIcon />
                                        </motion.div>
                                    </TooltipWrapper>

                                    <TooltipWrapper text="حذف الملف">
                                        <motion.div
                                            layout
                                            className=""
                                            onClick={e => {
                                                e.preventDefault();
                                                setFile("");
                                                setFileName("");
                                            }}
                                        >
                                            <XCircleIcon />
                                        </motion.div>
                                    </TooltipWrapper>
                                </div>
                            )}
                            <Input
                                dir="ltr"
                                name="materials"
                                id="materials"
                                type="file"
                                className={
                                    "cursor-pointer " + (file ? "hidden" : "")
                                }
                                onChange={handleUpload}
                                ref={ref}
                            />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <DialogFooter className="flex !justify-between sm:gap-0 gap-2">
                            <LoadingWrapper>
                                <Button
                                    onClick={e => {
                                        e.preventDefault();
                                        if (!isOpen) {
                                            setFile("");
                                            setFileName("");
                                            setError("");
                                        }
                                        setIsOpen(!isOpen);
                                    }}
                                >
                                    الغاء
                                </Button>
                                <Button className="mt-2 px-12" gradient>
                                    تثبيت
                                </Button>
                            </LoadingWrapper>
                        </DialogFooter>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
