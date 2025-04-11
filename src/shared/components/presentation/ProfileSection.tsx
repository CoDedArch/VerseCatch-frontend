import { FC } from "react";
import { ProfileSectionInterface } from "../../constants/interfaceConstants";
import { tourSteps } from "@/shared/constants/varConstants";
import ProfileMenu from "./ProfileMenu";

import { useState } from "react";

const ProfileSection: FC<ProfileSectionInterface> = ({
  userData,
  tourState,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      <div
        key={userData?.id}
        className={`gap-5 ${
          userData ? "flex absolute right-2 top-[55px] sm:top-0" : "hidden"
        } ${tourState.isTourActive ? "text-white" : ""}`}
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
            {userData?.current_tag || "Newbie"}
          </span>
        </p>
        <div className="flex items-center gap-1">
          <img
            src="/assets/coin.png"
            alt="coin"
            className={`w-8 ${"animate-coin"}`} // fix animation for coin later
          />{" "}
          <span className="text-sm">{userData?.faith_coins}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/assets/fire.png" alt="fire" className="w-8" />{" "}
          <span className="text-sm">{userData?.streak}</span>
        </div>
        <button
          className="profile-button absolute sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg sm:flex items-center hidden hover:cursor-pointer transition-all"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img
            src="/assets/profile.png"
            alt="Bible Version"
            className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
          />
          <span className="p-3 font-bold">
            {userData?.first_name?.[0]?.toUpperCase() || ""}{" "}
            {userData?.last_name?.[0]?.toUpperCase() || ""}
          </span>
        </button>
      </div>

      {showProfileMenu && <ProfileMenu/>}
    </>
  );
};

export default ProfileSection;
