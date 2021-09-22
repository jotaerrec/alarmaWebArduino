const mongoose = require("../bin/mongodb")

const signalSchema = new mongoose.Schema({
    inputName: {
        type: String,
        required: true,
    },
    pin:{
        type: Number,
        unique: true,
        required: true,
        min: 0,
        max: 13
    }
});
module.exports = mongoose.model("signal", signalSchema);