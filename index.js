const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const vendorRoutes=require("./routes/vendorRoutes");
const firmRoutes=require("./routes/firmRoutes");
const productRoutes=require("./routes/productRoutes");
const path=require("path");
const cors=require("cors");

const app=express();

const PORT=process.env.PORT || 5000;
dotenv.config();
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB connected")).catch((error)=>console.log(error));
app.use(bodyParser.json());
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static('uploads'));

app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`);
})
app.use("/",(req,res) => {
    res.send("<h1>Welcome</h1>");
})
