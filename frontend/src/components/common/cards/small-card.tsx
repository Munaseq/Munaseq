import Image from "next/image";
import Button from "@/components/common/buttons/button";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";
import { UserDataDto } from "@/dtos/user-data.dto";
import { CalendarDaysIcon, UserRoundIcon } from "lucide-react";

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
  image: StaticImport | string;
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

  return (
    <div className="max-w-[340px] w-full min-h-[350px] bg-white border border-gray-200 rounded-3xl shadow-lg relative">
      <div className="p-0 relative h-40">
        
         
            <Image
              className="rounded-t-3xl object-cover"
              src={image}
              fill
              sizes="100%"
              alt={title}
              priority
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

        <h5 className="my-2 text-2xl font-bold tracking-tight text-custom-black">
          {title} 
        </h5>

     
          <div className="flex gap-5 mb-3 font-medium items-center">
            {/* <div className="flex gap-2 items-center">
                        <Image src={timeIcon} alt="" />
                        <p className="bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent text-base">
                            {time}
                        </p>
                    </div> */}
            <div className="flex gap-2 items-center">
              <CalendarDaysIcon color="var(--custom-light-purple)" />
              <p className="bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent text-base">
                {date}
              </p>
            </div>
          </div>
     

    
          <div className="flex gap-5 font-medium items-center">
            <div className="flex gap-2">
              <UserRoundIcon className="text-custom-light-purple"/>
              <Link
                href={"/user/" + eventCreator.username}
                className="bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent text-base"
              >
                {eventCreator.firstName + " " + eventCreator.lastName}
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              {/* <Image src={rateIcon} alt="" />
                        <p className="bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent text-base">
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
