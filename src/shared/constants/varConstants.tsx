import { TaskState } from "./interfaceConstants";
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
    { value: "AKJV_bible", label: "American King James Version (AKJV)" },
    { value: "ASV_bible", label: "American Standard Version (ASV)" },
    { value: "BRG_bible", label: "BRG Bible (BRG)" },
    { value: "EHV_bible", label: "Evangelical Heritage Version (EHV)" },
    { value: "ESV_bible", label: "English Standard Version (ESV)" },
    { value: "ESVUK_bible", label: "English Standard Version Anglicised (ESVUK)" },
    { value: "GNV_bible", label: "Geneva Bible (GNV)" },
    { value: "GW_bible", label: "God's Word Translation (GW)" },
    { value: "ISV_bible", label: "International Standard Version (ISV)" },
    { value: "JUB_bible", label: "Jubilee Bible (JUB)" },
    { value: "KJ21_bible", label: "21st Century King James Version (KJ21)" },
    { value: "KJV_bible", label: "King James Version (KJV)" },
    { value: "LEB_bible", label: "Lexham English Bible (LEB)" },
    { value: "MEV_bible", label: "Modern English Version (MEV)" },
    { value: "NASB_bible", label: "New American Standard Bible (NASB)" },
    { value: "NASB1995_bible", label: "New American Standard Bible 1995 (NASB1995)" },
    { value: "NET_bible", label: "New English Translation (NET)" },
    { value: "NIV_bible", label: "New International Version (NIV)" },
    { value: "NIVUK_bible", label: "New International Version UK (NIVUK)" },
    { value: "NKJV_bible", label: "New King James Version (NKJV)" },
    { value: "NLT_bible", label: "New Living Translation (NLT)" },
    { value: "NLV_bible", label: "New Life Version (NLV)" },
    { value: "NOG_bible", label: "Names of God Bible (NOG)" },
    { value: "NRSV_bible", label: "New Revised Standard Version (NRSV)" },
    { value: "NRSVUE_bible", label: "New Revised Standard Version Updated Edition (NRSVUE)" },
    { value: "WEB_bible", label: "World English Bible (WEB)" },
    { value: "YLT_bible", label: "Young's Literal Translation (YLT)" }
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

export const INITIAL_TASK_STATE: TaskState = {
  isTaskVisible: true,
  isTaskHighlighted: false,
  showControls: true,
};

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
