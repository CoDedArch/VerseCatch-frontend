import { useState } from "react";
import { motion } from "framer-motion";
import BlurImage from "./ImageBlur";
import { useUserData } from "../Hooks/useUserData";
import { DELETE_ACCOUNT_URL } from "@/shared/constants/urlConstants";

const DeleteAccount = () => {
  const { userData, token } = useUserData();
  const [isConfirming, setIsConfirming] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [randomCode, setRandomCode] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInitiateDelete = () => {
    setShowWarning(true);
  };

  const handleProceedToConfirmation = () => {
    setRandomCode(generateRandomCode());
    setIsConfirming(true);
    setShowWarning(false);
    setError("");
  };

  const handleCancelDelete = () => {
    setIsConfirming(false);
    setShowWarning(false);
    setConfirmationText("");
    setRandomCode("");
  };

  const handleConfirmDelete = async () => {
    if (confirmationText !== randomCode) {
      setError("The code you entered doesn't match. Please try again.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const userEmail = userData?.email;
      const response = await fetch(DELETE_ACCOUNT_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete account");
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("username");
      localStorage.removeItem("bible_version");
      window.location.reload();
    } catch (err) {
      setError(
        (err as Error).message || "Failed to delete account. Please try again."
      );
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed -right-6 top-0  z-[1001] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={handleCancelDelete}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl z-[1002]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Are you sure you want to delete your account?
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm dark:text-gray-300 mb-3">
                This action is permanent and cannot be undone. Deleting your account will:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Permanently delete all your account data</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Erase all your achievements and progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Remove your payment history and subscriptions</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToConfirmation}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                disabled={isDeleting}
              >
                continue
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed bg-white text-sm inset-0 z-[1001] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={handleCancelDelete}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6 shadow-xl z-[1002]"
          >
            <div className="mb-4">
              <p className="font-bold text-red-700 dark:text-red-400 mb-2">
                Type the following code to confirm account deletion:
              </p>
              <div className="bg-white dark:bg-gray-700 dark:text-white p-3 rounded font-mono text-lg text-center mb-3 border border-red-200 dark:border-red-700">
                {randomCode}
              </div>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:placeholder:text-white dark:border-gray-700"
                placeholder="Enter the code above"
                autoFocus
              />
              {error && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Button */}
      <motion.li
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="hover:bg-white/20 pl-2 border-2 rounded-lg font-bold text-lg flex items-center sm:gap-2 transition-all cursor-pointer text-red-500"
        onClick={handleInitiateDelete}
      >
        <BlurImage
          src="/assets/delete.png"
          alt="Delete Account"
          className="w-5 sm:w-5 pointer-events-none"
          isIcon={true}
        />
        <span className="bg-slate-400/10 p-1 rounded">Delete Account</span>
      </motion.li>
    </>
  );
};

export default DeleteAccount;