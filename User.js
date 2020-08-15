const mongoose = require('mongoose');

// Mongoose schema
const userSchema = new mongoose.Schema ({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  password2: String
})

// Mongoose model
const User = mongoose.model('User', userSchema);



module.exports = User;