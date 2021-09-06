const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    }
})

userSchema.plugin(passportLocalMongoose); // this will add username and password to userSchema automatically
module.exports = mongoose.model('User', userSchema);