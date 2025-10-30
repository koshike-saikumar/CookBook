import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import CreateRecipe from './components/CreateRecipe';
// import CookPage from './components/CookPage';
import MiniPlayer from './components/MiniPlayer';
export default function App() {
    return (_jsxs("div", { style: { minHeight: '100vh' }, children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/recipes", replace: true }) }), _jsx(Route, { path: "/recipes", element: _jsx(RecipeList, {}) }), _jsx(Route, { path: "/create", element: _jsx(CreateRecipe, {}) })] }), _jsx(MiniPlayer, {})] }));
}
