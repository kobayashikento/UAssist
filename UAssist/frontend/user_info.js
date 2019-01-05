/*
The javascript responsible for creating the view for viewing a single user's
info and providing the backend functionalities (user may want to change personal info)
*/

// Creates the view for the user info screen
function user_info_screen() {
  // Clear all the DOM elements in the main container
  const body = $("#information_container")
  body.empty();



  // Create the container to add all the DOM elements to
  const interface_block = $('<div id="ProfileInterface">');
    const profile_objects = $('<div class="row">');
      const group1 = $('<div class="col-sm-12">');
      const group2 = $('<div class="col-sm-6">');
      const group3 = $('<div class="col-sm-6">');
      const group4 = $('<div class="col-sm-12">');
      const group5 = $('<div class="col-sm-12">');
      const group6 = $('<div class="col-sm-12">');
      const buttons = $('<div id="user_buttons" class="col-sm-3">');
      profile_objects.append(group1, group2, group3, group4, group5, group6, buttons);
    interface_block.append(profile_objects);

  // Add the username and password fields to the signup interface
    const username_text = $('<h6 class="InputDescription">Username</h6>')
    const username = $('<input class="SaveInput" type="username" id="SaveUsername" value='+login_account.username+'>');
    group1.append(username_text, username);

    const first_name_text = $('<h6 class="InputDescription">First Name</h6>')
    const first_name = $('<input class="SaveInput" type="text" id="SaveFName" value='+login_account.first_name+'>');
    group2.append(first_name_text, first_name);

    const last_name_text = $('<h6 class="InputDescription">Last Name</h6>')
    const last_name = $('<input class="SaveInput" type="text" id="SaveLName" value='+login_account.last_name+'>');
    group3.append(last_name_text, last_name)

    const email_text = $('<h6 class="InputDescription">Email</h6>')
    const email = $('<input class="SaveInput" id="SaveEmail"  value='+login_account.email+'>');
    group4.append(email_text, email)

    const password1_text = $('<h6 class="InputDescription">Password</h6>')
    const password1 = $('<input class="SaveInput" type="password" id="SavePassword1" value='+login_account.password+'>');
    group5.append(password1_text, password1)

    const password2_text = $('<h6 class="InputDescription">Re-enter password</h6>')
    const password2 = $('<input class="SaveInput" type="password" id="SavePassword2" value='+login_account.password+'>');
    group6.append(password2_text, password2)

  user_enter_info = {first_name: first_name, last_name: last_name,
                     username: username, password1: password1,
                     password2: password2, email: email};


  // Submit
  const button_holder = $('<div>');
  const save_button = $('<button id="save_button" class="btn-success profileButton" type="submit">Save Changes</button>');
  save_button.on("click", user_enter_info, user_info_submit_handler);
  button_holder.append(save_button)
  buttons.append(save_button);

  body.append(interface_block);
}

// Handler for when the user presses the save changes button to update user info
function user_info_submit_handler(e){
  // Check the user input. Helper function defined in index.js
  if (check_user_personal_information(e) === 0){
    return; // Input failed test so do not continue
  }

  // Make the changes to the databse by making a request to server
  // Prepear to make the server call
  let data = {
    first_name: e.data.first_name.val(),
    last_name: e.data.last_name.val(),
    username: e.data.username.val(),
    password: e.data.password1.val(),
    email: e.data.email.val(),
    user_id: login_account.user_id
  }
  const request = new Request("/editUserInfo", {
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
      // Make the changes locally
      login_account.first_name = e.data.first_name.val();
      login_account.last_name = e.data.last_name.val();
      login_account.username = e.data.username.val();
      login_account.password = e.data.password1.val();
      login_account.email = e.data.email.val();
      alert("Your personal information has been saved.");
      return;
    }else {
      alert("Something went wrong try again. There may be a problem with the server at this time.");
    }
  })
}
