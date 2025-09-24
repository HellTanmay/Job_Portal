const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth_middleware');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const JWT_SECRET = 'wefihwofeiwfe778273973982303291801j0poiljhbbfdxfww'; // Change this in production

// Register
router.post('/register', async (req, res) => {
  const { username, password,role } = req.body;

  if (!username || !password)
    return res.status(400).json({success:false, message: 'Please enter all fields' });

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({success:false, message: 'User  already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: role 
    });

    await user.save();
     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in production
      sameSite: 'lax', // CSRF protection
      maxAge: 3600000, // 1 hour in ms
    });
    res.status(200).json({ success:true, token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }, });
  } catch (err) {
    res.status(500).json({success:false, message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({success:false, message: 'Please enter all fields' });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({success:false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({success:false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in production
      sameSite: 'lax', // CSRF protection
      maxAge: 3600000, // 1 hour in ms
    });
    
    res.status(200).json({
        success:true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({success:false, message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/profile',authMiddleware,async(req,res)=>{
  const user=await User.findById(req.user.id).select('-password');
  if(!user){
    return res.status(404).json({success:false,message:"User not found"})
  }
  res.status(200).json({success:true,data:user})
})

router.put('/profile/edit',authMiddleware,async(req,res)=>{
   try{
console.log(req.body)

  const  data = req.body;
      let updateData = {
        username:data.username,
        about:data.about,
        firstName:data.firstName,
        lastName:data.lastName,
        email:data.email,
        address: {
          country:data.country,
          city:data.city,
        },
        resume:data.resume
      };
      console.log(updateData)
  const user=await User.findByIdAndUpdate(req.user.id,updateData,{new:true})
  if(!user){
    return res.status(404).json({success:false,message:"User not found"})
  }
 
    res.status(200).json({success:true,data:user})
  }
  catch(err){
    console.log(err)
    res.status(500).json({success:false,message:"Server Error"})
  }
})

router.get('/protected',authMiddleware, async(req, res) => {
  const user= await User.findById(req.user.id).select('-password');

  if(!user){
    return res.status(400).json({success:false, message: 'User not found' });
  }
  res.status(200).json({ username:user.username, role:user.role  });
});
module.exports = router;
