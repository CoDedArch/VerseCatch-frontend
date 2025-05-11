import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import InteractionSection from "@/shared/components/containers/InteractionSection";
import InspirationalCard from "@/shared/components/presentation/InspirationalCard";
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
import DonationOverlay from "@/shared/components/containers/DonationOverlay";
import AdBanner from "@/shared/components/containers/AdBanner";
import LoadingSpinner from "@/shared/components/presentation/LoadingSpinner";
import RatingOverlay from "@/shared/components/containers/RatingOverlay";
import { INSPIRATIONAL_VERSES } from "@/shared/constants/urlConstants";

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
  const [selectedInspirational, setSelectedInspirational] = useState();
  const [remaining_time, setRemainingTime] = useState();

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
  const [showDonationOverlay, setShowDonationOverlay] = useState(false);

  // ad state
  const [showAdBanner, setShowAdBanner] = useState(false);
  const [adClosed, setAdClosed] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);
  const adReappearTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);

  useEffect(() => {
    console.log(
      "[TOUR STEP] Current step changed:",
      tourState.currentStep,
      "of",
      tourSteps.length - 1,
      "| Active:",
      tourState.isTourActive
    );

    // Optional: Log the step details if needed
    if (tourState.isTourActive && tourSteps[tourState.currentStep]) {
      console.log("[TOUR STEP DETAILS]", tourSteps[tourState.currentStep]);
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

  const fetchInspirationalQuote = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      console.log("Using token:", token);

      const response = await fetch(INSPIRATIONAL_VERSES, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch book data", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Inspirational quote data:", data);
      setSelectedInspirational(data.verse);
      setRemainingTime(data.remaining_time);
    } catch (error) {
      console.error("Error in fetching Inspirational quote", error);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine when to show the Donation Overlay
  useEffect(() => {
    const shouldShowDonationOverlay = () => {
      // For logged-in users who haven't paid and caught enough verses
      if (
        !userData?.payment_status?.has_paid &&
        (userData?.total_verses_caught ?? 0) >= 6
      ) {
        return true;
      }

      if (isAnonymous) {
        // On larger screens (>768px), always show for anonymous users
        if (!isMobile) return true;

        // On mobile (≤768px), only show when there's no ad banner
        if (isMobile && !showAdBanner) return true;
      }

      return false;
    };

    setShowDonationOverlay(shouldShowDonationOverlay());
  }, [
    userData?.payment_status?.has_paid,
    userData?.total_verses_caught,
    isAnonymous,
    showAdBanner,
    isMobile,
  ]);

  // Show ad immediately for anonymous users
  useEffect(() => {
    if (isAnonymous && !adClosed && !showDonationOverlay) {
      setShowAdBanner(true);
    }
  }, [isAnonymous, adClosed, showDonationOverlay]);

  // fetch the Inspirational Quote for user
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (
        isLoggedIn &&
        (userData?.has_taken_tour || !tourState.isTourActive)
      ) {
        try {
          if (isMounted) setIsRefreshingQuote(true);
          await fetchInspirationalQuote();
        } finally {
          if (isMounted) setIsRefreshingQuote(false);
        }
      }
    };
    if (!userData?.has_taken_tour) {
      const timer = setTimeout(fetchData, 5000);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    } else {
      fetchData();
      return () => {
        isMounted = false;
      };
    }
  }, [
    isLoggedIn,
    fetchInspirationalQuote,
    tourState.isTourActive,
    userData?.has_taken_tour,
  ]);

  // Handle when timer completes for inspirational quotes
  const handleInspirationalTimerComplete = useCallback(async () => {
    setIsRefreshingQuote(true);
    try {
      await fetchInspirationalQuote();
    } finally {
      setIsRefreshingQuote(false);
    }
  }, [fetchInspirationalQuote]);

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
          hasTourStarted.current = true;
          dispatch(startTour());
        }
        setIsCheckingTour(false);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setIsCheckingTour(false);
    }
  }, [isLoggedIn, userData, isUserDataLoaded, dispatch]);

  // Handle tour progression
  useEffect(() => {
    if (!tourState.isTourActive) {
      console.log("Tour inactive - clearing interval");
      if (tourInterval.current) {
        clearInterval(tourInterval.current);
        tourInterval.current = null;
      }
      return;
    }

    console.log(`Starting tour progression from step ${tourState.currentStep}`);

    tourInterval.current = setInterval(() => {
      console.log(`Interval fired at step ${tourState.currentStep}`);

      if (tourState.currentStep < tourSteps.length - 1) {
        console.log(`Proceeding to next step from ${tourState.currentStep}`);
        dispatch(nextStep());
      } else {
        console.log("Tour completed - ending tour");
        clearInterval(tourInterval.current!);
        tourInterval.current = null;
        dispatch(endTour());

        if (userData?.email) {
          dispatch(
            updateHasTakenTour({
              email: userData.email,
              hasTakenTour: true,
            })
          );
        }
      }
    }, 5000);

    return () => {
      console.log("Cleaning up interval");
      if (tourInterval.current) {
        clearInterval(tourInterval.current);
      }
    };
  }, [tourState, dispatch, userData?.email]);

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

  // Handle ad progress and auto-close
  useEffect(() => {
    if (showAdBanner) {
      const duration = 5000;
      const startTime = Date.now();
      let animationFrameId: number;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setAdProgress(newProgress);

        if (newProgress < 100) {
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      };

      animationFrameId = requestAnimationFrame(updateProgress);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [showAdBanner]);

  // Handle ad closing
  const handleCloseAd = () => {
    if (adProgress >= 100) {
      setShowAdBanner(false);
      setAdClosed(true);

      adReappearTimerRef.current = setTimeout(() => {
        setAdClosed(false);
      }, 3 * 60 * 1000);
    }
  };

  // Clean up timers
  useEffect(() => {
    const currentAdTimer = adTimerRef.current;
    const currentReappearTimer = adReappearTimerRef.current;

    return () => {
      if (currentAdTimer) clearTimeout(currentAdTimer);
      if (currentReappearTimer) clearTimeout(currentReappearTimer);
    };
  }, []);

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
      <div
        style={{
          background: theme.styles.mainBackground.background,
          backgroundSize: theme.styles.mainBackground.backgroundSize,
          animation: theme.styles.mainBackground.animation,
        }}
        className="flex flex-col justify-between min-h-screen xl:gap-10 pt-3 "
      >
        <Header />
        <main
          style={{ background: "inherit" }}
          className="flex-1 overflow-y-auto"
        >
          {!isAnonymous && (
            <div>
              <TaskComp />
            </div>
          )}
          <div
            className={`w-full flex justify-center ${
              !receivedData ? "min-h-[50vh]" : "h-fit"
            }`}
          >
            {receivedData && (
              <VerseSection
                parsedData={parsedData}
                entireBookData={entireBookData}
                handleVerseClick={handleVerseClick}
                setEntireBookData={setEntireBookData}
              />
            )}

            {isRefreshingQuote ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              !receivedData &&
              selectedInspirational &&
              !tourState.isTourActive &&
              (
                <InspirationalCard
                  parsedData={selectedInspirational}
                  remaining_time={remaining_time ?? 0}
                  onTimerComplete={handleInspirationalTimerComplete}
                />
              )
            )}
          </div>
        </main>
        {/* InteractionSection now at the bottom */}

        {userData || isAnonymous ? (
          <InteractionSection />
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
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
    selectedInspirational,
    remaining_time,
    tourState,
    handleInspirationalTimerComplete,
    isRefreshingQuote,
  ]);

  return (
    <section className="min-h-[100dvh] overflow-hidden">
      {showCancelTour && <CancelTour />}
      {showDonationOverlay && <DonationOverlay />}
      <RatingOverlay />

      {mainContent}
      {isAnonymous && showAdBanner && (
        <AdBanner onClose={handleCloseAd} progress={adProgress} />
      )}
    </section>
  );
};

export default HomePage;
