import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import InteractionSection from "@/shared/components/containers/InteractionSection";
import Introduction from "@/shared/components/containers/Introduction";
import Header from "@/shared/components/containers/Header";
import TaskComp from "@/shared/components/containers/TaskComp";
import VerseSection from "@/shared/components/containers/VerseSection";
import { EntireBookDataInterface } from "@/shared/constants/interfaceConstants";
import { logout } from "@/store/userSlice";
import { useUserData } from "@/shared/components/Hooks/useUserData";
import CancelTour from "@/shared/components/containers/CancelTour";
import {
  startTour,
  nextStep,
  endTour,
  updateHasTakenTour,
} from "@/store/tourSlice";
import { tourSteps } from "@/shared/constants/varConstants";
import { AppDispatch } from "@/store/store";
import {
  setIntroComplete,
  resetIntroComplete,
  setHighlightedVerse,
  setSelectedVersion,
} from "@/store/uiSlice";
import { useRef } from "react";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { userData, token, isLoggedIn, isAnonymous, tokenExpiry } =
    useUserData();
  const { introComplete, selectedVersion, receivedData } = useSelector(
    (state: RootState) => state.ui
  );
  const tourState = useSelector((state: RootState) => state.tour);
  // Memoize parsed data to prevent unnecessary recalculations
  const parsedData = useMemo(() => {
    return receivedData ? JSON.parse(receivedData)[0] : null;
  }, [receivedData]);

  const tourInterval = useRef<NodeJS.Timeout | null>(null);
  const hasTourStarted = useRef(false);

  const [entireBookData, setEntireBookData] = useState<
    EntireBookDataInterface[] | null
  >(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isCheckingTour, setIsCheckingTour] = useState(false);

  useEffect(() => {
    console.log(
      '[TOUR STEP] Current step changed:', 
      tourState.currentStep,
      'of',
      tourSteps.length - 1,
      '| Active:', 
      tourState.isTourActive
    );
    
    // Optional: Log the step details if needed
    if (tourState.isTourActive && tourSteps[tourState.currentStep]) {
      console.log(
        '[TOUR STEP DETAILS]', 
        tourSteps[tourState.currentStep]
      );
    }
  }, [tourState.currentStep, tourState.isTourActive]);

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchEntireBook = useCallback(
    async (bookName: string) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get-book/${bookName}?version_name=${selectedVersion}`
        );
        if (!response.ok) throw new Error("Failed to fetch book data");
        const data = await response.json();
        setEntireBookData(data);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    },
    [selectedVersion]
  );

  // Memoize verse click handler
  const handleVerseClick = useCallback(() => {
    if (parsedData) fetchEntireBook(parsedData.book);
  }, [parsedData, fetchEntireBook]);

  // Scroll to verse effect
  useEffect(() => {
    if (entireBookData && receivedData) {
      const verseId = `${parsedData.chapter}:${parsedData.verse_number}`;
      dispatch(setHighlightedVerse(verseId));
      const verseElement = document.getElementById(verseId);
      verseElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [entireBookData, receivedData, dispatch, parsedData]);

  // Set user's preferred Bible version
  useEffect(() => {
    if (userData?.bible_version) {
      dispatch(setSelectedVersion(userData.bible_version));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (isLoggedIn && isUserDataLoaded && userData && !hasTourStarted.current) {
      setIsCheckingTour(true);

      const timer = setTimeout(() => {
        if (!userData.has_taken_tour) {
          hasTourStarted.current = true; // Mark tour as started
          dispatch(startTour());
        }
        setIsCheckingTour(false);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setIsCheckingTour(false);
    }
  }, [isLoggedIn, userData, isUserDataLoaded, dispatch]);

  // Handle automatic tour progression
  useEffect(() => {
    if (!tourState.isTourActive) {
      // Clear interval if tour is not active
      if (tourInterval.current) {
        clearInterval(tourInterval.current);
        tourInterval.current = null;
      }
      return;
    }

    // Start the interval for automatic progression
    tourInterval.current = setInterval(() => {
      if (tourState.currentStep < tourSteps.length - 1) {
        dispatch(nextStep());
      } else {
        // Tour completed
        if (tourInterval.current) {
          clearInterval(tourInterval.current);
          tourInterval.current = null;
        }
        dispatch(endTour());

        // Update backend that user has completed tour
        if (userData?.email) {
          dispatch(
            updateHasTakenTour({
              email: userData.email,
              hasTakenTour: true,
            })
          );
        }
      }
    }, 5000); // 5 seconds between steps

    return () => {
      if (tourInterval.current) {
        clearInterval(tourInterval.current);
      }
    };
  }, [tourState.isTourActive, tourState.currentStep, dispatch, userData]);

  // Handle authentication and session management
  useEffect(() => {
    if (isAnonymous) {
      dispatch(setIntroComplete(true));
      setIsUserDataLoaded(true);
      const cleanupTimer = setTimeout(() => {
        dispatch(logout());
        dispatch(resetIntroComplete());
      }, 30 * 60 * 1000);
      return () => clearTimeout(cleanupTimer);
    }

    if (token && isLoggedIn) {
      if (tokenExpiry && Date.now() < tokenExpiry) {
        dispatch(setIntroComplete(true));
        setIsUserDataLoaded(true);
        const timeout = setTimeout(() => {
          dispatch(logout());
          dispatch(resetIntroComplete());
        }, tokenExpiry - Date.now());
        return () => clearTimeout(timeout);
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  }, [token, isLoggedIn, tokenExpiry, isAnonymous, dispatch]);

  // Memoize the conditions for showing CancelTour to prevent unnecessary re-renders
  const showCancelTour = useMemo(() => {
    return (
      isLoggedIn && !isCheckingTour && introComplete && tourState.isTourActive
    );
  }, [isLoggedIn, isCheckingTour, introComplete, tourState]);

  // Memoize main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => {
    if (!introComplete) return <Introduction />;

    return (
      <main
        style={{
          background: theme.styles.mainBackground.background,
          backgroundSize: theme.styles.mainBackground.backgroundSize,
          animation: theme.styles.mainBackground.animation,
        }}
        className="min-h-screen xl:gap-0 gap-20 flex flex-col items-center justify-between xl:py-10 pt-5 overflow-x-hidden"
      >
        {!isAnonymous && <TaskComp />}
        <Header />
        {receivedData && (
          <VerseSection
            parsedData={parsedData}
            entireBookData={entireBookData}
            handleVerseClick={handleVerseClick}
            setEntireBookData={setEntireBookData}
          />
        )}
        {userData || isAnonymous ? (
          <InteractionSection />
        ) : (
          <p>Loading user data...</p>
        )}
      </main>
    );
  }, [
    introComplete,
    theme,
    isAnonymous,
    receivedData,
    parsedData,
    entireBookData,
    handleVerseClick,
    userData,
  ]);

  return (
    <section className="overflow-hidden">
      {showCancelTour && <CancelTour />}
      {mainContent}
    </section>
  );
};

export default HomePage;
