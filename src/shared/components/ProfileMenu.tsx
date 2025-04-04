import { FC } from "react";
import { ProfileMenuInterface } from "../constants/constants";

const ProfileMenu: FC<ProfileMenuInterface> = ({
  profileMenuRef,
  selectedTheme,
  setShowSettingsModal,
  setShowProfileMenu,
  setShowAboutModal,
  setShowHelpModal,
  setShowChangePasswordModal,
  setIntroComplete,
  setUserIsLoggedIn,
}) => {
  const handleSignOut = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("username");
    localStorage.removeItem("bible_version");

    // Reset state
    setUserIsLoggedIn(false);
    setIntroComplete(false);
    setShowProfileMenu(false);

    // You might want to redirect to the home page or login page
    window.location.reload();
  };

  return (
    <div
      ref={profileMenuRef}
      className={`${
        selectedTheme?.display_name === "Twilight" ||
        selectedTheme?.display_name === "Dark Night"
          ? "bg-slate-100"
          : "bg-slate-500/20"
      } absolute right-1 w-fit top-20 rounded-lg p-2`}
    >
      <ul className="space-y-5">
        <li
          className=" hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
          onClick={() => {
            setShowSettingsModal(true);
            setShowProfileMenu(false);
          }}
        >
          <img
            src="/assets/setting.png"
            alt="Settings"
            className="w-5 sm:w-5"
          />
          <span className="bg-slate-400/10">Settings</span>
        </li>
        <li
          className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
          onClick={() => {
            setShowAboutModal(true);
            setShowProfileMenu(false);
          }}
        >
          <img src="/assets/about.png" alt="About" className="w-5 sm:w-5" />
          <span className="bg-slate-400/10">About</span>
        </li>
        <li
          className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
          onClick={() => {
            setShowHelpModal(true);
            setShowProfileMenu(false);
          }}
        >
          <img src="/assets/help.png" alt="Get Help" className="w-5 sm:w-5" />
          <span className="bg-slate-400/10">Get Help</span>
        </li>

        <li
          className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
          onClick={() => {
            setShowChangePasswordModal(true);
            setShowProfileMenu(false);
          }}
        >
          <img
            src="/assets/setting.png"
            alt="Change Password"
            className="w-5 sm:w-5"
          />
          <span className="bg-slate-400/10">Change Password</span>
        </li>
        <li
          className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
          onClick={handleSignOut}
        >
          <img src="/assets/out.png" alt="Sign Out" className="w-5 sm:w-5" />
          <span className="bg-slate-400/10">Sign Out</span>
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu;
