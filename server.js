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
const CONNECTION_STRING = 'mongodb+srv://user-1:i-hate-passwords@yunus-finance-cluster-hwwsk.gcp.mongodb.net/yunus_database?retryWrites=true&w=majority';


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});

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

    .get(function(req, res) {
        Customer.find((err, customers) => {
            if (err)
                res.send(err);
            
            res.json(customers);
        })
    })

    // create a customer (accessed at POST http://localhost:8080/api/customers)
    .post(function(req, res) {

        var customer = new Customer({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumberCountryCode: req.body.phoneNumberCountryCode,
            phoneNumber: req.body.phoneNumber,
            countryName: req.body.countryName,
            nativeLanguage: req.body.nativeLanguage
        });      // create a new instance of the Customer model

        // save the bear and check for errors
        customer.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.json({success: true, customer: customer });
            }
        });

    });

router.route('/customers/:cust_id')
    .get((req, res) => {
        Customer.findById(req.params.cust_id, (err, customer) => {
            if (err) {
                res.send({sucess: false, response: err});
            } else if (!customer) {
                res.send({sucess: false, response: 'No customer found'});
            } else {
                res.json({sucess: true, response: customer});
            }
        })
    })


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Access on port ' + port);
