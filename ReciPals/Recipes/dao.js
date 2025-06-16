import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Recipes dao.js implements various CRUD operations for handling the recipes array in the Database

let { recipes } = db;

// creates a recipe
export function createRecipe(recipe) {
  db.recipes = [...db.recipes, recipe]; 
  return recipe;
}

// finds all recipes
export function findAllRecipes() {
  return db.recipes;
}

// finds a recipe by ID
export function findRecipeById(recipeId) {
  return db.recipes.find((recipe) => recipe.recipe_id === recipeId);
}

// updates an recipe
export function updateRecipe(recipeId, recipeUpdates) {
  const { recipes } = db;
  const recipe = recipes.find((recipe) => recipe.recipe_id === recipeId);
  Object.assign(recipe, recipeUpdates);
  return recipe;
}

// deletes an recipe
export function deleteRecipe(recipeId) {
  const { recipes } = db;
  db.recipes = recipes.filter((recipe) => recipe.recipe_id !== recipeId);
}
