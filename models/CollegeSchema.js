const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CollegeSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    logo:{
        type:String,
        default:null
    },
    description:{
        type:String,
        required: true
    },
    address:{
        type:Object,
        required:true
    },
    tuitionFee:{
        type:Number,
        required: true
    },
    accomodationFee:{
        type:Number,
        required: true
    },
    applicationFee:{
        type:Number,
        required: true
    },
    springDeadline:{
        type:String,
        required: true
    },
    summerDeadline:{
        type:String,
        required: true
    },
    fallDeadline:{
        type:String,
        required: true
    },
    WES:{
        type:Boolean,
        required: true
    },
    overallRating:{
        type:Number,
        required: true
    },
    livingCostRating:{
        type:Number,
        required: true
    },
    jobsRating:{
        type:Number,
        required: true
    },
    universityType:{
        type:String,
        required: true
    },
    webSite:{
        type:String,
        required: true
    },
    establishmentType:{
        type:Number,
        required: true
    },
    phoneNumber:{
        type:Number,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    acceptanceRate:{
        type:Number,
        required: true
    },
    graduationRate:{
        type:Number,
        required: true
    },
    GRE:{
        type:Number,
        required: true
    },
    IELTS:{
        type:Number,
        required: true
    },
    Toefl:{
        type:Number,
        required: true
    },
    degrees:{
        type:Array,
        default:null
    },
    specializations:{
        type:Array,
        default:null
    },
    status:{
        type:Boolean,
        required:true
    }

});

module.exports = mongoose.model("colleges", CollegeSchema);