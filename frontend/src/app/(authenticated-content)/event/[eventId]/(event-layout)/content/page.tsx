import { FileIcon } from "lucide-react";
import Image from "next/image";
import getMaterialsAction from "@/proxy/material/get-material-action";
import isEventPresenterAction from "@/proxy/user/is-event-presenter-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import AddMaterial from "@/components/authenticated-content/event/event-layout/add-material";
import DeleteMaterial from "@/components/authenticated-content/event/event-layout/delete-material";

type Material = {
    materialId: string;
    materialUrl: string;
    createdAt: string;
};

export default async function ContentPage({
    params,
}: {
    params: { eventId: string };
}) {
    const materials: Material[] = await getMaterialsAction(params.eventId);

    const cookiesStore = cookies();
    const token = cookiesStore.get("token");
    if (!token) {
        redirect("/signin");
    }
    const loggedUser: UserDataDto = await getProfileAction();
    const isPresenter: boolean = await isEventPresenterAction(
        params.eventId,
        loggedUser.username
    );

    return (
        <div>
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <FileIcon className="text-custom-light-purple" size={32} />
                محتوى الفعالية
            </h1>
            <div className="flex flex-wrap gap-4 mt-10">
                {materials.length === 0 && !isPresenter && (
                    <p className="p-2 text-custom-gray">
                        لا يوجد محتوى للفعالية
                    </p>
                )}
                {materials.map(material => (
                    <div
                        key={material.materialId}
                        className="bg-white rounded-lg shadow-md gap-2 w-48 h-48 transition-all relative"
                    >
                        {isPresenter && (
                            <DeleteMaterial materialId={material.materialId} />
                        )}
                        <div className="w-full h-full grid place-items-center">
                            <div className="grid place-items-center">
                                <FileIcon
                                    className="text-custom-light-purple"
                                    size={32}
                                />
                                <div>
                                    <p className="font-semibold text-lg">
                                        مادة تعليمية
                                    </p>
                                    <p className="text-custom-gray text-sm">
                                        {new Date(
                                            material.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                                <a className="bg-custom-gradient bottom-2 left-2 text-white py-2 px-4 rounded-3xl absolute hover:scale-105 transition-transform font-bold" href={material.materialUrl} target="_blank">
                                    عرض
                                </a>
                        </div>
                    </div>
                ))}
                {isPresenter && <AddMaterial eventId={params.eventId} />}
            </div>
        </div>
    );
}
