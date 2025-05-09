import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BibleSelectionInterface } from "../../constants/interfaceConstants";
import WaitingVerificationCard from "../presentation/WaitingVerificationCard";
import {
  book_versions,
  ERROR_OCCURRED_PROMPT,
  SIGNUP_AGAIN_PROMPT,
} from "../../constants/varConstants";
import { SIGNUP_URL, LOGIN_URL } from "../../constants/urlConstants";
import { useDispatch } from "react-redux";
import { hideGreeting } from "@/store/greetingsSlice";
import { setIntroComplete } from "@/store/uiSlice";

const BibleSelection: FC<BibleSelectionInterface> = ({
  userDetails,
  authState,
  stateHandlers,
}) => {
  const dispatch = useDispatch();
  const [isWaitingForVerification, setIsWaitingForVerification] =
    useState(false);
  const [isVersionSelectionLoading, setIsVersionSelectionLoading] =
    useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  const handleVersionSelect = async (version: string) => {
    if (authState.isLogin) {
      setTimeout(() => window.location.reload(), 500);
      return;
    }

    setIsVersionSelectionLoading(true);
    await handleSignUpSubmit(version);
    setIsVersionSelectionLoading(false);
  };

  const handleSignUpSubmit = async (version: string) => {
    const userData = {
      email: userDetails.email,
      user_name: userDetails.userName,
      password: userDetails.password,
      bible_version: version,
    };

    stateHandlers.setError("");
    stateHandlers.setIsVerifying(true);
    setIsWaitingForVerification(true);

    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || SIGNUP_AGAIN_PROMPT);

      const interval = setInterval(async () => {
        try {
          const loginResponse = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: userData.email?.trim() || userData.user_name?.trim(),
              password: userData.password?.trim(),
            }),
          });

          if (loginResponse.ok) {
            clearInterval(interval);
            dispatch(hideGreeting());
            dispatch(setIntroComplete(false));
            console.log("User Login");
            window.location.reload();
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);

      setPollingInterval(interval);
    } catch (err) {
      stateHandlers.setError((err as Error).message || ERROR_OCCURRED_PROMPT);
      setIsWaitingForVerification(false);
      stateHandlers.setIsVerifying(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "linear-gradient(135deg, #1CB5E0, #000046)",
      }}
      className="fixed w-full h-full inset-0 z-50 flex flex-col items-center justify-center"
    >
      {isWaitingForVerification ? (
        <WaitingVerificationCard />
      ) : (
        <>
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white  ml-10 sm:ml-0 text-2xl sm:text-4xl font-extrabold mb-10"
          >
            Select your preferred Bible version(choose one):
          </motion.h2>

          {isVersionSelectionLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center  px-4">
              {book_versions
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((version, index) => (
                    <motion.button
                    key={version.value}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:cursor-pointer font-bold shadow-lg hover:bg-blue-100 transition-colors text-sm sm:text-lg whitespace-nowrap"
                    onClick={() => handleVersionSelect(version.value)}
                    >
                    <span className="sm:hidden">{version.value}</span>
                    <span className="hidden sm:inline">{version.label}</span>
                    </motion.button>
                ))}
            </div>
          )}
        </>
      )}
    </motion.section>
  );
};

export default BibleSelection;
