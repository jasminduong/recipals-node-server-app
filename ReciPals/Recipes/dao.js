import db from "../Database/index.js";
import model from "./model.js";

// Recipes dao.js implements various CRUD operations for handling the recipes array in the Database

let { recipes } = db;

// creates a recipe
export async function createRecipe(recipe) {
  return await model.create(recipe);
}

// finds all recipes
export async function findAllRecipes() {
  return await model.find();
}

// finds a recipe by ID
export async function findRecipeById(recipeId) {
  return await model.findOne(recipeId);
}

// updates an recipe
export async function updateRecipe(recipeId, recipe) {
  return await model.updateOne({recipe_id: recipeId}, {$set: recipe});
}

// deletes an recipe
export async function deleteRecipe(recipeId) {
  return await model.deleteOne({recipe_id: recipeId})
}

// searches recipes by term using Mongoose (ingredients, name, description, tags, steps, AND by username who created them)
export async function searchRecipes(searchTerm) {
  const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive regex
  
  const searchQuery = {
    $or: [
      // Search in recipe name
      { name: searchRegex },
      
      // Search in user who created it
      { user_created: searchRegex },
      
      // Search in description
      { description: searchRegex },
      
      // Search in ingredients (nested in ingredients_sec array)
      { "ingredients_sec.ingredients": searchRegex },
      
      // Search in tags array
      { tags: searchRegex },
      
      // Search in steps array
      { steps: searchRegex }
    ]
  };
  
  return await model.find(searchQuery);
}
