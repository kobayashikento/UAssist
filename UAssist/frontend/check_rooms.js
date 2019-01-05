/*
The javascript responsible for creating the check rooms view for students.
This also contains all the backend functionality
*/

// Creates the view for the check rooms for both students and admin
function check_room_screen(){
  // Clear all the DOM elements
  const body = $("#information_container");
  body.empty();

  // Create the container to add all the DOM elements to
  const interface_block = $('<div id="RoomsInterface">');
    const profile_objects = $('<div class="row">');
      const group1 = $('<div class="col-sm-12">');
      const group2 = $('<div class="col-sm-12">');
      const group3 = $('<div class="col-sm-12">');
      const buttons = $('<div class="col-sm-12 room_buttons">');
      profile_objects.append(group1, group2, group3, buttons);
    interface_block.append(profile_objects);

  const building_name_text = $('<h6 class="InputDescription">Building Name</h6>')
  const building_name = $('<input class="RoomInput" placeholder="i.e. BA">');
  group1.append(building_name_text, building_name);

  const room_number_text = $('<h6 class="InputDescription">Room Number</h6>')
  const room_number = $('<input class="RoomInput" placeholder="i.e. 2000">');
  group2.append(room_number_text, room_number);

  const time_text = $('<h6 class="InputDescription">Time</h6>')
  const time = $('<div class="RoomInput">');
  const time_input = $('<input id="TimeInput"  placeholder="i.e. 9">');
  const time_select = $('<select class="custom-select" id="TimeSelect"><option selected>AM</option><option value="PM">PM</option>');
  time.append(time_input);
  time.append(time_select);
  group3.append(time_text, time)

  body.append(interface_block);


  /*
    NOW TIME TO INIT THE TABLE
  */
  // Add the section for displaying the booked times for a specific room
  const information_table = $('<div id="information_table">');
  // header for booked times section
  const book_times_header = $('<h1 class="table_header"> Showing booked times for: </h1>');
  information_table.append(book_times_header);
  // scroll table for the booked times section
  const booked_times_scroll_table_container = $('<div class="table-wrapper-scroll-y">');
  const booked_times_scroll_table = $('<table class="table table_content">');
  const booked_times_scroll_table_head = $('<thead class="thead-dark"><tr><th scope="col">Start</th><th scope="col">End</th></tr></thead>');
  const booked_times_scroll_table_body = $('<tbody id="booked_times_scroll_table_body">');
  booked_times_scroll_table.append(booked_times_scroll_table_head);
  booked_times_scroll_table.append(booked_times_scroll_table_body);
  booked_times_scroll_table_container.append(booked_times_scroll_table);
  information_table.append(booked_times_scroll_table_container);

  body.append(information_table);

  user_enter_info = {building_name: building_name, room_number: room_number,
                     Time: time_input, Time_select: time_select, booked_times_body: booked_times_scroll_table_body,
                     booked_times_header: book_times_header};

  /*
    Buttons to initialize
  */

  // Submit
  const check_room_submit_button = $('<button id="create_acct_submit_button" class="btn-success room_button" type="submit">Submit</button>');
  check_room_submit_button.on("click", user_enter_info, check_room_submit_handler);
  // Clear
  const check_room_clear_button = $('<button id="create_acct_clear_button" class="btn-warning room_button" type="submit">Clear</button>');
  check_room_clear_button.on("click", check_room_clear_handler);
  buttons.append(check_room_submit_button, check_room_clear_button);
}

// Handler for when the user clicks submit
function check_room_submit_handler(e){
  if (check_rooms_check_user_input(e) === 0){
    return; // User input is not valid so leave
  }

  // At this point the input is valid so we check the availability of the room and post details
  // Find the room that was requested. In phase2 we search in database NOT an array
  let requested_room = "";
  for (let i = 0; i < all_room_informtion.length; i++){
    if (e.data.building_name.val() === all_room_informtion[i].building_name &&
        e.data.room_number.val() === all_room_informtion[i].room_number){
          requested_room = all_room_informtion[i];
    }
  }

  // store and convert the time the user entered
  let user_enter_time = convert12hTo24h(parseInt(e.data.Time.val(), 10), e.data.Time_select.val())

  let start_time = "";
  let end_time = "";
  let temp = "";
  let time_collision = 0;
  e.data.booked_times_body.empty();
  for (let i = 0; i < requested_room.times.length; i++){
    temp = convert24hTo12h(requested_room.times[i][0]);
    start_time = temp[0].toString() + temp[1];
    temp = convert24hTo12h(requested_room.times[i][1]);
    end_time = temp[0].toString() + temp[1];
    e.data.booked_times_body.append($('<tr><td class="text_info">'+start_time+'</td><td class="text_info">'+end_time+'</td></tr>'));
    // Check if there is a time conflict
    if (user_enter_time >= requested_room.times[i][0] && user_enter_time < requested_room.times[i][1]){
      time_collision = 1;
    }
  }
  e.data.booked_times_header.html("Showing booked times for: "+e.data.building_name.val()+e.data.room_number.val());

  if (time_collision === 1){
    alert("There is a time conflict. "+e.data.building_name.val()+e.data.room_number.val()+" is being used at "+e.data.Time.val()+e.data.Time_select.val());
  }else {
    alert(e.data.building_name.val()+e.data.room_number.val()+" is free at "+e.data.Time.val()+e.data.Time_select.val());
  }

}

// Handler for when the user clicks clear
const check_room_clear_handler = () => check_room_screen();
