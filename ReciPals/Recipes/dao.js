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

// searches recipes by term (ingredients, name, description, AND by username who created them)
export function searchRecipes(searchTerm) {
  throw new Error("searchRecipes not implemented yet - needs database integration");
  /*const searchLower = searchTerm.toLowerCase();

  return db.recipes.filter((recipe) => {
    // Search in recipe name
    const nameMatch = recipe.name?.toLowerCase().includes(searchLower);

    // Search in user who created it
    const userMatch = recipe.user_created?.toLowerCase().includes(searchLower);

    // Search in description
    const descriptionMatch = recipe.description
      ?.toLowerCase()
      .includes(searchLower);

    // Search in ingredients (nested in ingredients_sec)
    const ingredientsMatch = recipe.ingredients_sec?.some((section) => {
      return section["ingredients"]?.some((ingredient) =>
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

    return (
      nameMatch ||
      userMatch ||
      descriptionMatch ||
      ingredientsMatch ||
      tagsMatch ||
      stepsMatch
    );
  });*/
}
