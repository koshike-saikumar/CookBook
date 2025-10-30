import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Paper, IconButton, Card, Chip, } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addRecipe } from '../slices/recipesSlice';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import './CreateRecipe.css';
export default function CreateRecipe() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    function addIngredient() {
        setIngredients((s) => [
            ...s,
            { id: nanoid(), name: '', quantity: 1, unit: 'pcs' },
        ]);
    }
    function removeIngredient(id) {
        setIngredients((s) => s.filter((ing) => ing.id !== id));
    }
    function addStep() {
        setSteps((s) => [
            ...s,
            {
                id: nanoid(),
                description: '',
                type: 'instruction',
                durationMinutes: 5,
                ingredientIds: [],
            },
        ]);
    }
    function removeStep(id) {
        setSteps((s) => s.filter((step) => step.id !== id));
    }
    function save() {
        if (title.trim().length < 3)
            return alert('Title must be at least 3 characters');
        if (ingredients.length < 1)
            return alert('Add at least 1 ingredient');
        if (steps.length < 1)
            return alert('Add at least 1 step');
        dispatch(addRecipe({ title, difficulty, ingredients, steps }));
        navigate('/recipes');
    }
    const getDifficultyColor = (level) => {
        switch (level) {
            case 'Easy': return '#10b981';
            case 'Medium': return '#f59e0b';
            case 'Hard': return '#ef4444';
            default: return '#6b7280';
        }
    };
    const totalTime = steps.reduce((total, step) => total + step.durationMinutes, 0);
    return (_jsx(Box, { className: "create-recipe-page", children: _jsxs(Paper, { className: "create-recipe-card", elevation: 0, children: [_jsx(Box, { className: "recipe-header", children: _jsxs(Box, { className: "header-content", children: [_jsxs(Box, { className: "header-text", children: [_jsx(Typography, { variant: "h4", className: "create-title", children: "Create New Recipe" }), _jsx(Typography, { variant: "subtitle1", className: "create-subtitle", children: "Craft your culinary masterpiece" })] }), _jsxs(Box, { className: "recipe-stats", children: [_jsx(Chip, { icon: _jsx(LocalDiningIcon, {}), label: `${ingredients.length} ingredients`, variant: "outlined", className: "stat-chip" }), _jsx(Chip, { icon: _jsx(ScheduleIcon, {}), label: `${totalTime} min`, variant: "outlined", className: "stat-chip" }), _jsx(Chip, { label: difficulty, style: { backgroundColor: getDifficultyColor(difficulty), color: 'white' }, className: "stat-chip" })] })] }) }), _jsxs(Box, { className: "form-content", children: [_jsxs(Box, { className: "form-section", children: [_jsxs(Typography, { variant: "h6", className: "section-title", children: [_jsx(RestaurantIcon, { className: "section-icon" }), "Basic Information"] }), _jsxs(Box, { className: "basic-fields", children: [_jsx(TextField, { label: "Recipe Title", fullWidth: true, value: title, onChange: (e) => setTitle(e.target.value), className: "recipe-input", placeholder: "e.g., Classic Chocolate Chip Cookies" }), _jsxs(TextField, { select: true, label: "Difficulty Level", value: difficulty, onChange: (e) => setDifficulty(e.target.value), className: "recipe-input", children: [_jsx(MenuItem, { value: "Easy", children: "Easy" }), _jsx(MenuItem, { value: "Medium", children: "Medium" }), _jsx(MenuItem, { value: "Hard", children: "Hard" })] })] })] }), _jsxs(Box, { className: "form-section", children: [_jsx(Box, { className: "section-header", children: _jsxs(Typography, { variant: "h6", className: "section-title", children: [_jsx(LocalDiningIcon, { className: "section-icon" }), "Ingredients", _jsx(Chip, { label: ingredients.length, size: "small", className: "count-chip" })] }) }), _jsx(Box, { className: "ingredients-list", children: ingredients.map((ing, idx) => (_jsxs(Card, { className: "ingredient-card", elevation: 1, children: [_jsxs(Box, { className: "ingredient-content", children: [_jsx(TextField, { label: "Ingredient Name", value: ing.name, onChange: (e) => setIngredients((prev) => prev.map((p) => p.id === ing.id ? { ...p, name: e.target.value } : p)), className: "ingredient-field", placeholder: "e.g., Flour", fullWidth: true, size: "small" }), _jsxs(Box, { className: "ingredient-meta", children: [_jsx(TextField, { label: "Qty", type: "number", value: ing.quantity, onChange: (e) => setIngredients((prev) => prev.map((p) => p.id === ing.id
                                                                    ? { ...p, quantity: Number(e.target.value) }
                                                                    : p)), className: "quantity-field", inputProps: { min: 0.1, step: 0.1 }, size: "small" }), _jsx(TextField, { label: "Unit", value: ing.unit, onChange: (e) => setIngredients((prev) => prev.map((p) => p.id === ing.id ? { ...p, unit: e.target.value } : p)), className: "unit-field", placeholder: "cups, tbsp", size: "small" })] })] }), _jsx(IconButton, { onClick: () => removeIngredient(ing.id), className: "remove-btn", size: "small", children: _jsx(DeleteIcon, { fontSize: "small" }) })] }, ing.id))) }), _jsx(Button, { variant: "outlined", startIcon: _jsx(AddCircleIcon, {}), className: "add-btn", onClick: addIngredient, fullWidth: true, size: "small", children: "Add Ingredient" })] }), _jsxs(Box, { className: "form-section", children: [_jsx(Box, { className: "section-header", children: _jsxs(Typography, { variant: "h6", className: "section-title", children: [_jsx(ScheduleIcon, { className: "section-icon" }), "Cooking Steps", _jsx(Chip, { label: steps.length, size: "small", className: "count-chip" })] }) }), _jsx(Box, { className: "steps-list", children: steps.map((st, idx) => (_jsxs(Card, { className: "step-card", elevation: 1, children: [_jsxs(Box, { className: "step-header", children: [_jsx(Chip, { label: `Step ${idx + 1}`, color: "primary", size: "small", className: "step-number" }), _jsx(IconButton, { onClick: () => removeStep(st.id), className: "remove-btn", size: "small", children: _jsx(DeleteIcon, { fontSize: "small" }) })] }), _jsx(TextField, { label: `Step description`, fullWidth: true, multiline: true, rows: 2, value: st.description, onChange: (e) => setSteps((prev) => prev.map((p) => p.id === st.id
                                                    ? { ...p, description: e.target.value }
                                                    : p)), className: "step-description", placeholder: "Describe this step...", size: "small" }), _jsxs(Box, { className: "step-options", children: [_jsxs(TextField, { select: true, label: "Type", value: st.type, onChange: (e) => setSteps((prev) => prev.map((p) => p.id === st.id
                                                            ? { ...p, type: e.target.value }
                                                            : p)), className: "step-type-field", size: "small", children: [_jsx(MenuItem, { value: "instruction", children: "Instruction" }), _jsx(MenuItem, { value: "cooking", children: "Cooking" })] }), _jsx(TextField, { label: "Duration (min)", type: "number", value: st.durationMinutes, onChange: (e) => setSteps((prev) => prev.map((p) => p.id === st.id
                                                            ? {
                                                                ...p,
                                                                durationMinutes: Math.max(1, Number(e.target.value)),
                                                            }
                                                            : p)), className: "duration-field", inputProps: { min: 1 }, size: "small" })] })] }, st.id))) }), _jsx(Button, { variant: "outlined", startIcon: _jsx(AddCircleIcon, {}), className: "add-btn", onClick: addStep, fullWidth: true, size: "small", children: "Add Step" })] }), _jsxs(Box, { className: "action-buttons", children: [_jsx(Button, { variant: "outlined", className: "cancel-btn", onClick: () => navigate('/recipes'), size: "small", children: "Cancel" }), _jsx(Button, { variant: "contained", startIcon: _jsx(SaveIcon, {}), className: "save-btn", onClick: save, disabled: !title || ingredients.length === 0 || steps.length === 0, size: "small", children: "Save Recipe" })] })] })] }) }));
}
