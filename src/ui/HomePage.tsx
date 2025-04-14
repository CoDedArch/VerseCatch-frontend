import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import InteractionSection from "@/shared/components/containers/InteractionSection";
import Introduction from "@/shared/components/containers/Introduction";
import Header from "@/shared/components/presentation/Header";
import TaskComp from "@/shared/components/containers/TaskComp";
import VerseSection from "@/shared/components/presentation/VerseSection";
import { INITIALTOURSTATE } from "@/shared/constants/varConstants";
import { EntireBookDataInterface } from "@/shared/constants/interfaceConstants";
import { tourSteps } from "@/shared/constants/varConstants";
import { UPDATE_HAS_TAKEN_TOUR_URL } from "@/shared/constants/urlConstants";
import { logout } from "@/store/userSlice";
import { useUserData } from "@/shared/components/Hooks/useUserData";
import CancelTour from "@/shared/components/presentation/CancelTour";

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { userData, token, isLoggedIn, isAnonymous, tokenExpiry } =
    useUserData();
  const [tourState, setTourState] = useState(INITIALTOURSTATE);
  const [receivedData, setReceivedData] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>("KJV_bible");
  const parsedData = receivedData ? JSON.parse(receivedData)[0] : null;
  const [entireBookData, setEntireBookData] = useState<
    EntireBookDataInterface[] | null
  >(null);
  const [highlightedVerse, setHighlightedVerse] = useState<string | null>(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isCheckingTour, setIsCheckingTour] = useState(false);

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
    if (isLoggedIn && isUserDataLoaded && userData) {
      setIsCheckingTour(true);

      const timer = setTimeout(() => {
        setTourState((prev) => ({
          ...prev,
          isTourActive: !userData.has_taken_tour,
        }));
        setIsCheckingTour(false);
      }, 150); // Slightly longer delay for more reliability

      return () => clearTimeout(timer);
    } else {
      setIsCheckingTour(false);
    }
  }, [isLoggedIn, userData, isUserDataLoaded]);

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

    if (tourState.isTourActive && !tourState.isCancelled && isLoggedIn) {
      const timer = setTimeout(() => {
        nextStep();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [
    tourState.currentStep,
    tourState.isTourActive,
    tourState.isCancelled,
    userData,
    isLoggedIn,
  ]);

  // Add z-index to the current step and its parent
  useEffect(() => {
    if (tourState.isTourActive && !tourState.isCancelled && isLoggedIn) {
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
  }, [
    tourState.currentStep,
    tourState.isTourActive,
    tourState.isCancelled,
    isLoggedIn,
  ]);

  // set the bible version to the preferred version of the user in their database
  useEffect(() => {
    if (userData?.bible_version) {
      setSelectedVersion(userData.bible_version);
    }
  }, [userData]);

  useEffect(() => {
    // Handle anonymous user
    console.log(isAnonymous);
    if (isAnonymous) {
      setIntroComplete(true);
      setIsUserDataLoaded(true);
      const cleanupTimer = setTimeout(() => {
        dispatch(logout());
        setIntroComplete(false);
      }, 30 * 60 * 1000);
      return () => clearTimeout(cleanupTimer);
    }

    // Handle regular logged in user
    if (token && isLoggedIn) {
      if (tokenExpiry && Date.now() < tokenExpiry) {
        setIntroComplete(true);
        setIsUserDataLoaded(true);
        const timeout = setTimeout(() => {
          dispatch(logout());
          setIntroComplete(false);
        }, tokenExpiry - Date.now());
        return () => clearTimeout(timeout);
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  }, [token, isLoggedIn, tokenExpiry, isAnonymous, dispatch]);

  return (
    <>
      {isLoggedIn &&
        !isCheckingTour &&
        tourState.isTourActive &&
        introComplete && (
          <CancelTour
            setTourState={setTourState}
            updateHasTakenTour={updateHasTakenTour}
          />
        )}

      {!introComplete ? (
        <Introduction />
      ) : (
        <main
          style={{ background: theme.styles.mainBackground?.background }}
          className={` 
            min-h-screen xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-5 ${theme.styles.mainBackground?.background}`}
        >
          {/* Task Div */}
          {!isAnonymous && <TaskComp tourState={tourState} />}
          {/* Show the first version div only if there's no receivedData */}
          <Header
            tourState={tourState}
            selectedVersion={selectedVersion}
            setIntroComplete={setIntroComplete}
          />

          {/* Show the section with version2 div only if there's receivedData */}
          {receivedData && (
            <VerseSection
              parsedData={parsedData}
              entireBookData={entireBookData}
              selectedVersion={selectedVersion}
              highlightedVerse={highlightedVerse}
              handleVerseClick={handleVerseClick}
              setEntireBookData={setEntireBookData}
            />
          )}

          {userData || isAnonymous ? (
            <InteractionSection
              setReceivedData={setReceivedData}
              version={{ value: selectedVersion, onChange: setSelectedVersion }}
              tourState={tourState}
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
