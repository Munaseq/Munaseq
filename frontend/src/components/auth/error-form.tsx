import Link from "next/link";
import Button from "../common/buttons/button";

export default function ErrorForm({message}: {message?: string}) {
    return (
        <div
            className="w-full grid gap-5"
        >
            <h1 className="font-bold text-3xl text-center"> حدث خطأ ما</h1>
            <p>حدث خطأ اثناء التسجيل الرجاء المحاولة مره اخرى في وقت لاحق</p>
            <Link href={"/"}>
                <Button className="shadow-xl w-full">العودة الى الصفحة الرئيسية</Button>
            </Link>
        </div>
    );
}
