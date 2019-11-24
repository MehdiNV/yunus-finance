var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AccountSchema = new Schema({
    customerId: String,
    accountId: String,
    uci: String,
    riskScore: String,
    currencyCode: String,
    productType: String,
    loanAmount: Number,
    loanPurpose: String
}, {collection: 'account_info'});

module.exports = mongoose.model('Account', AccountSchema);
