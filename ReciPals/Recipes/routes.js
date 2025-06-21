import * as recipesDao from "./dao.js";

// RecipeRoutes expose the database operations of routes through a RESTful API
export default function RecipeRoutes(app) {
  // creates a new recipe
  app.post("/api/recipes", async (req, res) => {
    const recipe = req.body;
    const newRecipe = await recipesDao.createRecipe(recipe);
    res.json(newRecipe);
  });

  // gets all recipes
  app.get("/api/recipes", async (req, res) => {
    const recipes = await recipesDao.findAllRecipes();
    res.json(recipes);
  });

  // updates a recipe
  app.put("/api/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;
    const recipeUpdates = req.body;
    const updatedRecipe = await recipesDao.updateRecipe(recipeId, recipeUpdates);
    res.json(updatedRecipe);
  });

  // deletes a recipe
  app.delete("/api/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;
    await recipesDao.deleteRecipe(recipeId);
    res.json();
  });

  // search recipes - using Mongoose
  app.get("/api/recipes/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query required' });
      }
      
      const recipes = await recipesDao.searchRecipes(q);
      res.json(recipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // gets a single recipe by id
  app.get("/api/recipes/:recipeId", async (req, res) => {
    const { recipeId } = req.params;
    const recipe = await recipesDao.findRecipeById(recipeId);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  });
}
