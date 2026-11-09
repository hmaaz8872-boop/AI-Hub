// Load saved data from Local Storage

let tasks = JSON.parse(localStorage.getItem("mazTasks")) || [];
let notes = JSON.parse(localStorage.getItem("mazNotes")) || [];

let currentFilter = "all";

// Dashboard Update

function updateDashboard() {
    let completed = tasks.filter(task => task.completed).length;

    document.getElementById("totalTasks").innerText = tasks.length;

    document.getElementById("completedTasks").innerText = completed;

    document.getElementById("totalNotes").innerText = notes.length;

    let percentage = tasks.length === 0
        ? 0
        : Math.round((completed / tasks.length) * 100);

    document.getElementById("productivity").innerText =
        percentage + "%";
}

// Save Tasks

function saveTasks() {
    localStorage.setItem("mazTasks", JSON.stringify(tasks));
    updateDashboard();
}

// Add Task

function addTask() {
    let input = document.getElementById("taskInput");
    let priority = document.getElementById("taskPriority").value;

    let taskName = input.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    let task = {
        id: Date.now(),
        name: taskName,
        priority: priority,
        completed: false
    };

    tasks.push(task);

    input.value = "";

    saveTasks();
    displayTasks();
}

// Display Tasks

function displayTasks() {
    let taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        let li = document.createElement("li");
        li.className = "task-item";

        let taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        let details = document.createElement("div");

        let name = document.createElement("span");
        name.textContent = task.name;

        if (task.completed) {
            name.classList.add("completed");
        }

        let priority = document.createElement("div");
        priority.className = "priority";
        priority.textContent = "Priority: " + task.priority;

        details.appendChild(name);
        details.appendChild(priority);

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(details);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.appendChild(taskInfo);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

// Complete Task

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete Task

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Filter Tasks

function filterTasks(filter) {
    currentFilter = filter;
    displayTasks();
}

// Add Notes

function addNote() {
    let input = document.getElementById("noteInput");

    let noteText = input.value.trim();

    if (noteText === "") {
        alert("Please write something first!");
        return;
    }

    let note = {
        id: Date.now(),
        text: noteText
    };

    notes.push(note);

    input.value = "";

    saveNotes();
    displayNotes();
}

// Save Notes

function saveNotes() {
    localStorage.setItem("mazNotes", JSON.stringify(notes));
    updateDashboard();
}

// Display Notes

function displayNotes() {
    let notesList = document.getElementById("notesList");

    notesList.innerHTML = "";

    notes.forEach(note => {
        let card = document.createElement("div");
        card.className = "note-card";

        let text = document.createElement("p");
        text.textContent = note.text;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id);
        });

        card.appendChild(text);
        card.appendChild(deleteButton);

        notesList.appendChild(card);
    });
}

// Delete Notes

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);

    saveNotes();
    displayNotes();
}

// AI Assistant Demo

function sendMessage() {
    let input = document.getElementById("userMessage");

    let message = input.value.trim();

    if (message === "") {
        return;
    }

    addChatMessage(message, "user-message");

    input.value = "";

    setTimeout(function () {
        let response = getAIResponse(message);

        addChatMessage(response, "bot-message");
    }, 500);
}

// Chat Messages

function addChatMessage(message, className) {
    let chatBox = document.getElementById("chatBox");

    let messageDiv = document.createElement("div");

    messageDiv.className = className;
    messageDiv.textContent = message;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Demo Assistant Responses

function getAIResponse(message) {
    let text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! Welcome to MAZ AI. How can I help you today?";
    }

    if (text.includes("task")) {
        return "You can manage your daily tasks using the My Tasks section.";
    }

    if (text.includes("note")) {
        return "You can save your important ideas in the Quick Notes section.";
    }

    if (text.includes("time")) {
        return "Try creating a daily schedule and completing your tasks one by one.";
    }

    if (text.includes("website")) {
        return "You can start building a website with HTML, CSS and JavaScript.";
    }

    return "Thanks for your message! I am currently a demo assistant. Real AI integration can be added later.";
}

// Enter Key Support

document.getElementById("userMessage").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

document.getElementById("taskInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

document.getElementById("noteInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addNote();
    }
});

// Voice Input

function startVoice() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported in this browser. Try Chrome.");
        return;
    }

    let recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        let voiceText = event.results[0][0].transcript;

        document.getElementById("userMessage").value = voiceText;
    };

    recognition.onerror = function() {
        alert("Voice recognition failed. Please check microphone permission.");
    };
}

// Initial Display

displayTasks();
displayNotes();
updateDashboard();