const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const loginfoSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    ipaddress:{
        type:String,
        required:false
    },
    role: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now.toLocaleString()
    }
});

module.exports = mongoose.model("loginfos", loginfoSchema);