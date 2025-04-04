import { FC } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { BibleSelectionInterface } from "../constants/interfaceConstants";

import {
  book_versions,
  ERROR_OCCURRED_PROMPT,
  SIGNUP_AGAIN_PROMPT,
} from "../constants/varConstants";

import { SIGNUP_URL, LOGIN_URL } from "../constants/urlConstants";

const BibleSelection: FC<BibleSelectionInterface> = ({
  isLogin,
  setIsExiting,
  onComplete,
  step,
  email,
  firstName,
  lastName,
  password,
  setIsLoading,
  setError,
  setIsWaitingForVerification,
  setShowAuthOptions,
  setShowVersions,
  setShowCheckmark,
}) => {
  const [isVersionSelectionLoading, setIsVersionSelectionLoading] =
    useState(false);

  const handleVersionSelect = async (version: string) => {
    if (isLogin) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete(version);
        window.location.reload();
      }, 500);
    } else if (step === "version") {
      setIsVersionSelectionLoading(true);
      await handleSignUpSubmit(version);
      setIsVersionSelectionLoading(false);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        localStorage.setItem("username", "anonymous");
        localStorage.setItem("bible_version", version);
        // onComplete(version);
        window.location.reload();
      }, 500);
    }
  };

  // Handle form submission for sign-up
  const handleSignUpSubmit = async (version: string) => {
    const userData = {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      bible_version: version,
    };

    console.log("user Data: ", userData);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || SIGNUP_AGAIN_PROMPT);
      }

      setIsWaitingForVerification(true);
      setShowAuthOptions(false);
      setShowVersions(false);

      // Poll the backend for verification status
      const pollVerificationStatus = async () => {
        try {
          const loginResponse = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userData.email,
              password: userData.password,
            }),
          });

          if (loginResponse.ok) {
            clearInterval(pollingInterval);
            setShowCheckmark(true);
            setTimeout(() => {
              setIsWaitingForVerification(false);
              setShowCheckmark(false);
              // onComplete(version); // Complete the process after verification
              window.location.reload();
            }, 1500);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      };

      const pollingInterval = setInterval(pollVerificationStatus, 5000);
    } catch (err) {
      setError((err as Error).message || ERROR_OCCURRED_PROMPT);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.section
      key="versions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "linear-gradient(135deg, #1CB5E0, #000046)",
      }}
      className="absolute w-full h-fit sm:h-full inset-0 z-50 flex flex-col items-center justify-center pt-10 sm:pt-0 space-y-10 sm:space-y-40"
    >
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white text-2xl sm:text-4xl font-extrabold"
      >
        Choose a Bible version:
      </motion.h2>
      {isVersionSelectionLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center pb-10">
          {book_versions
            .slice()
            .sort((a, b) => a.localeCompare(b))
            .map((version, index) => (
              <motion.button
                key={version}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-blue-500 px-6 py-2 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-colors text-xl font-bold"
                onClick={() => handleVersionSelect(version)}
              >
                {version}
              </motion.button>
            ))}
        </div>
      )}
    </motion.section>
  );
};

export default BibleSelection;
