import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractionSection from "@/shared/InteractionSection";
import Introduction from "@/shared/Introduction";
import useUserDataHook from "@/shared/UseUserHook";

const HomePage = () => {
  const { userData, isConnected } = useUserDataHook();
  const [isTourActive, setIsTourActive] = useState(false); // Set to true to start the tour
  const [currentStep, setCurrentStep] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [receivedData, setReceivedData] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>("KJV_bible");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [showLoginTaskComplete, setShowLoginTaskComplete] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [animate, setAnimate] = useState(false);
  const parsedData = receivedData ? JSON.parse(receivedData)[0] : null;
  const [isTaskVisible, setIsTaskVisible] = useState(true);
  const [isTaskHighlighted, setIsTaskHighlighted] = useState(false);

  const tourSteps = [
    {
      id: "task-section",
      description:
        "This is your personal hub for staying organized and on top of your goals.",
    },
    {
      id: "version-section",
      description: "This displays your Bible Version Preference.",
    },
    {
      id: "profile-section",
      description:
        "This section displays your current tag, faith coins, login streak, and profile settings.",
    },
    {
      id: "interaction-section",
      description:
        "This displays your Bible Version Preference in the interaction component.",
    },
  ];

  useEffect(() => {
    if (userData) {
      setIsTourActive(!userData?.has_taken_tour);
    }
  }, [userData]);

  const updateHasTakenTour = async (email: string, hasTakenTour: boolean) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/update-has-taken-tour",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ email, has_taken_tour: hasTakenTour }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update has_taken_tour");
      }

      const data = await response.json();
      console.log("has_taken_tour updated:", data);
    } catch (error) {
      console.error("Error updating has_taken_tour:", error);
    }
  };

  // Function to move to the next step
  const nextStep = async () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // End of tour
      setIsTourActive(false);
      await updateHasTakenTour(userData?.email || "", true);
    }
  };

  // Function to cancel the tour
  const cancelTour = async () => {
    setIsTourActive(false);
    setIsCancelled(true);
    await updateHasTakenTour(userData?.email || "", true);
  };

  // apply z index to the task for 5 seconds
  useEffect(() => {
    if (isTourActive) {
      setIsTaskHighlighted(true); // Apply high z-index
      const timer = setTimeout(() => {
        setIsTaskHighlighted(false); // Reset z-index after 5 seconds
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isTourActive]);

  // Automatically move to the next step every 3 seconds
  useEffect(() => {
    if (isTourActive && !isCancelled) {
      const timer = setTimeout(() => {
        nextStep();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentStep, isTourActive, isCancelled]);

  // Add z-index to the current step and its parent
  useEffect(() => {
    if (isTourActive && !isCancelled) {
      const currentElement = document.getElementById(tourSteps[currentStep].id);
      if (currentElement && currentElement.parentElement) {
        // Set high z-index for the current step and its parent
        currentElement.style.zIndex = "10000"; // High z-index for visibility
        currentElement.parentElement.style.zIndex = "10000"; // Ensure parent is also visible

        // Remove z-index after 5 seconds
        const timer = setTimeout(() => {
          currentElement.style.zIndex = "";
          if (currentElement.parentElement) {
            currentElement.parentElement.style.zIndex = "1"; // Reset parent z-index
          }
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, isTourActive, isCancelled]);

  useEffect(() => {
    if (userData?.bible_version) {
      setSelectedVersion(userData.bible_version);
    }
  }, [userData]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsTaskVisible(!mediaQuery.matches);

    // Optional: Add a listener to handle screen size changes dynamically
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsTaskVisible(!event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username === "anonymous") {
      const cleanupTimer = setTimeout(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("bible_version");
        setIntroComplete(false);
      }, 30 * 60 * 1000);

      return () => clearTimeout(cleanupTimer);
    }
  }, []);

  const handleShowClick = () => {
    setIsTaskVisible(true);
  };

  const handleHideClick = () => {
    setIsTaskVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node)
    ) {
      setShowProfileMenu(false);
    }
  };

  // Trigger animation when faith_coins changes
  useEffect(() => {
    if (userData?.faith_coins !== undefined) {
      setAnimate(true); // Start animation
      const timer = setTimeout(() => setAnimate(false), 3000); // Stop after 2 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [userData?.faith_coins]);

  useEffect(() => {
    if (showLoginTaskComplete) {
      // After 2 seconds, stop the animation and show the image
      const timer = setTimeout(() => {
        setShowLoginTaskComplete(false);
        setShowImage(true);
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [showLoginTaskComplete]);

  // Check for token, login state, or anonymous user on page load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username");
    const bibleVersion = localStorage.getItem("bible_version");

    if (username === "anonymous" && bibleVersion) {
      // Anonymous user detected
      setUserIsLoggedIn(false);
      setSelectedVersion(bibleVersion);
      setIntroComplete(true);
    } else if (
      token &&
      isLoggedIn &&
      localStorage.getItem("token_expiry") &&
      Date.now() < parseInt(localStorage.getItem("token_expiry")!)
    ) {
      // Logged-in user detected
      setUserIsLoggedIn(true);
      setIntroComplete(true);
    } else {
      // No valid session or anonymous user
      localStorage.removeItem("access_token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("username"); // Clear anonymous user data if invalid
      localStorage.removeItem("bible_version"); // Clear Bible version if invalid
    }
  }, []);

  // Handle token expiry
  useEffect(() => {
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry) - Date.now();

      if (expiryTime > 0) {
        // Set a timeout to log the user out when the token expires
        const timeout = setTimeout(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("token_expiry");
          setIntroComplete(false); // Show the introduction screen again
        }, expiryTime);

        return () => clearTimeout(timeout); // Clear the timeout if the component unmounts
      } else {
        // Token has already expired
        localStorage.removeItem("access_token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token_expiry");
      }
    }
  }, []);

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
      {isTourActive && introComplete && (
        <section className="bg-black/80 fixed inset-0 h-screen w-full z-50 flex justify-center items-center">
          <button
            className="text-white font-bold text-2xl ml-10 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-700/50"
            onClick={cancelTour}
          >
            Cancel Tour
          </button>
        </section>
      )}

      {!introComplete ? (
        <Introduction
          onComplete={(version) => {
            setSelectedVersion(version); // Update the selected version
            setIntroComplete(true); // Mark introduction as complete
          }}
        />
      ) : (
        <main
          className={`animated-gradient min-h-screen xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-5`}
        >
          <img
            src="/assets/show.png"
            alt="show"
            className={`w-14 absolute left-3 z-[100] top-[470px] bg-black/50 p-1 rounded-full cursor-pointer transition-opacity duration-300 ${
              isTaskVisible ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleShowClick}
          />

          {/* Task Div */}
          {userData && (
            <div
              style={{
                backgroundImage: "url('/assets/fr.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                background:
                  "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
              }}
              className={`fixed left-2 sm:top-37 ${
                isTaskHighlighted ? "sm:z-[10000]" : "z-[1]"
              } sm:z-1 top-[140px] w-fit h-fit space-y-4 rounded-lg p-2 text-white ${
                isTaskVisible ? "block animate-slide-in" : "hidden"
              }`}
            >
              {isTourActive && currentStep === 0 && (
                <div id="task-section">
                  <div className="absolute -right-[22em] w-[20em] text-xl font-bold p-2 top-1/2 transform -translate-y-1/2">
                    <img
                      src="/assets/left.png"
                      alt="hand left"
                      className="animate-move-left-right" // Apply the animation
                    />
                    {tourSteps[0].description}
                  </div>
                </div>
              )}
              {/* Hide Button */}
              <img
                src="/assets/hide.png"
                alt="hide"
                className="w-14 absolute -right-5 -top-5 bg-black/50 p-1 rounded-full cursor-pointer"
                onClick={handleHideClick}
              />
              <div className="flex justify-center">
                <h1 className="text-white font-bold text-center text-2xl flex">
                  Daily Task{" "}
                  <img src="/assets/trophy.png" alt="trophy" className="w-6" />
                </h1>
              </div>
              <ul className="space-y-2 text-black text-xl list-disc px-2 font-bold">
                <li
                  className={`relative flex gap-5 p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    showLoginTaskComplete
                      ? "bg-green-400 animate-pulse" // Apply animation and green background
                      : "bg-green-200" // Default background
                  }`}
                >
                  {showImage && (
                    <img
                      src="/assets/task.png"
                      alt="task"
                      className="w-10 absolute right-0 top-0 animate-fade-in"
                    />
                  )}
                  Login Daily{" "}
                  <div className="flex items-center gap-1">
                    <img src="/assets/fire.png" alt="fire" className="w-5" />{" "}
                    <span className="text-md">+1</span>
                  </div>
                </li>
                <li
                  className={`flex gap-5 p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    animate ? "bg-green-400 animate-pulse" : "bg-green-200"
                  }`}
                >
                  Catching 1 bible verse{" "}
                  <div className="flex items-center gap-1">
                    <img src="/assets/coin.png" alt="coin" className="w-5" />{" "}
                    <span className="text-md">+2</span>
                  </div>
                </li>
              </ul>
              <div className="flex justify-center ">
                <h1 className="text-white font-bold text-center text-2xl flex">
                  Keep Going{" "}
                  <img src="/assets/trophy.png" alt="trophy" className="w-6" />
                </h1>
              </div>
              <ul className="space-y-2 text-md list-disc px-2 font-bold text-black">
                <li
                  className={`relative flex gap-5 bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
                    (userData?.total_verses_caught / 10) * 100 === 100
                      ? "bg-green-400 animate-pulse"
                      : ""
                  }`}
                >
                  Catch 10 verses{" "}
                  <div className="flex items-center gap-1">
                    <span className="text-md font-bold">
                      (Verse Catcher) -{" "}
                      <span
                        className={`${
                          (userData?.total_verses_caught / 10) * 100 === 100
                            ? "bg-green-400 text-black"
                            : "bg-black text-white"
                        } absolute top-0 -right-4 p-2 rounded-full font-bold`}
                      >
                        {Math.min(
                          (userData?.total_verses_caught / 10) * 100,
                          100
                        )}
                        %
                      </span>
                    </span>
                  </div>
                  {(userData?.total_verses_caught / 10) * 100 === 100 && (
                    <img
                      src="/assets/task.png"
                      alt="task"
                      className="w-10 absolute right-0 top-0 animate-fade-in bg-white"
                    />
                  )}
                </li>
                <li
                  className={`relative flex gap-5 text-sm bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
                    userData?.streak === 7 ? "bg-green-400 animate-pulse" : ""
                  }`}
                >
                  {userData?.streak === 7 && (
                    <img
                      src="/assets/task.png"
                      alt="task"
                      className="w-10 absolute right-0 top-0 animate-fade-in bg-white"
                    />
                  )}
                  Log in for 7 consecutive days{" "}
                  <div className="flex items-center gap-1">
                    <span className="text-md font-bold">(Daily Devotee)</span>
                  </div>
                </li>
                <li
                  className={`relative flex gap-1 text-sm bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
                    (userData?.unique_books_caught / 5) * 100 === 100
                      ? "bg-green-400 animate-pulse"
                      : ""
                  }`}
                >
                  Catch from 5 different books{" "}
                  <div className="flex items-center gap-1">
                    <span className="text-md font-bold">
                      (Bible Explorer) -{" "}
                      <span
                        className={`${
                          (userData?.unique_books_caught / 5) * 100 === 100
                            ? "bg-green-400 text-black"
                            : "bg-black text-white"
                        } absolute top-0 -right-4 p-2 rounded-full font-bold`}
                      >
                        {Math.min(
                          (userData?.unique_books_caught / 5) * 100,
                          100
                        )}
                        %
                      </span>
                    </span>
                  </div>
                  {(userData?.unique_books_caught / 5) * 100 === 100 && (
                    <img
                      src="/assets/task.png"
                      alt="task"
                      className="w-10 absolute right-0 top-0 animate-fade-in bg-white"
                    />
                  )}
                </li>
                <li className="flex gap-5 text-sm bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100">
                  Share 50 verses with friends{" "}
                  <div className="flex items-center gap-1">
                    <span className="text-md font-bold">(Sharing Saint)</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
          {/* Show the first version div only if there's no receivedData */}
          <section
            className={`font-bold text-2xl relative flex items-center justify-center ${
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
                  src={`/assets/${
                    isTourActive ? "version2.png" : "version.png"
                  }`}
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
              <img src="/assets/book.png" alt="Bible" className="w-14" />{" "}
              VerseCatch
            </div>
            {/* Profile Button */}

            <div
              key={userData?.id}
              className={`gap-5 ${
                userData
                  ? "flex absolute right-2 top-[55px] sm:top-0"
                  : "hidden"
              } ${isTourActive ? "text-white" : ""}`}
            >
              {isTourActive && currentStep === 2 && (
                <div id="profile-section">
                  <div className="absolute right-0 w-[20em] p-2 top-[5em] flex flex-col text-xl items-center text-white text-center">
                    <img
                      src="/assets/pointer.png"
                      alt="hand up"
                      className="animate-move-up-down"
                    />
                    {tourSteps[2].description}
                  </div>
                </div>
              )}
              <p
                style={{
                  backgroundImage: "url('/assets/fr.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                  background:
                    "linear-gradient(135deg, rgba(20, 30, 48, 1), rgba(36, 59, 85, 0.2))",
                }}
                className="self-center p-1 rounded-2xl relative shadow-black shadow-2xl"
              >
                <span className="bg-white text-black p-2 rounded-2xl text-sm relative -top-3 shadow-black shadow-2xl">
                  {userData?.current_tag || "Newbie"}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <img
                  src="/assets/coin.png"
                  alt="coin"
                  className={`w-8 ${animate ? "animate-coin" : ""}`}
                />{" "}
                <span className="text-sm">{userData?.faith_coins}</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/assets/fire.png" alt="fire" className="w-8" />{" "}
                <span className="text-sm">{userData?.streak}</span>
              </div>
              <button
                className="profile-button absolute sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 top-[21em] sm:top-8 font-bold text-lg sm:flex items-center hidden hover:cursor-pointer transition-all"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img
                  src="/assets/profile.png"
                  alt="Bible Version"
                  className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
                />
                <span className="p-3 font-bold">
                  {userData?.first_name?.[0]?.toUpperCase() || ""}{" "}
                  {userData?.last_name?.[0]?.toUpperCase() || ""}
                </span>
              </button>
            </div>

            {/* Profile Menu */}
            {userIsLoggedIn && showProfileMenu && (
              <div
                ref={profileMenuRef}
                className="bg-slate-500/20 absolute right-1 w-fit top-20 rounded-lg p-2"
              >
                <ul className="space-y-5">
                  <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer">
                    <img
                      src="/assets/setting.png"
                      alt="Settings"
                      className="w-5 sm:w-5"
                    />
                    <span className="bg-slate-400/10">Settings</span>
                  </li>
                  <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer">
                    <img
                      src="/assets/help.png"
                      alt="Get Help"
                      className="w-5 sm:w-5"
                    />
                    <span className="bg-slate-400/10">Get Help</span>
                  </li>
                  <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer">
                    <img
                      src="/assets/about.png"
                      alt="About"
                      className="w-5 sm:w-5"
                    />
                    <span className="bg-slate-400/10">About</span>
                  </li>
                  <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer">
                    <img
                      src="/assets/setting.png"
                      alt="Change Password"
                      className="w-5 sm:w-5"
                    />
                    <span className="bg-slate-400/10">Change Password</span>
                  </li>
                  <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all hover:cursor-pointer">
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
          {userData || localStorage.getItem("username") === "anonymous" ? (
            <InteractionSection
              setReceivedData={setReceivedData}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              userIsLoggedIn={userIsLoggedIn}
              userEmail={userData?.email || "anonymous"}
              tourSteps={tourSteps}
              isTourActive={isTourActive}
              currentStep={currentStep}
            />
          ) : (
            <p>Loading user data...</p> // Optional: Show a loading state
          )}
        </main>
      )}
    </>
  );
};

export default HomePage;
