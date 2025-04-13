import { FC } from "react";
import ProfileSection from "../presentation/ProfileSection";
import { tourSteps } from "@/shared/constants/varConstants";
import { HeaderInterface } from "../../constants/interfaceConstants";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Header: FC<HeaderInterface> = ({
  tourState,
  selectedVersion,
  userData,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleConvertToAccount = () => {
    // Clear anonymous flag
    localStorage.removeItem("isAnonymous");
    localStorage.removeItem("username");

    // Redirect to signup page
    // navigate('/signup');
    window.location.href = "/";
  };

  useEffect(() => {
    setIsAnonymous(localStorage.getItem("isAnonymous") === "true");
  }, []);

  return (
    <section
      className={`"bg-slate-100 font-bold text-2xl relative flex items-center justify-center sm:justify-between w-full`}
    >
      {/* Version Display */}
      {selectedVersion && (
        <div
          className={`top-[21em] sm:top-0 font-bold text-lg sm:flex items-center sm:gap-2 ${
            tourState.isTourActive ? "text-white" : ""
          }`}
        >
          <img
            src={`/assets/${
              tourState.isTourActive ? "version2.png" : "version.png"
            }`}
            alt="Bible Version"
            className="w-8 sm:w-14"
          />
          <span className="bg-slate-400/10 p-3">
            {selectedVersion || "Bible version"}
          </span>
          {tourState.isTourActive && tourState.currentStep === 1 && (
            <div id="version-section">
              <div className="absolute -right-[20em] w-[20em] text-xl font-bold p-2 -top-1 text-white">
                <img
                  src="/assets/left.png"
                  alt="hand left"
                  className="animate-move-left-right"
                />
                {tourSteps[1].description}
              </div>
            </div>
          )}
        </div>
      )}

      {/* App Title */}
      <div className="flex items-center">
        <img src="/assets/book.png" alt="Bible" className="w-14" /> VerseCatch
      </div>

      {isAnonymous && (
        <motion.li
          whileHover={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
          className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer"
          onClick={handleConvertToAccount}
        >
          <img src="/assets/user.png" alt="Upgrade" className="w-5 sm:w-5" />
          <span className="bg-slate-400/10 p-1 rounded">Create Account</span>
        </motion.li>
      )}

      <ProfileSection userData={userData} tourState={tourState} />
    </section>
  );
};

export default Header;
