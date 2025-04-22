// store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showGreeting: boolean;
}

// Helper functions for localStorage
const loadGreetingState = (): boolean => {
  try {
    const savedState = localStorage.getItem('greetingState');
    return savedState ? JSON.parse(savedState) : true;
  } catch (error) {
    console.warn('Failed to load greeting state from localStorage', error);
    return true; // Default value if error occurs
  }
};

const saveGreetingState = (state: boolean) => {
  try {
    localStorage.setItem('greetingState', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save greeting state to localStorage', error);
  }
};

const initialState: UIState = {
  showGreeting: loadGreetingState(),
};

const greetingsSlice = createSlice({
  name: 'greetings',
  initialState,
  reducers: {
    hideGreeting: (state) => {
      state.showGreeting = false;
      saveGreetingState(false);
    },
    resetGreeting: (state) => {
      state.showGreeting = true;
      saveGreetingState(true);
    },
    setGreeting: (state, action: PayloadAction<boolean>) => {
      state.showGreeting = action.payload;
      saveGreetingState(action.payload);
    },
  },
});

export const { hideGreeting, resetGreeting, setGreeting } = greetingsSlice.actions;
export default greetingsSlice.reducer;