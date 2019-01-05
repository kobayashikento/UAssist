//JS file that contains all of the helper functions for the add_courses.js 

//Checks if the section(code and type) already exists in the list of sections to be added
//to the course, because the same section cannot have a time confliction with its self
function sectionExists(code, type, listOfSection){
    for (let k = 0; k < listOfSection.length; k++){
        // If the section type and code already exsits return true
        if (code === listOfSection[k].code && type=== listOfSection[k].type){
            return true;
        }
    }
    return false;
}

//Convert string input from type=time to digit
function convertTimeToDigit(time){
    let splittime = time.split("")
    if (splittime[0]=="0"){
        return parseInt(splittime[1])
    } else {
        return parseInt(splittime[0]+splittime[1])
    }
}


//Checks if the class time is a valid i.e. check if the start time and end times
//are valid (you cant end before you start)
function validClassTime(startHour,endHour){
    const diff = endHour - startHour;
    if (diff==0 || diff<0){
        return false;
    } else {
        return true;
    }
}

//Return the day
function toDay(dayInt){
    switch(dayInt){
        case 0:
        return "Monday"
        case 1:
        return "Tuesday"
        case 2:
        return "Wednesday"
        case 3:
        return "Thursday"
        case 4:
        return "Friday"
    }
}


//find course using course code 
function findCourseByCoursecode(courseCode){
    for (let i = 0; i < login_account.courses.length; i ++){
        if (login_account.courses[i].courseCode == courseCode){
            return login_account.courses[i]
        }
    } 
}

//Functions that checks for an invalid input when adding a course
function checkCollision(listOfSections){
    for (let section = 0; section < listOfSections.length; section++){
        const time = listOfSections[section].meet;
        // Checks to see if the current sections that we are checking are of the
        // the same type and they have the same code
        // If they are and they conflict then we want to return that there is a
        // collision that is found

        for (let i = 0; i < time.length; i++) {
            for (let j = 0; j < time.length; j++) {
                if (j != i && checkConflict(time[i], time[j])) {
                    return true;
                }
            }
        }
        let tutorialFound = false;
        let tutorialValid = false;
        // Checks to see if we have found a tutorial
        // And if a tutorial is found then check to see if there exists a lecture section for
        // tutorial. If there is then set that tutorial to be valid
        if (listOfSections[section].type === "TUT") {
            tutorialFound = true
        }
        for (let lecture_section = 0; lecture_section < listOfSections.length; lecture_section++){
            // Want to compare section i to all other sections j
            if (section != lecture_section) {
                const lecture_time = listOfSections[lecture_section].meet;
                // If section i is a tutorial and section j is a course then check to see
                // if section i is supported by section j
                if (tutorialFound){
                    if (listOfSections[lecture_section].type === "LEC") {
                        for (let i = 0; i < time.length; i++) {
                            for (let j = 0; j < lecture_time.length; j++) {
                                if (!checkConflict(time[i], lecture_time[j])) {
                                    tutorialValid = true;
                                }
                            }
                        }
                    }
                }

            }
        }
        // Checks to see if there is a tutorial that doesn't have a supporting course
        if (tutorialFound && !tutorialValid) {
            return true;
        }
    }
    return false
}