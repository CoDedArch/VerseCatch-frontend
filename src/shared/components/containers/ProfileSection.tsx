import { tourSteps } from "@/shared/constants/varConstants";
import ProfileMenu from "./ProfileMenu";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";

const ProfileSection = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const tourState = useSelector((state: RootState) => state.tour);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const toggleMenuVisibility = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const handleCloseProfileMenu = () => {
    setShowProfileMenu(false);
  };

  return (
    <>
      {!isMenuVisible && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          aria-label="Show task panel"
          onClick={toggleMenuVisibility}
          className="w-10 h-40 sm:h-14 sm:w-14 fixed z-[100] sm:hidden -right-6 backdrop-blur-sm top-[140px] bg-slate-300/50 p-1  rounded-2xl cursor-pointer hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/5"
        >
          <img
            src="/assets/swipe-left.png"
            alt="slide left"
            className="w-full pointer-events-none sm:hidden"
          />
        </motion.button>
      )}
      <motion.section
        initial={{ opacity: 0 , x: 20 }}
        animate={{ opacity: isMenuVisible ? 1 : 0, x: isMenuVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className={`absolute sm:static right-3 top-20 ${
          isMenuVisible ? "block" : "hidden sm:block"
        }`}
        style={{
          backgroundColor: "inherit",
          zIndex:
        tourState.isTourActive && tourState.currentStep === 2
          ? 10000
          : "auto",
        }}
      >
        <motion.button
          onClick={toggleMenuVisibility}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          aria-label="Hide menu panel"
          className="w-10 sm:w-14 bg-slate-200/50 block sm:hidden absolute top-1/2 -left-20 p-1 rounded-full cursor-pointer hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <img
            src="/assets/slide.png"
            alt="hide"
            className="w-full pointer-events-none"
          />
        </motion.button>
        <div
          key={user?.id}
          className={`gap-5 no-highlight ${
            user
              ? "flex flex-col sm:flex-row right-2 top-[55px] sm:top-0"
              : "hidden"
          } ${
            tourState.isTourActive && tourState.currentStep === 2
              ? "text-white z-[10000]"
              : ""
          }`}
        >
          {tourState.isTourActive && tourState.currentStep === 2 && (
            <div id="profile-section">
              <div className="absolute right-0 w-[20em] p-2 top-[5em] flex flex-col text-xl items-center text-white text-center">
                <img
                  src="/assets/pointer.png"
                  alt="hand up"
                  className="animate-move-up-down"
                />
                {tourSteps[2].description}
              </div>
            </div>
          )}
          <p
            style={{
              backgroundImage: "url('/assets/fr.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              background:
                "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
            }}
            className="self-center p-1 rounded-2xl relative shadow-black shadow-2xl"
          >
            <span className="bg-white text-black p-2 rounded-2xl text-sm relative -top-3 shadow-black shadow-2xl">
              {user?.current_tag || "Newbie"}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <img
              src="/assets/coin.png"
              alt="coin"
              className={`w-8 ${"animate-coin"}`}
            />{" "}
            <span className="text-sm">{user?.faith_coins}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src="/assets/fire.png" alt="fire" className="w-8" />{" "}
            <span className="text-sm">{user?.streak}</span>
          </div>
          <button
            ref={profileButtonRef}
            className="profile-button bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg flex items-center hover:cursor-pointer transition-all"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
          >
            <img
              src="/assets/profile.png"
              alt="Bible Version"
              className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
            />
            <span className="p-3 font-bold">
              {user?.user_name
                ?.split(" ")
                .map((name) => name[0]?.toUpperCase())
                .join("") || ""}
            </span>
          </button>
        </div>

        {showProfileMenu && (
          <ProfileMenu
            onClose={handleCloseProfileMenu}
            triggerRef={profileButtonRef}
          />
        )}
      </motion.section>
    </>
  );
};

export default ProfileSection;
