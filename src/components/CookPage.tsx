import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  Box, 
  Button, 
  Typography, 
  Chip, 
  LinearProgress, 
  Paper,
  Card,
  IconButton,
  Stack
} from '@mui/material';
import TimerCircle from './common/TimerCircle';
import {
  startSession,
  pauseSession,
  resumeSession,
  tickSecond,
  advanceStep,
  endSession,
  stopCurrentStep,
} from '../slices/sessionSlice';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import './CookPage.css';

function secFormat(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CookPage() {
  const { id } = useParams();
  const recipes = useSelector((s: RootState) => s.recipes);
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch();
  const recipe = recipes.find((r) => r.id === id);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!id || !session.activeRecipeId || session.activeRecipeId !== id) return;
    function tick() {
      const s = session.byRecipeId[id];
      if (!s || !s.isRunning) return;
      dispatch(tickSecond({ recipeId: id, nowTs: Date.now(), elapsedSec: 1 }));
      const current = session.byRecipeId[id];
      if (current && current.stepRemainingSec <= 0) {
        const r = recipes.find((rr) => rr.id === id);
        if (!r) return;
        const nextIndex = current.currentStepIndex + 1;
        if (nextIndex >= r.steps.length) {
          dispatch(endSession(id));
          return;
        }
        const nextDur = r.steps[nextIndex].durationMinutes * 60;
        dispatch(advanceStep({ recipeId: id, newStepIndex: nextIndex, stepDurationSec: nextDur }));
      }
    }
    timerRef.current = window.setInterval(() => tick(), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, id, recipes, dispatch]);

  if (!recipe)
    return (
      <Box className="cook-container">
        <Typography>Recipe not found</Typography>
      </Box>
    );

  const sess = session.activeRecipeId === id ? session.byRecipeId[id] : null;
  const totalSec = recipe.steps.reduce((a, b) => a + b.durationMinutes * 60, 0);
  const overallRemaining = sess ? sess.overallRemainingSec : totalSec;
  const overallElapsed = totalSec - overallRemaining;
  const overallPct = Math.round((overallElapsed / totalSec) * 100 || 0);

  function onStart() {
    if (session.activeRecipeId && session.activeRecipeId !== id)
      return alert('Another session is active!');
    if (sess) return;
    const firstDur = recipe.steps[0].durationMinutes * 60;
    dispatch(startSession({ recipeId: id!, stepRemainingSec: firstDur, overallRemainingSec: totalSec }));
  }
  function onPause() {
    dispatch(pauseSession());
  }
  function onResume() {
    dispatch(resumeSession());
  }
  function onStop() {
    if (!sess) return;
    dispatch(stopCurrentStep({ recipeId: id }));
  }

  const currentStep = sess ? recipe.steps[sess.currentStepIndex] : recipe.steps[0];
  const stepRemain = sess ? sess.stepRemainingSec : currentStep.durationMinutes * 60;
  const stepDur = currentStep.durationMinutes * 60;
  const stepPct = Math.round(((stepDur - stepRemain) / stepDur) * 100 || 0);

  const getStepStatus = (index: number) => {
    if (!sess) return index === 0 ? 'current' : 'upcoming';
    if (index < sess.currentStepIndex) return 'completed';
    if (index === sess.currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <Box className="cook-container">
      {/* Header Section */}
      <Card className="cook-header" elevation={0}>
        <Box className="header-content">
          <Box className="recipe-info">
            <Typography variant="h5" className="cook-title">
              {recipe.title}
            </Typography>
            <Box className="recipe-meta">
              <Chip 
                label={recipe.difficulty} 
                size="small"
                className={`difficulty-chip ${recipe.difficulty.toLowerCase()}`}
              />
              <Box className="time-meta">
                <ScheduleIcon className="meta-icon" />
                <Typography variant="body2">
                  {recipe.steps.reduce((a, b) => a + b.durationMinutes, 0)} min
                </Typography>
              </Box>
              <Box className="steps-meta">
                <RestaurantIcon className="meta-icon" />
                <Typography variant="body2">
                  {recipe.steps.length} steps
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1} className="control-buttons">
            {!sess && (
              <Button 
                variant="contained" 
                startIcon={<PlayArrowIcon />}
                className="start-btn"
                onClick={onStart}
                size="small"
              >
                Start
              </Button>
            )}
            {sess && sess.isRunning && (
              <Button 
                variant="outlined" 
                startIcon={<PauseIcon />}
                className="pause-btn"
                onClick={onPause}
                size="small"
              >
                Pause
              </Button>
            )}
            {sess && !sess.isRunning && (
              <Button 
                variant="contained" 
                startIcon={<PlayArrowIcon />}
                className="resume-btn"
                onClick={onResume}
                size="small"
              >
                Resume
              </Button>
            )}
            {sess && (
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<StopIcon />}
                className="stop-btn"
                onClick={onStop}
                size="small"
              >
                Stop
              </Button>
            )}
          </Stack>
        </Box>
      </Card>

      {/* Current Step Section */}
      <Card className="current-step-section" elevation={0}>
        <Box className="step-content">
          <Box className="step-info">
            <Chip 
              label={`Step ${(sess ? sess.currentStepIndex : 0) + 1} of ${recipe.steps.length}`}
              color="primary"
              className="step-counter"
              size="small"
            />
            <Typography variant="subtitle1" className="step-description">
              {currentStep.description}
            </Typography>
            <Box className="step-meta">
              {currentStep.type === 'cooking' ? (
                <Chip
                  icon={<RestaurantIcon />}
                  label={`${currentStep.cookingSettings?.temperature}° • Speed ${currentStep.cookingSettings?.speed}`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Chip 
                  icon={<ScheduleIcon />}
                  label="Instruction" 
                  variant="outlined" 
                  size="small"
                />
              )}
              <Box className="step-time">
                <ScheduleIcon className="time-icon" />
                <Typography variant="body2" className="time-text">
                  {secFormat(stepRemain)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="timer-container">
            <TimerCircle percent={stepPct} remaining={stepRemain} size={80} />
          </Box>
        </Box>
      </Card>

      {/* Overall Progress - Compact */}
      <Card className="progress-section" elevation={0}>
        <Box className="progress-content">
          <Box className="progress-info">
            <Typography variant="subtitle2" className="progress-title">
              Overall Progress
            </Typography>
            <Typography variant="body2" className="progress-time">
              {secFormat(overallRemaining)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallPct}
            className="progress-bar"
          />
          <Typography variant="caption" className="progress-percent">
            {overallPct}% • {sess ? sess.currentStepIndex + 1 : 0}/{recipe.steps.length} steps
          </Typography>
        </Box>
      </Card>

      {/* Timeline */}
      <Card className="timeline-section" elevation={0}>
        <Box className="timeline-header">
          <TimelineIcon className="timeline-icon" />
          <Typography variant="subtitle1" className="timeline-title">
            Steps
          </Typography>
        </Box>
        
        <Box className="timeline-steps">
          {recipe.steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <Box key={step.id} className={`timeline-step ${status}`}>
                <Box className="step-indicator">
                  {status === 'completed' && (
                    <CheckCircleIcon className="step-icon completed" />
                  )}
                  {status === 'current' && (
                    <Box className="step-icon current">
                      <PlayArrowIcon />
                    </Box>
                  )}
                  {status === 'upcoming' && (
                    <RadioButtonUncheckedIcon className="step-icon upcoming" />
                  )}
                  {index < recipe.steps.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </Box>
                
                <Box className="step-content">
                  <Typography variant="body2" className="step-title">
                    Step {index + 1}
                  </Typography>
                  <Typography variant="caption" className="step-description">
                    {step.description}
                  </Typography>
                  <Box className="step-meta">
                    <Chip 
                      label={`${step.durationMinutes}m`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
}