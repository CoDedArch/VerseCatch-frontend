import { Ref } from "react";

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
  isTourActive: boolean;
  selectedVersion: string;
  currentStep: number;
  tourSteps: TourSteps[];
  userData: UserData | null;
  animate: boolean;
  onThemeChange: (
    themeStyles: ThemeStyles,
    selectedTheme: Theme | null
  ) => void;
  setIntroComplete: (value: boolean) => void;
  setUserIsLoggedIn: (value: boolean) => void;
}

export interface AboutModelInterface {
  setShowAboutModal: (value: boolean) => void;
}

export interface HelpModelInterface {
  setShowHelpModal: (value: boolean) => void;
}

export interface InteractionBackgroundStyles {
  background: string;
  color: string;
  buttonColor: string;
}

export interface InteractionSectionProps {
  setReceivedData: (data: string) => void;
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  userIsLoggedIn: boolean;
  userEmail: string;
  tourSteps: { id: string; description: string }[];
  isTourActive: boolean;
  currentStep: number;
  interactionBackground: InteractionBackgroundStyles;
  displayThemeName: string | undefined;
}

export interface PasswordModelInterface {
  setShowChangePasswordModal: (value: boolean) => void;
}

export interface ProfileMenuInterface {
  profileMenuRef: Ref<HTMLDivElement | null>;
  selectedTheme: Theme | null;
  setIntroComplete: (value: boolean) => void;
  setUserIsLoggedIn: (value: boolean) => void;
  setShowSettingsModal: (value: boolean) => void;
  setShowProfileMenu: (value: boolean) => void;
  setShowAboutModal: (value: boolean) => void;
  setShowHelpModal: (value: boolean) => void;
  setShowChangePasswordModal: (value: boolean) => void;
}

export interface ProfileSectionInterface {
  userData: UserData | null;
  isTourActive: boolean;
  animate: boolean;
  currentStep: number;
  tourSteps: TourSteps[];
  showProfileMenu: boolean;
  setShowProfileMenu: (value: boolean) => void;
}

export interface SettingsModelInterface {
  userIsLoggedIn: boolean;
  isTourActive: boolean;
  showProfileMenu: boolean;
  selectedVersion: string;
  showSettingsModal: boolean;
  userData: UserData | null;
  setShowSettingsModal: (value: boolean) => void;
  setShowProfileMenu: (value: boolean) => void;
  onThemeChange: (
    themeStyles: ThemeStyles,
    selectedTheme: Theme | null
  ) => void;
}

export interface TaskCompInterface {
  userData: UserData;
  themeStyles: ThemeStyles;
  isTaskHighlighted: boolean;
  isTaskVisible: boolean;
  isTourActive: boolean;
  animate: boolean;
  showLoginTaskComplete: boolean;
  currentStep: number;
  tourSteps: TourSteps[];
  showImage: boolean;
  setIsTaskVisible: (value: boolean) => void;
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



