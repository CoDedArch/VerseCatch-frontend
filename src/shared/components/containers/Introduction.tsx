import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import IntroMessage from "../presentation/IntroMessage";
import AnonnymousSignUpCard from "./AnonnymousSignupCard";
import SignUpForm from "./SignUpForm";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { hideGreeting } from "@/store/greetingsSlice";

const Introduction = () => {
  const dispatch = useDispatch();
  const showGreeting = useSelector(
    (state: RootState) => state.greetings.showGreeting
  );

  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      dispatch(hideGreeting());
    }, 4000);

    return () => clearTimeout(greetingTimer);
  }, [dispatch]);

  return (
    <AnimatePresence>
      {showGreeting && <IntroMessage />}

      <motion.section
        key="auth-options"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #1CB5E0, #000046)",
        }}
        className="absolute w-full inset-0 z-50 flex flex-col items-center justify-center pt-0 sm:pt-0 space-y-10 sm:space-y-30"
      >
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white text-2xl sm:text-4xl text font-extrabold text-center px-2"
        >
          How would you like to proceed?
        </motion.h2>
        <div className="flex flex-col sm:flex-row gap-10 ">
          <SignUpForm />

          <AnonnymousSignUpCard />
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default Introduction;
