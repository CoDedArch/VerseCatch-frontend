import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Introduction = ({
  onComplete,
}: {
  onComplete: (version: string) => void;
}) => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // New state to handle exit animation
  const bibleVersions = [
    "AKJV_bible",
    "ASV_bible",
    "BRG_bible",
    "EHV_bible",
    "ESV_bible",
    "ESVUK_bible",
    "GNV_bible",
    "GW_bible",
    "ISV_bible",
    "JUB_bible",
    "KJ21_bible",
    "KJV_bible",
    "LEB_bible",
    "MEV_bible",
    "NASB_bible",
    "NASB1995_bible",
    "NET_bible",
    "NIV_bible",
    "NIVUK_bible",
    "NKJV_bible",
    "NLT_bible",
    "NLV_bible",
    "NOG_bible",
    "NRSV_bible",
    "NRSVUE_bible",
    "WEB_bible",
    "YLT_bible",
  ]; // Example versions

  useEffect(() => {
    // Show greeting for 4 seconds, then transition to Bible versions
    const greetingTimer = setTimeout(() => {
      setShowGreeting(false);
      setShowVersions(true);
    }, 4000);

    return () => clearTimeout(greetingTimer);
  }, []);

  const handleVersionSelect = (version: string) => {
    setIsExiting(true); // Trigger exit animation
    setTimeout(() => {
      onComplete(version); // Pass the selected version to the onComplete callback
    }, 500); // Match the duration of the exit animation
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <>
          {showGreeting && (
            <motion.section
              key="greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Fade out when exiting
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(135deg, #1CB5E0, #000046)",
              }}
              className="absolute w-full text-center h-full inset-0 z-50 flex items-center justify-center text-white text-3xl font-bold"
            >
              Hello and welcome to VerseCatch!
            </motion.section>
          )}

          {showVersions && (
            <motion.section
              key="versions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }} // Fade out and shrink (move towards the screen)
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(135deg, #1CB5E0, #000046)",
              }}
              className="absolute w-full h-fit sm:h-full inset-0 z-50 flex flex-col items-center justify-center pt-10 sm:pt-0 space-y-10 sm:space-y-40"
            >
              <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white text-2xl sm:text-4xl font-extrabold"
              >
                Choose a Bible version:
              </motion.h2>
              <div className="flex flex-wrap gap-10 justify-center pb-10">
                {bibleVersions.map((version, index) => (
                  <motion.button
                    key={version}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white text-blue-500 px-6 py-2 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-colors text-xl font-bold"
                    onClick={() => handleVersionSelect(version)} // Pass the selected version
                  >
                    {version}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default Introduction;
