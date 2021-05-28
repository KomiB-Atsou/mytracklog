const Category = require('../models/category');
const Task = require('../models/task');

module.exports = {
    create: async data => {
        let t = await new Category({ ...data }).save();
        return t ? t : false;
    },
    list: async keyword => await Category.find({
        label: {$regex: keyword, $options: 'i'}
    }),
    get: async id => await Category.findById(id),
    update: async (id, data) => {
        let t = await Category.findByIdAndUpdate(id, {
            label: data.label,
            dateUpdated: data.dateUpdated
        });
        return t ? t : false;
    },
    delete: async id => {
        await Category.deleteMany({parentCategoryId: id});
        await Task.deleteMany({categoryId: id});
        let t = await Category.findByIdAndDelete(id);
        return t ? t : false;
    }
}