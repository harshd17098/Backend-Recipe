const mongoose = require('mongoose');
const multer = require("multer")
const path = require("path")
const recipeSchema = new mongoose.Schema({
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
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads/recipe"));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '' + Date.now());
    }
});
recipeSchema.statics.uploadImage = multer({ storage: storage }).single("image")

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
