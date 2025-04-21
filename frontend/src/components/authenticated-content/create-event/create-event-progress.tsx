import { motion } from "framer-motion";
import { ClockIcon, PuzzleIcon, TagIcon, UsersRoundIcon } from "lucide-react";

export default function CreateEventProgress(props: { step: number }) {
    return (
        <motion.div className="flex gap-10">
          
            <PuzzleIcon className=" transition-colors duration-500" color={props.step > 1 ? '#229602' : '#ae00fe' } size={40}/>
            <UsersRoundIcon className=" transition-colors duration-500" color={props.step > 2 ? '#229602' : props.step === 2 ? '#ae00fe' : '#939393' } size={40}/>
            <ClockIcon className=" transition-colors duration-500" color={props.step > 3 ? '#229602' : props.step === 3 ? '#ae00fe' : '#939393' } size={40}/>
            <TagIcon className=" transition-colors duration-500" color={props.step === 4 ? '#ae00fe' : '#939393' } size={40}/>
            
        </motion.div>
    );
}
