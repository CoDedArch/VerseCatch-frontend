import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useSpeechRecognitionHook from "../Hooks/UseSpeechRecognitionHook";
import {
  UPDATE_BIBLE_VERSION_FAIL,
  UPDATE_BIBLE_VERSION_SUCCESS,
  book_versions,
} from "../../constants/varConstants";
import { UPDATE_BIBLE_VERSION_URL } from "../../constants/urlConstants";
import { InteractionSectionProps } from "../../constants/interfaceConstants";
import { tourSteps } from "../../constants/varConstants";



const InteractionSection: React.FC<InteractionSectionProps> = ({
  setReceivedData,
  version,
  tourState,
}) => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const {user, isLoggedIn} = useSelector((state: RootState)=> state.user)
  const [listening, setListening] = useState(false);
  const [icon, setIcon] = useState("/assets/play.png");
  const [buttonText, setButtonText] = useState("Start Listening");
  const [buttonIcon, setButtonIcon] = useState("/assets/mic.png");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // use speech recognition
  const { receivedData, startListening, stopListening, hasRecognitionSupport } =
    useSpeechRecognitionHook(version.value, user?.email || "anonymous");

  const handleButtonClick = () => {
    if (!listening) {
      setListening(true);
      setIcon("/assets/vector.png");
      setButtonText("Stop Listening");
      setButtonIcon("/assets/mic-off.png");
      startListening();
    } else {
      setListening(false);
      setIcon("/assets/pause.png");
      setButtonText("Continue Listening");
      setButtonIcon("/assets/mic.png");
      stopListening();
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const updateUserBibleVersion = async (version: string) => {
    try {
      const response = await fetch(UPDATE_BIBLE_VERSION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bible_version: version, email: user?.email }),
      });

      if (!response.ok) {
        throw new Error(UPDATE_BIBLE_VERSION_FAIL);
      }
      console.log(UPDATE_BIBLE_VERSION_SUCCESS);
    } catch (error) {
      console.error("Error updating Bible version:", error);
    }
  };

  const handleVersionChange = async (new_version: string) => {
    version.onChange(new_version);
    setDropdownVisible(false);
    if (isLoggedIn && user?.email) {
      await updateUserBibleVersion(new_version);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (receivedData) {
      setReceivedData(receivedData);
    }
  }, [receivedData, setReceivedData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {hasRecognitionSupport ? (
        <section
          style={{
            background: theme.styles.interactionBackground?.background
          }}
          className="sm:mt-0 px-20 py-6 xl:w-1/2 relative w-full rounded-xl">
          {tourState.isTourActive && tourState.currentStep === 3 && isLoggedIn &&(
            <div id="interaction-section">
              <div className="absolute -right-[17.5em] w-[20em] p-2 -top-[7em] text-white text-xl font-bold">
                {tourSteps[3].description}
                <img
                  src="/assets/down.png"
                  alt="hand down"
                  className="animate-move-up-down"
                />
              </div>
            </div>
          )}

          {!receivedData && (
            <div className="absolute sm:hidden sm:static left-2 sm:ml-2 sm:left-10 -top-20 sm:top-8 font-bold text-lg flex items-center sm:gap-2">
              <img
                src="/assets/version.png"
                alt="Bible Version"
                className="w-8 sm:w-14"
              />
              <span className="bg-slate-400/10 p-3">
                {version.value || "Bible version"}
              </span>
            </div>
          )}

          <motion.img
            title="Bible Versions"
            src="/assets/dots.png"
            alt="three dots"
            className="absolute right-0 w-9 cursor-pointer"
            onClick={toggleDropdown}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />

          <AnimatePresence>
            {dropdownVisible && (
              <motion.ul
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-3 xl:right-0 -top-45 xl:top-15 mt-2 w-48 h-[10em] overflow-y-scroll text-gray-800 bg-white border border-gray-300 rounded shadow-lg z-50"
              >
                <p className="text-center p-2 font-bold underline">
                  Bible Versions
                </p>
                {book_versions.map((version) => (
                  <motion.li
                    key={version}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleVersionChange(version)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {version}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <ul className="flex flex-col items-center space-y-5">
            <motion.li
              className={`span-color p-3 w-fit min-h-[50px] ${
                listening
                  ? `pt-4 ${user?.email ? "shadow-gradient listening-glow" : ""}`
                  : ""
              } rounded-full`}
              animate={{
                scale: listening ? 1.05 : 1,
                transition: { duration: 0.3 }
              }}
            >
              <span className="">
                <img src={icon} alt="" />
              </span>
            </motion.li>
            <li className="w-[214px] text-center font-semibold">
              Transcribing and detecting Bible quotations in real time
            </li>
            <li className="">
              <motion.button
                style={{
                  background: theme.styles.interactionBackground?.buttonColor,
                }}
                className={`w-[197px] h-[48px] text-white flex justify-center items-center hover:cursor-pointer rounded-3xl p-3 space-x-2 font-semibold`}
                onClick={handleButtonClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: buttonText === "Start Listening" || buttonText === "Continue Listening" ? 
                    [0, -5, 0] : 0,
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  },
                }}
              >
                <img src={buttonIcon} alt="mic" className="w-5 h-5" /> 
                <span>{buttonText}</span>
              </motion.button>
            </li>
          </ul>
        </section>
      ) : (
        <div>Your Browser doesn't have recognition support</div>
      )}
    </>
  );
};

export default InteractionSection;