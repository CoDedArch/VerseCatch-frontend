import { useState, useRef } from "react";
import PasswordModal from "../containers/PasswordModal";
import AboutModal from "./AboutModal";
import HelpModal from "./HelpModal";
import SettingsModal from "../containers/SettingsModal";

const ProfileMenu = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("username");
    localStorage.removeItem("bible_version");
    window.location.reload();
  };

  return (
    <>
      <div
        ref={profileMenuRef}
        className={`bg-slate-500/20 absolute right-1 w-fit top-20 rounded-lg p-2`}
      >
        <ul className="space-y-5">
          <li
            className=" hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
            onClick={() => {
              setShowSettingsModal(true);
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
            }}
          >
            <img src="/assets/about.png" alt="About" className="w-5 sm:w-5" />
            <span className="bg-slate-400/10">About</span>
          </li>
          <li
            className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
            onClick={() => {
              setShowHelpModal(true);
            }}
          >
            <img src="/assets/help.png" alt="Get Help" className="w-5 sm:w-5" />
            <span className="bg-slate-400/10">Get Help</span>
          </li>

          <li
            className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer"
            onClick={() => {
              setShowChangePasswordModal(true);
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
      {showChangePasswordModal && <PasswordModal />}
      {showAboutModal && <AboutModal />}
      {showHelpModal && <HelpModal />}
      {showSettingsModal && <SettingsModal />}
    </>
  );
};

export default ProfileMenu;
