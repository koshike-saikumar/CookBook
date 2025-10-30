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
  Fade,
  Slide,
  Grow,
  alpha,
} from '@mui/material';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { toggleFavorite } from '../slices/recipesSlice';
import { useNavigate } from 'react-router-dom';
import { Difficulty } from '../types';

export default function RecipeList() {
  const recipes = useSelector((s: RootState) => s.recipes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  const getDifficultyGradient = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'linear-gradient(135deg, #10b981, #34d399)';
      case 'Medium': return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
      case 'Hard': return 'linear-gradient(135deg, #ef4444, #f87171)';
      default: return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Box 
      className="recipe-list-container"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          zIndex: 0,
        }}
      />

      <Box position="relative" zIndex={1}>
        {/* Header */}
        <Slide in={true} direction="down" timeout={800}>
          <Paper 
            className="recipe-header"
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              padding: { xs: 3, md: 4 },
              marginBottom: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header Background Effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }}
            />
            
            <Box className="header-content">
              <Box>
                <Typography 
                  variant="h3" 
                  className="recipe-title"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    marginBottom: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  Your Recipes
                </Typography>
                <Typography 
                  variant="h6" 
                  className="recipe-subtitle"
                  sx={{
                    color: 'rgba(107, 114, 128, 0.8)',
                    fontWeight: 500,
                  }}
                >
                  {shown.length} delicious recipe{shown.length !== 1 ? 's' : ''} waiting for you
                </Typography>
              </Box>
              
              <Fade in={true} timeout={1000}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  className="create-btn"
                  onClick={() => navigate('/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    padding: '12px 24px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.6)',
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  Create Recipe
                </Button>
              </Fade>
            </Box>
          </Paper>
        </Slide>

        {/* Controls */}
        <Fade in={true} timeout={1200}>
          <Paper 
            className="controls-section"
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              padding: 3,
              marginBottom: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box className="controls-group">
              <Box className="control-item">
                <FilterListIcon 
                  className="control-icon"
                  sx={{ 
                    color: '#667eea',
                    fontSize: '24px !important',
                  }}
                />
                <FormControl size="small" className="filter-control">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={filter}
                    label="Difficulty"
                    onChange={(e) => setFilter(e.target.value as any)}
                    sx={{
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <MenuItem value="All">All Levels</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className="control-item">
                <SortIcon 
                  className="control-icon"
                  sx={{ 
                    color: '#667eea',
                    fontSize: '24px !important',
                  }}
                />
                <FormControl size="small" className="filter-control">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sort}
                    label="Sort By"
                    onChange={(e) => setSort(e.target.value as any)}
                    sx={{
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <MenuItem value="asc">Time: Low to High</MenuItem>
                    <MenuItem value="desc">Time: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Recipe Cards Grid */}
        <Grid container spacing={3} className="recipes-grid">
          {shown.map((recipe, index) => {
            const totalTime = recipe.steps.reduce((a, b) => a + b.durationMinutes, 0);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                <Grow in={true} timeout={800 + index * 100}>
                  <Card 
                    className="recipe-card"
                    onMouseEnter={() => setHoveredCard(recipe.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate(`/cook/${recipe.id}`)}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      boxShadow: hoveredCard === recipe.id 
                        ? '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)'
                        : '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: hoveredCard === recipe.id ? 'translateY(-8px)' : 'translateY(0)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: getDifficultyGradient(recipe.difficulty),
                      },
                    }}
                  >
                    {/* Favorite Corner */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                      }}
                    >
                      <IconButton
                        size="small"
                        className="favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleFavorite(recipe.id));
                        }}
                        sx={{
                          background: recipe.isFavorite 
                            ? 'rgba(245, 158, 11, 0.15)' 
                            : 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${recipe.isFavorite ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.5)'}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: recipe.isFavorite 
                              ? 'rgba(245, 158, 11, 0.25)' 
                              : 'rgba(255, 255, 255, 0.9)',
                            transform: 'scale(1.2)',
                          },
                        }}
                      >
                        {recipe.isFavorite ? (
                          <Star 
                            className="favorite-icon filled"
                            sx={{ 
                              color: '#f59e0b',
                              fontSize: '20px',
                            }}
                          />
                        ) : (
                          <StarBorder 
                            className="favorite-icon"
                            sx={{ 
                              color: '#cbd5e1',
                              fontSize: '20px',
                            }}
                          />
                        )}
                      </IconButton>
                    </Box>

                    <CardContent 
                      sx={{ 
                        padding: 3,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Recipe Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          background: getDifficultyGradient(recipe.difficulty),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 2,
                          boxShadow: `0 4px 12px ${alpha(getDifficultyColor(recipe.difficulty), 0.3)}`,
                        }}
                      >
                        <RestaurantIcon 
                          sx={{ 
                            color: 'white',
                            fontSize: '24px',
                          }}
                        />
                      </Box>

                      {/* Card Header */}
                      <Box sx={{ marginBottom: 2, flexGrow: 1 }}>
                        <Typography 
                          variant="h6" 
                          className="recipe-name"
                          sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            lineHeight: 1.4,
                            marginBottom: 1,
                            fontSize: '1.1rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {recipe.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {recipe.description || 'A delicious recipe waiting to be cooked...'}
                        </Typography>
                      </Box>

                      {/* Recipe Meta */}
                      <Box 
                        className="recipe-meta"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 'auto',
                        }}
                      >
                        <Chip
                          label={recipe.difficulty}
                          size="small"
                          className="difficulty-chip"
                          sx={{
                            background: getDifficultyGradient(recipe.difficulty),
                            color: 'white',
                            fontWeight: 700,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            height: '26px',
                            boxShadow: `0 2px 8px ${alpha(getDifficultyColor(recipe.difficulty), 0.3)}`,
                          }}
                        />
                        
                        <Box 
                          className="time-display"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            background: 'rgba(255, 255, 255, 0.6)',
                            padding: '4px 8px',
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          <AccessTimeIcon 
                            className="time-icon"
                            sx={{ 
                              fontSize: '16px !important',
                              color: '#667eea',
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            className="time-text"
                            sx={{
                              fontWeight: 600,
                              color: '#667eea',
                              fontSize: '0.8rem',
                            }}
                          >
                            {formatTime(totalTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    {/* Card Actions */}
                    <CardActions 
                      sx={{ 
                        padding: '16px 24px !important',
                        background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
                        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <Button 
                        size="small" 
                        fullWidth
                        className="cook-btn"
                        onClick={() => navigate(`/cook/${recipe.id}`)}
                        startIcon={<LocalFireDepartmentIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                          color: '#667eea',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          padding: '10px 16px',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                          },
                        }}
                      >
                        Start Cooking
                      </Button>
                    </CardActions>
                  </Card>
                </Grow>
              </Grid>
            );
          })}
        </Grid>

        {/* Empty State */}
        {shown.length === 0 && (
          <Fade in={true} timeout={1500}>
            <Paper 
              className="empty-state"
              sx={{
                textAlign: 'center',
                padding: 8,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                }}
              >
                <RestaurantIcon 
                  sx={{ 
                    color: 'white',
                    fontSize: '40px',
                  }}
                />
              </Box>
              
              <Typography 
                variant="h5" 
                className="empty-title"
                sx={{
                  color: '#1e293b',
                  fontWeight: 700,
                  marginBottom: 1,
                }}
              >
                No recipes found
              </Typography>
              
              <Typography 
                variant="body1" 
                className="empty-subtitle"
                sx={{
                  color: '#64748b',
                  marginBottom: 3,
                }}
              >
                Try adjusting your filters or create a new recipe to get started
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: 3,
                  padding: '12px 24px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.6)',
                  },
                }}
              >
                Create Your First Recipe
              </Button>
            </Paper>
          </Fade>
        )}
      </Box>
    </Box>
  );
}