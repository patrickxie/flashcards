const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const db = require('../db/index.js');
const bindrouter = require('./router.js');
const util = require('./util/util.js');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

bindrouter(app);

app.listen(PORT, function() {
  console.log('Obento express server connection established at:', PORT);
});

exports.app = app;

