import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel, Paper, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { useNavigate } from 'react-router-dom';
import './RecipeList.css';
export default function RecipeList() {
    const recipes = useSelector((s) => s.recipes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('asc');
    const shown = useMemo(() => recipes
        .filter((r) => (filter === 'All' ? true : r.difficulty === filter))
        .sort((a, b) => (a.steps.reduce((x, y) => x + y.durationMinutes, 0) -
        b.steps.reduce((x, y) => x + y.durationMinutes, 0)) *
        (sort === 'asc' ? 1 : -1)), [recipes, filter, sort]);
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '#10b981';
            case 'Medium': return '#f59e0b';
            case 'Hard': return '#ef4444';
            default: return '#6b7280';
        }
    };
    const formatTime = (minutes) => {
        if (minutes < 60)
            return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };
    return (_jsxs(Box, { className: "recipe-list-container", children: [_jsx(Paper, { className: "recipe-header", elevation: 0, children: _jsxs(Box, { className: "header-content", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", className: "recipe-title", gutterBottom: true, children: "Your Recipes" }), _jsxs(Typography, { variant: "body1", className: "recipe-subtitle", children: [shown.length, " recipe", shown.length !== 1 ? 's' : '', " found"] })] }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), className: "create-btn", onClick: () => navigate('/create'), children: "Create Recipe" })] }) }), _jsx(Box, { className: "controls-section", children: _jsxs(Box, { className: "controls-group", children: [_jsxs(Box, { className: "control-item", children: [_jsx(FilterListIcon, { className: "control-icon" }), _jsxs(FormControl, { size: "small", className: "filter-control", children: [_jsx(InputLabel, { children: "Difficulty" }), _jsxs(Select, { value: filter, label: "Difficulty", onChange: (e) => setFilter(e.target.value), children: [_jsx(MenuItem, { value: "All", children: "All Levels" }), _jsx(MenuItem, { value: "Easy", children: "Easy" }), _jsx(MenuItem, { value: "Medium", children: "Medium" }), _jsx(MenuItem, { value: "Hard", children: "Hard" })] })] })] }), _jsxs(Box, { className: "control-item", children: [_jsx(SortIcon, { className: "control-icon" }), _jsxs(FormControl, { size: "small", className: "filter-control", children: [_jsx(InputLabel, { children: "Sort By" }), _jsxs(Select, { value: sort, label: "Sort By", onChange: (e) => setSort(e.target.value), children: [_jsx(MenuItem, { value: "asc", children: "Time: Low to High" }), _jsx(MenuItem, { value: "desc", children: "Time: High to Low" })] })] })] })] }) }), shown.length === 0 && (_jsxs(Paper, { className: "empty-state", children: [_jsx(Typography, { variant: "h6", className: "empty-title", children: "No recipes found" }), _jsx(Typography, { variant: "body2", className: "empty-subtitle", children: "Try adjusting your filters or create a new recipe to get started." })] }))] }));
}
