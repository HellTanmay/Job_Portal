const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs');
const multer = require('multer');
const axios = require('axios');
const authMiddleware = require('../middleware/auth_middleware');
const User = require('../models/User');
const cheerio=require('cheerio');

router.get('/recommended-job',authMiddleware, async (req, res) => {
  try {

  const user=await User.findById(req.user.id)
  if(!user){
    res.status(404).json({success:false,message:"User not found"})
  }
    const jobs = await Job.find();
    const jobDescriptions = jobs.map(job => job.description);

    if(user.resume==" "||!user.resume){
      res.status(404).json("Add Resume")
    }
    const response = await axios.post('http://localhost:8000/parse', {
     
       content: `http://localhost:5000:${user.resume}`,

      job_descriptions: jobDescriptions,
      jobs: jobs // send full jobs for reference
    });
    res.status(200).json({success:true,data:response.data});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error parsing resume');
  }
});

router.get('/jobs',authMiddleware, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.get('/jobs/:id',authMiddleware, async (req, res) => {
  const jobs = await Job.findById(req.params.id);
  res.json(jobs);
});

router.put('/jobs/:id',authMiddleware, async (req, res) => {
  const id=req.user.id
  
  const job = await Job.findById(req.params.id);
   const alreadyApplied = job.applied.some(app => app.applicant === id);
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job.',
        alreadyApplied: true
      });
    }
    // Add user to applicants array and increment count
    job.applied.push({
      applicant: id,
      appliedAt: new Date(),
      status: 'pending'
    });
    job.applicant_count += 1;
    await job.save();
    res.status(200).json({success:true,message:"Applcation successfully submitted"})
});

router.post('/jobs',authMiddleware, async (req, res) => {
  const { title, description, company, location, salary,experience,skills,jobType,requirements,start_date,duration } = req.body;
  if (!title || !description || !company || !location || !salary) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  const user=await User.findById(req.user.id);
  
  
  const job = new Job(
    {title,
    description,
    company,
    location,
    salary,
    experience,
    skills,
    jobType,
    requirements,
    start_date,
    postedBy:user.id,
    duration}
  );
  await job.save();
  res.json(job);
});

router.get('/viewUsers',authMiddleware,async(req,res)=>{
  const id=req.user.id
  const jobs=await Job.find({postedBy:id}).populate("applied.applicant",'username fullName email resume')
  if(!jobs){
    res.status(404).json({success:false,message:"No jobs posted yet"})
  }
  
  res.status(200).json({success:true,jobs})
})

// router.get("/linkedinjob",async(req,res)=>{
//   const url = 'https://www.linkedin.com/jobs/search?keywords=data%20analyst&location=India';
//   const { data } = await axios.get(url, {
//     headers: { 'User-Agent': 'Mozilla/5.0' } // bypass bot detection
//   });

//   const $ = cheerio.load(data);
//   const jobs = [];

//   $('.base-card').each((i, el) => {
//     const title = $(el).find('.base-search-card__title').text().trim();
//     const company = $(el).find('.base-search-card__subtitle a').text().trim();
//     const location = $(el).find('.job-search-card__location').text().trim();
//     const link = $(el).find('a.base-card__full-link').attr('href');

//     jobs.push({ title, company, location, link });
//   });

//   res.json(jobs)  
// })



module.exports = router;
