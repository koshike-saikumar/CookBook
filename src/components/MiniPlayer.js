import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Stop from '@mui/icons-material/Stop';
import { pauseSession, resumeSession, stopCurrentStep } from '../slices/sessionSlice';
import TimerCircle from './common/TimerCircle';
import { useNavigate } from 'react-router-dom';
export default function MiniPlayer() {
    const session = useSelector((s) => s.session);
    const recipes = useSelector((s) => s.recipes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    if (!session.activeRecipeId)
        return null;
    const rid = session.activeRecipeId;
    const r = recipes.find(x => x.id === rid);
    if (!r)
        return null;
    const s = session.byRecipeId[rid];
    const totalSec = r.steps.reduce((a, b) => a + b.durationMinutes * 60, 0);
    const elapsed = totalSec - s.overallRemainingSec;
    const pct = Math.round((elapsed / totalSec) * 100 || 0);
    return (_jsxs(Paper, { sx: { position: 'fixed', bottom: 16, right: 16, p: 1, display: 'flex', alignItems: 'center', gap: 2 }, elevation: 6, children: [_jsxs(Box, { onClick: () => navigate(`/cook/${rid}`), sx: { cursor: 'pointer' }, children: [_jsx(Typography, { variant: "subtitle2", children: r.title }), _jsxs(Typography, { variant: "caption", children: [s.isRunning ? 'Running' : 'Paused', " \u00B7 Step ", s.currentStepIndex + 1, " of ", r.steps.length] })] }), _jsx(TimerCircle, { percent: pct, remaining: s.stepRemainingSec }), _jsx(IconButton, { onClick: () => s.isRunning ? dispatch(pauseSession()) : dispatch(resumeSession()), children: s.isRunning ? _jsx(Pause, {}) : _jsx(PlayArrow, {}) }), _jsx(IconButton, { onClick: () => dispatch(stopCurrentStep({ recipeId: rid })), children: _jsx(Stop, {}) })] }));
}
