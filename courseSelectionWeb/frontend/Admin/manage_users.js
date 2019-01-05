/*
The javascript responsible for creating the manage users view for admins.
This also contains all the backend functionality
*/

// Creates the view for the manage users screen for admins
function manage_users_screen(){
  // Clear all the DOM elements
  const body = $("#information_container");
  body.empty();

  /*
    Initialize the table (RIGHT SIDE)
   */
  // Add the section for displaying the users for a specific room
  const users_container = $('<div id="information_table">');
  // header for displaying users section
  const users_container_header = $('<h1 class="table_header"> List of users </h1>');
  users_container.append(users_container_header);
  // scroll table for the list of users
  const users_scroll_table_container = $('<div class="table-wrapper-scroll-y">');
  const users_scroll_table = $('<table class="table table_content">');
  const users_scroll_table_head = $('<thead class="thead-dark"><tr><th scope="col">Username</th><th scope="col">First Name</th>\
                                  <th scope="col">Last Name</th><th scope="col">Email</th><th scope="col">Account Type</th></tr></thead>');
  const users_scroll_table_body = $('<tbody id="booked_times_scroll_table_body">');
  users_scroll_table.append(users_scroll_table_head);
  users_scroll_table.append(users_scroll_table_body);
  users_scroll_table_container.append(users_scroll_table);
  users_container.append(users_scroll_table_container);

  /*
    Create the list of operations (LEFT SIDE)
   */
  // Create the container to add all the DOM elements to
  const interface_block = $('<div id="EditUsersInterface">');
    const profile_objects = $('<div class="row">');
      const group0 = $('<div class="col-sm-12">');
      const group1_1 = $('<div class="col-sm-12">');
      const group1_2 = $('<div class="col-sm-12">');
      const group2 = $('<div class="col-sm-12">');
      const group3_1 = $('<div class="col-sm-12">');
      const group3_2 = $('<div class="col-sm-12">');
      const buttons = $('<div class="col-sm-12 room_buttons">');
      profile_objects.append(group0, group1_1, group1_2, group2, group3_1, group3_2, buttons);
    interface_block.append(profile_objects);



  // Add the input fields for the operations/functions on users

  // FILTER
  const manage_users_filter = $('<h6 class="InputDescription">Filter users by keyword (Using empty keyword result in all users being shown)</h6>')
  group0.append(manage_users_filter)

  const manage_users_filter_input = $('<input class="UserInfoInput" placeholder="i.e. student1">');
  group1_1.append(manage_users_filter_input)

  const manage_users_filter_button = $('<button class="btn-primary manage_users_button">Filter</button>');
  manage_users_filter_button.on("click", {keyword: manage_users_filter_input, table_body: users_scroll_table_body}, manage_users_filter_handler);
  group1_2.append(manage_users_filter_button);

  // Edit users
  const manage_users_edit = $('<h6 class="InputDescription">Edit user by username</h6>');
  group2.append(manage_users_edit)

  const manage_users_edit_input = $('<input class="UserInfoInput" placeholder="i.e. student1">');
  group3_1.append(manage_users_edit_input);

  const manage_users_edit_button = $('<button class="btn-primary manage_users_button">Edit</button>');
  manage_users_edit_button.on("click", {username: manage_users_edit_input}, manage_users_edit_handler);
  group3_2.append(manage_users_edit_button)

  // Add the newly created DOM elements to the body of the main HTML file
  populate_list_of_users(users_scroll_table_body, "");
  body.append(interface_block, users_container);
}

function manage_users_filter_handler(e){
  populate_list_of_users(e.data.table_body, e.data.keyword.val());
}

function manage_users_edit_handler(e){
  // First check to see of the username is valid
  let temp = validate_username(e.data.username.val())
  if (temp === -1){
    return;
  }

  // At this point the username is valid so we continue
  edit_user_info_screen(all_accounts[temp]);
}

function manage_users_make_admin_handler(e){
  // First check to see of the username is valid
  let temp = validate_username(e.data.username.val())
  if (temp === -1){
    return;
  }

  // At this point the username is valid so make the change
  if (all_accounts[temp].acct_type === "Admin"){
    alert(e.data.username.val()+" is already an admin.");
    return;
  }
  all_accounts[temp].acct_type = "Admin";
  alert(e.data.username.val()+" is now an admin. Changes have been saved.");
  manage_users_screen();
}

function manage_users_make_stu_handler(e){
  // First check to see of the username is valid
  let temp = validate_username(e.data.username.val())
  if (temp === -1){
    return;
  }

  // At this point the username is valid so make the change
  if (all_accounts[temp].acct_type === "Student"){
    alert(e.data.username.val()+" is already a student.");
    return;
  }
  all_accounts[temp].acct_type = "Student";
  alert(e.data.username.val()+" is now a Student. Changes have been saved.");
  manage_users_screen();
}


function populate_list_of_users(list, filter){
  // Here we will make a server request to get all the accounts and the data for each account
  all_accounts = [];
  fetch("/getAllUsers").then((res) => {
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
    // Parse through the data we got back from the database
    list.empty();
    for (let i = 0; i < all_accounts.length; i++){
      if (all_accounts[i].username === login_account.username){
        continue;
      }
      else if (filter === "" || all_accounts[i].first_name.includes(filter) || all_accounts[i].last_name.includes(filter)
                || all_accounts[i].username.includes(filter) || all_accounts[i].email.includes(filter)){
                  list.append($('<tr><td class="text_info">'+all_accounts[i].username+'</td> <td class="text_info">'+all_accounts[i].first_name+'</td><td class="text_info">'+
                                all_accounts[i].last_name+'</td><td class="text_info">'+all_accounts[i].email+'</td><td class="text_info">'+all_accounts[i].acct_type+'</td></tr>'));
      }
    }
  }).catch((error) => {
    alert("Note: account data could not be loaded so managing users will be unavailiable.");
    console.log(error);
    return;
  })

}
