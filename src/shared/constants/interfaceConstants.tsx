import { RefObject } from "react";

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
  status: string;
  error: string | null;
  autoProgressTimer?: NodeJS.Timeout;
}

export interface TaskState {
  isTaskVisible: boolean;
  isTaskHighlighted: boolean;
  showControls: boolean;
}

export interface ThemeStyles {
  mainBackground: {
    background: string;
    backgroundSize: string;
    animation: string
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
  styles: ThemeStyles;
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
  id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  isAnonymous?: boolean;
  email?: string;
  is_active?: boolean;
  verified?: boolean;
  streak?: number;
  faith_coins?: number;
  current_tag?: string;
  bible_version?: string;
  has_taken_tour?: boolean;
  created_at?: string;
  logged_in_today?: boolean;
  total_verses_caught?: number;
  unique_books_caught?: number;
  achievements?: Achievement[];
}

export interface HeaderInterface {
  tourState: TourState;
}

export interface InteractionBackgroundStyles {
  background: string;
  color: string;
  buttonColor: string;
}

export interface CancelTourProps {
  updateHasTakenTour: (email: string, hasTakenTour: boolean) => Promise<void>;
}

export interface UserInfo {
  isLoggedIn: boolean;
  email: string;
}

export interface InteractionSectionProps {
  tourState: TourState;
}

export interface ProfileMenuInterface {
  userData: UserData | null;
}

export interface ProfileSectionInterface {
  tourState: TourState;
}

export interface TaskCompInterface {
  tourState: TourState;
}

export type SignUpStep = "email" | "details" | "version";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoggedIn: boolean;
  tokenExpiry: number | null;
  isLoading: boolean;
  error: string | null;
  isWebSocketConnected: boolean;
  isAnonymous: boolean;
}

interface StateHandlers {
  setError: (value: string) => void;
  setShowVersions: (value: boolean) => void;
  setIsVerifying: (value: boolean) => void;
}

export interface BibleSelectionInterface {
  userDetails: UserDetails;
  authState: {
    isLogin: boolean;
    step: string;
  };
  stateHandlers: StateHandlers;
}
export interface ProfileMenuProps {
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface VerseSectionProps {
  parsedData: {
    book: string;
    chapter: string;
    verse_number: string;
    text: string;
  } | null;
  entireBookData: EntireBookDataInterface[] | null;
  handleVerseClick: () => void;
  setEntireBookData: (data: EntireBookDataInterface[] | null) => void;
}

export interface ThemeState {
  currentTheme: Theme;
}
