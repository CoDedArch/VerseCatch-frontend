import ProfileSection from "./ProfileSection";
import { tourSteps } from "@/shared/constants/varConstants";
// import { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import CreateAccount from "./CreatAccount";

const Header = () => {
  const { selectedVersion, receivedData } = useSelector((state: RootState) => state.ui);
  const tourState = useSelector((state: RootState) => state.tour);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { isLoggedIn, isAnonymous } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <section
      className={`${
      theme.display_name === "Dark Night" || theme.display_name === "Twilight"
        ? "bg-slate-100"
        : ""
      } font-bold text-2xl relative flex items-center justify-center sm:justify-between w-full`}
    >
      {selectedVersion && !receivedData && (
      <div
        className={`font-bold text-lg hidden sm:flex items-center sm:gap-2 lg:w-1/2 no-highlight  ${
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
      <div className={`flex items-center no-highlight ${receivedData ? "justify-center sm:flex-1" : "justify-center sm:w-1/2"} `}>
      <img
        src="/assets/book.png"
        alt="Bible"
        className={`w-14 pointer-events-none ${receivedData ? "sm:ml-60" : "ml-0"}`}
      />{" "}
      VerseCatch
      </div>

      {isAnonymous && (
      <div className={`hidden sm:flex ${receivedData ? "w-fit" : "w-1/2"} justify-end`}>
        <CreateAccount />
      </div>
      )}

      {isLoggedIn && (
      <div
        className={`transition-opacity duration-300  flex justify-end ${
        receivedData ? "sm:opacity-100 w-fit z-[1000]" : "opacity-100 sm:w-1/2 z-[1000]"
        }`}
      >
        <ProfileSection />
      </div>
      )}
    </section>
  );
};

export default Header;
