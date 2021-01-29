const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    status:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required: true
    },
    ipaddress:{
        type:String,
        required:false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("admins", AdminSchema);