// JavaScript source code
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// CREATE REDIS CLIEN
let client = redis.createClient();

client.on('connect', () => console.log('Connected to Redis...'));

// set port
const port = 3000;

// init aoo
const app = express();

// view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// methodOverride
app.use(methodOverride('_method'));

// home page
app.get('/', (req, res, next) => {
    res.render('searchusers')
});

// search processing
app.post('/users/search', (req, res, next) => {
    let id = req.body.id;

    client.hgetall(id, (err, obj) => {
        if(!obj) {
            res.render('searchusers', { error: 'user doesn not exist' });
        } else {
            obj.id = id;
            res.render('details', { user: obj })
        }
    })
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
})