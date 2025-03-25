const express = require("express")
const User = require("../model/userSchema")
const bcrypt = require("bcrypt")
const userRoutes = express.Router()
const jwt = require("jsonwebtoken")
const authMiddleware = require("../config/auth")
const Recipe = require("../model/recipeSchema")
const SavedRecipe = require("../model/savedRecipeSchema")
const path= require("path")
const fs= require("fs")

exports.register = async (req, res) => {
    try {
        // ====================user
        const existingUser = await User.findOne({ email: req.body.email })
        if (!existingUser) {
            // console.log("existing user is", existingUser);
            const hashPassUser = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashPassUser
            const newUser = await User.create(req.body)
            console.log(newUser);
            res.status(200).json({ message: "User Registered", user: newUser })
        }
        else {
            // console.log("existing user else", existingUser);
            res.status(200).json({ message: "User already Registerd please login", existingUser: existingUser })
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.login= async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            if (await bcrypt.compare(req.body.password, existingUser.password)) {
                // console.log("existing uer is" ,existingUser);
                const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, "RECIPE", { expiresIn: '89h' })
                // console.log(token);
                res.status(200).json({ message: "Login Success", token, user: existingUser });
            }
            else {
                res.status(401).json({ message: "Incorect password" })
            }
        }
        else {
            res.status(401).json({ message: "Email doesnt exists" })
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.profile=   async (req, res) => {
    try {
        // console.log(req.user);
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        // console.log(user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.addRecipe=async (req, res) => {
    try {
        let imagePath = ""
        if (req.file) {
            req.body.image = `/uploads/recipe/${req.file.filename}`
        }
        req.body.adminId = req.user.id;
        const rec = await Recipe.create(req.body)
        //  console.log(req.body);
        //  console.log(req.file);
        res.status(200).json({ message: "recipe added", rec: req.body });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getCategory=async (req, res) => {
    try {
        const recipe = await Recipe.distinct('category')
        if (recipe) {
            res.status(200).json({ message: "all Recipe", recipe });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getRecipe= async (req, res) => {
    try {
        // console.log(req.query.category);
        const { category } = req.query;
        let allRecipes;

        if (category && category !== "all") {
            allRecipes = await Recipe.find({ category });
        } else {
            allRecipes = await Recipe.find();
        }
        if (allRecipes) {
            res.status(200).json({ message: "all Recipe", allRecipes });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getIsVegetarian=async (req, res) => {
    try {
        const { isVegetarian } = req.query
        //  console.log(isVegetarian);
        let allRecipe;
        if (isVegetarian && isVegetarian !== "all") {
            allRecipe = await Recipe.find({ isVegetarian })
        }
        else {
            allRecipe = await Recipe.find({})
        }
        if (allRecipe) {
            res.status(200).json({ message: "res get", allRecipe })
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.viewSingleRecipe=async (req, res) => {
    try {
        let singleRecipe = await Recipe.findById(req.params.id)
        res.status(200).json({ message: "Single Recipe", singleRecipe });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.selectFavourite=async (req, res) => {
    try {
        // console.log(req.params.id,".....");
        // console.log(req.user);
        const recipe = await Recipe.findById(req.params.id)
        const alreadySaved = await SavedRecipe.findOne({ userId: req.user.id, recipeId: recipe._id })
        if (alreadySaved) {
            // console.log("Already saved");
            return res.status(401).json({ message: "Recipe already saved" });
        }
        const savedRecipe = await SavedRecipe.create({
            userId: req.user.id,
            recipeId: recipe._id,
            name: recipe.name,
            isVegetarian: recipe.isVegetarian,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            difficulty: recipe.difficulty,
            servings: recipe.servings,
            category: recipe.category,
            ingredients: recipe.ingredients,
            image: recipe.image,
        });
        if (savedRecipe) {
            return res.status(200).json({ message: "Recipe  saved", savedRecipe });
        }
        // console.log(savedRecipe);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getFavourite=async (req, res) => {
    try {
        const savedRecipes = await SavedRecipe.find({ userId: req.user.id });
        if (!savedRecipes.length) {
            return res.status(404).json({ message: "No saved recipes found!" });
        }
        res.status(200).json({ message: "Saved recipes retrieved successfully!", savedRecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.removeFavourite=async (req, res) => {
    try {
        const recipe = await SavedRecipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found." });
        }
        if (recipe.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this recipe." });
        }
        await SavedRecipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Recipe removed from your favorites successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getAllRecipes=async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({ recipes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
exports.deleteRecipe=async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        await Recipe.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
exports.editRecipe=async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findById(id);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      // Delete old image if a new image is uploaded
      if (req.file) {
        const oldImagePath = path.join(__dirname, ".." , recipe.image);
        if (fs.existsSync(oldImagePath)) {
            console.log("old image deleted");
          fs.unlinkSync(oldImagePath);
        }
        req.body.image = `/uploads/recipe/${req.file.filename}`;
      }
      // Update recipe
      const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ message: 'Recipe updated successfully', updatedRecipe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }