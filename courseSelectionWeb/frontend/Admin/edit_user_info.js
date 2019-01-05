//// Below is what needs to happend when the user decides to edit the info for a user ////
// Creates the view for the edit user info screen
function edit_user_info_screen(user) {

  // Create the user info screen
  user_info_screen();

  // Change all the values to the appropriate document value
  username = document.getElementById("SaveUsername");
  username.value = user.username;

  first_name = document.getElementById("SaveFName");
  first_name.value = user.first_name;

  last_name = document.getElementById("SaveLName");
  last_name.value = user.last_name;

  email = document.getElementById("SaveEmail");
  email.value = user.email;

  password1 = document.getElementById("SavePassword1");
  password1.value = user.password;

  password2 = document.getElementById("SavePassword2");
  password2.value = user.password;

  /*
    Button OPERATIONS
   */
  user_enter_info = {user_id: user.user_id, first_name: first_name, last_name: last_name,
                     username: username, password1: password1,
                     password2: password2, email: email, user: user};
  // Add the buttons
  const buttons = $('#user_buttons');
  buttons.empty();
  // Save Changes
  const edit_user_submit_button = $('<button class="btn-success edit_users_button" type="submit">Save Changes</button>');
  edit_user_submit_button.on("click", user_enter_info, edit_user_info_submit_handler);
  buttons.append(edit_user_submit_button);
  // Clear changes
  const edit_user_delete_button = $('<button class="btn-warning edit_users_button" type="submit">Delete User</button>');
  edit_user_delete_button.on("click", user_enter_info, edit_user_info_delete_user_handler);
  buttons.append(edit_user_delete_button);
  // Exit/cancel
  const edit_user_cancel_button = $('<button class="btn-danger edit_users_button" type="submit">Back</button>');
  edit_user_cancel_button.on("click", edit_user_info_exit_handler);
  buttons.append(edit_user_cancel_button);


  let container = buttons.parent();
  const radio_buttons = $('<div id="radio_buttons" class="col-sm-5 ">');

  const student =$('<div class="form-check">')
    const student_radio = $('<input type="radio" class="form-check-input radio_button" id="student_radio" name="radAnswer">')
    const student_label = $('<label class="check_label text_info" for="student_radio">Student</label>')
    student.append(student_radio, student_label)

  const admin =$('<div class="form-check">')
    const admin_radio = $('<input type="radio" class="form-check-input radio_button" id="admin_radio" name="radAnswer">')
    const admin_label = $('<label class="check_label text_info" for="admin_radio">Admin</label>')
    admin.append(admin_radio, admin_label)

  radio_buttons.append(student, admin);
  container.append(radio_buttons)

  if (user.acct_type === "Student") {
    student_radio.prop('checked',true);
  }
  if (user.acct_type === "Admin") {
    admin_radio.prop('checked',true);;
  }

}

// Handler for when the user presses the save changes button to update user info
function edit_user_info_submit_handler(e){
  // Check the user input
  let invalid = 0;
  // First check to see if all the fields are not empty
  $.each(e.data, function (info){if (info !== "user" && e.data[info].value === ""){invalid = 1;}});
  if (invalid === 1){
    alert("The information you entered is not correct. Please ensure you have not left any field blank.");
    return 0;
  }

  // Now check that the user entered in the password correctly
  if (e.data.password1.value !== e.data.password2.value){
    alert("The password you entered does not match. Ensure you re-enter the password correctly.");
    return 0;
  }

  // Now check to see if username is unique NOTE: IN PHASE2 WE WILL REFER TO A DATABASE NOT AN ARRAY OF HARDCODED DATA
  let all_usernames = []
  for (let i = 0; i < all_accounts.length; i++){
    if ((login_account !== "") && (all_accounts[i].username !== e.data.user.username)){
      all_usernames.push(all_accounts[i].username);
    }
  }
  if (all_usernames.includes(e.data.username.value)){
    alert("The username you entered is already taken please try again.");
    return 0;
  }


  // At this point the input is valid
  // NOTE IN PHASE2 WE WILL ACTUALLY CHANGE THE INFO IN THE DATABASE AND NOT JUST HARDCODED INFO IN JS
  e.data.user.first_name = e.data.first_name.value;
  e.data.user.last_name = e.data.last_name.value;
  e.data.user.username = e.data.username.value;
  e.data.user.password = e.data.password1.value;
  e.data.user.email = e.data.email.value;

  if($('#admin_radio').is(':checked')) {
    e.data.user.acct_type = "Admin";
  }
  else if($('#student_radio').is(':checked')) {
    e.data.user.acct_type = "Student";
  }

  // Make the changes to the databse by making a request to server
  // Prepear to make the server call
  let data = {
    first_name: e.data.user.first_name,
    last_name: e.data.user.last_name,
    username: e.data.user.username,
    password: e.data.user.password,
    email: e.data.user.email,
    user_id: ((e.data.user).user_id).toString(),
    acct_type: e.data.user.acct_type
  }
  const request = new Request("/editUserInfoAdmin", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
    }
  });

  // Now we make the request, the server will take care of this
  fetch(request).then((res) => {
    // We handle the response given back from the server
    if (res.status === 200){
      alert("The changes have been saved.");
      return;
    }else {
      alert("Something went wrong try again. There may be a problem with the server at this time.");
    }
  })
}

// Handler for when the user presses the delete user button
function edit_user_info_delete_user_handler(e){
  // Prepear a request to check database for the correct user
  let data = {
    user_id: ((e.data.user).user_id).toString()
  }
  const request = new Request("/removeUser", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
    }
  });

  // Now we send the request and see what server does
  fetch(request).then((res) => {
    if (res.status === 200){
      alert(e.data.username.value + " has been removed. The account is no longer active.");
      manage_users_screen();
    }else {
      alert("Could not delete user.");
    }
  }).catch((error) => {
    console.log(error);
  })
}

// Handler for when the user presses the exit button to go back
function edit_user_info_exit_handler(){
  manage_users_screen();
}
