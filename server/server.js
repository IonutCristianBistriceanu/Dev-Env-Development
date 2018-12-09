const _=require('lodash');
const  express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

//----------------------Configuration-----------------------------------//
hbs.registerPartials(__dirname + './../views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + './../public'));



app.use(bodyParser.json());

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});
//----------------------Configuration end-----------------------------------//






//----------------------Helpers-----------------------------------//
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
});

hbs.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
//----------------------Helpers end-----------------------------------//





//----------------------Routes-----------------------------------//
app.get('/', (req, res) => {
    res.render('login.hbs', {
        pageTitle: 'Login page'
    })
});

app.get('/register', (req, res) => {
    res.render('register.hbs', {
        pageTitle: 'Register page'
    });
});
//----------------------Routes end-----------------------------------//





//----------------------API's-----------------------------------//

//POST /register
app.post('/register', (req, res)=>{
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);

    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

























//Get me
app.get('/users/me', authenticate , (req, res)=>{
    res.send(req.user);
});


app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text:req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos',(req, res) => {
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (e)=>{
        res.status(400).send(e);
    });
})

//GET /todos/1234

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
         return res.status(200).send({todo})
    }).catch((e)=>{
         res.status(400).send();
    })
})

app.delete('/todos/:id', (req, res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)) return res.status(404).send();
    
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo) return res.status(404).send();

        return res.status(200).send(todo);
    }).catch((e)=>{
        res.send(400).send();
    });
});


app.patch('/todos/:id', (req, res)=>{
    var id= req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{
        if(!todo) return Response.status(404).send();

        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});







//Login

//POST /users/login {email,password}

app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email','password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });

});


app.delete('/users/me/token', authenticate, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, ()=>{
        res.status(400).send();
    });
});
//----------------------API's end-----------------------------------//




module.exports= {app};