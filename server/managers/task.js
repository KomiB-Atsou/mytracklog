const Task = require('../models/task');

module.exports = {
    create: async data => {
        let t = new Task({ ...data });
        t = await t.save();
        return t ? t : false;
    },
    list: async categoryId => await Task.find({categoryId: categoryId}),
    list2: async categoryIds => await Task.find({categoryId: categoryIds}),
    list3: async (categoryIds, beginDate, endDate ) => await Task.find({categoryId: categoryIds, 
        startedAt: {
            $gte: new Date(beginDate), 
            $lt: new Date(endDate)
        },
        finishedAt: {
            $gte: new Date(beginDate), 
            $lt: new Date(endDate)
        }
    }),
    update: async (id, data) => {
        let t = await Task.findByIdAndUpdate(id, {
            label: data.label,
            description: data.description,
            startedAt: data.startedAt,
            finishedAt: data.finishedAt,
            duration: data.duration,
            categoryId: data.categoryId,
            updated_at: Date.now(),
        });
        return t ? t : false;
    },
    delete: async id => {
        let t = await Task.findByIdAndDelete(id);
        return t ? t : false;
    }
}