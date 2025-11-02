import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StepState {
  currentStepIndex: number;
  isRunning: boolean;
  stepRemainingSec: number;
  overallRemainingSec: number;
  lastTickTs?: number;
}

interface SessionState {
  activeRecipeId: string | null;
  byRecipeId: Record<string, StepState>;
}

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (
      state,
      action: PayloadAction<{
        recipeId: string;
        stepRemainingSec: number;
        overallRemainingSec: number;
      }>
    ) => {
      const { recipeId, stepRemainingSec, overallRemainingSec } = action.payload;
      // Prevent multiple active sessions
      if (state.activeRecipeId && state.activeRecipeId !== recipeId) return;

      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec,
        overallRemainingSec,
        lastTickTs: Date.now(),
      };
    },

    pauseSession: (state) => {
      if (state.activeRecipeId) {
        const s = state.byRecipeId[state.activeRecipeId];
        if (s) s.isRunning = false;
      }
    },

    resumeSession: (state) => {
      if (state.activeRecipeId) {
        const s = state.byRecipeId[state.activeRecipeId];
        if (s) {
          s.isRunning = true;
          s.lastTickTs = Date.now(); // reset tick base
        }
      }
    },

    tickSecond: (
      state,
      action: PayloadAction<{
        recipeId: string;
        nowTs: number;
        elapsedSec: number;
      }>
    ) => {
      const { recipeId, nowTs, elapsedSec } = action.payload;
      const s = state.byRecipeId[recipeId];
      if (!s || !s.isRunning) return;

      s.stepRemainingSec = Math.max(0, s.stepRemainingSec - elapsedSec);
      s.overallRemainingSec = Math.max(0, s.overallRemainingSec - elapsedSec);
      s.lastTickTs = nowTs;
    },

    stopCurrentStep: (state, action: PayloadAction<{ recipeId: string }>) => {
      const { recipeId } = action.payload;
      const s = state.byRecipeId[recipeId];
      if (s) s.stepRemainingSec = 0;
    },

    advanceStep: (
      state,
      action: PayloadAction<{
        recipeId: string;
        newStepIndex: number;
        stepDurationSec: number;
      }>
    ) => {
      const { recipeId, newStepIndex, stepDurationSec } = action.payload;
      const s = state.byRecipeId[recipeId];
      if (s) {
        s.currentStepIndex = newStepIndex;
        s.stepRemainingSec = stepDurationSec;
        s.isRunning = true;
        s.lastTickTs = Date.now(); // start new step immediately
      }
    },

    endSession: (state, action: PayloadAction<string>) => {
      const rid = action.payload;
      delete state.byRecipeId[rid];
      state.activeRecipeId = null;
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  tickSecond,
  stopCurrentStep,
  advanceStep,
  endSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
