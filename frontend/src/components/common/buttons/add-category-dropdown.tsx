'use client';

import { catagories } from '@/util/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../shadcn-ui/dropdown-menu';
import { PlusCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function addCatagoryDropdown({
  onCatagorySelect,
}: {
  onCatagorySelect: (catagory: string) => void;
}) {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="absoulte left-2">
        <motion.div layout  className="flex gap-1 px-3 items-center">
          <span>اضافة</span>{' '}
          <PlusCircleIcon/>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white relative p-0 h-50">
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
