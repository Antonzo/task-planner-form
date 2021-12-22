// General settings
document.getElementById("main-form").addEventListener("submit", function(event) {
  event.preventDefault();
});

document.getElementById("input-task").addEventListener("keydown", function(event) {
  if (event.key === "Enter"){
    event.preventDefault();

    let inputTask = document.getElementById("input-task");
    addTask(inputTask.value);
    updateTasks();
    inputTask.value = '';
  }
 });


// Get date and time
const daysOfW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']

function dayPostfix(dayNum){
  if (dayNum >= 11 && dayNum <= 13)
    return dayNum + 'th';
  switch (dayNum % 10){
    case 1:
      return dayNum + 'st';
    case 2:
      return dayNum + 'nd';
    case 3:
      return dayNum + 'rd';
    default:
      return dayNum + 'th';
  }
}

function numTwoDigits(num){
  if (num < 10)
    return '0' + num;
  return num.toString(10);
}

function changeTimeFormat(hour, minute){
  if (hour == 0)
    return 12 + ':' + minute + ' AM';
  if (hour >= 13)
    return (hour - 12) + ':' + minute + ' PM';
  return hour + ':' + minute + ' AM';
}

let currentDate = {}

function initDate(){
  let userDate = new Date();

  currentDate.month = userDate.getMonth();
  currentDate.dayOfMonth = userDate.getDate();
  currentDate.dayOfWeek = userDate.getDay();
  currentDate.hour = userDate.getHours();
  currentDate.minute = userDate.getMinutes();

  currentDate.dateStr = userDate.getFullYear() + '-' + numTwoDigits(currentDate.month+1) 
                        + '-' + numTwoDigits(currentDate.dayOfMonth);
  currentDate.dateTimeStr = currentDate.dateStr + ' ' + currentDate.hour + ':' + currentDate.minute;
}

// Update number of tasks
function updateTasks(){
  let checkboxForm = document.getElementById("checkbox-form");
  let rightHeaderForm = document.getElementById("right-header-form").getElementsByTagName("p")[0];
  let numOfTasks = checkboxForm.children.length;

  rightHeaderForm.innerText = numOfTasks + (numOfTasks == 1 ? ' Task' : ' Tasks');
}


// When DOM content is loaded
document.addEventListener("DOMContentLoaded", function(event){
  // set current date and time
  initDate();
  let leftHeaderForm = document.getElementById("left-header-form");
  leftHeaderForm.innerHTML = '<p><time datetime="'+ currentDate.dateStr + '"><span id="day-from"><b>' + daysOfW[currentDate.dayOfWeek] 
        + '</b>, ' + dayPostfix(currentDate.dayOfMonth) + '</span><br>' + months[currentDate.month] + '</time></p>';

  // upload list of tasks from the localStorage
  if (localStorage.getItem('tasks') !== null){
    let taskList = JSON.parse(localStorage.getItem('tasks'));
    for (let task of taskList){
      let li = document.createElement('li');
      li.innerHTML = task;
      document.getElementById("checkbox-form").append(li);
    }
  }

  // upload checks from the localStorage
  if (localStorage.getItem('checks') !== null){
    let checkSet = JSON.parse(localStorage.getItem('checks'));
    for (let check of checkSet){
      let checkedTask = document.getElementById("checkbox-form").children[check];
      checkedTask.getElementsByTagName('input')[0].checked = true;
      checkedTask.getElementsByTagName('span')[0].classList.add('strikethrough');
    }
  }

  updateTasks();
})


// Add task 
function addTask(inputValue){
  if (!inputValue)
    return;

  let checkboxForm = document.getElementById("checkbox-form");

  if (document.getElementById("checkbox-form").children.length >= 20)
    return;

  initDate();
  let li = document.createElement('li');
  li.innerHTML = '<input type="checkbox" name="tasks[]"> <span>' + inputValue + '</span> <time datetime="' + currentDate.dateTimeStr + '">' 
          + changeTimeFormat(currentDate.hour, currentDate.minute) + '</time>';

  checkboxForm.append(li);

  // add the task to the localStorage
  if (localStorage.getItem('tasks') === null)
    localStorage.setItem('tasks', JSON.stringify([li.innerHTML]));
  else {
    let taskList = JSON.parse(localStorage.getItem('tasks'));
    taskList.push(li.innerHTML);
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }
}


document.getElementById("plus-button").addEventListener("click", function(event){
  let inputTask = document.getElementById("input-task");
  addTask(inputTask.value);
  updateTasks();
  inputTask.value = '';
})


// Clear task list
document.getElementById("clear-button").addEventListener("click", function(event){
  document.getElementById("checkbox-form").innerHTML = '';
  updateTasks();
  localStorage.clear();
})


// Checkbox onclick make text strikethrough
function getTaskIndex(task){
  let index = 0;
  for (let elem of document.getElementById("checkbox-form").children){
    if (elem === task)
      return index;
    index++;
  }
}

document.getElementById("checkbox-form").addEventListener("click", function(event){
  if (event.target.tagName === "INPUT"){
    event.target.nextElementSibling.classList.toggle('strikethrough');
    let taskIndex = getTaskIndex(event.target.parentNode);

    // add checks to the localStorage
    if (event.target.checked) {
      if (localStorage.getItem('checks') === null)
        localStorage.setItem('checks', JSON.stringify([taskIndex]));
      else {
        let checkSet = new Set(JSON.parse(localStorage.getItem('checks')));
        checkSet.add(taskIndex);
        localStorage.setItem('checks', JSON.stringify(Array.from(checkSet)));
      }
    }
    else if (localStorage.getItem('checks') !== null) {
      let checkSet = new Set(JSON.parse(localStorage.getItem('checks')));
      checkSet.delete(taskIndex);
      localStorage.setItem('checks', JSON.stringify(Array.from(checkSet)));
    }
  }
})