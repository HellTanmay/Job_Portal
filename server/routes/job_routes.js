const express = require('express');
const router = express.Router();
const Job = require('../models/Jobs');
const multer = require('multer');
const axios = require('axios');
const authMiddleware = require('../middleware/auth_middleware');
const User = require('../models/User');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload',authMiddleware, upload.single('resume'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded');

  try {
   const jobs = await Job.find();
    const jobDescriptions = jobs.map(job => job.description);

    // Send resume and job descriptions to Flask
    const response = await axios.post('http://localhost:8000/parse', {
      content: file.buffer.toString('utf-8'),
      job_descriptions: jobDescriptions,
      jobs: jobs // send full jobs for reference
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error parsing resume');
  }
});

router.get('/jobs',authMiddleware, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.post('/jobs',authMiddleware, async (req, res) => {
  const { title, description, company, location, salary } = req.body;
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
    postedBy:user.id}
  );
  await job.save();
  res.json(job);
});

module.exports = router;
