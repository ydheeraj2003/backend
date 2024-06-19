const Vendor=require("../models/Vendor");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const dotenv=require("dotenv");

dotenv.config();

const secretkey=process.env.WhatIsYourName;

const vendorRegister=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const vendorEmail=await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).json("Email already exists");
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message: "vendor registered successfully"});
        console.log("registered");
    }
    catch{
        console.log("error");
        res.status(500).json({error: "internal server error"});
    }
}

const vendorLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const vendor=await Vendor.findOne({email});
        if (!vendor || !await(bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error: "invalid username or password"});
        }

        const token=jwt.sign({vendorId: vendor._id}, secretkey,{expiresIn: "1h"});
        return res.status(200).json({success:"Login successfull", token});
        
    }
    catch{
        return res.status(500).json({error: "error"});
    }
}

const getAllVendors=async(req,res)=>{
    try{
        const vendors=await Vendor.find().populate("firm");
        return res.json({vendors});
    }
    catch{
        return res.status(500).json({error: "error"});
    }
}

const getVendorById=async(req,res)=>{
    const vendorId=req.params.vendorId;
    try{
        const vendor=await Vendor.findById(vendorId);
        if (!vendor){
            return res.status(400).json({message: "vendor not found"});
        }
        return res.json({vendor});
    }
    catch{
        return res.status(500).json({error: "error"});
    }
}

module.exports={vendorRegister,vendorLogin, getAllVendors, getVendorById};