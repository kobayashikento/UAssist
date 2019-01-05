/*
The javascript responsible for creating the main menu view for admins.
This also contains all the backend functionality
*/

// Creates the view for the main menu for admins
function createAdminNavigation(){
	// Clear all the DOM elements
  const body = $("body");
  body.empty();

  const container = $('<div id="MainInterface">')

  const web_name = $('<div id="page"><img id="pageName" src="./Graphical_Assets/Logo/Uassist White.png" ></div>');

  const nav_column = $('<ul class="nav nav-pills nav_bar navbar-expand-lg navbar-dark bg-dark" style="background-color: #e3f2fd;" id="v-pills-tab" role="tablist" aria-orientation="vertical">')
    let home =$('<li class="nav-item tab_option in active";"> <a class="nav-link" id="home_tab" onclick="admin_home_page()" data-toggle="pill" href="#home_function" role="tab" aria-selected="false" style="color:silver; font-size:130%"> Home </a> </li>');
    let view_users =$('<li class="nav-item tab_option";"> <a class="nav-link" id="view_users_tab" onclick="admin_open_users()" data-toggle="pill" href="#open_users_function" role="tab" aria-selected="false" style="color:silver; font-size:130%"> Manage Users</a> </li>');
    let check_rooms = $('<li class="nav-item tab_option"><a class="nav-link" id="check_rooms_tab" onclick="open_rooms()" data-toggle="pill" href="#open_rooms_function" role="tab" aria-selected="false" style="color:silver; font-size:130%">Check Rooms</a></li>');
    let user_info = $('<li class="nav-item tab_option"> <a class="nav-link" id="info_tab" onclick="open_info()" data-toggle="pill" href="#settings_function" role="tab" aria-selected="false" style="color:silver; font-size:130%">Profile</a></li>');
    let sign_out = $('<li class="nav-item tab_option "> <a class="nav-link" id="sign_out_tab" onclick="sign_out()" data-toggle="pill" href="#sign_out_function" role="tab" aria-selected="false" style="color:grey; font-size:130%">Sign Out</a></li>');

  nav_column.append(home, view_users, check_rooms, user_info, sign_out)

  const new_container = $('<span class="container" id="information_container">PUT INFORMATION</span>' );

  container.append(web_name, nav_column, new_container);
  body.append(container);

  create_home_page()
}


// Handler when a admin presses the manage users button in the main menu
function admin_open_users() {
  manage_users_screen()
}

function admin_home_page() {
  create_home_page()
}
