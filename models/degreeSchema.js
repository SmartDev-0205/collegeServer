const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const degreeSchema = new Schema({

    type: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("degrees", degreeSchema);