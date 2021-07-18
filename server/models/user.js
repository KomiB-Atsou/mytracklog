const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    firstname: { type: String, required:  true },
    lastname: { type: String, required:  true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    //id: { type: String },    
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()},
   
});

const User = mongoose.model("User", schema);

module.exports = User;
