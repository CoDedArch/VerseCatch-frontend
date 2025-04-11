import { FC, useState, useEffect } from "react";
import { TaskCompInterface } from "../../constants/interfaceConstants";
import { tourSteps } from "@/shared/constants/varConstants";
import { INITIAL_TASK_STATE } from "@/shared/constants/varConstants";

const TaskComp: FC<TaskCompInterface> = ({userData, tourState }) => {
  const [taskState, setTaskState] = useState(INITIAL_TASK_STATE);
  const [showLoginTaskComplete, setShowLoginTaskComplete] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [animate, setAnimate] = useState(false);

  const toggleTaskVisibility = () => {
    setTaskState(prev => ({
      ...prev,
      isTaskVisible: !prev.isTaskVisible,
    }));
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    
    const updateVisibility = (matches: boolean) => {
      setTaskState(prev => ({
        ...prev,
        isTaskVisible: !matches,
      }));
    };

    updateVisibility(mediaQuery.matches);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      updateVisibility(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (tourState.isTourActive) {
      setTaskState(prev => ({
        ...prev,
        isTaskHighlighted: true,
      }));
      
      const timer = setTimeout(() => {
        setTaskState(prev => ({
          ...prev,
          isTaskHighlighted: false,
        }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [tourState.isTourActive]);

  useEffect(() => {
    if (userData?.faith_coins !== undefined) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [userData?.faith_coins]);

  useEffect(() => {
    if (showLoginTaskComplete) {
      const timer = setTimeout(() => {
        setShowLoginTaskComplete(false);
        setShowImage(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoginTaskComplete]);

  return (
    <>
      {/* Show button - rendered outside the panel */}
      {!taskState.isTaskVisible && (
        <button
          aria-label="Show task panel"
          onClick={toggleTaskVisibility}
          className="w-14 fixed z-[100] left-2 bottom-10 bg-black/50 p-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <img src="/assets/show.png" alt="show" className="w-full" />
        </button>
      )}

      {/* Task panel */}
      <div
        // style={{
        //   background: themeStyles?.taskBackground?.background,
        //   color: themeStyles?.taskBackground?.color,
        // }}
        className={`fixed left-2 sm:top-37 ${
          taskState.isTaskHighlighted ? "sm:z-[10000]" : "z-[1]"
        } sm:z-1 top-[140px] w-fit h-fit space-y-4 rounded-lg p-2 ${
          taskState.isTaskVisible ? "block animate-slide-in" : "hidden"
        } transition-all duration-300 shadow-lg`}
      >
        {/* Hide button - rendered inside the panel */}
        <button
          aria-label="Hide task panel"
          onClick={toggleTaskVisibility}
          className="w-14 absolute -right-5 -top-5 bg-black/50 p-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <img src="/assets/hide.png" alt="hide" className="w-full" />
        </button>

        {tourState.isTourActive && tourState.currentStep === 0 && (
          <div id="task-section">
            <div className="absolute text-white -right-[22em] w-[20em] text-xl font-bold p-2 top-1/2 transform -translate-y-1/2">
              <img
                src="/assets/left.png"
                alt="hand left"
                className="animate-move-left-right"
              />
              {tourSteps[0].description}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <h1 className="font-bold text-center text-2xl flex text-white">
            Daily Task{" "}
            <img src="/assets/trophy.png" alt="trophy" className="w-6" />
          </h1>
        </div>

        <ul className="space-y-2 text-black text-xl list-disc px-2 font-bold">
          <li
            className={`relative flex gap-5 p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              showLoginTaskComplete
                ? "bg-green-400 animate-pulse"
                : "bg-green-200"
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

        <div className="flex justify-center">
          <h1 className="font-bold text-center text-2xl flex text-white">
            Keep Going{" "}
            <img src="/assets/trophy.png" alt="trophy" className="w-6" />
          </h1>
        </div>

        <ul className="space-y-2 text-md list-disc px-2 font-bold text-black">
          <li
            className={`relative flex gap-5 bg-white p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100 ${
              (userData?.total_verses_caught / 100) * 100 === 100
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
                    (userData?.total_verses_caught / 100) * 100 === 100
                      ? "bg-green-400 text-black"
                      : "bg-black text-white"
                  } absolute top-0 -right-4 p-2 rounded-full font-bold`}
                >
                  {Math.round(
                    Math.min((userData?.total_verses_caught / 100) * 100, 100)
                  )}
                  %
                </span>
              </span>
            </div>
            {(userData?.total_verses_caught / 100) * 100 === 100 && (
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
              (userData?.unique_books_caught / 60) * 100 === 100
                ? "bg-green-400 animate-pulse"
                : ""
            }`}
          >
            Catch from 60 different books{" "}
            <div className="flex items-center gap-1">
              <span className="text-md font-bold">
                (Bible Explorer) -{" "}
                <span
                  className={`${
                    (userData?.unique_books_caught / 60) * 100 === 100
                      ? "bg-green-400 text-black"
                      : "bg-black text-white"
                  } absolute top-0 -right-4 p-2 rounded-full font-bold`}
                >
                  {Math.round(
                    Math.min((userData?.unique_books_caught / 60) * 100, 100)
                  )}
                  %
                </span>
              </span>
            </div>
            {(userData?.unique_books_caught / 60) * 100 === 100 && (
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
    </>
  );
};

export default TaskComp;