import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractionSection from "@/shared/components/containers/InteractionSection";
import Introduction from "@/shared/components/containers/Introduction";
import useUserDataHook from "@/shared/components/Hooks/UseUserHook";
import Header from "@/shared/components/containers/Header";
import TaskComp from "@/shared/components/presentation/TaskComp";
import {
  INITIALTOURSTATE,
} from "@/shared/constants/varConstants";
import {
  Verse,
  EntireBookDataInterface,
} from "@/shared/constants/interfaceConstants";
import { tourSteps } from "@/shared/constants/varConstants";
import { UPDATE_HAS_TAKEN_TOUR_URL } from "@/shared/constants/urlConstants";

const HomePage = () => {
  const { userData } = useUserDataHook();
  const [tourState, setTourState] = useState(INITIALTOURSTATE);

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [receivedData, setReceivedData] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>("KJV_bible");
  
  const parsedData = receivedData ? JSON.parse(receivedData)[0] : null;
  const [entireBookData, setEntireBookData] = useState<
    EntireBookDataInterface[] | null
  >(null);
  const [highlightedVerse, setHighlightedVerse] = useState<string | null>(null);
  

  // all Handlers

  // Function to move to the next step
  const nextStep = async () => {
    if (tourState.currentStep < tourSteps.length - 1) {
      setTourState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    } else {
      // End of tour
      setTourState((prev) => ({
        ...prev,
        isTourActive: false,
      }));
      await updateHasTakenTour(userData?.email || "", true);
    }
  };

  // Function to cancel the tour
  const cancelTour = async () => {
    setTourState((prev) => ({
      ...prev,
      isTourActive: false,
    }));
    setTourState((prev) => ({
      ...prev,
      isCancelled: false,
    }));
    await updateHasTakenTour(userData?.email || "", true);
  };

 
  // handler to fetch chapters, verse text from the book in which the verse belong
  const handleVerseClick = () => {
    if (parsedData) {
      fetchEntireBook(parsedData.book);
    }
  };

  // handler to set the tour status of the auth user
  const updateHasTakenTour = async (email: string, hasTakenTour: boolean) => {
    try {
      const response = await fetch(UPDATE_HAS_TAKEN_TOUR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ email, has_taken_tour: hasTakenTour }),
      });

      if (!response.ok) {
        throw new Error("Failed to update has_taken_tour");
      }

      const data = await response.json();
      console.log("has_taken_tour updated:", data);
    } catch (error) {
      console.error("Error updating has_taken_tour:", error);
    }
  };

  // This will fetch the entire books from the bible
  const fetchEntireBook = async (bookName: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/get-book/${bookName}?version_name=${selectedVersion}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch book data");
      }
      const data = await response.json();
      setEntireBookData(data);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  // set the tour status of the user
  useEffect(() => {
    if (userData) {
      setTourState((prev) => ({
        ...prev,
        isTourActive: !userData?.has_taken_tour,
      }));
    }
  }, [userData]);

  // This scrolls to the verse which have been caught when all chapters and verses in the book have been returned
  useEffect(() => {
    if (entireBookData && parsedData) {
      const verseId = `${parsedData.chapter}:${parsedData.verse_number}`;
      setHighlightedVerse(verseId);
      const verseElement = document.getElementById(verseId);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [entireBookData, parsedData]);

  // apply z index to the task for 5 seconds
 

  // Automatically move to the next step every 3 seconds
  useEffect(() => {
    if (tourState.isTourActive && !tourState.isCancelled) {
      const timer = setTimeout(() => {
        nextStep();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [tourState.currentStep, tourState.isTourActive, tourState.isCancelled]);

  // Add z-index to the current step and its parent
  useEffect(() => {
    if (tourState.isTourActive && !tourState.isCancelled) {
      const currentElement = document.getElementById(
        tourSteps[tourState.currentStep].id
      );
      if (currentElement && currentElement.parentElement) {
        // Set high z-index for the current step and its parent
        currentElement.style.zIndex = "10000";
        currentElement.parentElement.style.zIndex = "10000";

        // Remove z-index after 5 seconds
        const timer = setTimeout(() => {
          currentElement.style.zIndex = "";
          if (currentElement.parentElement) {
            currentElement.parentElement.style.zIndex = "1";
          }
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [tourState.currentStep, tourState.isTourActive, tourState.isCancelled]);

  // set the bible version to the preferred version of the user in their database
  useEffect(() => {
    if (userData?.bible_version) {
      setSelectedVersion(userData.bible_version);
    }
  }, [userData]);

  

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
      localStorage.removeItem("username");
      localStorage.removeItem("bible_version");
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
          setIntroComplete(false);
        }, expiryTime);

        return () => clearTimeout(timeout);
      } else {
        // Token has already expired
        localStorage.removeItem("access_token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token_expiry");
      }
    }
  }, []);

  return (
    <>
      {tourState.isTourActive && introComplete && (
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
            setSelectedVersion(version);
            setIntroComplete(true);
          }}
        />
      ) : (
        <main
          // style={{ background: themeStyles?.mainBackground?.background }}
            className={` 
            min-h-screen xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-5`}
        >
          

          {/* Task Div */}
          {userData && (
            <TaskComp
              userData={userData}
              tourState={tourState}
            />
          )}
          {/* Show the first version div only if there's no receivedData */}

          <Header
            userIsLoggedIn={userIsLoggedIn}
            receivedData={receivedData}
            tourState={tourState}
            userData={userData}
            selectedVersion={selectedVersion}
            setIntroComplete={setIntroComplete}
            setUserIsLoggedIn={setUserIsLoggedIn}
          />

          {/* Show the section with version2 div only if there's receivedData */}
          {receivedData && (
            <AnimatePresence>
              <motion.section
                key="verse-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                // style={{
                //   background: themeStyles?.verseBackground?.background,
                //   color: themeStyles?.verseBackground?.color,
                // }}
                className={`xl:w-1/2 space-y-4 p-10 relative rounded-2xl`}
                onClick={handleVerseClick}
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
                <div className="absolute left-10 sm:right-10 top-1 sm:bottom-40 font-bold text-lg flex items-center gap-1">
                  <img
                    src="/assets/back.png"
                    alt="Bible Version"
                    className="w-8 sm:w-8"
                  />
                  <span className="bg-slate-400/10 p-3">Back</span>
                </div>

                {parsedData && !entireBookData ? (
                  <>
                    <h1 className="text-center font-bold xl:text-3xl text-xl pt-10">{`${parsedData.book} ${parsedData.chapter}:${parsedData.verse_number}`}</h1>
                    <p className="text-center xl:text-2xl text-xl px-0 xl:px-0">
                      {parsedData.text}
                    </p>
                  </>
                ) : (
                  entireBookData && (
                    <div className="overflow-y-auto max-h-96">
                      {entireBookData.map((chapter) => (
                        <div key={chapter.chapter}>
                          <h2 className="text-center font-bold xl:text-2xl text-xl pt-5">{` ${parsedData.book} Chapter ${chapter.chapter}`}</h2>
                          {chapter.verses.map((verse: Verse) => (
                            <p
                              key={`${chapter.chapter}:${verse.verse_number}`}
                              id={`${chapter.chapter}:${verse.verse_number}`}
                              className={`text-center xl:text-xl text-lg px-0 xl:px-0 py-5 ${
                                highlightedVerse ===
                                `${chapter.chapter}:${verse.verse_number}`
                                  ? "text-green-200"
                                  : ""
                              }`}
                            >
                              {verse.verse_number}. {verse.text}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </motion.section>
            </AnimatePresence>
          )}
          {userData || localStorage.getItem("username") === "anonymous" ? (
            <InteractionSection
              setReceivedData={setReceivedData}
              version={{ value: selectedVersion, onChange: setSelectedVersion }}
              user={{
                isLoggedIn: userIsLoggedIn,
                email: userData?.email || "anonymous",
              }}
              tourState={tourState}
              // interactionBackground={themeStyles.interactionBackground}
              // displayThemeName={selectedTheme?.display_name}
            />
          ) : (
            <p>Loading user data...</p>
          )}
        </main>
      )}
    </>
  );
};

export default HomePage;
