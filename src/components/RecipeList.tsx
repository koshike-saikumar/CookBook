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
  Chip,
} from '@mui/material';
import imageIcon from '../utils/image.png';
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
            
           <Box display="flex" alignItems="center" gap={1} mb={2}>
  <img
    src={imageIcon}
    alt="copy icon"
    style={{
      width: 40,
      height: 40,
      borderRadius: '8px',
      objectFit: 'cover',
    }}
  />
  <Typography
    variant="h4"
    className="recipe-title"
    gutterBottom
    sx={{
      fontWeight: 'bold',
      fontFamily: 'Roboto, Arial, sans-serif',
    }}
  >
    Your Recipes
  </Typography>
</Box>
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

      {/* Recipe Cards (Flex Layout) */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
          mt: 3,
        }}
      >
        {shown.map((recipe) => {
          const totalTime = recipe.steps.reduce((a, b) => a + b.durationMinutes, 0);
          return (
            <Card
              key={recipe.id}
              className="recipe-card"
              sx={{
                flex: '1 1 250px', // responsive width
                maxWidth: 300,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
              }}
              onClick={() => navigate(`/cook/${recipe.id}`)}
            >
              <CardContent>
                <Box className="card-header" display="flex" justifyContent="space-between">
                  <Typography variant="h6">{recipe.title}</Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleFavorite(recipe.id));
                    }}
                  >
                    {recipe.isFavorite ? <Star color="warning" /> : <StarBorder />}
                  </IconButton>
                </Box>

                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={recipe.difficulty}
                    size="small"
                    sx={{
                      backgroundColor: getDifficultyColor(recipe.difficulty),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">{formatTime(totalTime)}</Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/cook/${recipe.id}`)}
                >
                  Start Cooking
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Empty State */}
      {shown.length === 0 && (
        <Paper className="empty-state" sx={{ textAlign: 'center', p: 4, mt: 3 }}>
          <Typography variant="h6">No recipes found</Typography>
          <Typography variant="body2">
            Try adjusting your filters or create a new recipe to get started.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
