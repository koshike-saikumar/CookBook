import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';


function formatMMSS(sec: number){ const m = Math.floor(sec/60).toString().padStart(2,'0'); const s = Math.floor(sec%60).toString().padStart(2,'0'); return `${m}:${s}`; }


export default function TimerCircle({percent, remaining}:{percent:number; remaining:number}){
return (
<Box position="relative" display="inline-flex">
<CircularProgress variant="determinate" value={percent} size={84} />
<Box
top={0}
left={0}
bottom={0}
right={0}
position="absolute"
display="flex"
alignItems="center"
justifyContent="center"
>
<Typography variant="caption">{formatMMSS(remaining)}</Typography>
</Box>
</Box>
);
}