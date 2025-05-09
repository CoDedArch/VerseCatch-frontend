import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { InspirationalProps } from "@/shared/constants/interfaceConstants";

const InspirationalCard = ({
  parsedData,
  remaining_time,
}: InspirationalProps) => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const [timeLeft, setTimeLeft] = useState(remaining_time);

  useEffect(() => {
    if (timeLeft <= 0) {
      window.location.reload();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining_time, timeLeft]);

  // Format time as MM:SS (minutes:seconds)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.section
        style={{
          background: `url('/assets/inspirational.jpg') no-repeat center / cover`,
          color: "white",
          position: "relative",
        }}
        key="verse-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-[350px] h-fit sm:h-fit mt-10 xl:w-1/2 space-y-4 p-10 sm:p-1 relative rounded-2xl bg-white/10 backdrop-blur-sm cursor-pointer"
      >
        {/* Black overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
            borderRadius: "inherit",
          }}
        ></div>

        {/* Tag in top left corner */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            INSPIRATIONAL
          </span>
        </div>

        {/* Countdown in top right corner */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center space-x-1 bg-black/70 text-white px-3 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Content area */}
        <div
          className="min-h-[300px] flex flex-col justify-center relative"
          style={{ zIndex: 2 }}
        >
          {parsedData && (
            <>
              <motion.h1
                className="text-center font-bold xl:text-3xl text-xl pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {`${parsedData.book} ${parsedData.chapter}:${parsedData?.verse}`}
              </motion.h1>
                <motion.p
                className="xl:text-2xl text-xl px-0 xl:px-20 mt-4 text-center"
                style={{ whiteSpace: "pre-wrap" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                >
                {parsedData.text}
                </motion.p>
            </>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default InspirationalCard;
