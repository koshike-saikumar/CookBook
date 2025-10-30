import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircularProgress, Box, Typography } from '@mui/material';
function formatMMSS(sec) { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = Math.floor(sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; }
export default function TimerCircle({ percent, remaining }) {
    return (_jsxs(Box, { position: "relative", display: "inline-flex", children: [_jsx(CircularProgress, { variant: "determinate", value: percent, size: 84 }), _jsx(Box, { top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", children: _jsx(Typography, { variant: "caption", children: formatMMSS(remaining) }) })] }));
}
