import { useState, useEffect, useRef } from "react";
import BlurImage from "./ImageBlur";
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
import { tourSteps } from "../../constants/varConstants";
import { useDispatch } from "react-redux";
import { setSelectedVersion, setReceivedData } from "@/store/uiSlice";
import CreateAccount from "./CreatAccount";


const InteractionSection = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const tourState = useSelector((state: RootState) => state.tour);
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user);
  const { selectedVersion } = useSelector((state: RootState) => state.ui);
  const [listening, setListening] = useState(false);
  const [icon, setIcon] = useState("/assets/play.png");
  const [buttonText, setButtonText] = useState("Start Listening");
  const [buttonIcon, setButtonIcon] = useState("/assets/mic.png");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // use speech recognition
  const { receivedData, startListening, stopListening, hasRecognitionSupport } =
    useSpeechRecognitionHook(selectedVersion, user?.email || "anonymous");

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
    dispatch(setSelectedVersion(new_version));
    setDropdownVisible(false);
    if (isLoggedIn && user?.email) {
      await updateUserBibleVersion(new_version);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (receivedData) {
      dispatch(setReceivedData(receivedData));
    }
  }, [receivedData, dispatch]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full flex justify-center">
      {hasRecognitionSupport ? (
        <section
          style={{
            background: theme.styles.interactionBackground?.background,
            zIndex:
              tourState.isTourActive && tourState.currentStep === 3
                ? 10000
                : "",
          }}
          className="px-4 sm:px-20 py-6 relative w-full max-w-4xl rounded-xl no-highlight"
        >
          <div className="absolute sm:hidden -right-8 -top-13">
            {!isLoggedIn && <CreateAccount />}
          </div>

          {tourState.isTourActive &&
            tourState.currentStep === 3 &&
            isLoggedIn && (
              <div id="interaction-section">
                <div className="absolute -right-10 sm:-right-[17.5em] w-[20em] p-2 -top-[7.2em] sm:-top-[8.5em] text-white text-sm sm:text-xl font-bold">
                  {tourSteps[3].description}
                  <BlurImage
                    src="/assets/down.png"
                    alt="hand down"
                    className="animate-move-up-down w-10 sm:w-20 ml-[70%] sm:ml-0"
                  />
                </div>
              </div>
            )}

          {selectedVersion && (
            <div
              className={`font-bold flex absolute -top-1 left-0 sm:hidden items-center text-sm sm:gap-2 no-highlight ${
                tourState.isTourActive && tourState.currentStep === 1
                  ? "z-[10000] text-white"
                  : ""
              }`}
            >
              <BlurImage
                src={`/assets/${
                  tourState.isTourActive &&
                  tourState.currentStep === 1 &&
                  isLoggedIn ||  theme.display_name === "Dark Night" && isMobile
                    ? "version2.png"
                    : "version.png"
                }`}
                alt="Bible Version"
                className="w-8 sm:w-14 pointer-events-none"
              />

              <span className={`bg-slate-400/10 p-3 ${theme.display_name === "Dark Night" && isMobile ? "text-white":""}`}>
                {selectedVersion || "Bible version"}
              </span>

              {/* {tourState.isTourActive && tourState.currentStep === 1 && ( */}
                <div
                  id="version-section"
                  className="absolute left-full ml-4 w-[20em] top-1 text-sm"
                >
                  <div className="bg-inherit rounded-lg p-4 text-white text-xl font-bold">
                    <BlurImage
                      src="/assets/left.png"
                      alt="hand left"
                      className="animate-move-left-right pointer-events-none mb-2 w-10 sm:w-20"
                    />
                    {tourSteps[1].description}
                  </div>
                </div>
              {/* )} */}
            </div>
          )}

          <motion.img
            title="Bible Versions"
            src="/assets/dots.png"
            alt="three dots"
            className={`absolute right-0 w-9 cursor-pointer ${
              theme.display_name === "Dark Night" ||
              theme.display_name === "Twilight"
                ? "bg-slate-100/70 rounded-2xl"
                : ""
            }`}
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
                className="absolute right-3 xl:right-0 -top-45 xl:top-15 mt-2 w-56 h-[10em] overflow-y-scroll text-gray-800 bg-white border border-gray-300 rounded shadow-lg z-50"
              >
                <p className="text-center p-2 font-bold underline">
                  Bible Versions
                </p>
                {book_versions
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((version) => (
                    <motion.li
                      key={version.value}
                      className={`px-4 py-2 cursor-pointer text-sm ${
                        selectedVersion === version.value
                          ? "bg-green-200/50 font-bold"
                          : "hover:bg-gray-200 transition-colors"
                      }`}
                      onClick={() => handleVersionChange(version.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {version.label}
                    </motion.li>
                  ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <ul className="flex flex-col items-center space-y-5">
            <motion.li
              className={`span-color p-3 w-fit min-h-[50px] ${
                listening
                  ? `pt-4 ${
                      user?.email ? "shadow-gradient listening-glow" : ""
                    }`
                  : ""
              } rounded-full`}
              animate={{
                scale: listening ? 1.05 : 1,
                transition: { duration: 0.3 },
              }}
            >
              <span className="">
                <img src={icon} alt="" className="pointer-events-none" />
              </span>
            </motion.li>
            <li
              className={`${
                theme.display_name === "Dark Night" ||
                theme.display_name === "Twilight"
                  ? "text-white"
                  : ""
              } w-[214px] text-center font-semibold`}
            >
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
                  y:
                    buttonText === "Start Listening" ||
                    buttonText === "Continue Listening"
                      ? [0, -5, 0]
                      : 0,
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }}
              >
                <BlurImage src={buttonIcon} alt="mic" className="w-5 h-5" priority={true }/>
                <span>{buttonText}</span>
              </motion.button>
            </li>
          </ul>
        </section>
      ) : (
        <div>Your Browser doesn't have recognition support</div>
      )}
    </div>
  );
};

export default InteractionSection;
