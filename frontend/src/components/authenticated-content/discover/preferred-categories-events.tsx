import getProfileAction from "@/proxy/user/get-profile-action";
import { UserDataDto } from "@/dtos/user-data.dto";
import CategoryEvents from "./category-events";
import EventListSection from "./event-list-section";
import Category from "@/components/common/category";

export default async function PreferredCategoriesEvents() {
    const user: UserDataDto = await getProfileAction();

    return (
        <>
            {user.categories.map(async (category) => {
                return (
                    <EventListSection
                        message={
                            <div className="flex gap-2 items-center">
                                من فئة
                                <Category notAnimate>{category}</Category>
                            </div>
                        }
                    >
                        <CategoryEvents category={category} />
                    </EventListSection>
                );
            })}
        </>
    );
}
