function createNavigation(){
	// Clear all the DOM elements
  const body = $("body")
  body.empty()
	const container = $('<div id="MainInterface">')

  const web_name = $('<div id="page"><img id="pageName" src="./Graphical_Assets/Logo/Uassist White.png" ></div>');

  const nav_column = $('<ul class="nav nav-pills nav_bar navbar-expand-lg navbar-dark bg-dark" style="background-color: #e3f2fd;" id="v-pills-tab" role="tablist" aria-orientation="vertical">')
    let home =$('<li class="nav-item tab_option in active";"> <a class="nav-link" id="home_tab" onclick="home_page()" data-toggle="pill" href="#home_function" role="tab" aria-selected="false" style="color:silver; font-size:130%"> Home </a> </li>');
    let view_schedule =$('<li class="nav-item tab_option";"> <a class="nav-link" id="view_schedule_tab" onclick="open_schedule()" data-toggle="pill" href="#open_schedule_function" role="tab" aria-selected="false" style="color:silver; font-size:130%"> View Schedule</a> </li>');
    let add_courses = $('<li class="nav-item tab_option"> <a class="nav-link" id="add_courses_tab" onclick="open_add_courses()" data-toggle="pill" href="#edit_schedule_function" role="tab" aria-selected="false" style="color:silver; font-size:130%"> Manage Courses</a></li>')
    let check_rooms = $('<li class="nav-item tab_option"><a class="nav-link" id="check_rooms_tab" onclick="open_rooms()" data-toggle="pill" href="#open_rooms_function" role="tab" aria-selected="false" style="color:silver; font-size:130%">Check Rooms</a></li>');
    let user_info = $('<li class="nav-item tab_option"> <a class="nav-link" id="info_tab" onclick="open_info()" data-toggle="pill" href="#settings_function" role="tab" aria-selected="false" style="color:silver; font-size:130%">Profile</a></li>');
    let sign_out = $('<li class="nav-item tab_option "> <a class="nav-link" id="sign_out_tab" onclick="sign_out()" data-toggle="pill" href="#sign_out_function" role="tab" aria-selected="false" style="color:grey; font-size:130%">Sign Out</a></li>');

  nav_column.append(home, view_schedule, add_courses, check_rooms, user_info, sign_out)

  const new_container = $('<span class="container" id="information_container"></span>' );

  container.append(web_name, nav_column, new_container)
  // Add the header bar

	body.append(container)
  create_home_page()
}

function home_page() {
  // Print some information about the user
  create_home_page()
}
function open_schedule() {
	console.log("clicked open schedule");
  create_schedule_view(99);
}

function open_add_courses() {
  console.log("add to schedule")
  create_course_selection_screen();
}

function open_rooms() {
	console.log("clicked check_rooms_button")
  check_room_screen();
}

function open_info() {
  user_info_screen();
}


// When the user signs out all the scheduling information will be saved for the user
// Note: this is the only place where the schedule data will be saved.
function sign_out() {
  // Only save scheduling data if there is data to save
  console.log(login_account.length);
  if ((login_account.courses.length !== 0) && (login_account.acct_type === "Student")){
    // Prepear the request
    let data = {
      user_id: login_account.user_id,
      courses: login_account.courses
    }
    const request = new Request("/saveSchedule", {
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
        alert("Your schedule information has been saved.");
      }else {
        alert("Something went wrong and your schedule data could not be saved.");
      }
    })
  }

  // Finally go back to the login screen
  create_login_screen();
}
