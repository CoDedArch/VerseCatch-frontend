import { FC } from "react";
import ProfileSection from "../presentation/ProfileSection";
import { tourSteps } from "@/shared/constants/varConstants";
import { HeaderInterface } from "../../constants/interfaceConstants";

const Header: FC<HeaderInterface> = ({
  tourState,
  selectedVersion,
  userData,
}) => {
  
  return (
    <section
      className={`"bg-slate-100 font-bold text-2xl relative flex items-center justify-center ${
        userData
          ? ""
          : `${userData ? "" : `${!userData ? "" : "sm:justify-between"}`} `
      }  w-full`}
    >
      {/* Version Display */}
      {selectedVersion && (
        <div
          className={`absolute hidden left-10 sm:ml-2 sm:left-2 top-[21em] sm:top-0 font-bold text-lg sm:flex items-center sm:gap-2 ${
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

      <ProfileSection
        userData={userData}
        tourState={tourState}
      />
    </section>
  );
};

export default Header;
