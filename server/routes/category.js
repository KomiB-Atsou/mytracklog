const router = require('express').Router();
const categoryManager = require('../managers/category');
var allCategories = [];

function getChildrenRecursive(arr) {
    let result = [];
    for(let i = 0; i < arr.length; i++) {
        let current = arr[i];
        let children = allCategories.filter(x => x.parentCategoryId == current._id);
        if(children.length === 0) {
            result.push({
                label: current.label,
                value: current._id,
                dateCreated: current.dateCreated,
                dateUpdated: current.dateUpdated,
                _id: current._id,
                parentCategoryId: current.parentCategoryId,
                children: []
            });
        } else {
            result.push({
                label: current.label,
                value: current._id,
                dateCreated: current.dateCreated,
                dateUpdated: current.dateUpdated,
                _id: current._id,
                parentCategoryId: current.parentCategoryId,
                children: getChildrenRecursive(children)
            });
        }
    }

    return result;
}

function getParentsRecursiveLabels(category) {
    let result = "";
    let parent = allCategories.find(x => category.parentCategoryId == x._id);
    if(parent) {
        if (!parent.parentCategoryId || parent.parentCategoryId.length === 0) {
            result += `${parent.label}-`;
        } else {
            result += `${parent.label}-`;
            result += `${getParentsRecursiveLabels(parent)}`;
        }
    }

    return result;
}

function rearrange() {
    let result = [];
    let rootCategories = allCategories.filter(x => x.parentCategoryId === '' || x.parentCategoryId === null);
    result = getChildrenRecursive(rootCategories);
    return result;
}

router.post('/all', async (req, res) => {
    try {
        const keyword = req.body.keyword || ``;
        allCategories = await categoryManager.list(keyword);
        let result = rearrange();
        return res.status(200).send(result);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/all-flat', async (req, res) => {
    try {
        const keyword = req.body.keyword || ``;
        let categories = await categoryManager.list(keyword);
        categories = categories.map(x => {
            return {
                value: x._id,
                name: x.label
            };
        });
        return res.status(200).send(categories);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/', async (req, res) => {
    
    console.log('req.body : ',req.body);
    try {
        const t = await categoryManager.create(req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const t = await categoryManager.update(id, req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryManager.get(id);
        console.log('test : ', category);
        allCategories = await categoryManager.list("");
        const tree = getParentsRecursiveLabels(category);

        let final = "";
        const t = tree.split('-');
        for(let i = t.length - 1; i >= 0; i--) {
            let x = t[i];
            if(x.length > 0 && x !== "-")
                final += `${x} / `;
        }

        final = `${final} ${category.label}`;
        return res.status(200).send({path: final});
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const r = await categoryManager.delete(id);
        return res.status(200).send(r);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;