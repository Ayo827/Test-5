var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');
//set up handlebars view engine--A type of view engine. others are Jade and ejs
var handlebars = require('express-handlebars').create({defaultLayout: 'main',
/*making a section*/                           helpers:{
                                                        section: function(name, options){
                                                            if(!this._sections)this._sections = {};
                                                            this._sections[name] = options.fn(this);
                                                            return null;
                                                        }
}  });

app.engine('handlebars', handlebars.engine); // or app.engine('handlebars', require(express-handlebars).create({defaultlayers: 'main'}))
app.set('view engine', 'handlebars');
var path = require("path");
var fortune = require('./lib/fortune');
var formidable = require('formidable');//its for multipart form processing. it is use for file upload to the server
var credentials = require('./credentials').credential;//importing the module where the cookies are
//import credential from './credentials';
app.use(require('cookie-parser')(credentials.cookieSecret));
//app.use(require('express-session')());
//Setting up a session
var session = require('express-session');
app.use(session({
                name: 'sid',
                secret: 'This is a session',
                cookie: {cookieName: 'monster',value: 'nom nom', signed: true, path: '/', httpOnly:true,  secure:true, maxAge: 6000},
                resave: false,
                saveUninitialized: false,
                sameSite: true
}));
//installing and requring csurf-- To prevent cross-site request forgery
// app.use(require('csurf')());
// app.use(function(req, res, next){
//     res.locals._csrfToken = req.csrfToken();
//     next();

// });


// SET OPENSSL_CONF = openssl.cnf;
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout meadowlark.pem
//  -out meadowlark.crt


// app.get('/process', function(req, res){
//     if(req.session.page_views){
//        req.session.page_views++;
//        res.send("You visited this page " + req.session.page_views + " times");
//     } else {
//        req.session.page_views = 1;
//        res.send("Welcome to this page for the first time!");
//     }
//  });

//SETTING UP A PAGE TEST. USING MOCHA AND CHAI
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test ==='1';
    next();
});

// catching unexpected error. Using DOMAIN(recommended instead of uncaughtExpectation). this middleware is placed before any other middleware and route
app. use(function(req, res, next){
    // create a domain for this request
    var domain = require('domain' ). create();
    // handle errors on this domain
    domain. on('error' , function(err){
    console. error('DOMAIN ERROR CAUGHT\n' , err. stack);
    try {
    // failsafe shutdown in 5 seconds
    setTimeout(function(){
    console. error('Failsafe shutdown.' );
    process. exit(1);
    }, 5000);


    // disconnect from the cluster
    var worker = require('cluster' ). worker;
 if(worker) worker. disconnect();
 // stop taking new requests
 server. close();
 try {
 // attempt to use Express error route
 next(err);
 } catch(err){
 // if Express error route failed, try
 // plain Node response
 console. error('Express error mechanism failed.\n' + err);
 res. statusCode = 500;
 res. setHeader('content-type' , 'text/plain' );
 res. end('Server error.' );
 }
 } catch(err){
 console. error('Unable to send 500 response.\n' +  err);
 }
 });

 // add the request and response objects to the domain
 domain. add(req);
 domain. add(res);
 // execute the rest of the request chain in the domain
 domain. run(next);
});

//CLUSTERS. to see different workers handling different request
app. use(function(req, res, next){
    var cluster = require('cluster' );
    if(cluster. isWorker) console. log('Worker %d received request' , cluster. worker. id);
    next();
   });
   
   //SETTING UP DATABASE CONNECTION (using MONGODB --with a low-level driver called mongoose)
   var mongoose = require('mongoose');
   var opts = {
        server:{
           socketOptions: {keepAlive: 1}//to prevent databasse connection error in long-running applications
        },
        useNewUrlParser: true,
         useUnifiedTopology: true
   };                                              //name of database
   var  url = function () { 
          'mongodb://localhost:127.0.0.1/playground';
    };
//    mongoose.connect('mongodb://localhost:127.0.0.1/Legendary')
//    .then(() => console.log('MongoDB Connected...'))
//    .catch((err) => console.log("this is " + err))

   switch(app.get('env')){
       case 'development' :
           mongoose.connect(credentials.mongo.development.connectionString, opts, url, function (err, client){
            var db = client.db('playground');
            db.collection('employees').find().toArray(function(err, docs){
                console.log('database: ', docs);
            });
        });
           break;
        case 'production' :
            mongoose.connect(credentials.mongo.production.connectionString, opts, url,function (err, client){
                var db = client.db('playground');
                db.collection('employees').find().toArray(function(err, docs){
                    console.log('database: ', docs);
                });
            });
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
   }
   //requiring the schema
   var Vacation = require('./models/vacation');
  

   Vacation.find(function(err, vacations){
    if(vacations.length) return;
    new Vacation({
    name: 'Hood River Day Trip' ,
    slug: 'hood-river-day-trip' ,
    category: 'Day Trip' ,
    sku: 'HR199' ,
    description: 'Spend a day sailing on the Columbia and ' +
    'enjoying craft beers in Hood River!' ,
    priceInCents: 9995,
    tags: ['day trip' , 'hood river' , 'sailing' , 'windsurfing' , 'breweries' ],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
    }). save();
    new Vacation({
    name: 'Oregon Coast Getaway' ,
    slug: 'oregon-coast-getaway' ,
    category: 'Weekend Getaway' ,
    sku: 'OC39' ,
    description: 'Enjoy the ocean air and quaint coastal towns!' ,
    priceInCents: 269995,
    tags: ['weekend getaway' , 'oregon coast' , 'beachcombing' ],
    inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0,
    }). save();
    new Vacation({
    name: 'Rock Climbing in Bend' ,
    slug: 'rock-climbing-in-bend' ,
    category: 'Adventure' ,
    sku: 'B99' ,
    description: 'Experience the thrill of climbing in the high desert.' ,
    priceInCents: 289995,
    tags: ['weekend getaway' , 'bend' , 'high desert' , 'rock climbing' ],
    inSeason: true,
    requiresWaiver: true,
 maximumGuests: 4,
 available: false,
 packagesSold: 0,
 notes: 'The tour guide is currently recovering from a skiing accident.' ,
 }). save();
});

//require nodemailer
var nodemailer = require('nodemailer');
var strict  = require('assert');
var mailTransport = nodemailer.createTransport({
                     service: 'Gmail',
                     auth: {
                         user: credentials.gmail.user,
                         pass: credentials.gmail.password
                     }
});

//connecting directly to smtp and making my own MSA--mail submission agent. MTA--Mail transfer agent
// var mailTransport = nodemailer.createTransport({
//     host: 'smtp.gmail.com' ,
//     secureConnection: true,  // use SSL
//     port: 465,
//     auth: {
//              user: credentials.meadowlarkSmtp.Username,
//              pass: credentials.meadowlarkSmtp.Password
//     }
//    });

//set the port
app.set('port', process.env.PORT || 3000);
//Lets make some routes
// app.get('/', function(req, res){
//     res.type('text/plain');
//     res.send('Home Page');
// });
// app.get('/about', function(req, res){
//     res.type('text/plain');
//     res.send('About Page');
// });

//Making a middleware for a flash message
// app. use(function(req, res, next){
//     // if there's a flash message, transfer
//     // it to the context, then clear it
//     res.locals.flash = req.session.flash;
//     delete req.session.flash;
//     next();
//    });

//ROUTES
// app.get('/*', function(req, res){
//     res.send("Coming soon...");
// });
// making routes based on handlebars view engine
app.get('/', function(req, res){
    res.render('home');
});

var fortunes = [
    "Conquer your fears or they will conquer you." ,
    "Rivers need springs." ,
    "Do not fear what you don't know." ,
    "You will have a pleasant surprise." ,
    "Whenever possible, keep it simple." 
   ];
app.get('/about', function(req, res){
    //var randomFortune = fortunes[Math.floor(Math.random() *  fortunes.length)];
    res.render('about', {fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
    });
});
app.get('/contest/vacation-photo', function(req, res){ 
    res.render('contest/vacation-photo');
});
function getWeatherData(){
    return {
    locations: [
    {
    name: 'Portland' ,
    forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html' ,
    iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif' ,
    weather: 'Overcast' ,
    temp: '54.1 F (12.3 C)'
    },
    {
    name: 'Bend' ,
    forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html' ,
    iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif' ,
    weather: 'Partly Cloudy',
    temp: '55.0 F (12.8 C)' 
    },
    {
    name: 'Manzanita' ,
    forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html' ,
    iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif' ,
    weather: 'Light Rain' ,
    temp: '55.0 F (12.8 C)'
    }
    ]
    };
   }
   //doing a partial
   app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
   });
//Using of middleware
app.use(express.static(path.join(__dirname, 'public', 'image')));
app.use(express.static(path.join(__dirname, 'public', 'vendor')));
app.use(require('body-parser')());//requiring and servering body-parser
// var id = function generate_id(){
//     return '_' + Math.random().toString(36).substr(2, 9);
// }
//routes

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
 });
    app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

app.get('/request-rate', function(req, res){
    res.render('request-rate');
});
app.post('/request-rate', function(req, res){
    res.redirect(303, '/thank-you');
});
app.get('/newsletter' , function(req, res, next){
    // we will learn about CSRF later...for now, we just
                                // provide a dummy value
    res.render('newsletter' /*, { _csrf: req.csrfToken() }*/);
   });
//    app.post('/process', function(req, res){
//     if(req.session.page_views){
//        req.session.page_views++;
//        res.send("You visited this page " + req.session.page_views + " times");
//     } else {
//        req.session.page_views = {name: "Ayo", email: "jiji@gmail.com"};
//        res.send("Welcome to this page for the first time!");
//     }
//      res.redirect(303, '/thanks');
//  });
app.post('/process' , function(req, res){
    var id;
    req.session.id = req.session.id || {name: req.body.name, email: req.body.email};
    req.session.id = id;
    id = {name: req.body.name, email: req.body.email};
    console.log(req.session.id);
    console.log(id);
   // req.session.cookie = {id: req.session.id};
   // console.log(req.session.cookie);
   res.cookie('monster', 'nom nom', {signed: true, path: '/process',httpOnly:true, sameSite: true, secure:true, maxAge: 6000}, {id: req.session.id});//setting up the cookie
    //sending a mail from the server to the client
mailTransport.sendMail({
    from: '"Meadowlark Travel" <dopeman827@gmail.com>' ,
    to:  req.body.email,
    subject: 'Your Meadowlark Travel Tour' ,
    text: "Dear " + req.body.name +'Thank you for booking your trip with Meadowlark Travel. ' + 'We look forward to your visit!' ,
}, function(err){
 if(err) console. error( 'Unable to send email: ' + err );
 else{
     console.log("The mail has been sent");
 }
});
//     // console.log('Form (from querystring): ' + req.query.form);
//     // console.log('CSRF token (from hidden form field): ' + req.body. _csrf);
//     // console.log('Name (from visible form field): ' + req.body.name);
//     // console.log('Email (from visible form field): ' + req.body.email);
 
    
//     // var signedMonster = req.signedCookies.monster; //to retrieve the value of the cookie
//     // console.log(signedMonster);
    res.redirect(303, '/thank-you' );
   });

//MAKING A POST FOR THE FLASH MESSAGE FOR THE NEWSLETTER FORM
// app.post('/process' , function(req, res){
//     var name = req. body. name || '' , email = req. body. email || '' ;
//     // input validation
//     if(!email.match(VALID_EMAIL_REGEX)) {
//     if(req.xhr) return res.json({ error: 'Invalid name email address.' });
//     req.session.flash = {
//     type: 'danger' ,
//     intro:'Validation error!' ,
//     message:'The email address you entered was not valid.'
//     };
//     return res. redirect(303, '/newsletter/archive' );
//  }
//  new NewsletterSignup({ name: name, email: email }).save(function(err){
//     if(err) {
//     if(req.xhr) return res. json({ error: 'Database error.' });
//     req. session. flash = {
//     type: 'danger' ,
//     intro: 'Database error!' ,
//     message: 'There was a database error; please try again later.' ,
//     }
//     return res. redirect(303, '/newsletter/archive' );
//     }
//     if(req.xhr) return res.json({ success: true });
//     req.session.flash = {
//     type: 'success' ,
//     intro: 'Thank you!' ,
//     message: 'You have now been signed up for the newsletter.' ,
//     };
//     return res.redirect(303, '/newsletter/archive' );
//     });
// });


  
   
   app.get('/contest/vacation-photo', function(req, res){
    var now = new Date();
    res.render('contest/vacation-photo',{year: now.getFullYear(), month: now.getMonth() });
   });
   app.post('/contest/vacation-photo/:year/:month', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
    if(err) return res.redirect(303, '/error' );
    console.log('received fields:' );
    console.log(fields);
    console.log('received files:' );
    console.log(files);
  res.cookie('signedMonster', 'nom nom', {signed: true, path: '/contest/vacation-photo/:year/:month', httpOnly: true, secure: true}); //setting up the cookie
    // var signedMonster = req.signedCookies.signedMonster;//retrieving the value of the cookie ---'nom nom'
    // console.log(signedMonster);
    // req.session.userName = 'Anonymous';
    // var colorScheme = req.session.colorScheme || 'dark';
    // console.log(colorScheme);

    res.redirect(303, '/thank-you' );
    });
   });
//router for vacations.hbs
   app.get('/vacations', function(req, res){
    Vacation.find({ available: true }).toArray(function(err, vacations){
    var context = {
    vacations: vacations.map(function(vacation){
        return {
            sku: vacation.sku,
            name: vacation.name,
            description: vacation.description,
            price: vacation.getDisplayPrice(),
            inSeason: vacation.inSeason,
            };
          }
    )};
      //  res.render('vacations', {context});
        console.log("the error is " + err);
     });
});
        

   //causing massive shut down of server
//    app. get('/epic-fail' , function(req, res){
//     process. nextTick(function(){
//     throw new Error('Kaboom!' );
//     });
//    });
//costum 404 page---when the page is not found
app.use(function(req, res){
   // res.type('text/plain');
    res.status(404);
    res.send("404 - NOT FOUND");
});
//costum 500 page --when there is an error on the server
app.use(function(err, req, res, next){
    console.error(err.stack);
   // res.type('text/plain');
    res.status(500);
    res.send("500 - Server Error");
});
app.disable('x-powered-by');//to prevent server info to be sent to the browseer
app.set('env', 'development');
//setting up a logger to an application
switch(app. get('env' )){
    case 'development' :
    // compact, colorful dev logging
    var accessLogStream = fs.createWriteStream(
        path.join(__dirname, 'access.log'), {flags: 'a'}
   );
    app.use(require('morgan')('dev',  {stream: accessLogStream}));
    break;
    case 'production' :
    // module 'express-logger' supports daily log rotation
    app. use(require('express-logger' )({
    path: __dirname + '/log/requests.log'
    }));
    break;
   }
   var options = {
       key: fs.readFileSync(__dirname + '/ssl/36382454_localhost3000.key'),
       cert: fs.readFileSync(__dirname + '/ssl/36382454_localhost3000.cert')
   };
//Making an app cluster. 
function startServer(){
   https.createServer(options, app).listen(app.get('port'), function(){
        console.log(`Express started on https://localhost:${app.get('port')} ${app.get('env')}`);
    });
}
if(require.main == module){
    startServer();
    console.log("server.js runs");
}
else{
    module.exports = startServer;
}
