const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL!;

export const CHECK_EMAIL_URL = `${BASE_URL}/auth/check-email`;
export const SIGNUP_URL = `${BASE_URL}/auth/signup`;
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const CHANGE_PASSWORD_URL = `${BASE_URL}/auth/change-password`;
export const THEMES_URL = `${BASE_URL}/api/themes`;
export const UNLOCK_THEME_URL = `${BASE_URL}/api/unlock-theme`;
export const SET_THEME_URL = `${BASE_URL}/api/set-theme`;
export const UPDATE_HAS_TAKEN_TOUR_URL =  `${BASE_URL}/api/update-has-taken-tour`;
export const UPDATE_BIBLE_VERSION_URL = `${BASE_URL}/api/update-bible-version`;
export const INSPIRATIONAL_VERSES = `${BASE_URL}/api/inspirational-verses`
export const RATING_URL = `${BASE_URL}/admin/user-ratings`
export const TRACK_VERSE_CATCH_URL = `${BASE_URL}/api/track-verse-catch/`
export const SUBMIT_RATING_URL = `${BASE_URL}/api/submit-rating`
export const CREATE_PAYMENT_URL = `${BASE_URL}/api/create-payment`
export const VERIFY_PAYMENT_URL = `${BASE_URL}/api/verify-payment`
export const USER_STATS_URL = `${BASE_URL}/admin/user-stats`
export const GET_CURRENT_THEME = `${BASE_URL}/api/themes/current`
export const DELETE_ACCOUNT_URL = `${BASE_URL}/auth/delete-account`