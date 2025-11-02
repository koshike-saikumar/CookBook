import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import CreateRecipe from './components/CreateRecipe';
import CookPage from './components/CookPage';
import MiniPlayer from './components/MiniPlayer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { tickSecond, advanceStep, endSession } from './slices/sessionSlice';
// ✅ Global ticking logic (keeps timer running even when not on CookPage)
function GlobalSessionTicker() {
    const dispatch = useDispatch();
    const session = useSelector((s) => s.session);
    const recipes = useSelector((s) => s.recipes);
    useEffect(() => {
        const interval = setInterval(() => {
            const rid = session.activeRecipeId;
            if (!rid)
                return;
            const s = session.byRecipeId[rid];
            if (!s || !s.isRunning)
                return;
            // Dispatch tick every second
            dispatch(tickSecond({ recipeId: rid, nowTs: Date.now(), elapsedSec: 1 }));
            // Auto-advance logic
            if (s.stepRemainingSec <= 0) {
                const recipe = recipes.find((r) => r.id === rid);
                if (!recipe)
                    return;
                const nextIndex = s.currentStepIndex + 1;
                if (nextIndex >= recipe.steps.length) {
                    dispatch(endSession(rid));
                    toast.success('Recipe session completed!');
                }
                else {
                    const nextDur = recipe.steps[nextIndex].durationMinutes * 60;
                    dispatch(advanceStep({
                        recipeId: rid,
                        newStepIndex: nextIndex,
                        stepDurationSec: nextDur,
                    }));
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [session, recipes, dispatch]);
    return null; // no UI
}
export default function App() {
    return (_jsxs("div", { style: { minHeight: '100vh' }, children: [_jsx(ToastContainer, { position: "top-right", autoClose: 3000 }), _jsx(GlobalSessionTicker, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/recipes", replace: true }) }), _jsx(Route, { path: "/recipes", element: _jsx(RecipeList, {}) }), _jsx(Route, { path: "/create", element: _jsx(CreateRecipe, {}) }), _jsx(Route, { path: "/cook/:id", element: _jsx(CookPage, {}) })] }), _jsx(MiniPlayer, {})] }));
}
