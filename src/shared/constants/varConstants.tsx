import { TourState, TaskState } from "./interfaceConstants";
import getThemeStyles from "../components/Hooks/GetThemeHook";



export const LOGIN_FAIL_PROMPT = "Login failed. Please try again.";
export const CHECK_EMAIL_FAIL_PROMPT =
  "An error occurred while checking the email. Please try again.";
export const EMAIL_ALREADY_EXIST_PROMPT =
  "This email is already registered. Please log in or use a different email.";
export const ENTER_VALID_EMAIL_PROMPT = "Please enter a valid email address.";
export const SIGNUP_AGAIN_PROMPT = "Signup failed. Please try again.";
export const WEAK_PASSWORD_PROMPT =
  "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
export const PASSWORD_MISMATCH_PROMPT = "Passwords do not match.";
export const NEW_PASSWORD_DIFF_PROMPT = "New passwords don't match";
export const NEW_PASSWORD_FAILED_PROMPT = "Failed to change password";
export const NEW_PASSWORD_SUCCESS_PROMPT = "Password changed successfully!";
export const ALL_PASSWORD_FIELDS_REQUIRED_PROMPT = "All fields are required";
export const DIFF_PASSWORD_PROMPT =
  "New password must be different from current password";
export const ENTER_PASSWORD_PROMPT = "Please enter your password.";
export const ERROR_OCCURRED_PROMPT = "An error occurred. Please try again.";
export const UPDATE_BIBLE_VERSION_FAIL = "Failed to update Bible version";
export const UPDATE_BIBLE_VERSION_SUCCESS =
  "Bible version updated successfully";

export const book_versions = [
  "AKJV_bible",
  "ASV_bible",
  "BRG_bible",
  "EHV_bible",
  "ESV_bible",
  "ESVUK_bible",
  "GNV_bible",
  "GW_bible",
  "ISV_bible",
  "JUB_bible",
  "KJ21_bible",
  "KJV_bible",
  "LEB_bible",
  "MEV_bible",
  "NASB_bible",
  "NASB1995_bible",
  "NET_bible",
  "NIV_bible",
  "NIVUK_bible",
  "NKJV_bible",
  "NLT_bible",
  "NLV_bible",
  "NOG_bible",
  "NRSV_bible",
  "NRSVUE_bible",
  "WEB_bible",
  "YLT_bible",
];


export const tourSteps = [
  {
    id: "task-section",
    description:
      "This is your personal hub for staying organized and on top of your goals.",
  },
  {
    id: "version-section",
    description: "This displays your Bible Version Preference.",
  },
  {
    id: "profile-section",
    description:
      "This section displays your current tag, faith coins, login streak, and profile settings.",
  },
  {
    id: "interaction-section",
    description:
      "This displays your Bible Version Preference in the interaction component.",
  },
];


export const INITIALTOURSTATE: TourState = {
  isTourActive: false,
  currentStep: 0,
  isCancelled: false,
}
export const INITIAL_TASK_STATE: TaskState = {
  isTaskVisible: true,
  isTaskHighlighted: false,
  showControls: true,
}


export const defaultTheme = {
        id: "default",
        name: "default",
        display_name: "Default",
        price: 0,
        preview_image_url: "",
        is_default: true,
        is_current: true,
        unlocked: true,
        styles: getThemeStyles("default"),
      };