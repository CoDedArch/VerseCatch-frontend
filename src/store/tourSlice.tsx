// store/slices/tourSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TourState } from "@/shared/constants/interfaceConstants";
import { tourSteps } from "@/shared/constants/varConstants";
import { UPDATE_HAS_TAKEN_TOUR_URL } from "@/shared/constants/urlConstants";

const initialState: TourState = {
  isTourActive: false,
  currentStep: 0,
  isCancelled: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Async thunk to update tour status
export const updateHasTakenTour = createAsyncThunk(
  'tour/updateHasTakenTour',
  async ({ email, hasTakenTour }: { email: string; hasTakenTour: boolean }, { rejectWithValue }) => {
    try {
      const response = await fetch(UPDATE_HAS_TAKEN_TOUR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ email, has_taken_tour: hasTakenTour }),
      });

      if (!response.ok) {
        throw new Error("Failed to update has_taken_tour");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    startTour: (state) => {
      state.isTourActive = true;
      state.currentStep = 0;
      state.isCancelled = false;
    },
    nextStep: (state) => {
      if (state.currentStep < tourSteps.length - 1) {
        state.currentStep += 1;
      } else {
        state.isTourActive = false;
      }
    },
    endTour: (state) => {
      state.isTourActive = false;
    },
    cancelTour: (state) => {
      state.isTourActive = false;
      state.isCancelled = true;
    },
    resetTour: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateHasTakenTour.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateHasTakenTour.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("Tour status updated:", action.payload);
      })
      .addCase(updateHasTakenTour.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        console.error("Error updating tour status:", action.payload);
      });
  }
});

export const { startTour, nextStep, endTour, cancelTour, resetTour } = tourSlice.actions;
export default tourSlice.reducer;