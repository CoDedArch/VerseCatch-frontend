import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserData } from "../Hooks/useUserData";
import { SUBMIT_RATING_URL } from "@/shared/constants/urlConstants";

const RatingOverlay = () => {
  const { userData, isLoggedIn } = useUserData();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Check if rating should be shown
  useEffect(() => {
    if (isLoggedIn && userData) {
      const hasRated = userData.has_rated;
      const verseCount = userData.total_verses_caught || 0;
      
      if (!hasRated && verseCount >= 2) {
        const timer = setTimeout(() => {
          setShowOverlay(true);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, userData]);

  const handleRatingSubmit = async () => {
    if (selectedRating === null) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(SUBMIT_RATING_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          rating: selectedRating,
          userId: userData?.id,
        }),
      });

      if (response.ok) {
        setSubmissionSuccess(true);
        localStorage.setItem("hasRatedApp", "true");
        setTimeout(() => setShowOverlay(false), 2000);
      } else {
        throw new Error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Rating submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDescription = (rating: number) => {
    switch(rating) {
      case 5: return "Excellent - Perfect experience!";
      case 4: return "Best - Really enjoying it";
      case 3: return "Better - Good but could improve";
      case 2: return "Good - Has potential";
      case 1: return "Worse - Needs work";
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOverlay(false)}
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-md rounded-xl bg-gradient-to-br from-slate-800 to-slate-900/5 p-6 shadow-xl border border-slate-700"
          >
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              ✕
            </button>

            {submissionSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-300">
                  We appreciate your feedback and will use it to improve VerseCatch.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  How's Your VerseCatch Experience?
                </h3>
                <p className="text-gray-300 mb-6">
                  You've caught {userData?.total_verses_caught} verses! Help us improve by rating your experience.
                </p>

                <div className="flex justify-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-12 h-12 rounded-full flex items-center hover:cursor-pointer justify-center text-lg font-bold transition-all ${
                        selectedRating === rating
                          ? "bg-blue-500 text-white scale-110"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                      disabled={isSubmitting}
                    >
                      {rating}
                    </button>
                  ))}
                </div>

                {selectedRating && (
                  <div className="mb-6 p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-blue-400 font-medium">
                      {getRatingDescription(selectedRating)}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleRatingSubmit}
                  disabled={selectedRating === null || isSubmitting}
                  className="w-full rounded-lg bg-blue-600 hover:cursor-pointer px-4 py-3 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingOverlay;