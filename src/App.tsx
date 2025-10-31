import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import CreateRecipe from './components/CreateRecipe';
import CookPage from './components/CookPage';
import MiniPlayer from './components/MiniPlayer';

export default function App(){
  return (
    <div style={{minHeight:'100vh'}}>
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" replace/>} />
        <Route path="/recipes" element={<RecipeList/>} />
        <Route path="/create" element={<CreateRecipe/>} />
        <Route path="/cook/:id" element={<CookPage/>} />
      </Routes>
      <MiniPlayer />
    </div>
  );
}