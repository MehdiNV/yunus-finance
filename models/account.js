var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AccountSchema = new Schema({
    customerId: String,
    accountId: String,
    uci: String,
    riskScore: String,
    currencyCode: String,
    productType: String
}, {collection: 'account_info'});

module.exports = mongoose.model('Account', AccountSchema);
