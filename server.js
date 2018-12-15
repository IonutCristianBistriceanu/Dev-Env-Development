const _=require('lodash');
const  express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./server/db/mongoose');
const {User} = require('./server/models/user');
const {House} = require('./server/models/house');
const {authenticate} = require('./server/middleware/authenticate');
const cookieParser = require('cookie-parser')
const upload = require('express-fileupload');

var app = express();

//----------------------Configuration-----------------------------------//
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials/');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(upload({
    limits: { fileSize: 1024 * 1024 },
  }));
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Started on port ${process.env.PORT || 3000}`);
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
        pageTitle: 'Login page',
        secondaryMenu:false
    })
});

app.get('/register', (req, res) => {
    res.render('register.hbs', {
        pageTitle: 'Register page',
        secondaryMenu:false
    });
});

//GET /main - get all houses
app.get('/main', authenticate, (req, res)=>{
    var id = req.user._id;

    House.find({ _creator: { $ne: id } }).then((houses)=>{
        res.render('main.hbs', {
            pageTitle:'Main',
            showLogoutBtn:true,
            secondaryMenu:true,
            houses
        });
    });
});

app.get('/add', authenticate, (req, res)=>{
    res.render('add.hbs', {
        pageTitle:'Add home',
        showLogoutBtn:true,
        secondaryMenu:true
    })
 });


 app.get('/myposts', authenticate, (req, res)=>{
    var id = req.user._id;

     House.find({_creator:id}).then((posts)=>{
        res.render('myposts.hbs', {
            pageTitle:'My posts',
            showLogoutBtn:true,
            secondaryMenu:true,
            posts
        })
     });
 });

 //GET /edit/:id - Edit post
app.get('/edit/:id', authenticate, (req, res)=>{
    var id = req.params.id;

    House.findById(id).then((house)=>{
        res.render('edit.hbs', {
            pageTitle:'Edit',
            showLogoutBtn:true,
            secondaryMenu:true,
            house
        })
    }).catch((e)=>{
        res.status(400).send();
    })
   
});

//GET /offer/:id

app.get('/offer/:id', authenticate, (req, res)=>{
    var id = req.params.id;

    House.findById(id).then((house)=>{
        User.findById(house._creator).then(user=>{
            res.render('offer.hbs', {
                pageTitle:'Offer',
                showLogoutBtn:true,
                secondaryMenu:true,
                house,
                email:user.email
            })
        })
    }).catch((e)=>{
        res.status(400).send();
    })
})
//----------------------Routes end-----------------------------------//





//----------------------API's-----------------------------------//

//POST '/' Login
app.post('/', (req, res)=>{
    var body = _.pick(req.body, ['email','password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.cookie('xauth', token);
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });
});

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

//DELETE Logout
app.delete('/main/logout', authenticate, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.cookie('xauth', "");
        res.status(200).send();
    }, ()=>{
        res.status(400).send();
    });
});

//POST '/add/ - Add new post
app.post('/add', authenticate, (req, res)=>{
    var imageName="";
    var imageLocation="";
    var id = req.user._id;
    
    if(req.files){
        var file = req.files.file;
        console.log(req.files);
        
        const filetypes = /jpeg|jpg|gif|bmp|png/;

        if(!filetypes.test(file.mimetype) || file.truncated){
            return res.status(400).redirect('main');
        }

        imageName = file.name+ Date.now();
        imageLocation ='./public/uploads/';

        file.mv(imageLocation + imageName, (err)=>{
            if(err){
            }
        })
    }

    var house = new House({
        location:req.body.location,
        description:req.body.description,
        imageName,
        imageLocation,
        _creator:id
    });

    house.save().then((doc)=>{
        res.redirect('/main');
    }, (e)=>{
        res.status(400).send(e);
    })  
})


//GET /myposts/:id - Delete a post
app.get('/myposts/:id', authenticate, (req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    House.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
         return res.redirect('/myposts');
    }).catch((e)=>{
         res.status(400).send();
    })
});

//POST '/updatepost' Update a single post 
app.post('/edit/:id', authenticate, (req, res)=> {
    var id= req.params.id;
    if(!ObjectID.isValid(id)) return res.status(404).send();

    House.findByIdAndUpdate(id, {location:req.body.location,description:req.body.description}).then((house)=>{
        if(!house) return Response.status(404).send();
        res.redirect('/myposts');
    }).catch((e)=>{
        res.status(400).send();
    })
});
//----------------------API's end-----------------------------------//

module.exports= {app};