import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  Button,
  Typography,
  Chip,
  LinearProgress,
  Card,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './CookPage.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Format seconds → mm:ss
function secFormat(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CookPage() {
  const { id } = useParams<{ id: string }>(); // ✅ strong typing
  const navigate = useNavigate();
  const recipes = useSelector((s: RootState) => s.recipes);
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch();
  const recipe = recipes.find((r) => r.id === id);
  const timerRef = useRef<number | null>(null);

  // ✅ Early return if invalid id
  if (!id || !recipe)
    return (
      <Box className="cook-container">
        <Typography>Recipe not found</Typography>
      </Box>
    );

  // Drift-safe tick logic
  useEffect(() => {
    if (session.activeRecipeId !== id) return;

    const tick = () => {
      const s = session.byRecipeId[id];
      if (!s || !s.isRunning) return;

      const now = Date.now();
      const elapsedSec = s.lastTickTs ? Math.floor((now - s.lastTickTs) / 1000) : 1;

      if (elapsedSec >= 1) {
        dispatch(tickSecond({ recipeId: id, nowTs: now, elapsedSec }));

        const current = session.byRecipeId[id];
        if (current && current.stepRemainingSec <= 0) {
          const nextIndex = current.currentStepIndex + 1;
          if (nextIndex >= recipe.steps.length) {
            dispatch(endSession(id));
            toast.success('Recipe session completed!');
            return;
          }
          const nextDur = recipe.steps[nextIndex].durationMinutes * 60;
          dispatch(
            advanceStep({
              recipeId: id,
              newStepIndex: nextIndex,
              stepDurationSec: nextDur,
            })
          );
        }
      }
    };

    timerRef.current = window.setInterval(() => tick(), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, id, recipe, dispatch]);

  // Session and progress math
  const sess = session.activeRecipeId === id ? session.byRecipeId[id] : null;
  const totalDurationSec = recipe.steps.reduce(
    (a, b) => a + b.durationMinutes * 60,
    0
  );
  const overallRemainingSec = sess ? sess.overallRemainingSec : totalDurationSec;
  const overallElapsedSec = totalDurationSec - overallRemainingSec;
  const overallProgressPercent = Math.round(
    (overallElapsedSec / totalDurationSec) * 100 || 0
  );

  const currentStep = sess ? recipe.steps[sess.currentStepIndex] : recipe.steps[0];
  const stepDurationSec = currentStep.durationMinutes * 60;
  const stepRemainingSec = sess ? sess.stepRemainingSec : stepDurationSec;
  const stepElapsedSec = stepDurationSec - stepRemainingSec;
  const stepProgressPercent = Math.round(
    (stepElapsedSec / stepDurationSec) * 100 || 0
  );

  // ✅ Handlers
  const onStart = () => {
    if (session.activeRecipeId && session.activeRecipeId !== id) {
      toast.error('Another recipe is already running — finish or stop it first!');
      return;
    }
    if (sess) return;
    const firstDur = recipe.steps[0].durationMinutes * 60;
    dispatch(
      startSession({
        recipeId: id,
        stepRemainingSec: firstDur,
        overallRemainingSec: totalDurationSec,
      })
    );
  };

  const onPause = () => dispatch(pauseSession());
  const onResume = () => dispatch(resumeSession());

  const onStop = () => {
    if (!sess) return;
    const currentIndex = sess.currentStepIndex;
    const isLastStep = currentIndex >= recipe.steps.length - 1;

    dispatch(stopCurrentStep({ recipeId: id }));

    if (isLastStep) {
      dispatch(endSession(id));
      toast.success('Recipe session finished!');
    } else {
      const nextIndex = currentIndex + 1;
      const nextDur = recipe.steps[nextIndex].durationMinutes * 60;
      dispatch(
        advanceStep({
          recipeId: id,
          newStepIndex: nextIndex,
          stepDurationSec: nextDur,
        })
      );
      toast.info('Step ended — moved to next step!');
    }
  };

  const getStepStatus = (index: number) => {
    if (!sess) return index === 0 ? 'current' : 'upcoming';
    if (index < sess.currentStepIndex) return 'completed';
    if (index === sess.currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <Box className="cook-container">
      {/* Header */}
      <Card className="cook-header" elevation={0}>
        <Box className="header-content">
          <Box>
            <Typography variant="h5" className="cook-title">
              {recipe.title}
            </Typography>
            <Box className="recipe-meta">
              <Chip
                label={recipe.difficulty}
                size="small"
                className={`difficulty-chip ${recipe.difficulty.toLowerCase()}`}
              />
              <Box className="meta-item">
                <ScheduleIcon className="meta-icon" />
                <Typography variant="body2">
                  {recipe.steps.reduce((a, b) => a + b.durationMinutes, 0)} min
                </Typography>
              </Box>
              <Box className="meta-item">
                <RestaurantIcon className="meta-icon" />
                <Typography variant="body2">
                  {recipe.steps.length} steps
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/recipes')}
              size="small"
            >
              Back
            </Button>

            {!sess && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
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
                onClick={onStop}
                size="small"
              >
                Stop
              </Button>
            )}
          </Stack>
        </Box>
      </Card>

      {/* Active Step Panel */}
      <Card className="current-step-section" elevation={0}>
        <Box className="step-content">
          <Box className="step-info">
            <Chip
              label={`Step ${(sess ? sess.currentStepIndex : 0) + 1} of ${
                recipe.steps.length
              }`}
              color="primary"
              size="small"
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'Roboto, Arial, sans-serif',
                fontWeight: 'bold',
                fontSize: '2rem',
                color: '#341a27ff',
                letterSpacing: 0.5,
              }}
            >
              {currentStep.description}
            </Typography>

            {currentStep.type === 'cooking' &&
              currentStep.cookingSettings && (
                <Box className="cooking-details" sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    🔥 Temperature: <b>{currentStep.cookingSettings.temperature}°C</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ⚙️ Speed: <b>{currentStep.cookingSettings.speed}</b>
                  </Typography>
                </Box>
              )}
            {currentStep.type === 'instruction' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                🧾 Type: Instruction step
              </Typography>
            )}

            <Box className="step-time">
              <ScheduleIcon className="time-icon" />
              <Typography variant="body2">{secFormat(stepRemainingSec)}</Typography>
            </Box>
          </Box>

          <Box className="timer-container">
            <TimerCircle percent={stepProgressPercent} remaining={stepRemainingSec} />
          </Box>
        </Box>
      </Card>

      {/* Overall Progress */}
      <Card className="progress-section" elevation={0}>
        <Box>
          <Typography variant="subtitle2">Overall Progress</Typography>
          <Typography variant="body2">{secFormat(overallRemainingSec)}</Typography>
          <LinearProgress variant="determinate" value={overallProgressPercent} />
          <Typography variant="caption">
            {overallProgressPercent}% • {(sess ? sess.currentStepIndex + 1 : 0)}/
            {recipe.steps.length} steps
          </Typography>
        </Box>
      </Card>

      {/* Timeline */}
      <Card className="timeline-section" elevation={0}>
        <Box className="timeline-header">
          <TimelineIcon className="timeline-icon" />
          <Typography variant="subtitle1">Steps</Typography>
        </Box>

        <Box
          className="timeline-steps"
          sx={{
            maxHeight: '300px',
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#d63384',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': { backgroundColor: '#f2f2f2' },
          }}
        >
          {recipe.steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <Box key={step.id} className={`timeline-step ${status}`}>
                <Box className="step-indicator">
                  {status === 'completed' && (
                    <CheckCircleIcon className="step-icon completed" />
                  )}
                  {status === 'current' && (
                    <PlayArrowIcon className="step-icon current" />
                  )}
                  {status === 'upcoming' && (
                    <RadioButtonUncheckedIcon className="step-icon upcoming" />
                  )}
                  {index < recipe.steps.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </Box>

                <Box className="step-content">
                  <Typography variant="body2">
                    Step {index + 1} —{' '}
                    <b>{step.type === 'cooking' ? 'Cooking' : 'Instruction'}</b>
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    {step.description}
                  </Typography>

                  {step.type === 'cooking' && step.cookingSettings && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                      <Typography variant="caption" color="text.secondary">
                        🔥 Temp: {step.cookingSettings.temperature}°C
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ⚙️ Speed: {step.cookingSettings.speed}
                      </Typography>
                    </Box>
                  )}

                  <Chip label={`${step.durationMinutes}m`} size="small" variant="outlined" />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
}
