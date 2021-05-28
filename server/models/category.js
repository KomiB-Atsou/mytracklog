const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    label: {type: String, require: true},
    dateCreated: {type: Date, default: Date.now()},
    dateUpdated: {type: Date, default: Date.now()},
    parentCategoryId: {type: String, require: true}
});

const Category = mongoose.model("Category", schema);

module.exports = Category;
