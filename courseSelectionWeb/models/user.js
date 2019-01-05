// Here we define the models which is the structure of the "objects" we will store
// in the database.

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// A section with a course
const SectionSchema = new mongoose.Schema({
  meet: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  code: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

// A Course that a student may have in their schedule
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  courseCode: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  sections: [SectionSchema]
})

// A user (same for both admin and no-admin users, but we know which type by acct_type)
const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  acct_type: {
    type: String,
    required: true
  },
  email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'The email is not valid'
		}
	},
  courses: []
})

// Here we define a function for getting a specific user by their username and password
UserSchema.statics.findUsernamePassword = function (username, password) {
  // Get the user with username
  return this.findOne({username: username}).then((user) => {
    if (!user){
      return Promise.reject();
    }
    // Continue to check password if user exist
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result){
          resolve(user);
        }else {
          reject();
        }
      })
    })
  })
}

// Here we define a function for getting a specific user via username
UserSchema.statics.findUsername = function (username) {
  // Get the user with username
  return this.findOne({username: username}).then((user) => {
    if (!user){
      return Promise.reject();
    }
    // Continue to check password if user exist
    return new Promise((resolve, reject) => {
      if (user){
        resolve(user);
      }else{
        reject();
      }
    })
  })
}

// Here we define a function that is triggered before a user is saved into the database
UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(this.password, salt, (error, hash) => {
        this.password = hash;  // So the password is now encrypted
        next();
      })
    })
  // We get here if the password field did not change from its original state
  }else {
    next();
  }
})

const User = mongoose.model("User", UserSchema);
module.exports = {User};
