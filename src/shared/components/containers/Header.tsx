import ProfileSection from "./ProfileSection";
import { tourSteps } from "@/shared/constants/varConstants";
// import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { logout } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { setIntroComplete } from "@/store/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { selectedVersion } = useSelector((state: RootState) => state.ui);
  const tourState = useSelector((state: RootState) => state.tour);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { isLoggedIn, isAnonymous } = useSelector(
    (state: RootState) => state.user
  );

  const handleCreateAccount = () => {
    dispatch(setIntroComplete(false));
    dispatch(logout());
  };
  return (
    <section
      className={`${
        theme.display_name === "Dark Night" || theme.display_name === "Twilight"
          ? "bg-slate-100"
          : ""
      } font-bold text-2xl relative flex items-center justify-center sm:justify-between w-full`}
    >
      {selectedVersion && (
        <div
          className={`relative top-[21em] sm:top-0 font-bold text-lg sm:flex items-center sm:gap-2 no-highlight ${
            tourState.isTourActive && tourState.currentStep === 1
              ? "z-[10000] text-white"
              : ""
          }`}
        >
          <img
            src={`/assets/${
              tourState.isTourActive &&
              tourState.currentStep === 1 &&
              isLoggedIn
                ? "version2.png"
                : "version.png"
            }`}
            alt="Bible Version"
            className="w-8 sm:w-14 pointer-events-none"
          />
          <span className="bg-slate-400/10 p-3">
            {selectedVersion || "Bible version"}
          </span>

          {tourState.isTourActive && tourState.currentStep === 1 && (
            <div
              id="version-section"
              className="absolute left-full ml-4 w-[20em]"
            >
              <div className="bg-inherit rounded-lg p-4 text-white text-xl font-bold">
                <img
                  src="/assets/left.png"
                  alt="hand left"
                  className="animate-move-left-right pointer-events-none mb-2"
                />
                {tourSteps[1].description}
              </div>
            </div>
          )}
        </div>
      )}
      {/* App Title */}
      <div className="flex items-center no-highlight">
        <img
          src="/assets/book.png"
          alt="Bible"
          className="w-14 pointer-events-none"
        />{" "}
        VerseCatch
      </div>

      {isAnonymous && (
        <motion.li
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
          className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer no-highlight"
          onClick={handleCreateAccount}
        >
          <img src="/assets/user.png" alt="Upgrade" className="w-5 sm:w-5" />
          <span className="bg-slate-400/10 p-1 rounded">Create Account</span>
        </motion.li>
      )}

      {isLoggedIn && <ProfileSection />}
    </section>
  );
};

export default Header;
