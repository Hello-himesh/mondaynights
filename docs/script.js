document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskDeadline = document.getElementById("taskDeadline");
    let taskText = taskInput.value.trim();
    let deadline = taskDeadline.value;

    if (taskText === "") return;

    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");
    li.innerHTML = `
        <span onclick="editTask(this)">${taskText} (${deadline})</span>
        <button onclick="toggleTask(this)">✔️</button>
        <button onclick="removeTask(this)">❌</button>
    `;
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = "";
    taskDeadline.value = "";
}

function editTask(span) {
    let newTask = prompt("Edit task:", span.textContent);
    if (newTask !== null) {
        span.textContent = newTask;
        saveTasks();
    }
}

function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
}

function toggleTask(button) {
    let li = button.parentElement;
    li.classList.toggle("completed");
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span onclick="editTask(this)">${task.text}</span>
            <button onclick="toggleTask(this)">V</button>
            <button onclick="removeTask(this)">X</button>
        `;
        if (task.completed) li.classList.add("completed");
        taskList.appendChild(li);
    });
}

async function syncToGitHub() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const content = JSON.stringify(tasks, null, 2);
    const repo = "Hello-himesh/mondaynights";
    const filename = "tasks.json";
    const token = "your_personal_access_token";  // Replace with GitHub Token

    const url = `https://api.github.com/repos/${repo}/contents/${filename}`;
    
    const response = await fetch(url, { headers: { Authorization: `token ${token}` } });
    const fileData = await response.json();

    const payload = {
        message: "Updated to-do list",
        content: btoa(content),
        sha: fileData.sha
    };

    await fetch(url, {
        method: "PUT",
        headers: { Authorization: `token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    alert("Tasks synced to GitHub!");
}
