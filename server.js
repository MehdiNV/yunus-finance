// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose   = require('mongoose');
var axios      = require('axios');

const path = require ('path');

// SCHEMAS

var Customer = require('./models/customer');
var Account = require('./models/account');
const CONNECTION_STRING = 'mongodb+srv://user-1:i-hate-passwords@yunus-finance-cluster-hwwsk.gcp.mongodb.net/yunus_database?retryWrites=true&w=majority';
const AUTH_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE1NzQyNDA0MDAsImFwaV9zdWIiOiI0NzAzZjliNmZlNjEwNzIwN2U1OGFjZmQxMWE3NWZiMTQ2MGU3Y2VhOTExYTg5ZDViOTRhN2ViNTNlMmJiZjE0MTU3NDYzOTk5OTAwMCIsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTU3NDYzOTk5OSwiZGV2ZWxvcGVyX2lkIjoiNDcwM2Y5YjZmZTYxMDcyMDdlNThhY2ZkMTFhNzVmYjE0NjBlN2NlYTkxMWE4OWQ1Yjk0YTdlYjUzZTJiYmYxNCJ9.itQ9cQb4AGyeZCaYYEHeF0VLKPjFxcqwA2FMyiwagaEb_AWBzVRzarcb8cAW-jYak-GHlLcQKLDDwTc9RSgAswOlADGQM-c_s0MSe8MwWzurNpsJh6BRjCJegK4aZd84xREOspaJiBTdDDpPpgusVXHUH4lssFxDxjQWjIGpL8-hv60yQKJMAKB6erRjQkgl5emJRH0rA2FXQy2bD7vMnomi7c-RIoNo0RWWfRekmXIEKD1vLDh-eu9sgZ6SnPFwvu7k-qVI74O5lDJ9L-U9LLseeE0l390lWiTGTTIMn0J0SA2kD66xmLS3Du6M_gqJbn3dkoOeM_fhkkudWov2hA';

// FUNCTIONS FOR API

var getCustomers = async (req, res) => {
    Customer.find((err, customers) => {
        if (err)
            res.send(err);

        res.json(customers);
    })
}

var createCustomer = async (req, res) => {
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

var getCustomer = async (req, res) => {
    return new Promise( (resolve, reject) => 
        {
            Customer.findById(req.params.cust_id, (err, customer) => {
                if (err) {
                    return reject({sucess: false, response: err});
                } else if (!customer) {
                    return reject({sucess: false, response: 'No customer found'});
                } else {
                    return resolve({sucess: true, response: customer});
                }
            })
        }
    );
}

var deleteCustomer = async (req, res) => {
    Customer.deleteOne({_id: req.params.cust_id}, (err, customer) => {
        if (err)
            res.send(err);
        
        res.json({message: 'successfully deleted customer'});
    })
}

var updateCustomer = async (req, res) => {
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
    .get((req, res) => {
        getCustomer(req, res)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                res.send(err);
            })
        })
    .delete(deleteCustomer)
    .put(updateCustomer);

// CAPITAL ONE INTERACTIONS
var createCapitalOneAccount = async (req, res) => {
    return new Promise ((resolve, reject) => {
        axios.post('https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/accounts/create',
            {
                'quantity': '1'
            },
            {
                headers: {
                    'Authorization': "Bearer " + AUTH_JWT,
                    'version' : '1.0'
                }
            },
        )
            .then((response) => {
                return resolve(response.data);
            })
            .catch((err) => {
                return reject(err);
            })
    });
}

var addAccount = async (req, res) => {
    return new Promise ((resolve, reject) => {
        var account = new Account({
            customerId: req.body.customerId,
            accountId: req.body.accountId,
            uci: req.body.uci,
            riskScore: req.body.riskScore,
            currencyCode: req.body.currencyCode,
            productType: req.body.productType,
            loanAmount: req.body.loanAmount,
            loanPurpose: req.body.loanPurpose
        });      // create a new instance of the Customer model
        // save the bear and check for errors
        account.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({success: true, account: account });
            }
        });
    })
}

router.route('/add')
    .post((req, res) => {
        addAccount(req, res)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                res.send(err);
            })
        });

router.route('/request_loan/')
    // In the body: loan amount, loan reason, 
    .post((req, res) => {
        console.log(req.body);
        createCapitalOneAccount(req, res)
            .then((response) => {
                let account = response.Accounts[0]
                req.body = {
                    customerId: req.body.customerId,
                    accountId: account.accountId,
                    uci: account.uci,
                    riskScore: account.riskScore,
                    currencyCode: account.currencyCode,
                    productType: account.productType,
                    loanAmount: req.body.loanAmount,
                    loanPurpose: req.body.loanPurpose
                }
                console.log(req.body);
                addAccount(req, res)
                    .then((add_acc_res) => {
                        res.json(add_acc_res);
                    })
                    .catch((err) => {
                        res.send(err);
                    })
            })
            .catch((err) => {
                res.send(err);
            })
        });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

