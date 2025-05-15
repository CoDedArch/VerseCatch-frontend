import { tourSteps } from "@/shared/constants/varConstants";
import ProfileMenu from "./ProfileMenu";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import BlurImage from "./ImageBlur";

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
    <div
      className={`${
        tourState.isTourActive && tourState.currentStep === 2
          ? "z-[10000] text-white"
          : ""
      }`}
    >
      {/* Show Profile Button (hidden when menu is visible) */}
      {!isMenuVisible && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          aria-label="Show profile panel"
          onClick={toggleMenuVisibility}
          className={`w-10 h-40 sm:h-14 sm:w-14 fixed z-[10000] sm:hidden -right-3 backdrop-blur-sm top-[140px] bg-slate-300/50 p-1 rounded-2xl cursor-pointer hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/5 ${
            tourState.isTourActive && tourState.currentStep === 2
              ? "z-[10002]"
              : ""
          }`}
        >
          <BlurImage
            src="/assets/swipe-left.png"
            alt="slide left"
            className="w-full pointer-events-none sm:hidden"
            isIcon={true}
          />
        </motion.button>
      )}

      {/* Main Profile Section */}
      <section
        className={`fixed sm:relative right-0 top-20 sm:top-0 z-[9998] ${
          tourState.isTourActive && tourState.currentStep === 2
            ? "z-[10000]"
            : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: isMenuVisible ? 1 : 0,
            x: isMenuVisible ? 0 : 20,
          }}
          transition={{ duration: 0.3 }}
          className={`relative ${isMenuVisible ? "block" : "hidden sm:block"}`}
          style={{ backgroundColor: "inherit" }}
        >
          {/* Hide Menu Button */}
          {isMenuVisible && (
            <motion.button
              onClick={toggleMenuVisibility}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              aria-label="Hide menu panel"
              className={`w-10 sm:w-14 bg-slate-200/50 block sm:hidden absolute top-1/2 -left-20 p-1 rounded-full cursor-pointer hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                tourState.isTourActive && tourState.currentStep === 2
                  ? "z-[10001] "
                  : ""
              }`}
            >
              <BlurImage
                src="/assets/slide.png"
                alt="hide"
                className="w-full pointer-events-none"
                isIcon={true}
              />
            </motion.button>
          )}
          {/* Profile Content */}
          <div
            className={`gap-5 no-highlight relative flex flex-col sm:flex-row right-2 top-[55px] sm:top-0 ${
              isMenuVisible
                ? "bg-white/50 rounded-2xl backdrop-blur-lg sm:bg-inherit"
                : ""
            }`}
          >
            {/* Tour Step 2 Highlight */}
            {tourState.isTourActive && tourState.currentStep === 2 && (
              <>
                {/* Full-screen overlay */}
                <div className="fixed inset-0 pointer-events-none z-[10001]" />

                {/* Tooltip */}
                <div
                  id="profile-section"
                  className="fixed right-20 sm:right-4 top-24 w-[20em] text-sm sm:text-base p-4 flex flex-col items-center text-white text-center rounded-lg z-[10002]"
                >
                  <BlurImage
                    isIcon={true}
                    src="/assets/pointer.png"
                    alt="hand up"
                    className={`animate-move-up-down w-10 sm:w-20 ${
                      window.innerWidth < 640 ? "rotate-90" : ""
                    }`}
                  />
                  {tourSteps[2].description}
                </div>
              </>
            )}

            {/* User Tag */}
            <p
              style={{
                backgroundImage: "url('/assets/fr.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                background: user?.payment_status?.is_supporter
                  ? "linear-gradient(135deg, rgba(106, 44, 112, 0.9), rgba(168, 50, 121, 0.7))"
                  : "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
              }}
              className={`self-center p-1 rounded-2xl relative transition-all duration-300 ${
                user?.payment_status?.is_supporter
                  ? "border border-purple-300"
                  : ""
              }`}
            >
              <span
                className={`p-2 rounded-2xl text-sm relative -top-3 shadow-lg transition-all duration-300 ${
                  user?.payment_status?.is_supporter
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                    : "bg-white text-black"
                }`}
              >
                {user?.current_tag || "Newbie"}
                {user?.payment_status?.is_supporter && (
                  <span className="ml-1">✨</span>
                )}
              </span>
            </p>

            {/* Faith Coins */}
            <div className="flex items-center gap-1">
              <BlurImage
                src="/assets/coin.png"
                alt="coin"
                className={`w-8 ${"animate-coin"}`}
                isIcon={true}
              />
              <span className="text-sm">{user?.faith_coins}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1">
              <BlurImage
                src="/assets/fire.png"
                alt="fire"
                className="w-8"
                priority={true}
                isIcon={true}
              />
              <span className="text-sm">{user?.streak}</span>
            </div>

            {/* Profile Button */}
            <button
              ref={profileButtonRef}
              className={` bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg flex items-center hover:cursor-pointer transition-all ${
                tourState.isTourActive && tourState.currentStep === 2
                  ? "ring-4 ring-yellow-400 z-[10003]"
                  : ""
              }`}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <BlurImage
                src="/assets/profile.png"
                alt="Profile"
                className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
                isIcon={true}
              />

              <span className="p-3 font-bold">
                {user?.user_name
                  ? user.user_name.split(" ").length === 1
                    ? user.user_name
                    : user.user_name
                        .split(" ")
                        .map((name) => name[0]?.toUpperCase())
                        .join("")
                  : ""}
              </span>
            </button>
          </div>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <ProfileMenu
              onClose={handleCloseProfileMenu}
              triggerRef={profileButtonRef}
            />
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default ProfileSection;
