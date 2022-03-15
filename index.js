require('dotenv').config()
require('./server/db-connection')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const categories = require('./server/routes/category');
const tasks = require('./server/routes/task');
const users = require('./server/routes/user');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/categories', categories);
app.use('/api/tasks', tasks);
app.use('/api/user', users);

console.log('test server time : ', new Date());


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API started @${port}`));