/* Javascript responsible for creating a timetable given a list of courses. This script assumes that
the courses do not have conflicting times which is in the select.js if there is only one course or if
there are multiple courses the script uses the remove_conflits fucntion that takes in a list of courses
and return the combination that doesnt have conflicts*/

/*-----------------------------------------------------------*/
/* Class Variables */
/*-----------------------------------------------------------*/

/*-----------------------------------------------------------*/
/* DOM INITIALIZATION */
/*-----------------------------------------------------------*/
//Create a row element that will be used to populate the container
function create_schedule_view(mode){
    const body = $("#information_container")
    body.empty();
    const container = $('<div class="container" id="scheduleContainer">');
    if (login_account.courses.length == 1){
        pop_schedule(body,container,login_account.courses)
    } else if (login_account.courses.length == 0 && mode == 99){
        pop_empty_schedule(body,container)
    } else if (remove_conflicts(mode,login_account.courses) == []){
        pop_no_schedule(body,container)
    } else {
        schedule = remove_conflicts(mode,login_account.courses)
        pop_schedule(body,container,schedule)
    }
}

//Populate schedule for display purposes 
function pop_display_schedule(body,listofsections,mode){
    const timetableSchedule = $('<table id="displaytimetableSchedule" style="width:100%;">');
    const thread = $('<thead>');
        const tr = $('<tr>');
            const th0 = $('<th class="scheduletopNav" style="width:10.0%;">&nbsp;</th>');
            const th1 = $('<th class="scheduletopNav" style="width:18%;">Monday</th>');
            const th2 = $('<th class="scheduletopNav" style="width:18%;">Tuesday</th>');
            const th3 = $('<th class="scheduletopNav" style="width:18%;">Wednesday</th>');
            const th4 = $('<th class="scheduletopNav" style="width:18%;">Thursday</th>');
            const th5 = $('<th class="scheduletopNav" style="width:18%;">Friday</th>');
        tr.append(th0,th1,th2,th3,th4,th5);
    thread.append(tr);
    const tbody = $('<tbody id="scheduleBody">');
    //mode = 1: no sections 2: at least one section 
    if (mode == 1){
        timetableSchedule.append(thread,populateTbody(tbody,[9,18],new Course("","",new Section())));
    } else if (mode == 2){
        timetableSchedule.append(thread,populateTbody(tbody,returnBodyHeight([new Course("","",listofsections)]),[new Course("","",listofsections)]))
    }
    return body.append(timetableSchedule)
}

//Populate view when no courses exists
function pop_empty_schedule(body, container){
    const web_name = $('<h2 id="scheduleselectTitle" class="display-5" align="center">Add a course to create a schedule</h2>')
    container.append(web_name)
    body.append(container)
}

//Populate view when no schedules can be made 
function pop_no_schedule(body, container){
    const web_name = $('<h2 id="scheduleselectTitle" class="display-5" align="center">No schedules can be made</h2>')
    container.append(web_name)
    body.append(container)
}

//Populate schedule
function pop_schedule(body,container,schedule){
    const web_name = $(`<h2 id="selectTitle" class="display-5" align="center">Schedule for ${login_account.first_name} ${login_account.last_name}</h2>`);
    const scheduleSortByButton = $(`<div id="scheduleDropDown" class="dropdown show">
    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="scheduledropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Show by
    </a>`)
    //create dropdown menu 
    const scheduledropdownmenu = $('<div class="dropdown-menu" aria-labelledby="scheduledropdownMenuLink"><a class="dropdown-item" onclick="create_schedule_view(0)">No conflicts</a><a class="dropdown-item" onclick="create_schedule_view(1)">Least time spent on campus</a>')
    scheduleSortByButton.append(scheduledropdownmenu)
    // Create the row that will contain the days and populate the body of the html
    const timetableSchedule = $('<table class="timetableSchedule" style="width:100%;">');
        const thread = $('<thead>');
            const tr = $('<tr>');
                const th0 = $('<th class="scheduletopNav" style="width:10.0%;">&nbsp;</th>');
                const th1 = $('<th class="scheduletopNav" style="width:18%;">Monday</th>');
                const th2 = $('<th class="scheduletopNav" style="width:18%;">Tuesday</th>');
                const th3 = $('<th class="scheduletopNav" style="width:18%;">Wednesday</th>');
                const th4 = $('<th class="scheduletopNav" style="width:18%;">Thursday</th>');
                const th5 = $('<th class="scheduletopNav" style="width:18%;">Friday</th>');
            tr.append(th0,th1,th2,th3,th4,th5);
        thread.append(tr);
        const tbody = $('<tbody id="scheduleBody">');
    timetableSchedule.append(thread,populateTbody(tbody,returnBodyHeight(schedule),schedule));
    container.append(web_name,scheduleSortByButton,timetableSchedule);
    body.append(container);
}


/*-----------------------------------------------------------*/
/* Functions */
/*-----------------------------------------------------------*/
//This function will be called when the return button is clicked
//It will call the DOM initialization for the course selection html and populate the course list
function returnToSelection(){
    create_course_selection_screen()
    // popSelectedCourseForm()
}

//Find the earliest class and latest class to determine the height of the table
function returnBodyHeight(schedule){
    //Create variables that will hold the earliest and latest class
    let earliest = 24;
    let latest = 0;
    //Loop through courses
    for (let i = 0; i < schedule.length; i++){
        //Loop through course sections
        for (let n = 0; n < schedule[i].sections.length; n++){
            //Loop throught the meets
            for (let j = 0; j < schedule[i].sections[n].meet.length; j ++){
                //Check if start time is earliest, if it is update the earliest variable
                if(parseInt(schedule[i].sections[n].meet[j][1]) <= earliest){earliest = schedule[i].sections[n].meet[j][1];}
                //Check if end time is latest, if it is update the latest variable
                if(parseInt(schedule[i].sections[n].meet[j][2]) >= latest){latest = schedule[i].sections[n].meet[j][2];}
            }
        }
    }
    //Add two rows to the earliest and the latest if the earliest class is not earlier than 2 am
    //and the latest class is not later than 9 pm to make the schedule look better
    if (2<parseInt(earliest) && parseInt(latest)<22){
        return [parseInt(earliest)-2,parseInt(latest)+2];
    } else {
        return [parseInt(earliest),parseInt(latest)];
    }
}

//Populate the start of the column with the appropriate times according to the earliest and latest class
//The function takes in an element and the length of the table based on the course times
function populateTbody(tbody,lenOfTable,schedule){
    //lenOfTable: [0] = earliest time, [1] = latest time
    for (let i = lenOfTable[0]; i < lenOfTable[1]; i++){
        //Create each cell per column
        let tr = $('<tr>');
        tr.append($(`<td class="scheduleTime">${i}:00</td>`))
        //Since there are 6 columns from monday to friday, the first column holding all the times
        //the first index is skipped because it is already populated with times and loops 5 times
        //because there are five days
        for (let n = 0; n < 5; n++){
            //populate the tr element that will be added row
            tr = populateTrElement(i,n,tr,schedule);
        }
        tbody.append(tr);
    }
    return tbody;
}

//Populates the tr element according to the course schedule. There are 3 possible cases when populating the
//the tr element. 1: a courses exits in the matrix so the tr element is populated with the course with a row
//span equivalent to the length of the course. 2. a courses already exists so a tr element empty. 3: the tr
//is populated with an empty space.
function populateTrElement(time,day,tr,schedule){
    //Loop through the courses
    for (let i = 0; i < schedule.length; i++){
        //Loop through the course sections
        for (let n = 0; n < schedule[i].sections.length; n++){
            //Loop through the course sections meet
            for (let j = 0; j < schedule[i].sections[n].meet.length; j ++){
                //Checks if the tr shoule be populated with the cours
                if(parseInt(schedule[i].sections[n].meet[j][1])===time && schedule[i].sections[n].meet[j][0]==day){
                    const classLength = parseInt(schedule[i].sections[n].meet[j][2]) - parseInt(schedule[i].sections[n].meet[j][1]);
                    //Change the height of the td element according to the length of the course
                    const td = $(`<td class="course${i}section${n} scheduleCourse" rowspan='${classLength}'>`);
                        //Populate the tr element
                        const courseCode = $(`<div class="scheduleCourseCode">${schedule[i].courseCode}</div>`);
                        const courseSection = $(`<div class="scheduleCourseSection">${schedule[i].sections[n].type} ${schedule[i].sections[n].code}</div>`);
                        const courseTime = $(`<div class="scheduleCourseTime">${schedule[i].sections[n].meet[j][1]}:00-${schedule[i].sections[n].meet[j][2]}:00</div>`);
                        td.append(courseCode,courseSection,courseTime);
                    tr.append(td);
                    return tr;
                //If there already exists a course that is not the start time
                } else if (parseInt(schedule[i].sections[n].meet[j][0])===day && parseInt(schedule[i].sections[n].meet[j][1])<time && time<parseInt(schedule[i].sections[n].meet[j][2])){
                    return tr;
                }
            }
        }
    }
    //If no courses are in the time frame
    tr.append($(`<td class="scheduleEmptyCell">&nbsp;</td>`));
    return tr;
}
