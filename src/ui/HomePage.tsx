import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractionSection from "@/shared/InteractionSection";
import Introduction from "@/shared/Introduction";

const HomePage = () => {
  const [receivedData, setReceivedData] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>("KJV_bible"); // Default version
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State for profile menu visibility
  const profileMenuRef = useRef<HTMLDivElement | null>(null); // Ref for profile menu

  const parsedData = receivedData ? JSON.parse(receivedData)[0] : null;

  // Handle clicks outside the profile menu
  const handleClickOutside = (event: MouseEvent) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
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
    <main className="animated-gradient h-[100vh] xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-5">
      {/* Show the first version div only if there's no receivedData */}
      {!introComplete && (
        <Introduction
          onComplete={(version) => {
            setSelectedVersion(version); // Update the selected version
            setIntroComplete(true); // Mark introduction as complete
          }}
        />
      )}

      <section className="font-bold text-2xl relative flex items-center justify-center sm:justify-between w-full">
        {/* Profile Menu */}
        {showProfileMenu && (
          <div
            ref={profileMenuRef}
            className="bg-slate-500/20 absolute right-1 w-fit top-20 rounded-lg p-2"
          >
            <ul className="space-y-5">
              <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2">
                <img
                  src="/assets/setting.png"
                  alt="Settings"
                  className="w-5 sm:w-5"
                />
                <span className="bg-slate-400/10">Settings</span>
              </li>
              <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2">
                <img
                  src="/assets/help.png"
                  alt="Get Help"
                  className="w-5 sm:w-5"
                />
                <span className="bg-slate-400/10">Get Help</span>
              </li>
              <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2">
                <img
                  src="/assets/about.png"
                  alt="About"
                  className="w-5 sm:w-5"
                />
                <span className="bg-slate-400/10">About</span>
              </li>
              <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2">
                <img
                  src="/assets/setting.png"
                  alt="Change Password"
                  className="w-5 sm:w-5"
                />
                <span className="bg-slate-400/10">Change Password</span>
              </li>
              <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2">
                <img
                  src="/assets/out.png"
                  alt="Sign Out"
                  className="w-5 sm:w-5"
                />
                <span className="bg-slate-400/10">Sign Out</span>
              </li>
            </ul>
          </div>
        )}

        {/* Version Display */}
        {!receivedData && (
          <div className="absolute hidden sm:static left-2 sm:ml-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg sm:flex items-center sm:gap-2">
            <img
              src="/assets/version.png"
              alt="Bible Version"
              className="w-8 sm:w-14"
            />
            <span className="bg-slate-400/10 p-3">
              {selectedVersion || "Bible version"}
            </span>
          </div>
        )}

        {/* App Title */}
        <div className="flex items-center">
          <img src="/assets/book.png" alt="Bible" className="w-14" /> VerseCatch
        </div>

        {/* Profile Button */}
        {!receivedData && (
          <div>
            <button
              className="profile-button absolute sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg sm:flex items-center hidden hover:cursor-pointer transition-all"
              onClick={() => setShowProfileMenu(!showProfileMenu)} // Toggle profile menu
            >
              <img
                src="/assets/profile.png"
                alt="Bible Version"
                className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
              />
              <span className="p-3">profile</span>
            </button>
          </div>
        )}
      </section>

      {/* Show the section with version2 div only if there's receivedData */}
      {receivedData && (
        <AnimatePresence>
          <motion.section
            key="verse-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: "url('/assets/fr.jpg')", // Add your image path here
              backgroundSize: "cover", // Ensure the image covers the section
              backgroundPosition: "center", // Center the image
              backgroundBlendMode: "overlay", // Blend the gradient with the image
              background:
                "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))", // Gradient with transparency
            }}
            className="xl:w-1/2 space-y-4 p-10 relative text-white rounded-2xl"
          >
            <div className="absolute left-10 sm:left-10 top-1 sm:top-8 font-bold text-lg flex items-center gap-1">
              <img
                src="/assets/version2.png"
                alt="Bible Version"
                className="w-8 sm:w-8"
              />
              <span className="bg-slate-400/10 p-3">
                {selectedVersion || "Bible version"}
              </span>
            </div>

            {parsedData ? (
              <>
                <h1 className="text-center font-bold xl:text-3xl text-xl pt-10">{`${parsedData.book} ${parsedData.chapter}:${parsedData.verse_number}`}</h1>
                <p className="text-center xl:text-2xl text-xl px-0 xl:px-0">
                  {parsedData.text}
                </p>
              </>
            ) : (
              ""
            )}
          </motion.section>
        </AnimatePresence>
      )}

      <InteractionSection
        setReceivedData={setReceivedData}
        selectedVersion={selectedVersion} // Pass the selected version
        setSelectedVersion={setSelectedVersion} // Pass the function to update the selected version
      />
    </main>
  );
};

export default HomePage;