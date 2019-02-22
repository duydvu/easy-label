const express = require('express');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const config = require('../../config.js');
const RouteHandler = require('./routes').default;

const app = express();
const PORT = config.PORT || 3000;

app.use(express.static(path.join(__dirname, '../static')));
app.set('views', path.join(__dirname, '../src/server/templates/dev'));
if (process.env.NODE_ENV === 'production') {
    app.set('views', path.join(__dirname, 'templates/dev'));
}

app.set('view engine', 'ejs');

RouteHandler(app);

app.listen(PORT, () => {
    const length = 100;
    const text = `Server is on port ${PORT}`;
    const padding = (length - text.length - 2) / 2;
    console.log(chalk.bgBlue(_.repeat(' ', length)));
    console.log(chalk.bgBlue.black(_.repeat(' ', padding), text, _.repeat(' ', padding)));
    console.log(chalk.bgBlue(_.repeat(' ', length)));
    process.send('ready');
});
