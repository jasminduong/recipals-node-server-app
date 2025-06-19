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

// searches recipes by term (ingredients, name, description, AND by username who created them)
export function searchRecipes(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  
  return db.recipes.filter((recipe) => {
    // Search in recipe name
    const nameMatch = recipe.name?.toLowerCase().includes(searchLower);
    
    // Search in user who created it (this is the key part for user search)
    const userMatch = recipe.user_created?.toLowerCase().includes(searchLower);
    
    // Search in description
    const descriptionMatch = recipe.description?.toLowerCase().includes(searchLower);
    
    // Search in ingredients (nested in ingredients_sec)
    const ingredientsMatch = recipe.ingredients_sec?.some((section) => {
      return section["ingredients:"]?.some((ingredient) => 
        ingredient.toLowerCase().includes(searchLower)
      );
    });
    
    // Search in tags
    const tagsMatch = recipe.tags?.some((tag) => 
      tag.toLowerCase().includes(searchLower)
    );
    
    // Search in steps
    const stepsMatch = recipe.steps?.some((step) => 
      step.toLowerCase().includes(searchLower)
    );
    
    return nameMatch || userMatch || descriptionMatch || ingredientsMatch || tagsMatch || stepsMatch;
  });
}
