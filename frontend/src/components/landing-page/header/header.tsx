import Button from "@/components/common/buttons/button";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/munaseq-logo.svg";
import smallWhiteLogo from "@/assets/logo/logo-small-white.svg";
import Menu from "./menu";

export default function Header() {
    return (
        <header className="absolute flex items-center rounded-full sm:px-5 px-2 py-5 justify-between w-full z-10">
            <div>
                <Link href={"/"}>
                    <Image
                        className="w-44 hidden md:block"
                        src={logo}
                        alt="logo"
                    />
                    <Image
                        className="w-12 md:hidden"
                        src={smallWhiteLogo}
                        alt="logo"
                    />
                </Link>
            </div>

            <div className="gap-2 sm:flex hidden">
                <Button className="bg-transparent border-white border hover:bg-white hover:!text-black">
                    <Link href={"/signin"}>تسجيل دخول</Link>
                </Button>
                <Button>
                    <Link href={"/signup"}>انشاء حساب</Link>
                </Button>
            </div>
            <Menu />
        </header>
    );
}
