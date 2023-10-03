//jshint esversion:6
require('dotenv').config();
const express= require("express");
const bodyparser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/secretDB");

console.log(process.env.SECRET);

const dataSchema= new mongoose.Schema({
    username: String,
    password: String
})

// const secret= "I am biggest fan of Hindustan ka Bhaijaan";
dataSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const Data= mongoose.model("Data", dataSchema);

const app= express();
const port= 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",(req, res)=>{
    res.render("home");
})
app.get("/secrets",(req, res)=>{
    res.render("secrets");
})

app.get("/login",(req, res)=>{
    res.render("login",{ results: ""});
})
app.post("/login",(req, res)=>{
    const output= "Wrong password entered";
    Data.findOne({username: req.body.username}).then(function(result){
        if(result.password=== req.body.password){
            res.render("secrets");
        }
        else{
            res.render("login",{ results: output});
        }
    })
})

app.get("/register",(req, res)=>{
    res.render("register");
})
app.post("/register",(req, res)=>{
    const data= new Data({
        username: req.body.username,
        password: req.body.password
    })
    data.save();
    // console.log(data)
    res.redirect("secrets");
})

app.listen(port,()=>{
    console.log(`Server starting at port ${port}`);
})