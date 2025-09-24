const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName:{type:String},
  lastName:{type:String},
  email:{type:String,unique:true},
  about:{type:String},
  address:{
    country:{type:String},
    city:{type:String},
  },
  resume:{type:String},
  skills:[{type:Array}],
  role: { type: String, enum: ['user', 'employer'], default: 'user' },
  
});

module.exports = mongoose.model('User ', UserSchema);
