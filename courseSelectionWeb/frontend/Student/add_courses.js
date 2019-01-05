/* This java script is responsible for handling the course selection for the user. The user will be able to select
courses which will be validated when the add course button is clicked. Invalid inputs such as class ending before
it starts, the section with confliting times, if the user doesnt enter or forgets to enter an input, if there is no
courses added a list to create schedule, if a tutorial time is added without a section time are all considered.
The user is informed before hand no schedules can be made*/

// Global arrays
'use strict';
let global_listOfSection = [];
let listflag = false;
let courseflag = null;


/*-----------------------------------------------------------*/
/* DOM INITIALIZATION */
/*-----------------------------------------------------------*/
//Create a row element that will be used to populate the container
function create_course_selection_screen(){
    const container = $('#information_container');
    container.empty();
    //Reset global variables 
    global_listOfSection = [];
    listflag = false;
    courseflag = null;

    const selectdisplayRow = $('<div class="row justify-content-start" id="selectdisplayRow">');
        //Create the col that will contain the selection of courses
        const optionsCol = $('<form id="selectoptionCol" class="col-6" onsubmit="return addToList(event)">')
            //Create form for Course code label
            const formLabel1 = $('<div class="form-row">');
                const l1 = $('<label class="selectText">Course Code</label>');
            formLabel1.append(l1);

            //Create the form that will search by course option
            const searchCourseForm = $('<div class="form-row">');
                // Create another div for design
                const d1 = $('<div class="col-7 input-group mb-3">');
                    const s1 = $('<label class="input-group-text">Course Name</label>');
                    const i1 = $('<input type="text" id="courseNameText" class="form-control" placeholder="i.e.Programming on the Web" required pattern="[a-zA-Z0-9_ ]+">');
                    d1.append(s1,i1);
                const d2 = $('<div class="col-5 input-group mb-3">');
                    const s2 = $('<label class="input-group-text">Course Code</label>');
                    const i2 = $('<input id="courseCode" class="form-control" placeholder="i.e.CSC209" required pattern="[A-Z]{3}\\d{3}">');
                    d2.append(s2,i2);
            searchCourseForm.append(d1,d2);

            //Create form for Lecture/Tutorial section label
            const formLabel2 = $('<div class="form-row">');
                const l2 = $('<label class="selectText">Lecture/Tutorial Section</label>');
            formLabel2.append(l2);

            //Create empty form for class time
            const courseInfo = $('<div id="classTimeForm" class="form-row">');

            //Buttons Row
            const addCourseButtonRow = $('<div id="selectCourseButtonRow" class="row" style="list-style-type:none">');
                const addlecturetimeButton = $('<button class="col-auto btn btn-primary selectButton">Add Time</button>');
                const addCourseButton = $('<input id="addCourseButton" class="col-auto btn btn-primary selectButton" style="width:120px" value="Add Course">');
                addCourseButton.on("click", addToList)
                addlecturetimeButton.on("click",addLectureTimes);
            addCourseButtonRow.append(addlecturetimeButton,addCourseButton);
        optionsCol.append(formLabel1,$('<p id="seletaddnewcoursetext">Add a new course</p>'),searchCourseForm,formLabel2,courseInfo,addCourseButtonRow);

        //Create the col that will display the courses
        const displayCol = $('<form id="selectDisplayCol" class="col-5">');
            //Create a row that will contain the selected courses and searched courses
            const displayRow = $('<div class="row" >');
                //Create the two cols "searched course table" and "selected course table"
                //Selected Col
                const selectedCol = $('<div class="col selectText";>Selected Courses</div>')
                    const seletedTableRow = $('<div class="table-responsive" id="selectedTableRow">')
                        const selectedTable = $(`<table id="selectcoursetable" class="table table-bordred"><thead><tr><th class="selectcoursetabletext">Course Code</th>
                        <th class="selectcoursetabletext">Course Name</th><th class="selectcoursetabletext">View</th><th class="selectcoursetabletext">Edit</th><th class="selectcoursetabletext">Delete</th>`)
                        selectedTable.append($(`<tbody id=selectcoursetablebody>`))
                        seletedTableRow.append(selectedTable)
                selectedCol.append($('<p class="selectDescriptionText">Manage Courses</p>'),seletedTableRow);
            displayRow.append(selectedCol);
        //Create a row that will contain the "return to menu" and "create schedule" buttons
        const createScheduleBotton = $('<button id="createSchedule" class="selectButton btn btn-primary">Create Schedule</button>');
        createScheduleBotton.on("click",createSchedule);
        //Append the button row and list view together
        displayCol.append(displayRow,createScheduleBotton);
        //Append the right columnm and left column together
        selectdisplayRow.append(optionsCol);
        selectdisplayRow.append(displayCol);
    //Create the row for buttons
    container.append(selectdisplayRow);

    if (login_account.courses.length == 0){
        //Do nothing
    } else {
        popSelectedCourseForm(login_account.courses)
    }
}

/*-----------------------------------------------------------*/
/* DOM MANIPULATION */
/*-----------------------------------------------------------*/
//This functions is called when the add course button is pressed
//This function validates if the user input was invalid if it is not it will alert the user
//If the input was valid is creates a new course and adds the course to the list of courses
//which will be used create the time schedule
function addToList(event){
    event.preventDefault();

    //Check if at least one start time was added
    if (global_listOfSection.length===0){
        alert("Add a class time");
        return false;
    }
    //Check if course already exists
    for (let k = 0; k < login_account.courses.length; k++){
        if ($('#courseCode')[0].value===login_account.courses[k].courseCode){
            alert("Course already exists");
            return false;
        }
    }
    //Check if course code is valid
    if (!$('#courseCode')[0].checkValidity()){
        alert("Course code not valid (3 Upper case characters followed by 3 digits)");
        return false
    }
    //Check if there are any collisons in sections
    if (checkCollision(global_listOfSection)){
        alert("Section Time Collision/No LEC type found");
        return false;
    }
    //If there the user input was valid the code will execute until this line
    login_account.courses.push(new Course($('#courseNameText')[0].value,$('#courseCode')[0].value,global_listOfSection));
    //Reset global_list of sections and counter 
    global_listOfSection = [];
    listflag = false;
    //Reset the course selecting window
    create_course_selection_screen();

}

//Function add section to a temp section array while doing validation checks
function addToListOfSections(target,sectionCode,sectionType){
    let listOfSectionForm = target
    
    //Get day, start hour, and end hour
    let lecture_times = []
    const monday = [0,listOfSectionForm.querySelector('.monday_start_input').value,listOfSectionForm.querySelector('.monday_end_input').value]
    const tuesday = [1,listOfSectionForm.querySelector('.tuesday_start_input').value,listOfSectionForm.querySelector('.tuesday_end_input').value]
    const wednesday = [2,listOfSectionForm.querySelector('.wednesday_start_input').value,listOfSectionForm.querySelector('.wednesday_end_input').value]
    const thursday = [3,listOfSectionForm.querySelector('.thursday_start_input').value,listOfSectionForm.querySelector('.thursday_end_input').value]
    const friday = [4,listOfSectionForm.querySelector('.friday_start_input').value,listOfSectionForm.querySelector('.friday_end_input').value]
    lecture_times.push(monday,tuesday,wednesday,thursday,friday)

    // Iterate through the 5 days in the week to determin if each time entered is valid
    let filtered_times = []
    for (let i = 0; i < lecture_times.length; i++) {
        if (lecture_times[i][1]==""&&lecture_times[i][2]!="" || lecture_times[i][2]==""&&lecture_times[i][1]!=""){
            alert(`${toDay(lecture_times[i][0])} incomplete or missing time`)
            return false
        } else if (lecture_times[i][1]!=""&&lecture_times[i][2]!=""){
            if(validClassTime(convertTimeToDigit(lecture_times[i][1]),convertTimeToDigit(lecture_times[i][2]))==false){
                alert(`${toDay(lecture_times[i][0])} class duration not valid`)
                return false
            } else {
                filtered_times.push(lecture_times[i])
            }
        } else {}
    }
    //Check if a time was inputed
    if (filtered_times.length==0){
        alert(`Enter a class time`)
        return false
    }
    let meet = [];
    //Check if the section code and type already exists
    if (sectionExists(sectionCode,sectionType,global_listOfSection)==true){
        alert(`Duplicate section time and type`)
        return false
    //Create a new section
    } else {
        for (let j = 0; j < filtered_times.length; j ++){
            const startTime = Number(convertTimeToDigit(filtered_times[j][1]));
            const finishTime = Number(convertTimeToDigit(filtered_times[j][2]));
            meet.push([Number(filtered_times[j][0]),startTime,finishTime]);
            }
        }
    global_listOfSection.push(new Section(meet,sectionCode,sectionType));
    //Check if there is collision in the sections lecture time or tutorial time    
}

//This function is called when "create schdule button" is clicked. the function is called
//this function is called only when the input is valid
function createSchedule(e){
    e.preventDefault();
    if(login_account.courses.length==0){
        alert("Add a course");
        return false;
    } else if (login_account.courses.length==1){
        create_schedule_view(99);
    }else {
        if (remove_conflicts(0,login_account.courses).length==0){
            alert("No Schedules can be made");
            return false;
        } else {
            create_schedule_view(0)
        }
    }
}

//populate display modal
function populateDisplayModal(modalbody,courseCode){
    modalbody.empty()
    pop_schedule(modalbody,$(`<div class="container" id="scheduleContainer">`),[findCourseByCoursecode(courseCode)])
    modalbody.children(2).children(0)[0].innerText = "Course Time"
    modalbody.children(2).children(0)[1].remove()
}

//populate the edit schedule functionalities for the edit modal
function popEditScheduleModal(course){
    $('#select-list-tab').empty()
    $('#nav-tabContent').empty()
    //Populate the left side and right side 
    //Just for the first element to make it active 
    $('#select-list-tab').append($(`<a class="list-group-item list-group-item-action" id="list-${course.sections[0].code}${course.sections[0].type}-list" 
            data-toggle="tab" href="#list-${course.sections[0].code}${course.sections[0].type}" role="tab" aria-controls="${course.sections[0].code}${course.sections[0].type}">${course.sections[0].type}${course.sections[0].code}</a>`))
    $('#nav-tabContent').append($(`<div class="tab-pane fade active active in" id="list-${course.sections[0].code}${course.sections[0].type}" role="tabpanel" 
        aria-labelledby="list-${course.sections[0].code}${course.sections[0].type}-list">`))
    $(`#list-${course.sections[0].code}${course.sections[0].type}`).append(createTimeInput())
    $(`#list-${course.sections[0].code}${course.sections[0].type}`).append(poptimeinput(`list-${course.sections[0].code}${course.sections[0].type}`,course.sections[0]))
    //Create modal elements that are not active if there are more than 1 element 
    for (let n = 1; n < course.sections.length; n ++){
        $('#select-list-tab').append($(`<a class="list-group-item list-group-item-action" id="list-${course.sections[n].code}${course.sections[n].type}-list" 
            data-toggle="tab" href="#list-${course.sections[n].code}${course.sections[n].type}" role="tab" aria-controls="${course.sections[n].code}${course.sections[n].type}">${course.sections[n].type}${course.sections[n].code}</a>`))
        $('#nav-tabContent').append($(`<div class="tab-pane fade" id="list-${course.sections[n].code}${course.sections[n].type}" role="tabpanel" 
        aria-labelledby="list-${course.sections[n].code}${course.sections[n].type}-list">`))
        $(`#list-${course.sections[n].code}${course.sections[n].type}`).append(createTimeInput())
        $(`#list-${course.sections[n].code}${course.sections[n].type}`).append(poptimeinput(`list-${course.sections[n].code}${course.sections[n].type}`,course.sections[n]))
    }
}            

//populate the time inputs for editing and populate the time inputs with the existing times 
function poptimeinput(listname,courseSection){
    for (let i = 0; i < courseSection.meet.length; i++){
        let starttime = courseSection.meet[i][1]
        let endtime = courseSection.meet[i][2]
        if (/^\d$/.test(starttime)){
            starttime = '0'+starttime} 
        if (/^\d$/.test(endtime)){
            endtime = '0'+endtime
        }
        switch (courseSection.meet[i][0]){
            case 0:
                $(`#${listname} .monday_start_input`).val(`${starttime}:00`) 
                $(`#${listname} .monday_end_input`).val(`${endtime}:00`) 
                break;
            case 1:
                $(`#${listname} .tuesday_start_input`).val(`${starttime}:00`) 
                $(`#${listname} .tuesday_end_input`).val(`${endtime}:00`) 
                break;
            case 2:
                $(`#${listname} .wednesday_start_input`).val(`${starttime}:00`) 
                $(`#${listname} .wednesday_end_input`).val(`${endtime}:00`) 
                break;
            case 3:
                $(`#${listname} .thursday_start_input`).val(`${starttime}:00`) 
                $(`#${listname} .thursday_end_input`).val(`${endtime}:00`) 
                break;
            case 4:
                $(`#${listname} .friday_start_input`).val(`${starttime}:00`) 
                $(`#${listname} .friday_end_input`).val(`${endtime}:00`) 
                break;
        }
    }
}

//Populate the right side of the list (the list of courses). TAKES IN AN ARRAY OF COURSE OBJECTS
function popSelectedCourseForm(courses){
    $("#selectcoursetablebody").empty()
    $('.modal').remove()

    //Create the modal for displaying the course 
    let modaldisplay = $(`<div class="modal fade" id="modal-display" role="dialog"> <div id="modal-dialog-display" class="modal-dialog">`)
    $(document.body).append(modaldisplay)
    let modalContentDisplay = $('<div class="modal-content" id="selectModalContent">')
        let modalHeaderDisplay = $('<div class="modal-header"><img id="selectmodalicon" src="./Graphical_Assets/Logo/Uassist White.png"><button type="button" class="close" data-dismiss="modal">&times;</button>')
        let modalBodyDisplay = $(`<div class="modal-body" id="modal-body-display">`)
        let modalFooterDisplay = $(`<div id="selectModalFooter-display" class="modal-footer">`)
    modalContentDisplay.append(modalHeaderDisplay,modalBodyDisplay,modalFooterDisplay)
    $(`#modal-dialog-display`).append(modalContentDisplay)
    $(`#selectModalFooter-display`).append($(`<div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>`))

    //Create the modal for editing a course 
    let modaledit = $(`<div class="modal fade" id="editScheduleModal" role="dialog"> <div id="modal-dialog-edit" class="modal-dialog">`)
        $(document.body).append(modaledit)
        let modalContent = $('<div class="modal-content" id="selectModalContent">')
        let modalHeader = $('<div class="modal-header"><img id="selectmodalicon" src="./Graphical_Assets/Logo/Uassist White.png"><button type="button" class="close" data-dismiss="modal">&times;</button>')
        let modalBody = $(`<div class="modal-body"><div id="editmodal" class="row">`)
            //Create the left side of the body
            let leftmodalbody = $(`<div class="col-4"><div class="list-group" id="select-list-tab" role="tablist">`)
            //Create the right side of the body
            let rightmodalbody = $(`<div class="col-8"><div class="tab-content" id="nav-tabContent">`)
            let modalFooter = $(`<div id="selectModalFooter" class="modal-footer"><button type="button" id="selectsavechangesbutton" class="input-group-4 btn btn-default">Save Changes</button>
            <button type="button" onclick="global_listOfSection = []" class="input-group-4 btn btn-default" data-dismiss="modal">Cancel</button>`)
        modalContent.append(modalHeader,modalBody,modalFooter)
    $(`#modal-dialog-edit`).append(modalContent)
    $(`#editmodal`).append(leftmodalbody,rightmodalbody)
    $('#select-list-tab a').click(function(event) {
        event.preventDefault()
        $('#nav-tabContent').empty()
        $(this).tab('show')
    })
    $(`#selectsavechangesbutton`).click(function(event){
        event.preventDefault()
        global_listOfSection = []
        for (let w = 0; w < $('#select-list-tab').children().length; w ++){
            if (addToListOfSections($('#nav-tabContent')[0].children[w],courseflag.sections[w].code,courseflag.sections[w].type)==false){
                return false
            }
        }
        for (let m = 0; m < login_account.courses.length; m++){
            if(login_account.courses[m].courseCode==courseflag.courseCode){
                login_account.courses[m].sections = global_listOfSection
            }
        }
        courseflag = null
        $('#editScheduleModal').modal('hide')
    })

    //Create the list of courses for populating the right side of the div
    for (let i = 0; i < courses.length; i++){
        const cd = courses[i].courseCode;
        const cn = courses[i].name
            const bodytr = $(`<tr class="select-tr-body" id="select-tr-body-${cd}"><td class="selectbodytrtext">${cd}</td><td class="selectbodytrtext">${cn}</td>`)
                //Create view functionality
                const viewtr = $(`<td><p data-placement="top" data-toggle="tooltip" title="View">
                <button id="selectviewbtn-${cd}" class="btn btn-primary btn-xs" data-title="View" data-toggle="modal" href="#modal-display" data-target="#modal-display">
                <span class="glyphicon glyphicon-eye-open"></span></button></p></td>`)
                //Create edit functionality
                const edittr = $(`<td><p data-placement="top" data-toggle="tooltip" title="Edit">
                <button id="selecteditbtn-${cd}" class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" href="#editScheduleModal" data-target="#editScheduleModal">
                <span class="glyphicon glyphicon-pencil"></span></button></p></td>`)
                //Create delete functionality 
                const deletetr = $(`<td><p data-placement="top" data-toggle="tooltip" title="Delete">
                <button class="selectdeletebtn btn btn-primary btn-xs" data-title="Delete" onclick="deleteCourse(event,'${cd}')">
                <span class="glyphicon glyphicon-trash"></span></button></p></td>`)
            bodytr.append(viewtr,edittr,deletetr)
            $('#selectcoursetablebody').append(bodytr)

        //Prevent default when buttons are clicked and add functions on click
        $(`#selectviewbtn-${cd}`).click(function(event){
            event.preventDefault()
            populateDisplayModal($('#modal-body-display'),cd)})
        $(`#selecteditbtn-${cd}`).click(function(event){
            event.preventDefault()
            courseflag = courses[i];
            popEditScheduleModal(findCourseByCoursecode(cd))})
        $('#selectdeletebtn').click(function(event){event.preventDefault()})
    }
}

//Delete a course at the selected index from the list of course
function deleteCourse(event, courseCode){
    event.preventDefault()
    for (let i = 0; i < login_account.courses.length; i++){
        if (courseCode==login_account.courses[i].courseCode){
            login_account.courses.splice(i,1);
            break;
        }
    }
    create_course_selection_screen()
}

//Delete a section time at the selected index from the list of sections on the left side
function removeClassTime(e){
    e.preventDefault();
    $(this).closest('.form').remove();
}

//Create time inputs 
function createTimeInput(){
    // Initialize the days of the week
    let days_of_input = $('<div id="days-of-week">');
    let monday = $('<div class="form-check form-check-inline day">');
      let monday_text = $('<label class="day_text">Monday : </label>');
      let monday_start_input = $(`<input type="time" class="monday_start_input" step='3600' min="00" max="24" class="day_input">`);
      let monday_end_input = $(`<input type="time" class="monday_end_input" step='3600' min="00" max="24" class="day_input">`);
      monday.append(monday_text, $('<label class="start_text">Start</label>'), monday_start_input,$('<label class="start_text">End</label>'),monday_end_input)
    let tuesday = $(`<div class="form-check form-check-inline day">`);
      let tuesday_text = $('<label class="day_text">Tuesday : </label>');
      let tuesday_start_input = $(`<input type="time" class="tuesday_start_input" step='3600' min="00" max="24" class="day_input">`);
      let tuesday_end_input = $(`<input type="time" class="tuesday_end_input" step='3600' min="00" max="24" class="day_input">`);
      tuesday.append(tuesday_text, $('<label class="start_text">Start</label>'), tuesday_start_input,$('<label class="start_text">End</label>'),tuesday_end_input)
    let wednesday = $(`<div class="form-check form-check-inline day">`);
      let wednesday_text = $('<label class="day_text">Wednesday : </label>');
      let wednesday_start_input = $(`<input type="time" class="wednesday_start_input" step='3600' min="00" max="24" class="day_input">`);
      let wednesday_end_input = $(`<input type="time" class="wednesday_end_input" step='3600' min="00" max="24" class="day_input">`);
      wednesday.append(wednesday_text, $('<label class="start_text">Start</label>'), wednesday_start_input,$('<label class="start_text">End</label>'),wednesday_end_input)
    let thursday = $(`<div class="form-check form-check-inline day">`);
      let thursday_text = $('<label class="day_text">Thursday : </label>');
      let thursday_start_input = $(`<input type="time" class="thursday_start_input" step='3600' min="00" max="24" class="day_input">`);
      let thursday_end_input = $(`<input type="time" class="thursday_end_input" step='3600' min="00" max="24" class="day_input">`);
      thursday.append(thursday_text, $('<label class="start_text">Start</label>'), thursday_start_input,$('<label class="start_text">End</label>'),thursday_end_input)
    let friday = $(`<div class="form-check form-check-inline day">`);
      let friday_text = $('<label class="day_text">Friday : </label>');
      let friday_start_input = $(`<input type="time" class="friday_start_input" step='3600' min="00" max="24" class="day_input">`);
      let friday_end_input = $(`<input type="time" class="friday_end_input" step='3600' min="00" max="24" class="day_input">`);
      friday.append(friday_text, $('<label class="start_text">Start</label>'), friday_start_input,$('<label class="start_text">End</label>'),friday_end_input)
    days_of_input.append(monday, tuesday, wednesday, thursday, friday);
    return days_of_input;
}

//Add a lecture time (section type/time input options)
function addLectureTimes(e){
    e.preventDefault();

    //Create a calender 
    if (listflag == false){
        listflag = true
        $('#selectDisplayCol').empty()
        pop_display_schedule($('#selectDisplayCol'),global_listOfSection,1)
    } else {
        const target = $('#classTimeForm')[0].children[0]
        //Section Code
        const sectionCode = target.querySelector('#sectionCode')
        if (!sectionCode.checkValidity()){
            alert("Enter a valid section code(4 digits): i.e. 3010");
            return false
        }
        //Section Type
        const sectionType = target.querySelector('#sectionType')
        if (!sectionType.checkValidity()){
            alert("Choose a section type");
            return false
        }
        if(addToListOfSections(target,sectionCode.value,sectionType.value)==false){
            return false
        }   
        $('#classTimeForm').empty()
        $('#selectDisplayCol').empty()
        if (global_listOfSection.length == 0){
            pop_display_schedule($('#selectDisplayCol'),global_listOfSection,1)
        } else {
            pop_display_schedule($('#selectDisplayCol'),global_listOfSection,2)
        } 
    }

    const form = $('#classTimeForm');
    //Populate the class time form
    let f1 = $(`<form id="lectureTime" class="form lectureTimeForm">`);
        let label1 = $(`<label>Section Time</label>`);
        let f3 = $(`<div class="form-group">`);
            const f4 = $(`<div class="form-row">`);
                const col5 = $('<div class="col"></div>');
                const label5 = $('<label>Section Code</label>');
                col5.append(label5);
                const col6 = $('<div class="col"></div>');
                const label6 = $('<label>Section Type</label>');
                col6.append(label6);
            f4.append(col5,col6);
            //Create the input text fro the lecture code
            const f5 = $(`<div class="form-row">`);
                    const section = $('<div class="col mb-3">');
                    const sectionNumberInput = $(`<input id="sectionCode" class="form-control" placeholder="i.e. 0101,0202" required pattern="[0-9]{4}">`);
                section.append(sectionNumberInput);
            const sectionType = $('<div class="col mb-3">');
            //Create the drop down menu to select between LEC and TUT
            const sel4 = $(`<select class="custom-select" id="sectionType" required>`);
                const o13 = $('<option value="">Choose...</option>');
                const o14= $('<option value="LEC">LEC</option>');
                const o15 = $('<option value="TUT">TUT</option>');
                sel4.append(o13,o14,o15);
            const v4 = $('<div class="invalid-feedback">Enter Class Type</div>');
            sectionType.append(sel4,v4);
            f5.append(section,sectionType);
        f3.append(f4,f5);
    // f1.append(label1,f2,timepreferenceForm,f3);
    f1.append(label1,createTimeInput(),f3);
    form.append(f1);
    if ($('#selectCourseButtonRow').children().length < 3){
        const schedulereturn = $('<button class="col-auto btn btn-primary selectButton">Cancel</button>');
        schedulereturn.on("click",create_course_selection_screen)
        $('#selectCourseButtonRow').prepend(schedulereturn)
    }
}
