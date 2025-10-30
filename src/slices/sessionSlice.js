import { createSlice } from '@reduxjs/toolkit';
const initialState = { activeRecipeId: null, byRecipeId: {} };
const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        startSession(state, action) {
            const { recipeId, stepRemainingSec, overallRemainingSec } = action.payload;
            if (state.activeRecipeId)
                return; // disallow if active
            state.activeRecipeId = recipeId;
            state.byRecipeId[recipeId] = { currentStepIndex: 0, isRunning: true, stepRemainingSec, overallRemainingSec, lastTickTs: Date.now() };
        },
        pauseSession(state) { const id = state.activeRecipeId; if (!id)
            return; state.byRecipeId[id].isRunning = false; state.byRecipeId[id].lastTickTs = undefined; },
        resumeSession(state) { const id = state.activeRecipeId; if (!id)
            return; state.byRecipeId[id].isRunning = true; state.byRecipeId[id].lastTickTs = Date.now(); },
        stopCurrentStep(state, action) {
            const { recipeId } = action.payload;
            const s = state.byRecipeId[recipeId];
            if (!s)
                return;
            s.stepRemainingSec = 0; // will be advanced by tick handler in UI
        },
        tickSecond(state, action) {
            const { recipeId, elapsedSec } = action.payload;
            const s = state.byRecipeId[recipeId];
            if (!s || !s.isRunning)
                return;
            s.stepRemainingSec = Math.max(0, s.stepRemainingSec - elapsedSec);
            s.overallRemainingSec = Math.max(0, s.overallRemainingSec - elapsedSec);
            s.lastTickTs = Date.now();
        },
        advanceStep(state, action) {
            const { recipeId, newStepIndex, stepDurationSec } = action.payload;
            const s = state.byRecipeId[recipeId];
            if (!s)
                return;
            s.currentStepIndex = newStepIndex;
            s.stepRemainingSec = stepDurationSec;
            s.isRunning = true;
            s.lastTickTs = Date.now();
        },
        endSession(state, action) { const id = action.payload; if (state.activeRecipeId === id) {
            delete state.byRecipeId[id];
            state.activeRecipeId = null;
        } }
    }
});
export const { startSession, pauseSession, resumeSession, stopCurrentStep, tickSecond, advanceStep, endSession } = sessionSlice.actions;
export default sessionSlice.reducer;
