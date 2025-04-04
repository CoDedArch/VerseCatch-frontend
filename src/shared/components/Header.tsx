import { FC } from "react";
import { useState, useEffect, useRef } from "react";
import PasswordModal from "./PasswordModal";
import AboutModal from "./AboutModal";
import HelpModal from "./HelpModal";
import SettingsModal from "./SettingsModal";
import ProfileMenu from "./ProfileMenu";
import ProfileSection from "./ProfileSection";
import { Theme, ThemeStyles, HeaderInterface } from "../constants/constants";

const Header: FC<HeaderInterface> = ({
  userIsLoggedIn,
  receivedData,
  isTourActive,
  selectedVersion,
  currentStep,
  tourSteps,
  userData,
  animate,
  setIntroComplete,
  setUserIsLoggedIn,
  onThemeChange,
}) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleThemeChange = (themeStyles: ThemeStyles, theme: Theme | null) => {
    setSelectedTheme(theme);
    onThemeChange(themeStyles, theme);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node)
    ) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      className={`${
        selectedTheme?.display_name === "Twilight" ||
        selectedTheme?.display_name === "Dark Night"
          ? "bg-slate-100"
          : ""
      } font-bold text-2xl relative flex items-center justify-center ${
        userIsLoggedIn
          ? ""
          : `${
              receivedData
                ? ""
                : `${!userIsLoggedIn ? "" : "sm:justify-between"}`
            } `
      }  w-full`}
    >
      {/* Version Display */}
      {!receivedData && (
        <div
          className={`absolute hidden left-10 sm:ml-2 sm:left-2 top-[21em] sm:top-0 font-bold text-lg sm:flex items-center sm:gap-2 ${
            isTourActive ? "text-white" : ""
          }`}
        >
          <img
            src={`/assets/${isTourActive ? "version2.png" : "version.png"}`}
            alt="Bible Version"
            className="w-8 sm:w-14"
          />
          <span className="bg-slate-400/10 p-3">
            {selectedVersion || "Bible version"}
          </span>
          {isTourActive && currentStep === 1 && (
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

      {/* Profile Button */}
      <ProfileSection
        userData={userData}
        isTourActive={isTourActive}
        animate={animate}
        currentStep={currentStep}
        tourSteps={tourSteps}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
      />

      {/* Profile Menu */}
      {userIsLoggedIn && showProfileMenu && (
        <ProfileMenu
          profileMenuRef={profileMenuRef}
          selectedTheme={selectedTheme}
          setShowSettingsModal={setShowSettingsModal}
          setShowProfileMenu={setShowProfileMenu}
          setShowAboutModal={setShowAboutModal}
          setShowHelpModal={setShowHelpModal}
          setShowChangePasswordModal={setShowChangePasswordModal}
          setIntroComplete={setIntroComplete}
          setUserIsLoggedIn={setUserIsLoggedIn}
        />
      )}

      {showChangePasswordModal && (
        <PasswordModal
          setShowChangePasswordModal={setShowChangePasswordModal}
        />
      )}
      {showAboutModal && <AboutModal setShowAboutModal={setShowAboutModal} />}
      {showHelpModal && <HelpModal setShowHelpModal={setShowHelpModal} />}

      {showSettingsModal && (
        <SettingsModal
          userIsLoggedIn={userIsLoggedIn}
          isTourActive={isTourActive}
          showProfileMenu={showProfileMenu}
          selectedVersion={selectedVersion}
          userData={userData}
          setShowSettingsModal={setShowSettingsModal}
          showSettingsModal={showSettingsModal}
          onThemeChange={handleThemeChange}
          setShowProfileMenu={setShowProfileMenu}
        />
      )}
    </section>
  );
};

export default Header;
