const mongoose = require('mongoose');
const multer = require("multer")
const path = require("path")
const savedRecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    isVegetarian: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian', 'vegan'],
        required: true
    },
    prepTime: {
        type: Number,
        required: true,
        min: 1
    },
    cookTime: {
        type: Number,
        required: true,
        min: 1
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    servings: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'],
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },
});


const savedRecipe = mongoose.model('savedRecipe', savedRecipeSchema);
module.exports = savedRecipe;
