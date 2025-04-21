import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/common/buttons/button";
import logo from "@/assets/logo/munaseq-logo.svg";

export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6">
                <Image
                    src={logo}
                    alt="Munaseq logo"
                    className="w-36 sm:w-48 md:w-52 lg:w-64 mb-8"
                />

                <h1 className="text-custom-black text-5xl  font-bold text-center">
                    <span className="bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent">
                        404
                    </span>{" "}
                    - الفعالية غير موجودة
                </h1>

                <p className="text-gray-500 text-md sm:text-lg md:text-xl text-center px-4 sm:px-8 lg:px-16">
                    حدث خطا
                </p>

                <Link href="/discover">
                    <Button gradient>العودة إلى الصفحة الرئيسية</Button>
                </Link>
            </div>
        </div>
    );
}
