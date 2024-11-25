// Show a message for user actions
function showMessage(message, type = "info") {
    const messageBox = document.getElementById("messageBox");

    // Update text and style
    messageBox.textContent = message;
    messageBox.className = `alert alert-${type} text-center`;

    // Show the message
    messageBox.classList.remove("d-none");

    // Hide the message after 3 seconds
    setTimeout(() => {
        messageBox.classList.add("d-none");
    }, 3000);
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll("#myTasks li").forEach(li => {
        tasks.push({
            text: li.querySelector("span:first-child").textContent,
            dateTime: li.querySelector(".date-time").textContent,
            checked: li.classList.contains("checked")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const li = createTaskElement(task.text, task.dateTime, task.checked);
        document.getElementById("myTasks").appendChild(li);
    });
}

// Create a task element
function createTaskElement(taskText, taskDateTime, isChecked) {
    const li = document.createElement("li");
    li.classList.add("p-2", "ps-3");
    if (isChecked) li.classList.add("checked");

    // Task text
    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;
    li.appendChild(textSpan);

    // Task date-time
    const dateTimeSpan = document.createElement("span");
    dateTimeSpan.textContent = ` ${taskDateTime}`;
    dateTimeSpan.className = "date-time";
    li.appendChild(dateTimeSpan);

    // Add buttons
    addCloseButton(li);
    addEditButton(li);

    // Toggle checked state
    li.addEventListener("click", toggleCheckedState);

    return li;
}

// Add a close button to a task
function addCloseButton(li) {
    const closeSpan = document.createElement("span");
    closeSpan.className = "close p-2 ps-5";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-x";
    closeSpan.appendChild(icon);

    closeSpan.onclick = function () {
        li.remove();
        saveTasksToLocalStorage();
        showMessage("Task Deleted Successfully!", "danger");
    };

    li.appendChild(closeSpan);
}

// Add an edit button to a task
function addEditButton(li) {
    const editSpan = document.createElement("span");
    editSpan.className = "edit p-2 ps-5";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-edit";
    editSpan.appendChild(icon);

    editSpan.onclick = function () {
        const newTaskText = prompt("Edit your task:", li.querySelector("span:first-child").textContent);
        if (newTaskText !== null) {
            li.querySelector("span:first-child").textContent = newTaskText;
            saveTasksToLocalStorage();
            showMessage("Task Updated Successfully!", "warning");
        }
    };

    li.appendChild(editSpan);
}

// Add a check icon to a task
function addCheckIcon(li) {
    let checkIcon = li.querySelector(".fa-check");
    if (!checkIcon) {
        checkIcon = document.createElement("i");
        checkIcon.className = "fa-solid fa-check";
        li.insertBefore(checkIcon, li.firstChild);
    }
}

// Remove the check icon from a task
function removeCheckIcon(li) {
    const checkIcon = li.querySelector(".fa-check");
    if (checkIcon) {
        checkIcon.remove();
    }
}

// Toggle the checked state of a task
function toggleCheckedState(event) {
    if (
        event.target.tagName === "SPAN" ||
        (event.target.classList.contains("date-time") ||
            event.target === event.currentTarget.querySelector("span:first-child"))
    ) {
        let li = event.currentTarget;

        li.classList.toggle("checked");

        if (li.classList.contains("checked")) {
            addCheckIcon(li);
            showMessage("Task is completed!", "success");
        } else {
            removeCheckIcon(li);
            showMessage("Task isn't complete.", "info");
        }

        saveTasksToLocalStorage();
    }
}

// Add a new task
function newElement() {
    const inputValue = document.getElementById("newTask").value;
    if (inputValue === "") {
        showMessage("You must write something!", "danger");
        return;
    }

    const now = new Date();
    const formattedDateTime = now.toLocaleString();

    const li = createTaskElement(inputValue, formattedDateTime, false);
    document.getElementById("myTasks").appendChild(li);

    saveTasksToLocalStorage();
    showMessage("Task Added Successfully!", "success");

    document.getElementById("newTask").value = "";
}

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);