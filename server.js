const express= require("express")
const port = 3456;
const mongoose= require("mongoose")
const db= require("./config/dbConnect")
const cors= require("cors")
const path= require("path")

const app= express()
app.use(cors());
app.use(express.json())


app.use("/", require("./routes/userRoutes"))
app.use("/uploads",express.static(path.join(__dirname,'uploads')))

app.listen(port,()=>{
    console.log(`Server starting at http://localhost:${port}`);
})