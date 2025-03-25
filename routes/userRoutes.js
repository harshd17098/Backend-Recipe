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
const { register, login, profile, addRecipe, getCategory, getRecipe, getIsVegetarian, viewSingleRecipe, selectFavourite, getFavourite, removeFavourite, getAllRecipes, deleteRecipe, editRecipe } = require("../controller/userController")

userRoutes.post("/register", register)

userRoutes.post("/login", login)

userRoutes.get("/profile", authMiddleware,profile)
userRoutes.post("/addRecipe", authMiddleware, Recipe.uploadImage,addRecipe)

userRoutes.get("/getCategory", getCategory)
userRoutes.get("/getRecipe", getRecipe)
userRoutes.get("/getIsVegetarian", getIsVegetarian)
userRoutes.get("/viewSingleRecipe/:id", authMiddleware, viewSingleRecipe)
userRoutes.get("/selectFavourite/:id", authMiddleware, selectFavourite)
userRoutes.get("/getFavourite", authMiddleware, getFavourite)
userRoutes.delete("/removeFavourite/:id", authMiddleware, removeFavourite)
userRoutes.get('/getAllRecipes', authMiddleware, getAllRecipes);
userRoutes.delete('/deleteRecipe/:id', authMiddleware, deleteRecipe);
userRoutes.put('/editRecipe/:id', authMiddleware, Recipe.uploadImage, editRecipe);


module.exports = userRoutes