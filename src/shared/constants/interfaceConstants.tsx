export interface Verse {
  verse_number: string;
  text: string;
}

export interface EntireBookDataInterface {
  chapter: string;
  verses: Verse[];
}

export interface TourState {
  isTourActive: boolean;
  currentStep: number;
  isCancelled: boolean;
}

export interface TaskState {
  isTaskVisible: boolean;
  isTaskHighlighted: boolean;
  showControls: boolean;
}

export interface ThemeStyles {
  mainBackground: {
    background: string;
  };
  taskBackground: {
    background: string;
    color: string;
    contentBackground: string;
  };
  verseBackground: {
    background: string;
    color: string;
    verseHighlight: string;
  };
  interactionBackground: {
    background: string;
    color: string;
    buttonColor: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  display_name: string;
  price: number;
  preview_image_url: string;
  is_default: boolean;
  is_current?: boolean;
  unlocked?: boolean;
  styles: string | ThemeStyles;
}

export interface TourSteps {
  id: string;
  description: string;
}

interface Achievement {
  id: string;
  name: string;
  tag: string;
  requirement: number;
  achieved_at: string;
}

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  verified: boolean;
  streak: number;
  faith_coins: number;
  current_tag: string;
  bible_version: string;
  has_taken_tour: boolean;
  created_at: string;
  logged_in_today: boolean;
  total_verses_caught: number;
  unique_books_caught: number;
  achievements: Achievement[];
}

export interface HeaderInterface {
  userIsLoggedIn: boolean;
  receivedData: string | null;
  tourState: TourState;
  selectedVersion: string;
  userData: UserData | null;
  setIntroComplete: (value: boolean) => void;
  setUserIsLoggedIn: (value: boolean) => void;
}

export interface InteractionBackgroundStyles {
  background: string;
  color: string;
  buttonColor: string;
}

export interface VersionSelection {
  value: string;
  onChange: (version: string) => void;
}

export interface UserInfo {
  isLoggedIn: boolean;
  email: string;
}

export interface InteractionSectionProps {
  setReceivedData: (data: string) => void;
  version: VersionSelection;
  user: UserInfo;
  tourState: TourState;
  // interactionBackground: InteractionBackgroundStyles;
  // displayThemeName: string | undefined;
}

export interface PasswordModelInterface {
  setShowChangePasswordModal: (value: boolean) => void;
}

export interface ProfileMenuInterface {
  userData: UserData | null;
}

export interface ProfileSectionInterface {
  userData: UserData | null;
  tourState: TourState;
}


export interface TaskCompInterface {
  userData: UserData;
  tourState: TourState;
}

export interface WaitingVerificationInterface {
  showCheckmark: boolean;
}

export type SignUpStep = "email" | "details" | "version";

export interface SignUpFormInterface {
  isWaitingForVerification: boolean;
  isLogin: boolean;
  isLoading: boolean;
  step: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: string;
  setLastName: (value: string) => void;
  setFirstName: (value: string) => void;
  setPassword: (value: string) => void;
  setEmail: (value: string) => void;
  setError: (value: string) => void;
  setStep: (value: SignUpStep) => void;
  setShowAuthOptions: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setShowVersions: (value: boolean) => void;
  setShowCheckmark: (value: boolean) => void;
}

export interface SignUpFormInterface {
  isWaitingForVerification: boolean;
  isLogin: boolean;
  isLoading: boolean;
  step: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: string;
  setLastName: (value: string) => void;
  setFirstName: (value: string) => void;
  setPassword: (value: string) => void;
  setEmail: (value: string) => void;
  setError: (value: string) => void;
  setStep: (value: SignUpStep) => void;
  setShowAuthOptions: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setShowVersions: (value: boolean) => void;
  setShowCheckmark: (value: boolean) => void;
}

export interface BibleSelectionInterface {
  isWaitingForVerification: boolean;
  isLogin: boolean;
  isLoading: boolean;
  step: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  onComplete: (version: string) => void;
  setError: (value: string) => void;
  setShowAuthOptions: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setShowVersions: (value: boolean) => void;
  setShowCheckmark: (value: boolean) => void;
  setIsExiting: (value: boolean) => void;
  setIsWaitingForVerification: (value: boolean) => void;
}

export interface AnonnymousSignUpInterface {
  step: string;
  isWaitingForVerification: boolean;
  setShowAuthOptions: (value: boolean) => void;
  setShowVersions: (value: boolean) => void;
}
