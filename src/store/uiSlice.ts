// store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  introComplete: boolean;
  selectedVersion: string;
  highlightedVerse: string | null;
  receivedData: string | null;
}

const initialState: UIState = {
  introComplete: false,
  selectedVersion: "KJV_bible",
  highlightedVerse: null,
  receivedData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIntroComplete: (state, action: PayloadAction<boolean>) => {
      state.introComplete = action.payload;
    },
    resetIntroComplete: (state) => {
      state.introComplete = false;
    },
    setSelectedVersion: (state, action: PayloadAction<string>) => {
      state.selectedVersion = action.payload;
    },
    setHighlightedVerse: (state, action: PayloadAction<string | null>) => {
      state.highlightedVerse = action.payload;
    },
    setReceivedData: (state, action: PayloadAction<string | null>) => {
      state.receivedData = action.payload;
    },
    resetVerseData: (state) => {
      state.highlightedVerse = null;
      state.receivedData = null;
    },
  },
});

export const { 
  setIntroComplete, 
  resetIntroComplete,
  setSelectedVersion,
  setHighlightedVerse,
  setReceivedData,
  resetVerseData
} = uiSlice.actions;

export default uiSlice.reducer;