import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import IntroMessage from "./IntroMessage";
import WaitingVerificationCard from "./WaitingVerificationCard";
import SignUpForm from "./SignUpForm";
import AnonnymousSignUpCard from "./AnonnymousSignupCard";
import BibleSelection from "./BibleSelection";

import { SignUpStep } from "../constants/interfaceConstants";

const Introduction = ({
  onComplete,
}: {
  onComplete: (version: string) => void;
}) => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [step, setStep] = useState<SignUpStep>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isWaitingForVerification, setIsWaitingForVerification] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      setShowGreeting(false);
      setShowAuthOptions(true);
    }, 4000);

    return () => clearTimeout(greetingTimer);
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <>
          {showGreeting && <IntroMessage />}

          {(showAuthOptions || isWaitingForVerification) && (
            <motion.section
              key="auth-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(135deg, #1CB5E0, #000046)",
              }}
              className="absolute w-full inset-0 z-50 flex flex-col items-center justify-center pt-10 sm:pt-0 space-y-10 sm:space-y-30"
            >
              <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white text-2xl sm:text-4xl font-extrabold pl-10"
              >
                {isWaitingForVerification
                  ? "🎉 One last step! Verify your email to unlock the full VerseCatch experience. 🎉"
                  : "How would you like to proceed?"}
              </motion.h2>
              <div className="flex flex-wrap gap-18 justify-center pb-10 p-2">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white w-fit px-6 py-2 pb-10 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-colors text-xl font-bold"
                >
                  <h1 className="text-3xl text-black font-bold text-center">
                    {isWaitingForVerification
                      ? "VerseCatch Team 📖😊"
                      : isLogin
                      ? "Login to VerseCatch"
                      : "Create your VerseCatch account"}
                  </h1>
                  <div className="space-y-3">
                    <h2 className="text-sm text-center text-black font-bold">
                      {isLogin
                        ? "Welcome back! Please log in to continue."
                        : "Start your journey and catch meaningful verses effortlessly."}
                    </h2>
                    <h2
                      className={`text-lg text-center text-blue-500 font-bold  ${
                        isWaitingForVerification ? "hidden" : ""
                      }`}
                    >
                      {isLogin ? (
                        <>
                          Don't have an account?{" "}
                          <span
                            className="underline text-black cursor-pointer"
                            onClick={() => {
                              setIsLogin(false);
                              setStep("email");
                            }}
                          >
                            Sign up
                          </span>
                          {showCheckmark && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.8 }}
                              className="flex justify-center"
                            >
                              <img
                                src="/assets/check.png"
                                alt="check mark"
                                className="w-20"
                              />
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <span
                            className="underline text-black cursor-pointer"
                            onClick={() => {
                              setIsLogin(true);
                              setStep("email");
                            }}
                          >
                            Login
                          </span>
                        </>
                      )}
                    </h2>
                  </div>
                  {isWaitingForVerification && (
                    <WaitingVerificationCard showCheckmark={showCheckmark} />
                  )}
                  <SignUpForm
                    isWaitingForVerification={isWaitingForVerification}
                    isLogin={isLogin}
                    isLoading={isLoading}
                    step={step}
                    firstName={firstName}
                    lastName={lastName}
                    email={email}
                    password={password}
                    error={error}
                    setEmail={setEmail}
                    setLastName={setLastName}
                    setFirstName={setFirstName}
                    setPassword={setPassword}
                    setError={setError}
                    setStep={setStep}
                    setShowAuthOptions={setShowAuthOptions}
                    setIsLoading={setIsLoading}
                    setShowVersions={setShowVersions}
                    setShowCheckmark={setShowCheckmark}
                  />
                </motion.div>

                <AnonnymousSignUpCard
                  step={step}
                  isWaitingForVerification={isWaitingForVerification}
                  setShowAuthOptions={setShowAuthOptions}
                  setShowVersions={setShowVersions}
                />
              </div>
            </motion.section>
          )}

          {showVersions && (
            <BibleSelection
              isWaitingForVerification={isWaitingForVerification}
              isLogin={isLogin}
              isLoading={isLoading}
              step={step}
              firstName={firstName}
              lastName={lastName}
              email={email}
              password={password}
              setShowAuthOptions={setShowAuthOptions}
              setIsLoading={setIsLoading}
              setShowVersions={setShowVersions}
              setShowCheckmark={setShowCheckmark}
              onComplete={onComplete}
              setError={setError}
              setIsExiting={setIsExiting}
              setIsWaitingForVerification={setIsWaitingForVerification}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default Introduction;
