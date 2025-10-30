import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
} from '@mui/material';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { toggleFavorite } from '../slices/recipesSlice';
import { useNavigate } from 'react-router-dom';
import { Difficulty } from '../types';
import './RecipeList.css';
export default function RecipeList() {
  const recipes = useSelector((s: RootState) => s.recipes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const shown = useMemo(
    () =>
      recipes
        .filter((r) => (filter === 'All' ? true : r.difficulty === filter))
        .sort(
          (a, b) =>
            (a.steps.reduce((x, y) => x + y.durationMinutes, 0) -
              b.steps.reduce((x, y) => x + y.durationMinutes, 0)) *
            (sort === 'asc' ? 1 : -1)
        ),
    [recipes, filter, sort]
  );

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Box className="recipe-list-container">
      {/* Header */}
      <Paper className="recipe-header" elevation={0}>
        <Box className="header-content">
          <Box>
            <Typography variant="h4" className="recipe-title" gutterBottom>
              Your Recipes
            </Typography>
            <Typography variant="body1" className="recipe-subtitle">
              {shown.length} recipe{shown.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="create-btn"
            onClick={() => navigate('/create')}
          >
            Create Recipe
          </Button>
        </Box>
      </Paper>

      {/* Controls */}
      <Box className="controls-section">
        <Box className="controls-group">
          <Box className="control-item">
            <FilterListIcon className="control-icon" />
            <FormControl size="small" className="filter-control">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filter}
                label="Difficulty"
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <MenuItem value="All">All Levels</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="control-item">
            <SortIcon className="control-icon" />
            <FormControl size="small" className="filter-control">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                label="Sort By"
                onChange={(e) => setSort(e.target.value as any)}
              >
                <MenuItem value="asc">Time: Low to High</MenuItem>
                <MenuItem value="desc">Time: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Recipe Cards Grid */}
      <Grid container spacing={3} className="recipes-grid">
        {shown.map((recipe) => {
          const totalTime = recipe.steps.reduce((a, b) => a + b.durationMinutes, 0);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <Card 
                className="recipe-card"
                onClick={() => navigate(`/cook/${recipe.id}`)}
              >
                <CardContent className="card-content">
                  {/* Card Header */}
                  <Box className="card-header">
                    <Typography variant="h6" className="recipe-name">
                      {recipe.title}
                    </Typography>
                    <IconButton
                      size="small"
                      className="favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleFavorite(recipe.id));
                      }}
                    >
                      {recipe.isFavorite ? (
                        <Star className="favorite-icon filled" />
                      ) : (
                        <StarBorder className="favorite-icon" />
                      )}
                    </IconButton>
                  </Box>

                  {/* Recipe Meta */}
                  <Box className="recipe-meta">
                    <Chip
                      label={recipe.difficulty}
                      size="small"
                      className="difficulty-chip"
                      style={{
                        backgroundColor: getDifficultyColor(recipe.difficulty),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Box className="time-display">
                      <AccessTimeIcon className="time-icon" />
                      <Typography variant="body2" className="time-text">
                        {formatTime(totalTime)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Card Actions */}
                <CardActions className="card-actions">
                  <Button 
                    size="small" 
                    fullWidth
                    className="cook-btn"
                    onClick={() => navigate(`/cook/${recipe.id}`)}
                  >
                    Start Cooking
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {shown.length === 0 && (
        <Paper className="empty-state">
          <Typography variant="h6" className="empty-title">
            No recipes found
          </Typography>
          <Typography variant="body2" className="empty-subtitle">
            Try adjusting your filters or create a new recipe to get started.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}