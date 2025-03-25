const mongoose= require("mongoose")

const dbConnect=()=>{
    mongoose.connect("mongodb+srv://PraveshPrajapati:Pravesh%402004@cluster0.v4bed.mongodb.net/Recipe")
    .then((res) => {
        console.log("Db connect");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports= dbConnect()