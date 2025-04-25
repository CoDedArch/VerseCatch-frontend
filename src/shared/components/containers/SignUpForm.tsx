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
import { loginStart, loginFailure, loginSuccess } from "@/store/userSlice";
import { setIntroComplete } from "@/store/uiSlice";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState<SignUpStep>("email");
  const [showVersions, setShowVersions] = useState(false);
  const [email, setEmail] = useState("");
  const [identifier, setIdentfier] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      console.log("email", email);
      if (!validateEmail(email.trim())) {
        console.log("Error Occurred here");
        setError(ENTER_VALID_EMAIL_PROMPT);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const emailExists = await checkEmailExists(email.trim());
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
    if (!identifier) {
      setError(ENTER_VALID_EMAIL_PROMPT);
      return;
    }
    if (!password) {
      setError(ENTER_PASSWORD_PROMPT);
      return;
    }

    setIsLoading(true);
    setError("");
    dispatch(loginStart());

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || LOGIN_FAIL_PROMPT);

      console.log("Login userData", data.user);

      setShowCheckmark(true);

      dispatch(setIntroComplete(true));

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.access_token,
        })
      );
    } catch (err) {
      const errorMessage = (err as Error).message || ERROR_OCCURRED_PROMPT;
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-10 mx-10">
      <div className="flex flex-wrap gap-18 justify-center pb-10 p-2">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white w-[1/2] sm:w-[450px] px-6 py-2 pb-10 rounded-lg hover:cursor-pointer shadow-2xl shadow-black hover:bg-blue-100 transition-colors text-xl font-bold"
        >
          <h1 className="sm:text-3xl text-black font-bold text-center">
            {isLogin ? "login to VerseCatch" : "create your VerseCatch account"}
          </h1>

          <div className="space-y-3">
            <h2 className="text-sm text-center text-black font-bold">
              {isLogin
                ? "Welcome back! Please log in to continue."
                : "Start your journey and catch meaningful verses effortlessly."}
            </h2>

            <h2 className="text-sm sm:text-lg text-center text-blue-500 font-bold">
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
                    className="underline text-black cursor-pointer block sm:inline"
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

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 space-y-2"
          >
            {!isLogin && step === "details" && (
              <>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-2 w-full h-13 placeholder:text-[16px] rounded-2xl p-2"
                  placeholder="username"
                  required
                />
              </>
            )}

            <div className={step === "details" ? "hidden" : ""}>
              <input
                type="text"
                value={!isLogin ? email : identifier}
                onChange={(e) =>
                  !isLogin
                    ? setEmail(e.target.value)
                    : setIdentfier(e.target.value)
                }
                className={`border-2 w-full h-13 rounded-2xl p-2 placeholder:text-[16px]`}
                placeholder={`Enter your ${
                  isLogin ? "email/username" : "email"
                }`}
                required
              />
            </div>

            {(isLogin || step === "details") && (
              <>
                <div className={`relative`}>
                  <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className={`border-2 w-full h-13 placeholder:text-[16px] rounded-2xl p-2`}
                  placeholder="Enter your password"
                  required
                  />
                  {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <img
                    src={
                      showPassword
                      ? "/assets/eye-off.png"
                      : "/assets/eye.png"
                    }
                    alt="toggle password visibility"
                    className="w-5 h-5"
                    />
                  </button>
                  )}
                </div>

                {!isLogin && step === "details" && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-2 w-full h-13 rounded-2xl placeholder:text-[16px] p-2 pr-10"
                      placeholder="Confirm Password"
                      required
                    />
                    {confirmPassword && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <img
                          src={
                            showConfirmPassword
                              ? "/assets/eye-off.png"
                              : "/assets/eye.png"
                          }
                          alt="toggle password visibility"
                          className="w-5 h-5"
                        />
                      </button>
                    )}
                  </div>
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
          userDetails={{ userName, email, password }}
          authState={{ isLogin, step }}
          stateHandlers={{
            setError,
            setShowVersions: (value) => !isVerifying && setShowVersions(value),
            setIsVerifying,
          }}
        />
      )}
    </section>
  );
};

export default SignUpForm;
