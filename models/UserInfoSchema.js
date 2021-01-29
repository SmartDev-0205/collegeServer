const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserInfoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phonenumber:{
    type:Number,
    required:true
  },
  status:{
   type:String,
   required:true
  },
  avatar:{
    type:String,
    required:true
  },
  ipaddress:{
    type:String,
    required:false
  },
  shortlist:{
    type:String,
    default:""
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UserInfo", UserInfoSchema);