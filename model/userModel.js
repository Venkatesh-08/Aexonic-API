const mongoose = require('mongoose');

const schema = mongoose.Schema;
var crypto = require('crypto'); 
const userSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: ' '
    },
    hash : String, 
    salt : String   
});
   
const User = module.exports = mongoose.model('users',userSchema);