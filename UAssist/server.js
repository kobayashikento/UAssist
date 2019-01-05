// Below is the express server that will take care of all the request a client
// may make when using the web application.


// Some important imports
const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
// Imports related to the database
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
// Import the models used for the database
const {User} = require('./models/user');
const {Room} = require('./models/room');

// Initialize express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname));
app.use(session({
	secret: "Secret",
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 1000,
		httpOnly: true
	}
}))

// Middleware to see if user is logged in (mostly for returning users)
const check_session = (req, res, next) => {
  if (req.session.user) {
		res.redirect("/login"); // NEED TO CHANGE THIS NOT SURE HOW TO DO THIS
	} else {
		next();  // Get out and go somewhere else, most likey go to login
	}
}

// Route for getting the login page
app.get("/", check_session, (req, res) => {
  // We go to login if check_session does not bring us somewhere else
  res.redirect("login");
})
app.route('/login').get(check_session, (req, res) => {
  // Load up the login screen
	res.sendFile(__dirname + '/index.html');
})

// Route for adding new user to database
app.post("/createNewUser", (req, res) => {
  // Create the new user
  const new_user = new User ({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password,
    acct_type: "Student",
    email: req.body.email,
    courses: []
  })

  // Save the student to the database
  new_user.save().then((result) => {
    res.send(result);
  }, (error) => {
    res.status(400).send(error);
  })
})

// Route for logging in
app.post("/userLogin", (req, res) => {
  // Search the database to see if we can get the target user
  User.findUsernamePassword(req.body.username, req.body.password).then((user) => {
    // If we did not find the user
    if (!user) {
      res.status(400).send("");
    // If we were able to find the target user
    }else {
      req.session.user = user._id;
      req.session.acct_type = user.acct_type; // So we can tell if it is admin
      res.status(200).send({user});
    }
  }).catch((error) => {
    res.status(400).send("");
  })
})

// Route for editing a users information
app.post("/editUserInfo", (req, res) => {
	// Check if id is valid
	if (!ObjectID.isValid(req.body.user_id)) {
		return res.status(404).send()
	}

	// Search the database to see if we can get the target user and update
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(req.body.password, salt);
	let properties = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		password: hash,
		email: req.body.email
	}
	User.findByIdAndUpdate(req.body.user_id, {$set: properties}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({user})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

// Route for getting all the room inforamtion in the room database (Note must use Postman)
app.get("/getAllRooms", (req, res) => {
	Room.find().then((rooms) => {
		res.send(rooms);
	}, (error) => {
		res.status(400).send(error);
	})
})

// Route for adding a room to the database
app.post("/addNewRoom", (req, res) => {
	// Create the new room
	const new_room = new Room({
		building_name: req.body.building_name,
		room_number: req.body.room_number,
		times: req.body.times
	});

	// Save the new room
	new_room.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})

// Route for saving a user's schedule
app.post("/saveSchedule", (req, res) => {
	let properties = {
		courses: req.body.courses
	}

	// Save the information to the target user
	User.findByIdAndUpdate(req.body.user_id, {$set: properties}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({user})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

// Route for getting all the users and account details (only admin can do this)
app.get("/getAllUsers", (req, res) => {
	User.find().then((users) => {
		res.send(users);
	}, (error) => {
		res.status(400).send(error);
	})
})


//Route for deleting user
app.post("/removeUser", (req, res) => {
	const id = req.body.user_id;
	console.log(id);
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	User.findByIdAndRemove(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({user})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

//Route for editing a single user from the admin side
// Route for editing a users information
app.post("/editUserInfoAdmin", (req, res) => {
	// Check if id is valid
	if (!ObjectID.isValid(req.body.user_id)) {
		return res.status(404).send()
	}

	// Search the database to see if we can get the target user and update
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(req.body.password, salt);
	let properties = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		password: hash,
		email: req.body.email,
		acct_type: req.body.acct_type
	}
	User.findByIdAndUpdate(req.body.user_id, {$set: properties}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({user})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// Starts listening on a port and prepare to accept connections (get ready to serve clients)
app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
});
