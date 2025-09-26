  const mongoose = require('mongoose');

  const JobSchema = new mongoose.Schema({
    title: { 
      type: String, 
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'],
      trim: true,
      
    },
    company: { 
      type: String, 
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    location: { 
      type: String, 
      required: [true, 'Location is required'],
      trim: true
    },
    salary: { 
      type: Number  // e.g., average or min salary; parsed from string in route
    },
    requirements: {
      type: String,
      trim: true  // Optional, from frontend
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: [true, 'Job type is required']  // From frontend
    },
    experience: {
      type: String,
      enum: ['entry', 'mid', 'senior'],
      required: [true, 'Experience level is required']  // From frontend
    },
    skills: {
      type: String,
      trim: true  // Optional, comma-separated from frontend
    },
    postedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User ' 
    },
    start_date:{
      type:Date,
    },
    duration:{
      type:Number,
      default:1
    },
    applied: [{
      applicant: {  // Renamed from 'Job_id' for clarity (references the applying User)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User '
      },
      stats: {
        type: String,
        enum: ['pending', 'rejected', 'approved'],
        default: 'pending'
      },
      applied_at: {
        type: Date,
        default: Date.now() 
      }
    }],
    applicant_count: {
      type: Number,
      default: 0
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }, {
    timestamps: true  // Adds updatedAt automatically
  });

  module.exports = mongoose.model('Job', JobSchema);
