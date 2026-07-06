// =========================
// DATE & TIME
// =========================

function updateDateTime() {

const now = new Date();

const options = {
weekday: "long",
year: "numeric",
month: "long",
day: "numeric"
};

document.getElementById("datetime").innerHTML =
`${now.toLocaleDateString("en-US", options)}
<br>
${now.toLocaleTimeString()}`;

}

setInterval(updateDateTime, 1000);

updateDateTime();


// =========================
// TASK STORAGE
// =========================

let tasks =
JSON.parse(localStorage.getItem("tasks"))
|| [];

let currentFilter = "all";


// =========================
// ADD TASK
// =========================

function addTask() {

const taskInput =
document.getElementById("taskInput");

const taskDate =
document.getElementById("taskDate");

if(taskInput.value.trim() === ""){

alert("Enter a task");

return;

}

const task = {

text: taskInput.value,

date: taskDate.value,

completed: false,

createdAt: new Date().toISOString()

};

tasks.push(task);

saveTasks();

renderTasks();

taskInput.value = "";

taskDate.value = "";

}


// =========================
// SAVE TASKS
// =========================

function saveTasks(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

updateDashboard();

}


// =========================
// RENDER TASKS
// =========================

function renderTasks(){

const taskList =
document.getElementById("taskList");

taskList.innerHTML = "";

let filteredTasks = tasks;

if(currentFilter === "daily"){

filteredTasks = tasks.filter(task => {

const today =
new Date().toDateString();

return task.date &&
new Date(task.date)
.toDateString() === today;

});

}

else if(currentFilter === "weekly"){

const now = new Date();

const weekLater =
new Date();

weekLater.setDate(
now.getDate() + 7
);

filteredTasks = tasks.filter(task => {

if(!task.date) return false;

const d = new Date(task.date);

return d >= now &&
d <= weekLater;

});

}

else if(currentFilter === "monthly"){

const now = new Date();

filteredTasks = tasks.filter(task => {

if(!task.date) return false;

const d = new Date(task.date);

return d.getMonth() ===
now.getMonth();

});

}


filteredTasks.forEach((task,index)=>{

const li =
document.createElement("li");

const left =
document.createElement("div");

const checkbox =
document.createElement("input");

checkbox.type = "checkbox";

checkbox.checked =
task.completed;

checkbox.onchange = ()=>{

task.completed =
!task.completed;

saveTasks();

renderTasks();

checkAchievements();

};

left.appendChild(checkbox);

const span =
document.createElement("span");

span.innerHTML =
` ${task.text}
<br>
<small>${task.date || "No Reminder"}</small>`;

if(task.completed){

span.style.textDecoration =
"line-through";

}

left.appendChild(span);

li.appendChild(left);

const btnGroup =
document.createElement("div");


// EDIT

const editBtn =
document.createElement("button");

editBtn.innerText = "Edit";

editBtn.onclick = ()=>{

const updated =
prompt(
"Update Task",
task.text
);

if(updated){

task.text = updated;

saveTasks();

renderTasks();

}

};

btnGroup.appendChild(editBtn);


// DELETE

const deleteBtn =
document.createElement("button");

deleteBtn.innerText =
"Delete";

deleteBtn.onclick = ()=>{

tasks.splice(index,1);

saveTasks();

renderTasks();

};

btnGroup.appendChild(deleteBtn);

li.appendChild(btnGroup);

taskList.appendChild(li);

});

updateDashboard();

}


// =========================
// FILTERS
// =========================

function showTasks(filter){

currentFilter = filter;

renderTasks();

}


// =========================
// DASHBOARD
// =========================

let chart;

function updateDashboard(){

const total =
tasks.length;

const completed =
tasks.filter(
t=>t.completed
).length;

const pending =
total - completed;

document.getElementById(
"totalTasks"
).innerText = total;

document.getElementById(
"completedTasks"
).innerText = completed;

document.getElementById(
"pendingTasks"
).innerText = pending;


const ctx =
document.getElementById(
"progressChart"
);

if(chart){

chart.destroy();

}

chart = new Chart(ctx,{

type:"pie",

data:{

labels:[
"Completed",
"Pending"
],

datasets:[{

data:[
completed,
pending
]

}]

}

});

}


// =========================
// STREAK & BADGES
// =========================

let streak =
localStorage.getItem("streak")
|| 0;

function checkAchievements(){

const total =
tasks.length;

const completed =
tasks.filter(
t=>t.completed
).length;

if(total > 0 &&
total === completed){

streak++;

localStorage.setItem(
"streak",
streak
);

}

const badge =
document.getElementById(
"badgeArea"
);

if(streak >= 30){

badge.innerHTML =
"🏆 1 Month Star Badge";

}

else if(streak >= 7){

badge.innerHTML =
"⭐ 1 Week Star Badge";

}

else{

badge.innerHTML =
`Current Streak:
${streak} Days`;

}

}


// =========================
// DARK MODE
// =========================

document
.getElementById(
"themeToggle"
)
.addEventListener(
"click",
()=>{

document.body
.classList.toggle(
"dark-mode"
);

}
);


// =========================
// REMINDERS
// =========================

function checkReminders(){

const now =
new Date();

tasks.forEach(task=>{

if(
task.date &&
!task.completed
){

const reminder =
new Date(task.date);

const diff =
reminder - now;

if(
diff > 0 &&
diff < 60000
){

if(
Notification.permission
=== "granted"
){

new Notification(
`Reminder: ${task.text}`
);

}

}

}

});

}

if(
"Notification" in window
){

Notification
.requestPermission();

}

setInterval(
checkReminders,
30000
);


// =========================
// INITIAL LOAD
// =========================

renderTasks();

checkAchievements();

function openTaskModal(){

document.getElementById("taskModal")
.style.display = "flex";

}

function closeTaskModal(){

document.getElementById("taskModal")
.style.display = "none";

}

async function saveTask() {

    let title =
    document.getElementById("taskTitle").value;

    let priority =
    document.getElementById("taskPriority").value;

    let date =
    document.getElementById("taskDate").value;

    if(title === ""){

        alert("Enter Task Title");
        return;

    }

    const response = await fetch(
        "http://localhost:3000/addTask",
        {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
                title: title,
                priority: priority,
                due_date: date,
                status: "Pending"
            })
        }
    );

    const result =
    await response.text();

    alert(result);

    closeTaskModal();

}


function toggleMenu(){

document
.getElementById("sidebar")
.classList.toggle("active");

}

document.addEventListener(
"click",
function(event){

const sidebar =
document.getElementById("sidebar");

const menuBtn =
document.querySelector(".menu-btn");

if(
sidebar.classList.contains("active")
&&
!sidebar.contains(event.target)
&&
!menuBtn.contains(event.target)
){

sidebar.classList.remove("active");

}

}
);

function goBack(){

window.location.href = "login.html";

}

function toggleMenu(){

document
.getElementById("sidebar")
.classList.toggle("active");

}

function goBack(){

window.location.href = "login.html";

}

