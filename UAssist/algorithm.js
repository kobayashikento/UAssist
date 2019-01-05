/*
  Javascript file responsible for determining the order of the clases/ tutorials
 */

// Generate all possible section assignments for the chosen courses
function generate_all_possible_solns(unfiltered_courses, isTutorial){
  queue = []
  final_list_of_courses = []

  // queue = [[[2] [2] [2] [2]], [[2] [2] [2]]]
  // Each element in the queue is a path to a section
  // [2] = [index, section]
  //
  if (unfiltered_courses.length > 0) {
    for (let i = 0; i < unfiltered_courses[0].sections.length; i++) {
      section = unfiltered_courses[0].sections[i]
      // Initialize the queue
      if ((section.type === "LEC" && !isTutorial) || (section.type === "TUT" && isTutorial)) {
        queue.push([[0, section]]) // 0 indicates the index of the section used for matching tutorials to courses
      }
    }
  }

  let depth = 0
  // BFS to get all possible assignments
  while (queue.length > 0) {
    path_of_section = queue.splice(0,1)[0]
    console.log(path_of_section)
    // Checks to see if we are at a terminating node NEED TO FIX
    // NEED SOME OTHER WAY TO CHECK IF AT TERMINATING NODE
    if (depth + 1 === unfiltered_courses.length) {
      final_list_of_courses.push(path_of_section);
    }

    else {
      // Get all child leafs
      let hasAdded = false
      const index = path_of_section[path_of_section.length - 1][0]
      if (depth === index) {
        depth += 1
      }
      for (let i = 0; i < unfiltered_courses[index + 1].sections.length; i++) {

        // Add child leaf to open
        new_section = unfiltered_courses[index + 1].sections[i]
        if ((new_section.type === "LEC" && !isTutorial) || (new_section.type === "TUT" && isTutorial)) {
          hasAdded = true
          section_copy = path_of_section.slice()
          section_copy.push([index + 1, new_section])
          queue.push(section_copy)
        }
      }

      if (!hasAdded) {
        section_copy = path_of_section.slice()
        section_copy.push([index + 1, null])
        queue.push(section_copy)
      }
    }
  }

  final_list_of_courses = remove_null(final_list_of_courses);
  console.log(final_list_of_courses)
  return final_list_of_courses;
}

//
function remove_null(list) {
  for (let path = 0; path < list.length; path ++){
    let section_path = list[path]
    let new_path = []
    for (let i = 0; i < section_path.length; i++) {
      if (section_path[i][1] != null) {
        new_path.push(section_path[i])
      }
    }
    list[path] = new_path
  }
  return list
}

// Removes the conflicts found in the provided courses sections
// Returns the first course sections which don't give a time conflict
function remove_conflicts(preference, unfiltered_courses) {
  let isBetter = random
  if (preference !== 0) {
    isBetter = leastDays
  }
  lecture = generate_all_possible_solns(unfiltered_courses, 0);
  tutorial = generate_all_possible_solns(unfiltered_courses, 1);
  final = []
  console.log(lecture, tutorial)
  // Merge the tutorial and lecture time together into one array known as
  // the final array
  for (let lec = 0; lec < lecture.length; lec++) {
    let schedule = []
    for (let courseNo = 0; courseNo < lecture[lec].length; courseNo ++) {

      // Add the course
      schedule.push(lecture[lec][courseNo][1])
      for (let tut = 0; tut < tutorial.length; tut++) {
        for (let tutNo = 0; tutNo < tutorial[tut].length; tutNo ++) {
          if (tutorial[tut][tutNo][0] == courseNo) {

            // Add the tutorial
            schedule.push(tutorial[tut][tutNo][1])
          }
        }
      }
    }
    final.push(schedule)
  }
  console.log(final)
  // Iterate through the final array which is going to be a list of
  // possible schedules which may contain conflicts.
  // Return the first schedule which doesn't have a conflict
  let bestChoice = [];
  for (let scheduleNo = 0; scheduleNo < final.length; scheduleNo ++) {
    schedule = final[scheduleNo]
    collision = 0
    for (let j = 0; j < schedule.length; j++) {
      for (let i = 0; i < schedule.length; i++) {
        if (i !== j) {
          time = schedule[j].meet;
          lecture_time = schedule[i].meet;
          for (let a = 0; a < time.length; a++) {
            for (let b = 0; b < lecture_time.length; b++) {
                if (checkConflict(time[a], lecture_time[b])) {
                collision = 1;
              }
            }
          }
        }
      }
    }


    // If the current schedule does not have conflict
    if (!collision) {
      // schedule is a list
      console.log("collision")
      console.log(schedule)
      new_courses = unfiltered_courses.slice()
      counter = 0
      for (let c = 0; c < schedule.length; c++) {
        if (schedule[c].type === "LEC") {
          new_courses[counter].sections = []
          counter++
        }
        new_courses[counter - 1].sections.push(schedule[c])
      }

      // Check to see if the best choice is nothing or if the current choice is
      // better than the previous choice
      console.log(new_courses)
      if (bestChoice.length === 0 || isBetter(new_courses, bestChoice)) {
        bestChoice = new_courses
      }
    }
  }

  // If there are no schedules that have no time conflicts
  return bestChoice
}


/*
  Determines if the current schedule is better than a previous schedule based
  on the user preferences. If it is return true otherwise return false
*/

// Randomly deteremines if current is better than previous
function random(currentSelection, previousSelection) {
  return Math.random() >= 0.5; // Randomly chooses whether or not it is better
}

// Determines if currentSelection has less days than previousSelection
function leastDays(currentSelection, previousSelection) {
  currentSelectionDays = []
  previousSelectionDays = []

  if (currentSelection.length !== previousSelection.length) {
    log("HUGE ERROR NOT THE SAME LENGTH")
  }

  currentSelectionDays = getDays(currentSelection)
  previousSelectionDays = getDays(previousSelection)

  return currentSelectionDays.length < previousSelectionDays.length
}

function getDays(selection) {
  days = []
  for (let i = 0; i < selection.length; i++){
    sections = selection[i].sections;
    for (let j = 0; j < sections.length; j++) {
      let day = sections[j].meet[0]
      if (!days.includes(day)) {
        days.push(day)
      }
    }
  }
  return days
}

// Determines if currentSelection has less time waiting on campus than
// previousSelection
function leastWaiting(currentSelection, previousSelection) {
}
