/*
The javascript responsible for creating the login elements and
providing the backend functionalities
*/

// Creates the view for the login screen
function create_login_screen() {
  // Set this global variable to nothing since no one is signed in
  login_account = "";

  // Clear all the DOM elements in the main container
  const body = $("body")
  body.empty();

  // Create the login container which contains the background image
  const login_container = $('<div id="LoginContainer">');

  // Add the website name, UAssist
  const web_name = $('<div align="center"><img id="LoginTitle" src="./Graphical_Assets/Logo/Uassist Black.png" ></div>');
  // login_container.append(web_name);

  // Create the interface block
  const interface_block = $('<div id="LoginInterface", class="container">');
  const row1 = $('<div class="row login_objects">');
  const col1 = $('<div class="col-sm-12">');
  const col2 = $('<div class="col-sm-12">');
  row1.append(col1);
  row1.append(col2);
  interface_block.append(web_name);

  interface_block.append(row1);

  // Add the username and password fields to the login interface
  const username = $('<input type="username" id="InputUsername" class="LoginInput" placeholder="Username">');
  const password = $('<input type="password" id="InputPassword" class="LoginInput" placeholder="Password">');
  col1.append(username);
  col1.append(password);

  // Add the sign in button
  const sign_in_button = $('<button id="sign_in_button" class="btn-success btn-block" type="submit">Sign in</button>');
  sign_in_button.on("click",{username: username, password: password}, sign_in_handler);
  col2.append(sign_in_button);

  // Add the create new account button
  const create_acct_button = $('<button id="create_acct_button" class="btn-warning btn-block" type="submit">Create Account</button>');
  create_acct_button.on("click", make_account_handler);
  col2.append(create_acct_button);

  login_container.append(interface_block);
  body.append(login_container);
}

// Handler for when user clicks sign in
function sign_in_handler(e){
  // Prepear a request to check database for the correct user
  let data = {
    username: e.data.username.val(),
    password: e.data.password.val()
  }
  const request = new Request("/userLogin", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
    }
  });

  // Now we send the request and see what server does
  fetch(request).then((res) => {
    // If we found the user
    if (res.status === 200){
      return res.json();
    // If we did not find the user
    }else {
      alert("The login credentials you entered is not valid, try again.");
    }
  }).then((json) => {
    login_account = new UserAccount(json.user.first_name, json.user.last_name, json.user.username,
       json.user.password, json.user.acct_type, json.user.email, json.user.courses);
    login_account.user_id = (json.user._id).toString();
    login_account.courses = json.user.courses;
    console.log(login_account);
    if (json.user.acct_type === "Student"){
      createNavigation();
    }else {
      createAdminNavigation();
    }
  }).catch((error) => {
    console.log(error);
  })
}

// Handler for when user wants to create a new account
const make_account_handler = () => create_new_account_screen();
