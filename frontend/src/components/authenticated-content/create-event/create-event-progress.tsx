// 'use client'

// import user from "@/assets/auth-assets/icons/user.svg";
// import userCircle from "@/assets/auth-assets/icons/user-circle.svg";
// import check from "@/assets/auth-assets/icons/check-circle.svg";
// import tag from "@/assets/auth-assets/icons/tag.svg";
// import userGreen from "@/assets/auth-assets/icons/user-green.svg";
// import userCircleGreen from "@/assets/auth-assets/icons/user-circle-green.svg";
// import tagGreen from "@/assets/auth-assets/icons/tag-green.svg";
// import userGradient from "@/assets/auth-assets/icons/user-gradient.svg";
// import userCircleGradient from "@/assets/auth-assets/icons/user-circle-gradient.svg";
// import checkGradient from "@/assets/auth-assets/icons/check-circle-gradient.svg";
// import tagGradient from "@/assets/auth-assets/icons/tag-gradient.svg";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function CreateEventProgress(props: { step: number }) {
//     return (
//         <motion.div className="grid grid-cols-4 place-items-center gap-8 text-red-500">
//             <div>
//                 <motion.div animate={props.step > 1 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={userGreen}
//                         alt={"user green icon"}
//                         className="absolute w-12"
//                     />
//                 </motion.div>
//                 <motion.div animate={props.step === 1 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={userGradient}
//                         alt={"user Gradient icon"}
//                         className="w-12"
//                     />
//                 </motion.div>
//             </div>
//             <div>
//                 <motion.div animate={props.step > 2 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={userCircleGreen}
//                         alt={"profile green icon"}
//                         className="absolute w-12"
//                     />
//                 </motion.div>
//                 <motion.div animate={props.step === 2 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={userCircleGradient}
//                         alt={"profile gradient icon"}
//                         className="absolute w-12"
//                     />
//                 </motion.div>
//                 <motion.div animate={props.step < 2 ? {opacity: 1} : {opacity: 0}}>
//                     <Image src={userCircle} alt={"profile icon"} className="w-12" />
//                 </motion.div>
//             </div>
//             <div>
//                 <motion.div animate={props.step > 3 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={tagGreen}
//                         alt={"tag green icon"}
//                         className="absolute w-12"
//                     />
//                 </motion.div>
//                 <motion.div animate={props.step === 3 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={tagGradient}
//                         alt={"tag gradient icon"}
//                         className="absolute w-12"
//                     />
//                 </motion.div>
//                 <motion.div animate={props.step < 3 ? {opacity: 1} : {opacity: 0}}>
//                     <Image src={tag} alt={"tah icon"} className="w-12" />
//                 </motion.div>
//             </div>
//             <div>
//                 <motion.div animate={props.step >= 4 ? {opacity: 1} : {opacity: 0}}>
//                     <Image
//                         src={checkGradient}
//                         alt={"check gradient icon"}
//                         className="absolute w-12"
//                     />
//                 </motion.div>
//                 <motion.div animate={props.step < 4 ? {opacity: 1} : {opacity: 0}}>
//                     <Image src={check} alt={"check icon"} className="w-12" />
//                 </motion.div>
//             </div>
//         </motion.div>
//     );
// }
