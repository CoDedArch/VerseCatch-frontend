import { FC } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnonnymousSignUpInterface } from "../constants/interfaceConstants";

const AnonnymousSignUpCard: FC<AnonnymousSignUpInterface> = ({
  step,
  isWaitingForVerification,
  setShowAuthOptions,
  setShowVersions,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Detect if the device is a touch device
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  // Toggle tooltip visibility on touch devices

  const handleInfoClick = () => {
    if (isTouchDevice()) {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  const handleAuthOptionSelect = (option: string) => {
    if (option === "Anonymous") {
      setShowAuthOptions(false);
      setShowVersions(true);
    } else {
      setShowAuthOptions(false);
      setShowVersions(false);
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.9 }}
      className={`bg-white text-blue-500 h-fit ${
        isHovered ? "" : "self-center"
      } ${
        step === "details" || isWaitingForVerification ? "hidden" : ""
      } px-6 py-2 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-colors text-xl font-bold flex items-center gap-3 relative `}
      onHoverStart={() => !isTouchDevice() && setIsHovered(true)}
      onHoverEnd={() => !isTouchDevice() && setIsHovered(false)}
      onClick={() => handleAuthOptionSelect("Anonymous")}
    >
      Continue as Anonymous{" "}
      <img src="/assets/incognito.png" alt="incognito" className="w-10" />
      <motion.img
        src="/assets/info.png"
        alt="info"
        className="absolute w-8 -top-1 -left-2 cursor-pointer p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleInfoClick();
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isHovered || isTooltipVisible ? 1 : 0,
          y: isHovered || isTooltipVisible ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute gradient-bg-small-screen w-full text-white left-0 right-0 top-20  text-[16px] space-y-2 list-disc list-inside text-center`}
      >
        <li>Your activity will not be saved or synced across devices.</li>
        <li>
          You won't have access to personalized features like saved verses or
          reading plans.
        </li>
        <li>
          You can still explore the app and catch Bible verses in real-time.
        </li>
        <li>You can always create an account later to unlock full features.</li>
      </motion.ul>
    </motion.div>
  );
};

export default AnonnymousSignUpCard;
