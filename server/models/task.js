const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    label: {type: String, require: true},
    description: {type: String, require: true},
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    startedAt: {type: Date},
    finishedAt: {type: Date},
    duration: {type: Number, default: 15},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

const Task = mongoose.model("Task", schema);

module.exports = Task;
