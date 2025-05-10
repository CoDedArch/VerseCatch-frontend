import { useState, useEffect } from "react";
import { tourSteps } from "@/shared/constants/varConstants";
import { INITIAL_TASK_STATE } from "@/shared/constants/varConstants";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import BlurImage from "./ImageBlur";

const TaskComp = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { user } = useSelector((state: RootState) => state.user);
  const tourState = useSelector((state: RootState) => state.tour);
  const [taskState, setTaskState] = useState(INITIAL_TASK_STATE);
  const [showLoginTaskComplete, setShowLoginTaskComplete] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [animate, setAnimate] = useState(false);

  const toggleTaskVisibility = () => {
    setTaskState((prev) => ({
      ...prev,
      isTaskVisible: !prev.isTaskVisible,
    }));
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updateVisibility = (matches: boolean) => {
      // Force visible during tour step 0, otherwise follow normal behavior
      const shouldBeVisible =
        !matches || (tourState.isTourActive && tourState.currentStep === 0);
      setTaskState((prev) => ({
        ...prev,
        isTaskVisible: shouldBeVisible,
      }));
    };

    updateVisibility(mediaQuery.matches);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      updateVisibility(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [tourState.isTourActive, tourState.currentStep]);

  useEffect(() => {
    if (user?.faith_coins !== undefined) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user?.faith_coins]);

  useEffect(() => {
    if (showLoginTaskComplete) {
      const timer = setTimeout(() => {
        setShowLoginTaskComplete(false);
        setShowImage(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoginTaskComplete]);

  useEffect(() => {
    if (tourState.isTourActive && tourState.currentStep === 0) {
      setTaskState((prev) => ({
        ...prev,
        isTaskVisible: true, // Force visible during tour
        isTaskHighlighted: true,
      }));

      const timer = setTimeout(() => {
        setTaskState((prev) => ({
          ...prev,
          isTaskHighlighted: false,
          // Only set back to hidden if not on mobile
          isTaskVisible: window.matchMedia("(min-width: 641px)").matches,
        }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [tourState.isTourActive, tourState.currentStep, dispatch]);

  return (
    <>
      {/* Show button - rendered outside the panel */}
      <AnimatePresence>
        {!taskState.isTaskVisible && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            aria-label="Show task panel"
            onClick={toggleTaskVisibility}
            className="w-10 h-40 sm:w-14 fixed z-[100] -left-6 sm:-left-6 backdrop-blur-sm top-[140px] bg-slate-300/50 p-1 sm:rounded-full rounded-2xl cursor-pointer transition-all hover:bg-slate-500/70 focus:outline-none focus:ring-2 focus:ring-white/5"
          >
            <BlurImage
              src="/assets/slide.png"
              alt="slide"
              className="w-full pointer-events-none"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Task panel with animations */}
      <AnimatePresence>
        {taskState.isTaskVisible && (
          <motion.div
            style={{
              background: theme.styles?.taskBackground.background,
              color: theme.styles?.taskBackground.color,
              zIndex: taskState.isTaskHighlighted ? 10000 : 1,
            }}
            initial={{ x: -320, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 25 },
            }}
            exit={{
              x: -320,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className={`fixed left-2 sm:top-37 ${
              taskState.isTaskHighlighted ? "sm:z-[10000]" : "z-[1]"
            } sm:z-1 top-[140px] z-[100000] w-fit h-fit space-y-4 rounded-lg p-2 shadow-lg bg-white/90 backdrop-blur-sm no-highlight`}
          >
            {/* Hide button - rendered inside the panel */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Hide task panel"
              onClick={toggleTaskVisibility}
              className="w-10 sm:w-14 absolute right-0 sm:-right-5 backdrop-blur-sm -top-5 bg-black/50 p-1 rounded-full cursor-pointer hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <BlurImage
                src="/assets/hide.png"
                alt="hide"
                className="w-full pointer-events-none"
              />
            </motion.button>

            {taskState.isTaskHighlighted && tourState.isTourActive && (
              <div id="task-section">
                <div className="absolute text-white -right-[22em] w-[20em] text-xl font-bold p-2 top-1/2 transform -translate-y-1/2">
                  <BlurImage
                    src="/assets/left.png"
                    alt="hand left"
                    className="animate-move-left-right w-10 sm:w-20"
                  />
                  {tourSteps[0].description}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <h1 className="font-bold text-center text-2xl flex">
                Daily Task{" "}
                <BlurImage
                  src="/assets/trophy.png"
                  alt="trophy"
                  className="w-6 pointer-events-none"
                  priority={true}
                />
              </h1>
            </div>

            <ul className="space-y-2 text-xl list-disc px-2 font-bold">
              <li
                style={{
                  background: theme.styles?.taskBackground.contentBackground,
                }}
                className={`relative flex justify-between items-center gap-5 p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  showLoginTaskComplete
                    ? "bg-green-400 animate-pulse"
                    : "bg-green-200"
                }`}
              >
                Login Daily{" "}
                <div className="flex items-center gap-1">
                  <BlurImage
                    src="/assets/fire.png"
                    alt="fire"
                    className="w-5 pointer-events-none"
                    priority={true}
                  />
                  <span className="text-md">+1</span>
                </div>
                {showImage && (
                  <BlurImage
                    src="/assets/task.png"
                    alt="task"
                    className="w-10 absolute right-0 top-0 animate-fade-in pointer-events-none"
                    priority={true}
                  />
                )}
              </li>
              <li
                style={{
                  background: theme.styles?.taskBackground.contentBackground,
                }}
                className={`flex gap-5 p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  animate ? "bg-green-400 animate-pulse" : "bg-green-200"
                }`}
              >
                Catching 1 bible verse{" "}
                <div className="flex items-center gap-1">
                  <BlurImage
                    src="/assets/coin.png"
                    alt="coin"
                    className="w-5 pointer-events-none"
                    priority={true}
                  />
                  <span className="text-md">+2</span>
                </div>
              </li>
            </ul>

            <div className="flex justify-center">
              <h1 className="font-bold text-center text-2xl flex">
                Keep Going{" "}
                <BlurImage
                  src="/assets/trophy.png"
                  alt="trophy"
                  className="w-6 pointer-events-none"
                  priority={true}
                />
              </h1>
            </div>

            <ul className="space-y-2 text-md list-disc px-2 font-bold">
              <li
                style={{
                  background: theme.styles?.taskBackground.contentBackground,
                }}
                className={`relative flex gap-5 bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
                  user?.total_verses_caught === 100
                    ? "bg-green-400 animate-pulse"
                    : ""
                }`}
              >
                Catch 100 verses{" "}
                <div className="flex items-center gap-1">
                  <span className="text-md font-bold">
                    (Verse Catcher) -{" "}
                    <span
                      className={`${
                        user?.total_verses_caught === 100
                          ? "bg-green-400 text-black"
                          : "bg-black text-white"
                      } absolute top-0 -right-4 p-2 rounded-full font-bold`}
                    >
                      {user?.total_verses_caught + " / " + 100}
                    </span>
                  </span>
                </div>
                {(user?.total_verses_caught ?? 0 / 100) * 100 === 100 && (
                  <img
                    src="/assets/task.png"
                    alt="task"
                    className="w-10 absolute right-0 top-0 animate-fade-in bg-white"
                  />
                )}
              </li>
              <li
                style={{
                  background: theme.styles?.taskBackground.contentBackground,
                }}
                className={`relative flex gap-5 text-sm bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
                  user?.streak === 7 ? "bg-green-400 animate-pulse" : ""
                }`}
              >
                {user?.streak === 7 && (
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
                style={{
                  background: theme.styles?.taskBackground.contentBackground,
                }}
                className={`relative flex gap-1 text-sm bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
                  user?.unique_books_caught === 60
                    ? "bg-green-400 animate-pulse"
                    : ""
                }`}
              >
                Catch 60 different books{" "}
                <div className="flex items-center gap-1">
                  <span className="text-md font-bold">
                    (Bible Explorer) -{" "}
                    <span
                      className={`${
                        user?.unique_books_caught === 60
                          ? "bg-green-400 text-black"
                          : "bg-black text-white"
                      } absolute top-0 -right-4 p-2 rounded-full font-bold`}
                    >
                      {user?.unique_books_caught + " / " + 60}
                    </span>
                  </span>
                </div>
                {(user?.unique_books_caught ?? 0 / 60) * 100 === 100 && (
                  <img
                    src="/assets/task.png"
                    alt="task"
                    className="w-10 absolute right-0 top-0 animate-fade-in bg-white"
                  />
                )}
              </li>
              <li
                style={{
                  background: theme.styles?.taskBackground.contentBackground,
                }}
                className="flex gap-5 text-sm bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100"
              >
                Share 50 verses with friends{" "}
                <div className="flex items-center gap-1">
                  <span className="text-md font-bold">(Sharing Saint)</span>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskComp;
