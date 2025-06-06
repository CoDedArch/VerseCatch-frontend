import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordModal from "./PasswordModal";
import AboutModal from "./AboutModal";
import HelpModal from "./HelpModal";
import SettingsModal from "./SettingsModal";
import { ProfileMenuProps } from "@/shared/constants/interfaceConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BlurImage from "./ImageBlur";
// import DeleteAccount from "./DeleteAccount";

const ProfileMenu = ({ onClose, triggerRef }: ProfileMenuProps) => {
  const [settingsKey, setSettingsKey] = useState(0);
  const [activeModal, setActiveModal] = useState<
    null | "password" | "about" | "help" | "settings"
  >(null);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menu (only when no modals are open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !activeModal &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, triggerRef, activeModal]);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("username");
    localStorage.removeItem("bible_version");
    window.location.reload();
  };

  const openModal = (modalType: typeof activeModal) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={profileMenuRef}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`${
            theme.display_name === "Dark Night" ||
            theme.display_name === "Twilight" ||
            theme.display_name === "Royal Purple"
              ? "bg-slate-100"
              : "bg-slate-500/20"
          }  absolute right-1 sm:top-20 w-[200px] sm:w-fit rounded-lg p-2 backdrop-blur-sm z-[1000] shadow-lg no-highlight`}
        >
          <ul className="space-y-3 z-[1000]">
            <motion.li
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer"
              onClick={() => openModal("settings")}
            >
              <BlurImage
                src="/assets/setting.png"
                alt="Settings"
                className="w-5 sm:w-5 pointer-events-none"
                isIcon={true}
              />
              <span className="bg-slate-400/10 p-1 rounded">Settings</span>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer"
              onClick={() => openModal("about")}
            >
              <BlurImage
                src="/assets/about.png"
                alt="About"
                className="w-5 sm:w-5 pointer-events-none"
                isIcon={true}
              />
              <span className="bg-slate-400/10 p-1 rounded">About</span>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer"
              onClick={() => openModal("help")}
            >
              <BlurImage
                src="/assets/help.png"
                alt="Get Help"
                className="w-5 sm:w-5 pointer-events-none"
                isIcon={true}
              />
              <span className="bg-slate-400/10 p-1 rounded">Get Help</span>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer"
              onClick={() => openModal("password")}
            >
              <BlurImage
                src="/assets/key.png"
                alt="Change Password"
                className="w-5 sm:w-5 pointer-events-none"
                isIcon={true}
              />
              <span className="bg-slate-400/10 p-1 rounded">
                Change Password
              </span>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/50 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer text-blue-500/90"
              onClick={handleSignOut}
            >
              <BlurImage
                src="/assets/out.png"
                alt="Sign Out"
                className="w-5 sm:w-5 pointer-events-none"
                isIcon={true}
              />
              <span className="bg-slate-400/10 p-1 rounded">Sign Out</span>
            </motion.li>
            {/* <DeleteAccount /> */}
          </ul>
        </motion.div>
      </AnimatePresence>
      {/* Modal Components */}
      <PasswordModal isOpen={activeModal === "password"} onClose={closeModal} />
      <AboutModal isOpen={activeModal === "about"} onClose={closeModal} />
      <HelpModal isOpen={activeModal === "help"} onClose={closeModal} />
      {activeModal === "settings" && (
        <SettingsModal isOpen={true} onClose={closeModal} key={settingsKey} setSettingsKey={setSettingsKey} />
      )}
    </>
  );
};

export default ProfileMenu;
