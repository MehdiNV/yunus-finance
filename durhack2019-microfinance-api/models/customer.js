var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CustomerSchema   = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    dateOfBirth: Date,
    phoneNumberCountryCode: Number,
    phoneNumber: String,
    countryName: String,
    nativeLanguage: String
});

module.exports = mongoose.model('Bear', BearSchema);
