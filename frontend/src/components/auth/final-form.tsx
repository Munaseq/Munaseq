import Tag from "@/components/common/category";
import Button from "@/components/common/buttons/button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import mail from "@/assets/icons/mail.svg";
import user from "@/assets/icons/user-gradiant.svg";
import userCircle from "@/assets/icons/user-circle.svg";
import { MutableRefObject, useRef } from "react";
import LogoLoading from "../common/logo-loading";
import useFormVariants from "./hooks/use-form-variants";

export default function FinalForm(props: {
    step: number;
    prevStepHandler: (e: MouseEvent) => void;
    formData: FormData;
    isLoading: boolean;
}) {
    let categories: string[] = [];
    let image: MutableRefObject<string> = useRef("");

    if (props.formData.getAll("categories").length > 0) {
        categories = props.formData.getAll("categories") as string[];
    }

    let file = props.formData.get("profileImage");
    if (file instanceof Blob && file.size > 0) {
        image.current = URL.createObjectURL(
            props.formData.get("profileImage") as any
        );
    }

    const data = {
        username: props.formData.get("username") as string,
        email: props.formData.get("email") as string,
        displayName: props.formData.get("displayName") as string,
        firstName: props.formData.get("firstName"),
        lastName: props.formData.get("lastName"),
    };

    const variants: Variants = useFormVariants();
    return (
        <motion.div
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            initial={"next"}
            animate={
                props.step === 4 ? "active" : props.step > 4 ? "past" : "next"
            }
            variants={variants}
            className="w-full"
        >
            <h1 className="font-bold text-3xl text-center">
                {" "}
                تأكد من المعلومات
            </h1>

            {categories.length > 0 && (
                <div className="grid gap-2 mt-10">
                    <div className="flex gap-3">
                        <div className="w-20 aspect-square relative rounded-full overflow-hidden">
                            {image.current.length > 0 ? (
                                <Image src={image.current} alt="preview" fill />
                            ) : (
                                <Image src={userCircle} alt="preview" fill />
                            )}
                        </div>
                        <div className="mt-2">
                            <p className="font-bold text-lg">
                                {data.firstName + " " + data.lastName}
                            </p>
                            <p className="text-custom-gray">{data.username}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Image src={mail} alt="mail icon" />
                        <p className="font-semibold">{data.email}</p>
                    </div>
                    {data.displayName && (
                        <div className="flex gap-2">
                            <Image src={user} alt="mail icon" />
                            <p className="font-semibold">{data.displayName}</p>
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-lg">الاهتمامات</p>
                        <div className="flex flex-wrap gap-2 mt-5 sm:text-[0.75rem] text-xs max-h-44 overflow-hidden">
                            {categories.map((tag, index) => [
                                <Tag key={index}>{tag}</Tag>,
                            ])}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                {!props.isLoading ? (
                    <>
                        <Button
                            disabled={props.step !== 3}
                            onClick={props.prevStepHandler}
                            className="bg-transparent !text-custom-gray hover:!bg-[hsl(0,0%,92%)]"
                        >
                            السابق
                        </Button>
                        <Button className="shadow-xl px-10" gradient>
                            تأكيد الحساب
                        </Button>{" "}
                    </>
                ) : (
                    <div className="w-full grid place-items-center">
                        <LogoLoading className="w-20" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
