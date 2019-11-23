// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');

// SCHEMAS

var Customer = require('./models/customer');
const CONNECTION_STRING = 'mongodb://user-1:i-hate-passwords@yunus-finance-cluster-shard-00-00-hwwsk.gcp.mongodb.net:27017,yunus-finance-cluster-shard-00-01-hwwsk.gcp.mongodb.net:27017,yunus-finance-cluster-shard-00-02-hwwsk.gcp.mongodb.net:27017/test?ssl=true&replicaSet=yunus-finance-cluster-shard-0&authSource=admin&retryWrites=true&w=majority';


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(CONNECTION_STRING);

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Accessed API!' });   
});


// more routes for our API will happen here

router.route('/customers')

    // create a bear (accessed at POST http://localhost:8080/api/customers)
    .post(function(req, res) {

        var customer = new Customer();      // create a new instance of the Customer model
        
        // setting the customer's attributes to those passed in by the request body

        customer.firstName = req.body.firstName;
        customer.lastName = req.body.lastName;
        customer.email = req.body.email;
        customer.dateOfBirth = req.body.dateOfBirth;
        customer.phoneNumberCountryCode = req.body.phoneNumberCountryCode;
        customer.phoneNumber = req.body.phoneNumber;
        customer.countryName = req.body.countryName;
        customer.nativeLanguage = req.body.nativeLanguage;

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Customer created!' });
        });

    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
