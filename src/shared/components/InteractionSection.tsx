import React, { useState, useEffect, useRef } from "react";
import useSpeechRecognitionHook from "./UseSpeechRecognitionHook";
import { InteractionSectionProps, book_versions } from "../constants/constants";

const InteractionSection: React.FC<InteractionSectionProps> = ({
  setReceivedData,
  selectedVersion,
  setSelectedVersion,
  userIsLoggedIn,
  userEmail,
  tourSteps,
  isTourActive,
  currentStep,
  interactionBackground,
  displayThemeName,
}) => {
  const [listening, setListening] = useState(false);
  const [icon, setIcon] = useState("/assets/play.png");
  const [buttonText, setButtonText] = useState("Start Listening");
  const [buttonIcon, setButtonIcon] = useState("/assets/mic.png");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Default styles if not provided
  const defaultStyles = {
    background: "white",
    textColor: "text-gray-800",
    buttonColor: "black",
  };

  // Merge with default styles
  const styles = interactionBackground || defaultStyles;

  // use speech recognition
  const { receivedData, startListening, stopListening, hasRecognitionSupport } =
    useSpeechRecognitionHook(selectedVersion, userEmail); // Pass selectedVersion to the hook

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

  // Function to update the user's Bible version in the backend
  const updateUserBibleVersion = async (version: string) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/update-bible-version",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bible_version: version, email: userEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Bible version");
      }

      console.log("Bible version updated successfully");
    } catch (error) {
      console.error("Error updating Bible version:", error);
    }
  };

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version);
    setDropdownVisible(false);

    // Update the user's Bible version in the backend
    if (userIsLoggedIn) {
      await updateUserBibleVersion(version);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    // Hide dropdown if clicked outside
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }

    // Hide profile menu if clicked outside
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node)
    ) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    if (receivedData) {
      setReceivedData(receivedData);
    }
  }, [receivedData, setReceivedData]);

  useEffect(() => {
    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {hasRecognitionSupport ? (
        <section
          style={{
            background: styles?.background || defaultStyles.background,
            color: styles?.color,
          }}
          className={`sm:mt-0 px-20 py-6 xl:w-1/2 relative w-full rounded-xl`}
        >
          {isTourActive && currentStep === 3 && (
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

          {/* Profile Menu */}
          {userIsLoggedIn && showProfileMenu && (
            <div
              ref={profileMenuRef}
              className="bg-slate-500/20 sm:hidden absolute right-1 w-fit -top-[21em] rounded-lg p-2"
            >
              <ul className="space-y-5">
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/setting.png"
                    alt="Settings"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Settings</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/help.png"
                    alt="Get Help"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Get Help</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/about.png"
                    alt="About"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">About</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/setting.png"
                    alt="Change Password"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Change Password</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
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

          {/* Profile Button */}
          {userIsLoggedIn && !receivedData && (
            <div>
              <button
                className="profile-button absolute sm:hidden sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 -top-20 sm:top-8 font-bold text-lg flex items-center hover:cursor-pointer transition-all"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
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

          {/* Rest of the code remains unchanged */}
          {!receivedData && (
            <div className="absolute sm:hidden sm:static left-2 sm:ml-2 sm:left-10 -top-20 sm:top-8 font-bold text-lg flex items-center sm:gap-2">
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
          <img
            title="Bible Versions"
            src={
              displayThemeName === "Twilight" ||
              displayThemeName === "Dark Night"
                ? "/assets/dots1.png"
                : "/assets/dots.png"
            }
            alt="three dots"
            className="absolute right-0 w-9 cursor-pointer"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <ul
              ref={dropdownRef}
              className="absolute right-3 xl:right-0 -top-45 xl:top-15 mt-2 w-48 h-[10em] overflow-y-scroll text-gray-800 bg-white border border-gray-300 rounded shadow-lg"
            >
              <p className="text-center p-2 font-bold underline">
                Bible Versions
              </p>
              {book_versions.map((version) => (
                <li
                  key={version}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleVersionChange(version)}
                >
                  {version}
                </li>
              ))}
            </ul>
          )}
          <ul className="flex flex-col items-center space-y-5">
            <li
              className={`span-color p-3 w-fit min-h-[50px] ${
                listening
                  ? `pt-4 ${userEmail ? "shadow-gradient listening-glow" : ""}`
                  : ""
              } rounded-full`}
            >
              <span className="">
                <img src={icon} alt="" />
              </span>
            </li>
            <li className="w-[214px] text-center font-semibold">
              Transcribing and detecting Bible quotations in real time
            </li>
            <li className="">
              <button
                style={{
                  background: styles?.buttonColor || defaultStyles.buttonColor,
                }}
                className={`w-[197px] h-[48px] text-white flex justify-center hover:scale-105 transition-all hover:cursor-pointer rounded-3xl p-3 space-x-2 font-semibold ${
                  buttonText === "Start Listening" ||
                  buttonText === "Continue Listening"
                    ? "bouncing-button"
                    : ""
                }`}
                onClick={handleButtonClick}
              >
                <img src={buttonIcon} alt="mic" /> <span>{buttonText}</span>
              </button>
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
