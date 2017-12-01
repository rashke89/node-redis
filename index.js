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

// add user page
app.get('/user/add', (req, res, next) => {
    res.render('addUser');
})
// search process
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

// add process
app.post('/user/add', (req, res, next) => {
    let userObj = {
        id: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone
    }

    client.hmset(userObj.id, [
        "first_name", userObj.first_name,
        "last_name", userObj.last_name,
        "email", userObj.email,
        "phone", userObj.phone
    ], (err, reply) => {
        if(err) console.log(err);
        
        console.log('Add User Status = ' + reply);
        res.redirect('/');
    })
});

// delete process
app.delete('/user/delete/:id', (req, res, next) => {
    client.del(req.params.id);
    res.redirect('/');
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
})