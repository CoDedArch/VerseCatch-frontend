import { FC } from "react";

import { useState } from "react";
import { SignUpFormInterface } from "../../constants/interfaceConstants";
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

const SignUpForm: FC<SignUpFormInterface> = ({
  isWaitingForVerification,
  isLogin,
  isLoading,
  step,
  firstName,
  lastName,
  email,
  password,
  error,
  setLastName,
  setFirstName,
  setPassword,
  setEmail,
  setError,
  setStep,
  setShowAuthOptions,
  setIsLoading,
  setShowVersions,
  setShowCheckmark,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validate password strength
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

      if (!response.ok) {
        throw new Error(data.detail || CHECK_EMAIL_FAIL_PROMPT);
      }

      return data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
      throw err;
    }
  };

  // Validate email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle "Next" button click for sign-up
  const handleNext = async () => {
    if (isLogin) {
      // If logging in, submit the form
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
      // Validate password strength
      if (!validatePassword(password)) {
        setError(WEAK_PASSWORD_PROMPT);
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        setError(PASSWORD_MISMATCH_PROMPT);
        return;
      }

      setStep("version");
      setShowVersions(true);
    }
  };

  // Handle form submission for login
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

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || LOGIN_FAIL_PROMPT);
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("isLoggedIn", "true");
      const expirationTime = Date.now() + 30 * 60 * 1000;
      localStorage.setItem("token_expiry", expirationTime.toString());

      setShowCheckmark(true);

      setTimeout(() => {
        setShowAuthOptions(false);
        setShowVersions(false);
        setShowCheckmark(false);
        // onComplete("");
        window.location.reload();
      }, 1500);

      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError((err as Error).message || ERROR_OCCURRED_PROMPT);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`mt-10 space-y-2 ${isWaitingForVerification ? "hidden" : ""}`}
    >
      {!isLogin && step === "details" && (
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-2 w-full h-13 rounded-2xl p-2"
            placeholder="First Name"
            required
          />
        </div>
      )}
      {!isLogin && step === "details" && (
        <div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-2 w-full h-13 rounded-2xl p-2"
            placeholder="Last Name"
            required
          />
        </div>
      )}
      <div className={`${step === "details" ? "hidden" : ""}`}>
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
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 w-full h-13 rounded-2xl p-2"
            placeholder="Enter your password"
            required
          />
        </div>
      )}
      {!isLogin && step === "details" && (
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-2 w-full h-13 rounded-2xl p-2"
            placeholder="Confirm Password"
            required
          />
        </div>
      )}
      {error && <p className={`text-red-500 text-sm`}>{error}</p>}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="border-2 w-full h-13 rounded-2xl text-black bg-blue-100 hover:bg-blue-200 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : isLogin ? (
            "Login"
          ) : step === "email" || step === "details" ? (
            "Next"
          ) : (
            "Submit"
          )}
        </button>
      )}
    </form>
  );
};

export default SignUpForm;
