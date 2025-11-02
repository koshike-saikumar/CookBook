import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  IconButton,
  Card,
  Chip,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addRecipe } from '../slices/recipesSlice';
import { Ingredient, RecipeStep, Difficulty } from '../types';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateRecipe.css';

export default function CreateRecipe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  // ---- Ingredient Functions ----
  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: nanoid(), name: '', quantity: 1, unit: 'pcs' },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // ---- Step Functions ----
  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: nanoid(),
        description: '',
        type: 'instruction',
        durationMinutes: 5,
        ingredientIds: [],
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  // ---- Validation & Save ----
  const save = () => {
    if (title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long!');
      return;
    }

    if (ingredients.length < 1) {
      toast.error('Add at least one ingredient!');
      return;
    }

    const allowedUnits = ['g', 'ml', 'pcs', 'kg', 'tsp', 'tbsp', 'cup', 'l'];

    for (const ing of ingredients) {
      if (!ing.name || ing.name.trim().length === 0) {
        toast.error('Each ingredient must have a name!');
        return;
      }

      if (ing.quantity <= 0 || isNaN(ing.quantity)) {
        toast.error(`Ingredient "${ing.name || 'Unnamed'}" must have a positive quantity!`);
        return;
      }

      if (!ing.unit || ing.unit.trim().length === 0) {
        toast.error(`Ingredient "${ing.name || 'Unnamed'}" must have a valid unit!`);
        return;
      }

      if (!allowedUnits.includes(ing.unit.trim().toLowerCase())) {
        toast.error(
          `Invalid unit "${ing.unit}" for "${ing.name}". Use one of: ${allowedUnits.join(', ')}`
        );
        return;
      }
    }

    if (steps.length < 1) {
      toast.error('Add at least one step!');
      return;
    }

    for (const step of steps) {
      if (step.durationMinutes <= 0) {
        toast.error('Each step must have a positive duration!');
        return;
      }

      if (step.type === 'cooking') {
        if (
          !step.cookingSettings ||
          step.cookingSettings.temperature < 40 ||
          step.cookingSettings.temperature > 200 ||
          step.cookingSettings.speed < 1 ||
          step.cookingSettings.speed > 5
        ) {
          toast.error(
            'Cooking step must have temperature between 40–200°C and speed between 1–5!'
          );
          return;
        }
      } else if (step.type === 'instruction') {
        if (!step.description || step.description.trim().length === 0) {
          toast.error('Each instruction step must have a description!');
          return;
        }
      }
    }

    const newRecipe = {
      id: nanoid(),
      title,
      difficulty,
      ingredients,
      steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addRecipe(newRecipe));
    toast.success('Recipe saved successfully!');
    navigate('/recipes');
  };

  const getDifficultyColor = (level: Difficulty) => {
    switch (level) {
      case 'Easy':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'Hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const totalTime = steps.reduce((sum, s) => sum + s.durationMinutes, 0);

  // ---- UI ----
  return (
    <Box className="create-recipe-page">
      <Paper className="create-recipe-card" elevation={0}>
        {/* Header */}
        <Box className="recipe-header">
          <Box className="header-content">
            <Typography variant="h4" className="create-title">
              Create New Recipe
            </Typography>
            <Box className="recipe-stats">
              <Chip
                icon={<LocalDiningIcon />}
                label={`${ingredients.length} ingredients`}
                variant="outlined"
              />
              <Chip
                icon={<ScheduleIcon />}
                label={`${totalTime} min`}
                variant="outlined"
              />
              <Chip
                label={difficulty}
                style={{
                  backgroundColor: getDifficultyColor(difficulty),
                  color: 'white',
                }}
              />
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/recipes')}
              startIcon={<ArrowBackIcon />}
              sx={{ height: 40 }}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* Form */}
        <Box className="form-content">
          {/* Basic Info */}
          <Box className="form-section">
            <Typography variant="h6">
              <RestaurantIcon className="section-icon" /> Basic Information
            </Typography>
            <TextField
              label="Recipe Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Classic Pancakes"
            />
            <TextField
              select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              fullWidth
              margin="dense"
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </TextField>
          </Box>

          {/* Ingredients */}
          <Box className="form-section">
            <Typography variant="h6">
              <LocalDiningIcon className="section-icon" /> Ingredients
            </Typography>
            {ingredients.map((ing) => (
              <Card key={ing.id} sx={{ p: 1, my: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    label="Name"
                    value={ing.name}
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((p) =>
                          p.id === ing.id ? { ...p, name: e.target.value } : p
                        )
                      )
                    }
                    size="small"
                  />
                  <TextField
                    label="Qty"
                    type="number"
                    value={ing.quantity}
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((p) =>
                          p.id === ing.id
                            ? { ...p, quantity: Math.max(1, Number(e.target.value)) }
                            : p
                        )
                      )
                    }
                    placeholder="1, 2, 3, etc."
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="Unit"
                    value={ing.unit}
                    placeholder="g, ml, pcs, etc."
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((p) =>
                          p.id === ing.id ? { ...p, unit: e.target.value } : p
                        )
                      )
                    }
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <IconButton onClick={() => removeIngredient(ing.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              onClick={addIngredient}
              sx={{ mt: 1 }}
            >
              Add Ingredient
            </Button>
          </Box>

          {/* Steps */}
          <Box className="form-section">
            <Typography variant="h6">
              <ScheduleIcon className="section-icon" /> Steps
            </Typography>
            {steps.map((st, idx) => (
              <Card key={st.id} sx={{ p: 1, my: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle2">Step {idx + 1}</Typography>
                  <IconButton onClick={() => removeStep(st.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={st.description}
                  onChange={(e) =>
                    setSteps((prev) =>
                      prev.map((p) =>
                        p.id === st.id ? { ...p, description: e.target.value } : p
                      )
                    )
                  }
                  size="small"
                  margin="dense"
                />
                <Box display="flex" gap={1}>
                  <TextField
                    select
                    label="Type"
                    value={st.type}
                    onChange={(e) =>
                      setSteps((prev) =>
                        prev.map((p) =>
                          p.id === st.id
                            ? { ...p, type: e.target.value as 'instruction' | 'cooking' }
                            : p
                        )
                      )
                    }
                    size="small"
                    sx={{ width: 160 }}
                  >
                    <MenuItem value="instruction">Instruction</MenuItem>
                    <MenuItem value="cooking">Cooking</MenuItem>
                  </TextField>
                  <TextField
                    label="Duration (min)"
                    type="number"
                    value={st.durationMinutes}
                    onChange={(e) =>
                      setSteps((prev) =>
                        prev.map((p) =>
                          p.id === st.id
                            ? { ...p, durationMinutes: Math.max(1, Number(e.target.value)) }
                            : p
                        )
                      )
                    }
                    size="small"
                    sx={{ width: 150 }}
                  />
                </Box>

                {/* Cooking Step Fields */}
                {st.type === 'cooking' && (
                  <Box display="flex" gap={1} mt={1}>
                    <TextField
                      label="Temperature (°C)"
                      type="number"
                      inputProps={{ min: 40, max: 200 }}
                      value={st.cookingSettings?.temperature || ''}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((p) =>
                            p.id === st.id
                              ? {
                                  ...p,
                                  cookingSettings: {
                                    temperature: Math.min(
                                      200,
                                      Math.max(40, Number(e.target.value))
                                    ),
                                    speed: Math.max(1, p.cookingSettings?.speed || 1),
                                  },
                                }
                              : p
                          )
                        )
                      }
                      placeholder="40–200"
                      size="small"
                    />

                    <TextField
                      label="Speed"
                      type="number"
                      inputProps={{ min: 1, max: 5 }}
                      value={st.cookingSettings?.speed || ''}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((p) =>
                            p.id === st.id
                              ? {
                                  ...p,
                                  cookingSettings: {
                                    speed: Math.min(
                                      5,
                                      Math.max(1, Number(e.target.value))
                                    ),
                                    temperature: p.cookingSettings?.temperature || 100,
                                  },
                                }
                              : p
                          )
                        )
                      }
                      placeholder="1–5"
                      size="small"
                    />
                  </Box>
                )}
              </Card>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              onClick={addStep}
              sx={{ mt: 1 }}
            >
              Add Step
            </Button>
          </Box>

          {/* Footer Buttons */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={() => navigate('/recipes')}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={save}
              disabled={!title || ingredients.length === 0 || steps.length === 0}
            >
              Save Recipe
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
