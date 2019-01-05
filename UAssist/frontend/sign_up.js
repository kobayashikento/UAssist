/*
The javascript responsible for creating the view for clients who want to
create a new account (a new user). This also contains all the backend functionality
*/

// Creates the view for the create new account screen
function create_new_account_screen() {
  // Clear all the DOM elements in the main container
  const body = $("body")
  body.empty();

  // Create the container to add all the DOM elements to
  const signup_container = $('<div id="SignupContainer">');

  // Add current page information
  const web_name = $('<h1 id="signupPage" align="left">Sign Up</h1>');

  // Create the interface block
  const interface_block = $('<div id="SignupInterface", class="container">');
  const signup_objects = $('<div class="row signup_objects">');
  const user_inputs = $('<div class="col-sm-12">');
  const buttons = $('<div class="col-sm-12">');
  signup_objects.append(user_inputs);
  signup_objects.append(buttons);

  interface_block.append(web_name);
  interface_block.append(signup_objects);

  // Add the username and password fields to the signup interface
  const first_name = $('<input type="text" id="InputFName" class="SignupInput" placeholder="First Name">');
  const last_name = $('<input type="text" id="InputLName" class="SignupInput" placeholder="Last Name">');
  const username = $('<input type="username" id="InputUsername" class="SignupInput" placeholder="Username">');
  const password1 = $('<input type="password" id="InputPassword1" class="SignupInput" placeholder="Password">');
  const password2 = $('<input type="password" id="InputPassword2" class="SignupInput" placeholder="Re-enter Password">');
  const email = $('<input  id="InputEmail" class="SignupInput" placeholder="Email">');

  user_inputs.append(username, first_name, last_name, email, password1, password2);

  user_enter_info = {first_name: first_name, last_name: last_name,
                     username: username, password1: password1,
                     password2: password2, email: email};


  // Submit
  const create_acct_submit_button = $('<button id="create_acct_submit_button" class="btn-success btn-block create_acct_button" type="submit">Submit</button>');
  create_acct_submit_button.on("click", user_enter_info, create_acct_submit_handler);
  buttons.append(create_acct_submit_button);

  // Cancel
  const create_acct_cancel_button = $('<button id="create_acct_cancel_button" class="btn-danger btn-block create_acct_button" type="submit">Cancel</button>');
  create_acct_cancel_button.on("click", create_acct_cancel_handler);
  buttons.append(create_acct_cancel_button);

  signup_container.append(interface_block);
  body.append(signup_container);

}

// Handler for when users want to submit info and make new account
function create_acct_submit_handler(e){
  // Check the user input. Helper function defined in index.js
  console.log(e.data)
  if (check_user_personal_information(e) === 0){
    return; // Input failed test so do not continue
  }

  //Prepear to make a server call which adds the new user
  let data = {
    first_name: e.data.first_name.val(),
    last_name: e.data.last_name.val(),
    username: e.data.username.val(),
    password: e.data.password1.val(),
    email: e.data.email.val()
  }
  const request = new Request("/createNewUser", {
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
      alert("Congratulations! You can now signup in using your username and password.");
      setTimeout(create_login_screen, 0);
      return;
    }else {
      alert("Something went wrong try again. There may be a problem with the server at this time.");
    }
  })
}

// Handler for when user wants to cancel and go back to signup screen
const create_acct_cancel_handler = () => create_login_screen();
