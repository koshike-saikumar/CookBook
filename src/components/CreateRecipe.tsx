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
import './CreateRecipe.css';

export default function CreateRecipe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  function addIngredient() {
    setIngredients((s) => [
      ...s,
      { id: nanoid(), name: '', quantity: 1, unit: 'pcs' },
    ]);
  }

  function removeIngredient(id: string) {
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

  function removeStep(id: string) {
    setSteps((s) => s.filter((step) => step.id !== id));
  }

  function save() {
    if (title.trim().length < 3) return alert('Title must be at least 3 characters');
    if (ingredients.length < 1) return alert('Add at least 1 ingredient');
    if (steps.length < 1) return alert('Add at least 1 step');
    dispatch(addRecipe({ title, difficulty, ingredients, steps } as any));
    navigate('/recipes');
  }

  const getDifficultyColor = (level: Difficulty) => {
    switch (level) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const totalTime = steps.reduce((total, step) => total + step.durationMinutes, 0);

  return (
    <Box className="create-recipe-page">
      <Paper className="create-recipe-card" elevation={0}>
        {/* Header Section */}
        <Box className="recipe-header">
          <Box className="header-content">
            <Box className="header-text">
              <Typography variant="h4" className="create-title">
                Create New Recipe
              </Typography>
              <Typography variant="subtitle1" className="create-subtitle">
                Craft your culinary masterpiece
              </Typography>
            </Box>
            <Box className="recipe-stats">
              <Chip 
                icon={<LocalDiningIcon />} 
                label={`${ingredients.length} ingredients`}
                variant="outlined"
                className="stat-chip"
              />
              <Chip 
                icon={<ScheduleIcon />} 
                label={`${totalTime} min`}
                variant="outlined"
                className="stat-chip"
              />
              <Chip 
                label={difficulty}
                style={{ backgroundColor: getDifficultyColor(difficulty), color: 'white' }}
                className="stat-chip"
              />
            </Box>
          </Box>
        </Box>

        <Box className="form-content">
          {/* Basic Information */}
          <Box className="form-section">
            <Typography variant="h6" className="section-title">
              <RestaurantIcon className="section-icon" />
              Basic Information
            </Typography>
            <Box className="basic-fields">
              <TextField
                label="Recipe Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="recipe-input"
                placeholder="e.g., Classic Chocolate Chip Cookies"
              />
              <TextField
                select
                label="Difficulty Level"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="recipe-input"
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </TextField>
            </Box>
          </Box>

          {/* Ingredients Section */}
          <Box className="form-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <LocalDiningIcon className="section-icon" />
                Ingredients
                <Chip label={ingredients.length} size="small" className="count-chip" />
              </Typography>
            </Box>
            
            <Box className="ingredients-list">
              {ingredients.map((ing, idx) => (
                <Card className="ingredient-card" key={ing.id} elevation={1}>
                  <Box className="ingredient-content">
                    <TextField
                      label="Ingredient Name"
                      value={ing.name}
                      onChange={(e) =>
                        setIngredients((prev) =>
                          prev.map((p) =>
                            p.id === ing.id ? { ...p, name: e.target.value } : p
                          )
                        )
                      }
                      className="ingredient-field"
                      placeholder="e.g., Flour"
                      fullWidth
                      size="small"
                    />
                    <Box className="ingredient-meta">
                      <TextField
                        label="Qty"
                        type="number"
                        value={ing.quantity}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((p) =>
                              p.id === ing.id
                                ? { ...p, quantity: Number(e.target.value) }
                                : p
                            )
                          )
                        }
                        className="quantity-field"
                        inputProps={{ min: 0.1, step: 0.1 }}
                        size="small"
                      />
                      <TextField
                        label="Unit"
                        value={ing.unit}
                        onChange={(e) =>
                          setIngredients((prev) =>
                            prev.map((p) =>
                              p.id === ing.id ? { ...p, unit: e.target.value } : p
                            )
                          )
                        }
                        className="unit-field"
                        placeholder="cups, tbsp"
                        size="small"
                      />
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => removeIngredient(ing.id)}
                    className="remove-btn"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Card>
              ))}
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              className="add-btn"
              onClick={addIngredient}
              fullWidth
              size="small"
            >
              Add Ingredient
            </Button>
          </Box>

          {/* Steps Section */}
          <Box className="form-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <ScheduleIcon className="section-icon" />
                Cooking Steps
                <Chip label={steps.length} size="small" className="count-chip" />
              </Typography>
            </Box>

            <Box className="steps-list">
              {steps.map((st, idx) => (
                <Card className="step-card" key={st.id} elevation={1}>
                  <Box className="step-header">
                    <Chip 
                      label={`Step ${idx + 1}`} 
                      color="primary" 
                      size="small"
                      className="step-number"
                    />
                    <IconButton
                      onClick={() => removeStep(st.id)}
                      className="remove-btn"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <TextField
                    label={`Step description`}
                    fullWidth
                    multiline
                    rows={2}
                    value={st.description}
                    onChange={(e) =>
                      setSteps((prev) =>
                        prev.map((p) =>
                          p.id === st.id
                            ? { ...p, description: e.target.value }
                            : p
                        )
                      )
                    }
                    className="step-description"
                    placeholder="Describe this step..."
                    size="small"
                  />
                  
                  <Box className="step-options">
                    <TextField
                      select
                      label="Type"
                      value={st.type}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((p) =>
                            p.id === st.id
                              ? { ...p, type: e.target.value as any }
                              : p
                          )
                        )
                      }
                      className="step-type-field"
                      size="small"
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
                              ? {
                                  ...p,
                                  durationMinutes: Math.max(
                                    1,
                                    Number(e.target.value)
                                  ),
                                }
                              : p
                          )
                        )
                      }
                      className="duration-field"
                      inputProps={{ min: 1 }}
                      size="small"
                    />
                  </Box>
                </Card>
              ))}
            </Box>

            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              className="add-btn"
              onClick={addStep}
              fullWidth
              size="small"
            >
              Add Step
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box className="action-buttons">
            <Button
              variant="outlined"
              className="cancel-btn"
              onClick={() => navigate('/recipes')}
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              className="save-btn"
              onClick={save}
              disabled={!title || ingredients.length === 0 || steps.length === 0}
              size="small"
            >
              Save Recipe
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}