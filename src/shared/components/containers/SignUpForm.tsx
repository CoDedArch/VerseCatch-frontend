import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { SignUpStep } from "../../constants/interfaceConstants";
import BibleSelection from "./BibleSelection";
import {
  CHECK_EMAIL_FAIL_PROMPT,
  EMAIL_ALREADY_EXIST_PROMPT,
  ENTER_PASSWORD_PROMPT,
  ENTER_VALID_EMAIL_PROMPT,
  ERROR_OCCURRED_PROMPT,
  LOGIN_FAIL_PROMPT,
  PASSWORD_MISMATCH_PROMPT,
  WEAK_PASSWORD_PROMPT,
} from "../../constants/varConstants";
import { LOGIN_URL, CHECK_EMAIL_URL } from "../../constants/urlConstants";
import { loginStart, loginFailure, loginSuccess} from "@/store/userSlice";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState<SignUpStep>("email");
  const [showVersions, setShowVersions] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const checkEmailExists = async (email: string) => {
    try {
      const response = await fetch(CHECK_EMAIL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || CHECK_EMAIL_FAIL_PROMPT);
      return data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
      throw err;
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNext = async () => {
    if (isLogin) {
      await handleLoginSubmit();
      return;
    }

    if (step === "email") {
      if (!validateEmail(email)) {
        setError(ENTER_VALID_EMAIL_PROMPT);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          setError(EMAIL_ALREADY_EXIST_PROMPT);
        } else {
          setStep("details");
        }
      } catch (err) {
        setError((err as Error).message || CHECK_EMAIL_FAIL_PROMPT);
      } finally {
        setIsLoading(false);
      }
    } else if (step === "details") {
      if (!validatePassword(password)) {
        setError(WEAK_PASSWORD_PROMPT);
        return;
      }
      if (password !== confirmPassword) {
        setError(PASSWORD_MISMATCH_PROMPT);
        return;
      }
      setStep("version");
      setShowVersions(true);
    }
  };

  const handleLoginSubmit = async () => {
    if (!validateEmail(email)) {
      setError(ENTER_VALID_EMAIL_PROMPT);
      return;
    }
    if (!password) {
      setError(ENTER_PASSWORD_PROMPT);
      return;
    }

    setIsLoading(true);
    setError("");
    dispatch(loginStart())

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || LOGIN_FAIL_PROMPT);

      console.log("Signup userData", data.user)
      
      setShowCheckmark(true);

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(loginSuccess({
        user: data.user,
        token: data.access_token
      }))
      
    } catch (err) {
      const errorMessage =(err as Error).message || ERROR_OCCURRED_PROMPT 
      setError(errorMessage);
      dispatch(loginFailure(errorMessage))
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-10">
      <div className="flex flex-wrap gap-18 justify-center pb-10 p-2">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white w-[450px] px-6 py-2 pb-10 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-colors text-xl font-bold"
        >
          <h1 className="text-3xl text-black font-bold text-center">
            {isLogin ? "Login to VerseCatch" : "Create your VerseCatch account"}
          </h1>
          
          <div className="space-y-3">
            <h2 className="text-sm text-center text-black font-bold">
              {isLogin
                ? "Welcome back! Please log in to continue."
                : "Start your journey and catch meaningful verses effortlessly."}
            </h2>
            
            <h2 className="text-lg text-center text-blue-500 font-bold">
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
                      <img src="/assets/check.png" alt="check mark" className="w-20" />
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

          <form onSubmit={(e) => e.preventDefault()} className="mt-10 space-y-2">
            {!isLogin && step === "details" && (
              <>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-2 w-full h-13 rounded-2xl p-2"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-2 w-full h-13 rounded-2xl p-2"
                  placeholder="Last Name"
                  required
                />
              </>
            )}

            <div className={step === "details" ? "hidden" : ""}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 w-full h-13 rounded-2xl p-2"
                placeholder="Enter your email"
                required
              />
            </div>

            {(isLogin || step === "details") && (
              <>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 w-full h-13 rounded-2xl p-2"
                  placeholder="Enter your password"
                  required
                />
                {!isLogin && step === "details" && (
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-2 w-full h-13 rounded-2xl p-2"
                    placeholder="Confirm Password"
                    required
                  />
                )}
              </>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="button"
              onClick={handleNext}
              className="border-2 w-full h-13 rounded-2xl text-black bg-blue-100 hover:bg-blue-200 transition-colors flex justify-center items-center cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              ) : isLogin ? (
                "Login"
              ) : step === "email" || step === "details" ? (
                "Next"
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {showVersions && (
        <BibleSelection
          userDetails={{ firstName, lastName, email, password }}
          authState={{ isLogin, step }}
          stateHandlers={{ 
            setError, 
            setShowVersions: (value) => !isVerifying && setShowVersions(value),
            setIsVerifying
          }}
        />
      )}
    </section>
  );
};

export default SignUpForm;