// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose   = require('mongoose');

const path = require ('path');

// SCHEMAS

var Customer = require('./models/customer');
const CONNECTION_STRING = 'mongodb+srv://user-1:i-hate-passwords@yunus-finance-cluster-hwwsk.gcp.mongodb.net/yunus_database?retryWrites=true&w=majority';

console.log('I just called, to say, I love youuuuu');

// FUNCTIONS FOR API

var getCustomers = (req, res) => {
    Customer.find((err, customers) => {
        if (err)
            res.send(err);

        res.json(customers);
    })
}

var createCustomer = (req, res) => {
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
}

var getCustomer = (req, res) => {
    Customer.findById(req.params.cust_id, (err, customer) => {
        if (err) {
            res.send({sucess: false, response: err});
        } else if (!customer) {
            res.send({sucess: false, response: 'No customer found'});
        } else {
            res.json({sucess: true, response: customer});
        }
    })
}

var deleteCustomer = (req, res) => {
    Customer.deleteOne({_id: req.params.cust_id}, (err, customer) => {
        if (err)
            res.send(err);
        
        res.json({message: 'successfully deleted customer'});
    })
}

var updateCustomer = (req, res) => {
    Customer.findById(req.params.cust_id, (err, customer) => {
        if (err) {
            res.send({sucess: false, response: err});
        } else if (!customer) {
            res.send({sucess: false, response: 'No customer found'});
        } else {
            customer.firstName = req.body.firstName;
            customer.lastName = req.body.lastName;
            customer.email = req.body.email;
            customer.dateOfBirth = req.body.dateOfBirth;
            customer.phoneNumberCountryCode = req.body.phoneNumberCountryCode;
            customer.phoneNumber = req.body.phoneNumber;
            customer.countryName = req.body.countryName;
            customer.nativeLanguage = req.body.nativeLanguage;

            customer.save((err) => {
                if (err)
                    res.send({success: false});
            })
            res.json({sucess: true, response: customer});
        }
    })
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});

app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// more routes for our API will happen here

app.get('/tabs/tab1', (req,res) => {
  console.log('I just called, to say, I love youuuuu');
  res.redirect('https://yunus-finance.herokuapp.com/');
})


router.route('/customers')
    .get(getCustomers)
    .post(createCustomer);

router.route('/customers/:cust_id')
    .get(getCustomer)
    .delete(deleteCustomer)
    .put(updateCustomer);

// CAPITAL ONE INTERACTIONS

router.route('/request_loan/:cust_id')

    // In the body: loan amount & loan reason
    .post((req, res) => {
        // STEP 1: Retrieve customer details

        // STEP 2: Create account with Captial One

        // STEP 3: Store account details 


    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

