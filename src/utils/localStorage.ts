import { Recipe } from '../types';
const KEY = 'recipes:v1';
export function saveRecipes(list: Recipe[]) {
try { localStorage.setItem(KEY, JSON.stringify(list)); } catch(e){}
}
export function loadRecipes(): Recipe[] {
try {
const raw = localStorage.getItem(KEY);
if(!raw) return [];
const parsed = JSON.parse(raw);
if(!Array.isArray(parsed)) return [];
return parsed;
} catch(e) { return []; }
}