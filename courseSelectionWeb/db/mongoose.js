const mongoose = require('mongoose')

// Connect to the main data base that stores all the users and information
const mongoURI = "mongodb://<dbuser>:<dbpassword>@ds227664.mlab.com:27664/uassist_users" || process.env.MONGODB_URI || 'mongodb://localhost:27017/UAssits_Users'

//mongoose.connect('mongodb://localhost:27017/StudentAPI', { useNewUrlParser: true});
mongoose.connect(mongoURI, {useNewUrlParser: true});

module.exports = {mongoose}
