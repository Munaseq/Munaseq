'use client';

import plusIcon from '@/assets/icons/plus-circle.svg';
import { catagories } from '@/util/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../shadcn-ui/dropdown-menu';
import Image from 'next/image';

export default function addCatagoryDropdown({
  onCatagorySelect,
}: {
  onCatagorySelect: (catagory: string) => void;
}) {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="absoulte left-2">
        <div className="flex gap-1 px-3">
          <span>اضافة</span>{' '}
          <Image className="w-5 h-5" src={plusIcon} alt="add icon" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white relative p-0 h-56 overflow-auto ">
        {catagories.map((catagory) => (
          <div
          key={catagory}
            onClick={() => onCatagorySelect(catagory)}
            className="flex gap-3 items-center p-3 transition-colors hover:bg-[#ebebeb] cursor-pointer"
          >
            {catagory}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
