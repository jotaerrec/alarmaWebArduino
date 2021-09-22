const mongoose = require("../bin/mongodb")

const componentSchema = new mongoose.Schema({
    signal:{
        type:String,
        required:true,
    },
    nameComponent:{
        type:String,
        required:true,
    },
    state:{
        type:Boolean,
        default: false,
    },
    pin:{
        type:Number,
        unique:true,
        required:true,
        min:0,
        max:13
    }
});
module.exports = mongoose.model("component", componentSchema);