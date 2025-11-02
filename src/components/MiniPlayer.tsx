import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Stop from '@mui/icons-material/Stop';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  pauseSession,
  resumeSession,
  stopCurrentStep,
  advanceStep,
  endSession,
} from '../slices/sessionSlice';
import TimerCircle from './common/TimerCircle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// helper for mm:ss
function secFormat(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MiniPlayer() {
  const session = useSelector((s: RootState) => s.session);
  const recipes = useSelector((s: RootState) => s.recipes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ no active recipe → hide player
  if (!session.activeRecipeId) return null;

  const rid = session.activeRecipeId;
  const recipe = recipes.find((r) => r.id === rid);
  if (!recipe) return null;

  const s = session.byRecipeId[rid];
if (!s) return null;

  // ✅ hide only when viewing the same cook page
  if (location.pathname === `/cook/${rid}`) return null;

  // progress calculations
  const totalSec = recipe.steps.reduce((a, b) => a + b.durationMinutes * 60, 0);
  const elapsed = totalSec - s.overallRemainingSec;
  const pct = Math.round((elapsed / totalSec) * 100 || 0);
  const currentStep = recipe.steps[s.currentStepIndex];
  const stepRemaining = s.stepRemainingSec;
  const stepTotal = currentStep.durationMinutes * 60;
  const stepPct = Math.round(((stepTotal - stepRemaining) / stepTotal) * 100 || 0);

  // ✅ STOP handler with same semantics as CookPage
  const onStop = () => {
    const currentIndex = s.currentStepIndex;
    const isLastStep = currentIndex >= recipe.steps.length - 1;

    dispatch(stopCurrentStep({ recipeId: rid }));

    if (isLastStep) {
      dispatch(endSession(rid));
      toast.success('Step ended — Recipe session finished!');
    } else {
      const nextIndex = currentIndex + 1;
      const nextDur = recipe.steps[nextIndex].durationMinutes * 60;
      dispatch(advanceStep({ recipeId: rid, newStepIndex: nextIndex, stepDurationSec: nextDur }));
      toast.info('Step ended — moved to next step!');
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 3,
        boxShadow: 6,
        background: '#ffffffff',
        zIndex: 1200,
      }}
      elevation={6}
    >
      {/* Click anywhere except icons to open active CookPage */}
      <Box
        onClick={() => navigate(`/cook/${rid}`)}
        sx={{
          cursor: 'pointer',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
          {recipe.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {s.isRunning ? 'Running' : 'Paused'} · Step {s.currentStepIndex + 1} of {recipe.steps.length} · {secFormat(stepRemaining)}
        </Typography>
      </Box>

      <TimerCircle percent={stepPct} remaining={stepRemaining} />

      <Tooltip title={s.isRunning ? 'Pause' : 'Resume'}>
        <IconButton
          color="primary"
          onClick={() =>
            s.isRunning ? dispatch(pauseSession()) : dispatch(resumeSession())
          }
        >
          {s.isRunning ? <Pause /> : <PlayArrow />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Stop Step">
        <IconButton color="error" onClick={onStop}>
          <Stop />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
