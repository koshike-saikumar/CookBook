import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Stop from '@mui/icons-material/Stop';
import { pauseSession, resumeSession, stopCurrentStep } from '../slices/sessionSlice';
import TimerCircle from './common/TimerCircle';
import { useNavigate } from 'react-router-dom';


export default function MiniPlayer(){
const session = useSelector((s:RootState)=>s.session);
const recipes = useSelector((s:RootState)=>s.recipes);
const dispatch = useDispatch();
const navigate = useNavigate();
if(!session.activeRecipeId) return null;
const rid = session.activeRecipeId;
const r = recipes.find(x=>x.id===rid);
if(!r) return null;
const s = session.byRecipeId[rid];
const totalSec = r.steps.reduce((a,b)=>a+ b.durationMinutes*60,0);
const elapsed = totalSec - s.overallRemainingSec;
const pct = Math.round((elapsed/ totalSec)*100 || 0);
return (
<Paper sx={{position:'fixed', bottom:16, right:16, p:1, display:'flex', alignItems:'center', gap:2}} elevation={6}>
<Box onClick={()=>navigate(`/cook/${rid}`)} sx={{cursor:'pointer'}}>
<Typography variant="subtitle2">{r.title}</Typography>
<Typography variant="caption">{s.isRunning? 'Running':'Paused'} · Step {s.currentStepIndex+1} of {r.steps.length}</Typography>
</Box>
<TimerCircle percent={pct} remaining={s.stepRemainingSec} />
<IconButton onClick={()=> s.isRunning ? dispatch(pauseSession()) : dispatch(resumeSession())}>
{s.isRunning? <Pause/>: <PlayArrow/>}
</IconButton>
<IconButton onClick={()=>dispatch(stopCurrentStep({recipeId:rid}))}><Stop/></IconButton>
</Paper>
);
}