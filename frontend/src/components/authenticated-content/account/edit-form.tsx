"use client";

import TextField from "@/components/common/text/text-field";
import Catagory from "@/components/common/category";
import Subtitle from "@/components/common/text/subtitle";
import TextArea from "@/components/common/text/text-area";
import Radio from "@/components/common/radio-group";
import AddCatagoryDropdown from "@/components/common/buttons/add-category-dropdown";
import { UserDataDto } from "@/dtos/user-data.dto";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/common/shadcn-ui/input";
import Button from "@/components/common/buttons/button";
import LoadingWapper from "@/components/common/loading-wrapper";
import isUsernameUniqueAction from "@/proxy/user/is-username-unique-action";
import isEmailUniqueAction from "@/proxy/user/is-email-unique-action";
import Link from "next/link";
import editProfileAction from "@/proxy/user/edit-profile-action";
import TooltipWrapper from "@/components/common/tooltip";
import { PencilIcon, FileTextIcon, XCircleIcon } from "lucide-react";

export default function EditForm({
    userData,
}: {
    userData: UserDataDto;
}) {
    const [formError, setFormError] = useState([] as string[]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCatagories, setSelectedCatagories] = useState(
        userData.categories
    );
    const [image, setImage] = useState(userData.profilePictureUrl);
    const [cvFile, setCvFile] = useState(userData.cvUrl);
    const emailRef = useRef({} as HTMLInputElement);
    const usernameRef = useRef({} as HTMLInputElement);
    const firstNameRef = useRef({} as HTMLInputElement);
    const lastNameRef = useRef({} as HTMLInputElement);
    const xLinkRef = useRef({} as HTMLInputElement);
    const linkedinLinkRef = useRef({} as HTMLInputElement);
    const profileImageRef = useRef({} as HTMLInputElement);
    const cvRef = useRef({} as HTMLInputElement);

    if (typeof userData.socialAccounts === "string") {
        userData.socialAccounts = JSON.parse(userData.socialAccounts as string);
    }

    function handleImageUpload(e: any) {
        if (e.target.files.length === 0) {
            return;
        }
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    const handleCvUpload = (e: any) => {
        if (e.target.files.length === 0) {
            return;
        }
        setCvFile(URL.createObjectURL(e.target.files[0]));
    };

    const checkFirstNameEmpty: () => boolean = () => {
        if (firstNameRef.current.value.length < 3) {
            if (!formError.includes("FIRSTNAME_EMPTY")) {
                setFormError(prev => [...prev, "FIRSTNAME_EMPTY"]);
            }
            return false;
        }

        setFormError(prev => prev.filter(e => e !== "FIRSTNAME_EMPTY"));
        return true;
    };

    const checkLastNameEmpty: () => boolean = () => {
        if (lastNameRef.current.value.length < 3) {
            if (!formError.includes("LASTNAME_EMPTY")) {
                setFormError(prev => [...prev, "LASTNAME_EMPTY"]);
            }
            return false;
        }

        setFormError(prev => prev.filter(e => e !== "LASTNAME_EMPTY"));
        return true;
    };

    const isEmailCorrect: () => boolean = () => {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(emailRef.current.value)) {
            if (!formError.includes("EMAIL_INVALID")) {
                setFormError(prev => [...prev, "EMAIL_INVALID"]);
            }
            return false;
        }
        setFormError(prev => prev.filter(e => e !== "EMAIL_INVALID"));
        return true;
    };
    const isEmailNotEmpty: () => boolean = () => {
        if (emailRef.current.value.length < 3) {
            if (!formError.includes("EMAIL_EMPTY")) {
                setFormError(prev => [...prev, "EMAIL_EMPTY"]);
            }
            return false;
        }
        setFormError(prev => prev.filter(e => e !== "EMAIL_EMPTY"));
        return true;
    };

    const isEmailUnique = async () => {
        setIsLoading(true);
        const sameEmail: boolean = emailRef.current.value === userData.email;
        const data = await isEmailUniqueAction(emailRef.current.value);
        if (!sameEmail && !data.passed) {
            if (!formError.includes(data.error)) {
                setFormError(prev => [...prev, data.error]);
            }
            setIsLoading(false);
            return false;
        }
        setFormError(prev =>
            prev.filter(e => e !== "EMAIL_NOT_UNIQUE" && e !== "ERROR")
        );
        setIsLoading(false);
        return true;
    };
    const isUsernameUnique = async () => {
        const sameUsername: boolean =
            usernameRef.current.value === userData.username;
        const data = await isUsernameUniqueAction(usernameRef.current.value);
        if (!sameUsername && !data.passed) {
            if (!formError.includes(data.error)) {
                setFormError(prev => [...prev, data.error]);
            }
            setIsLoading(false);
            return false;
        }
        setFormError(prev =>
            prev.filter(e => e !== "USERNAME_NOT_UNIQUE" && e !== "ERROR")
        );
        setIsLoading(false);
        return true;
    };

    const isUsernameNotEmpty: () => boolean = () => {
        if (usernameRef.current.value.length < 3) {
            if (!formError.includes("USERNAME_EMPTY")) {
                setFormError(prev => [...prev, "USERNAME_EMPTY"]);
            }
            return false;
        }
        setFormError(prev => prev.filter(e => e !== "USERNAME_EMPTY"));
        return true;
    };

    const checkXLink = () => {
        if (
            !xLinkRef.current.value.startsWith("https://x.com/") &&
            xLinkRef.current.value.length !== 0
        ) {
            if (!formError.includes("XLINK_INVALID")) {
                setFormError(prev => [...prev, "XLINK_INVALID"]);
            }
            return false;
        }
        setFormError(prev => prev.filter(e => e !== "XLINK_INVALID"));
        return true;
    };

    const checkLinkedInLink = () => {
        if (
            !linkedinLinkRef.current.value.startsWith(
                "https://www.linkedin.com/in/"
            ) &&
            linkedinLinkRef.current.value.length !== 0
        ) {
            if (!formError.includes("LINKEDINLINK_INVALID")) {
                setFormError(prev => [...prev, "LINKEDINLINK_INVALID"]);
            }
            return false;
        }
        setFormError(prev => prev.filter(e => e !== "LINKEDINLINK_INVALID"));
        return true;
    };

    const validateInputs = async () => {
        return (
            isEmailNotEmpty() &&
            isUsernameNotEmpty() &&
            isEmailCorrect() &&
            (await isEmailUnique()) &&
            (await isUsernameUnique()) &&
            checkFirstNameEmpty() &&
            checkLastNameEmpty() &&
            checkXLink() &&
            checkLinkedInLink()
        );
    };

    const getError: () => string = () => {
        if (formError.includes("EMAIL_INVALID")) {
            return "الايميل غير صحيح";
        }
        if (formError.includes("EMAIL_NOT_UNIQUE")) {
            return "الايميل موجود بالفعل";
        }
        if (formError.includes("USERNAME_NOT_UNIQUE")) {
            return "اسم المستخدم موجود بالفعل";
        }
        if (formError.includes("EMAIL_EMPTY")) {
            return "الايميل لا يمكن ان يكون اقل من 3 احرف";
        }
        if (formError.includes("USERNAME_EMPTY")) {
            return "اسم المستخدم لا يمكن ان يكون اقل من 3 احرف";
        }
        if (
            formError.includes("FIRSTNAME_EMPTY") ||
            formError.includes("LASTNAME_EMPTY")
        ) {
            return "اسم المستخدم لا يمكن ان يكون اقل من 3 احرف";
        }
        if (formError.includes("XLINK_INVALID"))
            return "الرابط يجب أن يبدأ بـ https://x.com/";
        if (formError.includes("LINKEDINLINK_INVALID"))
            return "الرابط يجب أن يبدأ بـ https://www.linkedin.com/in/";
        if (formError.includes("ERROR")) {
            return "حدث خطأ, الرجاء المحاولة في وقت لاحق";
        }
        return "";
    };

    return (
        <form
            action={async (formData: FormData) => {
                setIsLoading(true);
                if (!(await validateInputs())) {
                    setIsLoading(false);
                    return;
                }
                for (const category of selectedCatagories) {
                    formData.append("categories", category);
                }
                formData.set(
                    "socialAccounts",
                    JSON.stringify({
                        xLink: xLinkRef.current.value,
                        linkedinLink: linkedinLinkRef.current.value,
                    })
                );

                const error: { message: string } = await editProfileAction(
                    formData,
                );
                if (error.message) {
                    setFormError(prevErrors => [...prevErrors, error.message]);
                    setIsLoading(false);
                    return;
                }
            }}
            className="grid grid-cols-1 gap-10"
        >
            <div className="grid grid-cols-1 gap-10">
                <Subtitle>المعلومات الاساسية</Subtitle>
                <div className="w-56">
                    <TextField
                        ref={usernameRef}
                        placeholder="الاسم المستخدم"
                        name="username"
                        defaultValue={userData.username}
                        onBlur={() => {
                            isUsernameNotEmpty();
                            // await isUsernameUnique();
                        }}
                        error={
                            formError.includes("USERNAME_EMPTY") ||
                            formError.includes("USERNAME_NOT_UNIQUE")
                        }
                    />
                    <TextField
                        ref={emailRef}
                        placeholder="البريد الالكتروني"
                        name="email"
                        defaultValue={userData.email}
                        onBlur={() => {
                            isEmailCorrect();
                            isEmailNotEmpty();
                            // await isEmailUnique();
                        }}
                        error={
                            formError.includes("EMAIL_INVALID") ||
                            formError.includes("EMAIL_EMPTY") ||
                            formError.includes("EMAIL_NOT_UNIQUE")
                        }
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-10">
                <Subtitle>معلومات الملف الشخصية</Subtitle>

                <div className="max-w-96 w-full grid grid-cols-1 gap-10">
                    <div className="grid grid-cols-2 gap-10">
                        <TextField
                            ref={firstNameRef}
                            placeholder="الاسم الاول"
                            name="firstName"
                            defaultValue={userData.firstName}
                            onBlur={checkFirstNameEmpty}
                            error={formError.includes("FIRSTNAME_EMPTY")}
                        />
                        <TextField
                            ref={lastNameRef}
                            placeholder="الاسم الاخير"
                            name="lastName"
                            defaultValue={userData.lastName}
                            onBlur={checkLastNameEmpty}
                            error={formError.includes("LASTNAME_EMPTY")}
                        />
                    </div>
                    <motion.div className="grid gap-3 mt-5">
                        <motion.label
                            layout
                            htmlFor="profilePicture"
                            className="block text-custom-gray text-md"
                        >
                            صورة العرض
                        </motion.label>

                        {image ? (
                            <div className="flex items-center gap-5">
                                <motion.div
                                    layout
                                    className="w-20 aspect-square relative rounded-full overflow-hidden"
                                >
                                    <Image src={image} alt="preview" fill />
                                </motion.div>
                                <TooltipWrapper text="تعديل الصورة">
                                    <motion.button
                                        layout
                                        className="ms-5"
                                        onClick={e => {
                                            e.preventDefault();
                                            profileImageRef.current.click();
                                        }}
                                    >
                                        <PencilIcon/>
                                    </motion.button>
                                </TooltipWrapper>

                                <TooltipWrapper text="حذف الصورة">
                                    <motion.button
                                        layout
                                        className=""
                                        onClick={e => {
                                            e.preventDefault();
                                            setImage("");
                                            profileImageRef.current.value = "";
                                        }}
                                    >
                                        <XCircleIcon/>
                                    </motion.button>
                                </TooltipWrapper>
                            </div>
                        ) : null}
                        <Input
                            name="profilePicture"
                            id="profilePicture"
                            type="file"
                            className={
                                "cursor-pointer " + (image ? "hidden" : "")
                            }
                            accept="image/png, image/jpeg , image/jpg"
                            onChange={handleImageUpload}
                            ref={profileImageRef}
                        />
                    </motion.div>
                    <motion.div className="grid gap-3 mt-5">
                        <motion.label
                            layout
                            htmlFor="cvFile"
                            className="block text-custom-gray text-md"
                        >
                            السيرة الذاتية (PDF)
                        </motion.label>
                        {cvFile ? (
                            <div className="flex items-center gap-5">
                                <TooltipWrapper text="عرض السيرة الذاتية">
                                    <a
                                        href={cvFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-custom-gray"
                                    >
                                        <FileTextIcon className="cursor-pointer" />
                                    </a>
                                </TooltipWrapper>
                                <TooltipWrapper text="تعديل السيرة الذاتية">
                                    <motion.button
                                        layout
                                        className="ms-5"
                                        onClick={e => {
                                            e.preventDefault();
                                            cvRef.current.click();
                                        }}
                                    >
                                       <PencilIcon/>
                                    </motion.button>
                                </TooltipWrapper>

                                <TooltipWrapper text="حذف السيرة الذاتية">
                                    <motion.button
                                        layout
                                        className=""
                                        onClick={e => {
                                            e.preventDefault();
                                            setCvFile("");
                                            cvRef.current.value = "";
                                        }}
                                    >
                                        <XCircleIcon/>
                                    </motion.button>
                                </TooltipWrapper>
                            </div>
                        ) : null}
                        <Input
                            name="cv"
                            id="cvFile"
                            type="file"
                            className={
                                "cursor-pointer " + (cvFile ? "hidden" : "")
                            }
                            accept="application/pdf"
                            onChange={handleCvUpload}
                            ref={cvRef}
                        />
                    </motion.div>

                    <motion.div className="grid gap-5 mt-5">
                        <TextField
                            ref={xLinkRef}
                            placeholder="رابط X"
                            name="xLink"
                            defaultValue={userData.socialAccounts?.xLink}
                            onBlur={checkXLink}
                            error={formError.includes("XLINK_INVALID")}
                        />
                        <TextField
                            ref={linkedinLinkRef}
                            placeholder="رابط LinkedIn"
                            name="linkedinLink"
                            defaultValue={userData.socialAccounts?.linkedinLink}
                            onBlur={checkLinkedInLink}
                            error={formError.includes("LINKEDINLINK_INVALID")}
                        />
                    </motion.div>

                    <TextArea
                        placeholder="الوصف"
                        name="description"
                        defaultValue={userData.description}
                    ></TextArea>
                </div>
                <div className="grid gap-3 mt-5">
                    <span className="block text-lg text-custom-gray">
                        الجنس
                    </span>
                    <Radio
                        name={"gender"}
                        options={["ذكر", "انثى"]}
                        values={["MALE", "FEMALE"]}
                        defaultValue={userData.gender}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-10">
                <Subtitle>الاهتمامات</Subtitle>

                <motion.div layout className="flex flex-wrap gap-2">
                    {selectedCatagories.map(category => (
                        <Catagory
                            onClick={() => {
                                if (selectedCatagories.length === 1) {
                                    return;
                                }
                                setSelectedCatagories(prevState => {
                                    return prevState.filter(
                                        t => t !== category
                                    );
                                });
                            }}
                            selected={selectedCatagories.includes(category)}
                            checked
                            active
                            key={category}
                        >
                            {category}
                        </Catagory>
                    ))}
                    <motion.div layout className="grid place-items-center">
                        <AddCatagoryDropdown
                            onCatagorySelect={(catagory: string) => {
                                if (selectedCatagories.includes(catagory)) {
                                    return;
                                }
                                setSelectedCatagories(prevState => [
                                    ...prevState,
                                    catagory,
                                ]);
                            }}
                        />
                    </motion.div>
                </motion.div>
                <motion.div layout>
                    {formError.length > 0 && (
                        <motion.div
                            layout
                            animate={{ y: 0, opacity: 1 }}
                            initial={{ y: 12, opacity: 0 }}
                            transition={{ delay: 0.225 }}
                            className="text-red-500 text-center mt-5"
                        >
                            {getError()}
                        </motion.div>
                    )}
                    <motion.div layout className="flex justify-between">
                        <LoadingWapper isLoading={isLoading}>
                            <Link
                                href={"/account"}
                                className="bg-transparent text-custom-gray hover:text-white hover:bg-black px-3 py-2 rounded-3xl transition-colors"
                            >
                                الغاء
                            </Link>
                            <Button gradient className="shadow-xl px-9 ">
                                تثبيت
                            </Button>
                        </LoadingWapper>
                    </motion.div>
                </motion.div>
            </div>
        </form>
    );
}
