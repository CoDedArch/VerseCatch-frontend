import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { anonymousLogin } from "@/store/userSlice";

const AnonnymousSignUpCard = () => {
  const dispatch = useDispatch();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const handleInfoClick = () => {
    if (isTouchDevice()) {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  const handleAnonymousLogin = () => {
    dispatch(anonymousLogin());
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      whileTap={{ scale: 0.9 }}
      className={`bg-white text-blue-500 h-fit self-center px-6 py-2 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-transform transform hover:scale-105 text-xl font-bold flex items-center gap-3 relative`}
      onHoverStart={() => !isTouchDevice() && setIsHovered(true)}
      onHoverEnd={() => !isTouchDevice() && setIsHovered(false)}
      onClick={handleAnonymousLogin}
    >
      Continue as Anonymous{" "}
      <img src="/assets/incognito.png" alt="incognito" className="w-10" />
      <motion.img
        src="/assets/info.png"
        alt="info"
        className="absolute w-8 -top-1 -left-2 lg:hidden  cursor-pointer p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleInfoClick();
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {(isTooltipVisible || isHovered) && (
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 10,
          }}
          transition={{ duration: 0.3 }}
          className={`absolute gradient-bg-small-screen w-full text-white left-0 right-0 ${
            window.innerWidth < 768 ? "-top-60" : "top-full"
          } text-[16px] space-y-2 list-disc list-inside text-center pointer-events-none`}
        >
          <li>Your activity will not be saved or synced across devices.</li>
          <li>
            You will not get a feel of the VerseCatch Experience
          </li>
          <li>
            You can still explore the app and catch Bible verses, go for it.
          </li>
          <li>
            You can always create an account later to unlock full features.
          </li>
        </motion.ul>
      )}
    </motion.div>
  );
};

export default AnonnymousSignUpCard;
