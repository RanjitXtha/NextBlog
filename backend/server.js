require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const UserSchema = require('./Schema/User.js');
const BlogSchema = require('./Schema/Blog.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const dbURL = 'mongodb+srv://shrestharanjit:mrbumblebee@cluster0.rdogmng.mongodb.net/'
const JWT_SECRET="my_secret_key"

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const upload = require('./Middleware/multer.js')
// Config cloudinary

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(dbURL).then(()=>{
    app.listen(5000); 
    console.log('server created');
    console.log('connected to db');
}).catch((error)=>{console.log(error)});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME)


app.post('/auth/register',async(req,res)=>{
    console.log("recieved");
    try{
        const {fullname,username,email,password} = req.body;
        const profilePic = req.file ? req.file.path : null;
        
        const userExists = await UserSchema.findOne({email});

        if(userExists){
            return res.json({success:false,message:'User already Exists'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser = new UserSchema({
            fullname,email,username,password: hashedPassword,profilePic
        })

        const user = await newUser.save();
        const token = jwt.sign({userId:user._id , username:user.username },JWT_SECRET);
    return res.json({success:true,token});
    }catch(error){
        console.log(error);
        return res.json({success:false, message:{error}})
    }
})

app.post('/auth/login',async(req,res)=>{
     try{
        const {email , password} = req.body;
        const user = await UserSchema.findOne({email});

        if (!user) {
            console.log('User doesn\'t exist');
            return res.json({success:false, message: 'User does not exist' });
        }
    const isPasswordCorrect = await bcrypt.compare(password , user.password);

    if(!isPasswordCorrect){
        console.log('Incorrect Password');
        return res.json({success:false,message:'Wrong Password'})
    }


    const token = jwt.sign({userId:user._id , username:user.username},JWT_SECRET);
    return res.json({success:true,token});
    }catch(error){
        console.log(error);
        return res.json({success:false, message:{error}});
    }


})

app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  console.log("req made");
  const url = req.file ? req.file.path : null;

  try {
    console.log("Cloudinary URL:", url);
    return res.json({success:true, url });
  } catch (err) {
    return res.json({ success:false, message: err });
  }
});

app.get("/blog/getblogs",async(req,res)=>{
    const blogs = await BlogSchema.find();
    console.log(blogs)
    return res.json({blogs});
})

app.post("/api/blog/create", upload.single("banner"), async (req, res) => {
    console.log("gotten")
  try {
    const { title, des, content, tags } = req.body;

    // Convert tags string into array if needed
    const tagsArray = tags?.split(',').map(tag => tag.trim());

    // Use uploaded banner file path
    const bannerPath = req.file ? req.file.filename : '';

    // Temporary author until auth is implemented
    const dummyAuthorId = "60c72b2f5f1b2c001c8e4f56"; // Replace with actual user _id from DB

    const blog = new BlogSchema({
      title,
      banner: bannerPath,
      des,
      content:content, // if content is stringified array
      tags: tagsArray,
      author: dummyAuthorId, // replace with logged-in user's _id
    });

    await blog.save();
    res.status(201).json({ success: true, blog });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating blog" });
  }
});