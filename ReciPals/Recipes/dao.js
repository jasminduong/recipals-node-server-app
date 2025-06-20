import model from "./model.js";

// Recipes dao.js implements various CRUD operations for handling the recipes array in the Database

// creates a recipe
export async function createRecipe(recipe) {
  const newRecipe = { ...recipe, _id: uuidv4() };
  await model.create(newRecipe);
}

// finds all recipes
export async function findAllRecipes() {
  await model.find();
}

// finds a recipe by ID
export async function findRecipeById(recipeId) {
  await model.findById(recipeId);
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
