import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../types';
import { loadRecipes, saveRecipes } from '../utils/localStorage';
import { nanoid } from 'nanoid';


const initialState: Recipe[] = loadRecipes();


const recipesSlice = createSlice({
name: 'recipes',
initialState,
reducers: {
addRecipe(state, action: PayloadAction<Omit<Recipe,'id'|'createdAt'|'updatedAt'>>) {
const now = new Date().toISOString();
const r: Recipe = { ...action.payload, id: nanoid(), createdAt: now, updatedAt: now };
state.push(r);
saveRecipes(state);
},
updateRecipe(state, action: PayloadAction<Recipe>) {
const idx = state.findIndex(s=>s.id===action.payload.id);
if(idx>=0){ state[idx]=action.payload; saveRecipes(state); }
},
deleteRecipe(state, action: PayloadAction<string>){
const idx = state.findIndex(s=>s.id===action.payload);
if(idx>=0){ state.splice(idx,1); saveRecipes(state); }
},
toggleFavorite(state, action: PayloadAction<string>){
const r = state.find(s=>s.id===action.payload);
if(r){ r.isFavorite = !r.isFavorite; saveRecipes(state);} }
}
});
export const { addRecipe, updateRecipe, deleteRecipe, toggleFavorite } = recipesSlice.actions;
export default recipesSlice.reducer;