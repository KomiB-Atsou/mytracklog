const router = require('express').Router();
const taskManager = require('../managers/task');
const categoryManager = require('../managers/category');
const moment = require('moment');

const getHoursMinutesFormat = minutes => moment.utc(moment.duration(minutes*60, "seconds").asMilliseconds()).format("HH:mm");

var allCategories = [];
function getChildrenIdsRecursive(arr) {
    let result = "";
    for(let i = 0; i < arr.length; i++) {
        let current = arr[i];
        let children = allCategories.filter(x => x.parentCategoryId == current._id);
        if(children.length === 0) {
            result += `${current._id}|`;
        } else {
            result += `${current._id}|`;
            result += getChildrenIdsRecursive(children);
        }
    }

    return result;
}

router.post('/all', async (req, res) => {
    try {
        const categoryId = req.body.categoryId;
        allCategories = await categoryManager.list("");
        const category = await categoryManager.get(categoryId);
        const childrenIdsStr = getChildrenIdsRecursive([category]);
        const childrenIds = childrenIdsStr.split("|").filter(x => x.length === 24);
        let t = await taskManager.list2(childrenIds);
        t = t.map(x => {
            return {
                _id: x._id,
                categoryId: x.categoryId,
                title: `${x.label} | ${moment(x.startedAt).format('HH:mm')}-${moment(x.finishedAt).format('HH:mm')} | ${getHoursMinutesFormat(x.duration)}`,
                start: moment(x.startedAt).toDate(),
                end: moment(x.finishedAt).toDate(),
                description: x.description,
                duration: x.duration
            };
        });

        const result = {
            tasks: t,
            duration: t.reduce((a, b) => a + b.duration, 0)
        };

        return res.status(200).send(result);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const t = await taskManager.create(req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const t = await taskManager.update(id, req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/duration/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const t = await taskManager.update(id, req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const r = await taskManager.delete(id);
        return res.status(200).send(r);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;