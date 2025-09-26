const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const job_route=require('./routes/job_routes')
const auth_route = require('./routes/auth_route');
const cookieParser = require('cookie-parser');
const dotenv=require('dotenv');
const app = express();
dotenv.config();


app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/api/auth', auth_route);

app.use('/api/job',job_route)



app.listen(5000, () => {
  console.log('Server running on port 5000');
});
