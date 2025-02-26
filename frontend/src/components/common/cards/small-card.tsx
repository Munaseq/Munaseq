import dateIcon from "@/assets/icons/calender-outline.svg";
import timeIcon from "@/assets/icons/time-outline.svg";
import presenterIcon from "@/assets/icons/presenter-outline.svg";
import rateIcon from "@/assets/icons/star-outline.svg";
import Image from "next/image";
import Button from "@/components/common/buttons/button";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";
import { UserDataDto } from "@/dtos/user-data.dto";

export default function SmallCard({
  image,
  title,
  time,
  date,
  eventCreator,
  eventId,
  rate,
  cost,
  badges = [],
  isJoined = false,
}: {
  image: StaticImport;
  title: string;
  time?: string;
  date: string;
  eventCreator: UserDataDto;
  eventId: string;
  rate?: number;
  cost?: string;
  badges: string[];
  isJoined?: boolean;
}) {
  // const [cancelOrLeaveLoading, setCancelOrLeaveLoading] = useState(false);
  // const { toast } = useToast();
  // const leaveEvent = async () => {
  //   const res = await leaveEventAction(eventId);

  //   toast({
  //     duration: 5000,
  //     title: "تم الخروج من الفعالية",
  //   });
  // };
  // const cancelEvent = async () => {
  //   const res = await cancelEventAction(eventId);

  //   toast({
  //     duration: 5000,
  //     title: "تم الغاء الفعالية",
  //   });
  // };

 

  return (
    <div className="max-w-[340px] w-full min-h-[350px] bg-white border border-gray-200 rounded-3xl shadow-lg relative">
      <div className="p-0 relative h-40">
        
         
            <Image
              className="rounded-t-3xl object-cover"
              src={image}
              fill
              sizes="100%"
              alt=""
            />
            <div className="m-2 absolute top-0 flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-100 px-2.5 py-1 text-sm font-medium text-purple-800"
                >
                  {badge}
                </span>
              ))}
            </div>
      </div>

      <div className="p-5 pt-0 relative">
        {/* {(asEventCreator || asEventParticipant) && (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="absolute top-2 left-2 z-30">
              <Image src={dots} alt="options" className="shadow-" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white relative">
              {cancelOrLeaveLoading && <LogoLoading className="w-10" />}
              {asEventCreator && !cancelOrLeaveLoading && (
                <div
                  onClick={() => cancelEvent()}
                  className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                >
                  الغاء الفعالية{" "}
                  <Image src={signout} alt="user icon" className="w-8" />
                </div>
              )}
              {asEventParticipant && !cancelOrLeaveLoading && (
                <div
                  onClick={() => leaveEvent()}
                  className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                >
                  {" "}
                  الخروج من الفعالية{" "}
                  <Image src={signout} alt="user icon" className="w-8" />
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}

        <h5 className="my-2 text-2xl font-bold tracking-tight text-custom-black">
          title 
        </h5>

     
          <div className="flex gap-5 mb-3 font-medium items-center">
            {/* <div className="flex gap-2 items-center">
                        <Image src={timeIcon} alt="" />
                        <p className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent text-base">
                            {time}
                        </p>
                    </div> */}
            <div className="flex gap-2 items-center">
              <Image src={dateIcon} alt="" className="" />
              <p className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent text-base">
                {date}
              </p>
            </div>
          </div>
     

    
          <div className="flex gap-5 font-medium items-center">
            <div className="flex gap-2">
              <Image src={presenterIcon} alt="" className="" />
              <Link
                href={"/user/" + eventCreator.username}
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent text-base"
              >
                {eventCreator.firstName + " " + eventCreator.lastName}
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              {/* <Image src={rateIcon} alt="" />
                        <p className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent text-base">
                            {rate}
                        </p> */}
            </div>
          </div>
    

       
          <div className="flex items-center justify-between mt-6">
            <p className="text-2xl font-bold text-custom-black">{cost}</p>
            <Button gradient>
              <Link
                className="w-full h-full grid place-items-center"
                href={`/event/${eventId}${isJoined ? "/about" : ""}`}
              >
                التفاصيل
              </Link>
            </Button>
          </div>
    
      </div>
    </div>
  );
}
