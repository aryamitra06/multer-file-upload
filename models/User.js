const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: String,
    profilephoto: String
});

module.exports = mongoose.model('user', UserSchema);