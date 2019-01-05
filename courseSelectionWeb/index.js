/*
The javascript responsible for keeping track of global variables
and contains functions that can be used by all views such as sorting
algorithms and changing 24h time to 12h time. This also calls the
first function to get the website running
*/

// General classes and data structures to hold data about users
class UserAccount{
  constructor(first_name, last_name, username, password, acct_type, email, courses){
    this.user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.password = password;
    this.acct_type = acct_type;
    this.email = email;
    this.courses = [];
  }
}

// A class the holds the information about the rooms
class Room{
  constructor(building_name, room_number){
    this.building_name = building_name;
    this.room_number = room_number;
    this.times = []; // will hold the times that the room is used in 24h style
  }
}

// A class that holds the information about a course. This contains an array of Section classes
// Because a course can have more than one section/tutorial section.
class Course {
    constructor(name, courseCode, sections){
        this.name = name;
        this.courseCode = courseCode;
        this.sections = sections;
    }
  }

// A class that represents the different sections in a course
class Section {
    //Time is in 24 hour, day -> 1=Monday....5=Friday
    constructor(meet,code,type){
        this.meet = meet;
        this.code = code;
        this.type = type;
    }
}

// Global variables
// all_accounts will be an useful for the admin version only
let all_accounts = [];
update_all_user_list();
function update_all_user_list(){
  // Here we will make a server request to get all the accounts and the data for each account
  const request = new Request("/getAllUsers", {
      method: "get",
      async: false
  });
  fetch(request).then((res) => {
    if (res.status === 200) {
      return res.json();
    }else {
      alert("Note: account data could not be loaded so managing users will be unavailiable.");
      return;
    }
  }).then((info) => {
    let user_;
    for (let i = 0; i < info.length; i++){
      user_ = new UserAccount(info[i].first_name, info[i].last_name, info[i].username,
                             info[i].password, info[i].acct_type, info[i].email, info[i].courses);
      user_.user_id = (info[i]._id).toString();
      all_accounts.push(user_);
    }
  }).catch((error) => {
    alert("Note: account data could not be loaded so managing users will be unavailiable.");
    console.log(error);
    return;
  })
}

// Once again this is hardcoded. In phase2 we will actually get this info from a database
let all_room_informtion = []
// Here we will make a server request to load all the data for rooms and store in all_room_inforamtion
fetch("/getAllRooms").then((res) => {
  if (res.status === 200) {
    return res.json();
  }else {
    alert("Note room data could not load so check room feature will be unavailiable.")
  }
}).then((info) => {
  let room;
  for (let i = 0; i < info.length; i++){
    room = new Room(info[i].building_name, info[i].room_number);
    room.times = info[0].times
    all_room_informtion.push(room);
  }
}).catch((error) => {
  alert("Note room data could not load so check room feature will be unavailiable.")
})

// This variable will hold the account that is signed in and is set upon signing in
let login_account = "";

// General utility functions
function convert24hTo12h(time){
    // Note: Time is an int (do not send a string)
    if (time > 0 && time < 12){
      return [time, "AM"];
    }else if (time === 0){
      return [12, "AM"];
    }else if (time === 12){
      return [12, "PM"];
    }else if (time === 24){
      return [12, "AM"];
    }else {
      return [time % 12, "PM"];
    }
}

function convert12hTo24h(time, period){
    //Note: Time must be an int and period is a string
    //      Which is either "AM" or "PM"
    if (period === "AM" && time == 12){
        return 0;
    }
    if (period == "PM" && time == 12) {
      return 12
    }
    if (period == "AM") {
      return time;
    }
    else {
        return time + 12;
    }
}

// This helper function checks to see if a username is valid by checking to see
// if it exists in database of users.
function validate_username(username){
  update_all_user_list();
  let invalid_username = 1;
  let good_index = 0; // this will store which index in array contains the user that matches the username
  // check through database which is currently an array (phase1)
  for (let i = 0; i < all_accounts.length; i++){
    if (all_accounts[i].username === username){
      invalid_username = 0;
      good_index = i;
    }
  }

  if (invalid_username === 1){
    alert("The username enetered does not exist please try again.");
    return -1; // -1 = fail
  }
  return good_index; // pass
}

// This is a helper function for checking that the user information is valid
// e is an array that stores all the user information that we will check
function check_user_personal_information(e){
  update_all_user_list();
  // Some variable(s) to help with validation of entered information
  let invalid = 0;

  // First check to see if all the fields are not empty
  $.each(e.data, function (info){if (e.data[info].val() === ""){invalid = 1;}});
  if (invalid === 1){
    alert("The information you entered is not correct. Please ensure you have not left any field blank.");
    return 0;
  }

  // Now check to see if username is unique NOTE: IN PHASE2 WE WILL REFER TO A DATABASE NOT AN ARRAY OF HARDCODED DATA
  let all_usernames = []
  for (let i = 0; i < all_accounts.length; i++){
    if ((login_account !== "") && (all_accounts[i].username !== login_account.username)){
      all_usernames.push(all_accounts[i].username);
    }
  }
  console.log(all_usernames);
  if (all_usernames.includes(e.data.username.val())){
    alert("The username you entered is already taken please try again.");
    return 0;
  }

  // Now check that the user entered in the password correctly
  if (e.data.password1.val() !== e.data.password2.val()){
    alert("The password you entered does not match. Ensure you re-enter the password correctly.");
    return 0;
  }

  return 1;
}

// This is a helper function for checking the user input for check rooms feature
function check_rooms_check_user_input(e){
  let invalid = 0;
  let room_valid = 0; // 0 = false , 1 = true

  // First check to see if all the fields are not empty
  $.each(e.data, function (info){if (e.data[info].val() === "" && info !== "booked_times_body" && info !== "booked_times_header"){invalid = 1;}});
  if (invalid === 1){
    alert("The information you entered is not correct. Please ensure you have not left any field blank.");
    return 0;
  }

  // Check to see if the building name and room number is in the database
  for (let i = 0; i < all_room_informtion.length; i++){
    if (e.data.building_name.val() === all_room_informtion[i].building_name &&
        e.data.room_number.val() === all_room_informtion[i].room_number){
          room_valid = 1;
    }
  }
  if (room_valid === 0){
    alert("Sorry, the room you requested is not in our database and no information can be given for this room at this time.");
    return 0;
  }

  // Now check the time
  if (e.data.Time.val().match(/^[0-9]*$/) === null){
    alert("The time you entered is not valid");
    return 0;
  }
  if (parseInt(e.data.Time.val(), 10) > 12 || parseInt(e.data.Time.val(), 10) < 1){
    alert("The time must be between 1 and 12 inclusive");
    return 0;
  }

  return 1;
}

function checkConflict(time1, time2) {
  if (time1[0] === time2[0]) {
    if (time1[1] <= time2[1] && time2[1] < time1[2]) {
        return true;
    }
    if (time2[1] <= time1[1] && time1[1] < time2[2]) {
        return true;
    }
  }
    return false;
}

// Get the website running
//create_login_screen();
create_login_screen()
//createAdminNavigation()
