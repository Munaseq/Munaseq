import Menu from "@/components/authenticated-content/menu";
import Image from "next/image";
import logo from "@/assets/logo/munaseq-logo.svg";
import Link from "next/link";
import Search from "@/components/authenticated-content/search";
import deco from "@/assets/auth-content-assets/deco.svg";
import MenuMobile from "@/components/authenticated-content/menu-mobile";
import logoSmall from "@/assets/logo/munaseq-icon-dark-lines.svg";
import { Toaster } from 'react-hot-toast';
import getProfileAction from "@/proxy/user/get-profile-action";

export default async function AuthContentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const data = await getProfileAction();

    return (
        <section className=" flex grid-cols-2 ">
            <div dir="ltr">
            <Toaster />

            </div>
            <div className="h-screen w-[22rem] lg:block hidden">
                <Menu profileData={data} />
            </div>
            <div className="relative flex-1 pb-10">
                <header className="flex items-center lg:justify-end justify-center lg:px-10 px-2 my-10 gap-2 w-full">
                    <div className="lg:hidden block">
                        <MenuMobile profileData={data} />
                    </div>
                    <Image
                        src={deco}
                        alt="deco"
                        className="absolute -right-32 top-0 -z-10 min-w-96 lg:block hidden"
                        priority
                    />
                    <Search />
                    <Link href="/" className="">
                        <Image
                            priority
                            className="w-52 2xl:block hidden "
                            src={logo}
                            alt="Munaseq logo"
                        />
                        <Image
                            priority
                            className="min-w-14 w-14 block 2xl:hidden "
                            src={logoSmall}
                            alt="Munaseq logo"
                        />
                    </Link>
                </header>
                <div className="xl:px-20 px-5">{children}</div>
                {/* <BottomNavigation /> */}
            </div>
        </section>
    );
}
