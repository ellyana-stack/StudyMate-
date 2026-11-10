
// ==========================================
// STUDYMATE - COMPLETE JAVASCRIPT
// ==========================================


// ==========================================
// 1. GET TODAY'S DATE
// ==========================================

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// 2. FORMAT DATE
// ==========================================

function formatDate(date) {
    if (!date) return "-";

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ==========================================
// 3. ESCAPE HTML
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// ==========================================
// 4. DEFAULT TASKS
// ==========================================

const defaultTasks = [
    {
        id: 1,
        name: "Website Design Project",
        subject: "IMS566",
        date: "2026-11-15",
        status: "Pending"
    },
    {
        id: 2,
        name: "Research Report",
        subject: "IMS566",
        date: "2026-11-18",
        status: "In Progress"
    },
    {
        id: 3,
        name: "Group Presentation",
        subject: "IMC",
        date: "2026-11-22",
        status: "Pending"
    },
    {
        id: 4,
        name: "Case Study",
        subject: "Management",
        date: "2026-11-25",
        status: "In Progress"
    },
    {
        id: 5,
        name: "Reflection Journal",
        subject: "English",
        date: "2026-11-28",
        status: "Pending"
    }
];


// ==========================================
// 5. GET AND SAVE TASKS
// ==========================================

function getTasks() {
    const savedTasks = localStorage.getItem("myTasks");

    if (savedTasks === null) {
        localStorage.setItem("myTasks", JSON.stringify(defaultTasks));
        return [...defaultTasks];
    }

    try {
        return JSON.parse(savedTasks) || [];
    } catch (error) {
        return [];
    }
}


function saveTasks(tasks) {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}


// ==========================================
// 6. DISPLAY MY TASKS
// ==========================================

function displayTasks() {
    const tableBody = document.getElementById("taskTableBody");

    if (!tableBody) return;

    const tasks = getTasks();

    tableBody.innerHTML = "";

    if (tasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No tasks available ♡
                </td>
            </tr>
        `;
    }

    tasks.forEach(task => {
        const statusClass =
            task.status === "Completed" ? "success" :
            task.status === "In Progress" ? "warning" : "secondary";

        tableBody.innerHTML += `
            <tr>
                <td>${escapeHTML(task.name)}</td>
                <td>${escapeHTML(task.subject)}</td>
                <td>${formatDate(task.date)}</td>

                <td>
                    <select class="form-select form-select-sm task-status"
                        data-id="${task.id}">
                        <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>
                            In Progress
                        </option>

                        <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>
                            Completed
                        </option>
                    </select>
                </td>

                <td>
                    <button class="btn btn-sm btn-outline-primary"
                        data-action="edit" data-id="${task.id}">
                        Edit
                    </button>

                    <button class="btn btn-sm btn-outline-danger"
                        data-action="delete" data-id="${task.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateTaskSummary();
}


// ==========================================
// 7. UPDATE TASK SUMMARY
// ==========================================

function updateTaskSummary() {
    const tasks = getTasks();

    const total = tasks.length;
    const pending = tasks.filter(task => task.status === "Pending").length;
    const progress = tasks.filter(task => task.status === "In Progress").length;

    const totalElement = document.getElementById("totalTasks");
    const pendingElement = document.getElementById("pendingTasks");
    const progressElement = document.getElementById("progressTasks");

    if (totalElement) totalElement.textContent = total;
    if (pendingElement) pendingElement.textContent = pending;
    if (progressElement) progressElement.textContent = progress;
}


// ==========================================
// 8. ADD AND EDIT TASK
// ==========================================

function handleTaskForm(event) {
    event.preventDefault();

    const id = document.getElementById("taskId")?.value;
    const name = document.getElementById("taskName")?.value.trim();
    const subject = document.getElementById("taskSubject")?.value.trim();
    const date = document.getElementById("taskDate")?.value;
    const status = document.getElementById("taskStatus")?.value;

    if (!name || !subject || !date || !status) {
        alert("Please complete all task details.");
        return;
    }

    const tasks = getTasks();

    if (id) {
        const taskIndex = tasks.findIndex(task => String(task.id) === String(id));

        if (taskIndex !== -1) {
            const oldTask = tasks[taskIndex];

            tasks[taskIndex] = {
                ...oldTask,
                name,
                subject,
                date,
                status,
                completedDate:
                    status === "Completed"
                        ? (oldTask.status === "Completed"
                            ? oldTask.completedDate || getTodayDate()
                            : getTodayDate())
                        : null
            };
        }
    } else {
        const newTask = {
            id: Date.now(),
            name,
            subject,
            date,
            status,
            completedDate: status === "Completed" ? getTodayDate() : null
        };

        tasks.push(newTask);
    }

    saveTasks(tasks);

    document.getElementById("addTaskForm").reset();

    const taskIdInput = document.getElementById("taskId");
    if (taskIdInput) taskIdInput.value = "";

    closeTaskModal();

    refreshAllPages();
}


// ==========================================
// 9. EDIT TASK
// ==========================================

function editTask(id) {
    const tasks = getTasks();

    const task = tasks.find(item => String(item.id) === String(id));

    if (!task) return;

    document.getElementById("taskId").value = task.id;
    document.getElementById("taskName").value = task.name;
    document.getElementById("taskSubject").value = task.subject;
    document.getElementById("taskDate").value = task.date;
    document.getElementById("taskStatus").value = task.status;

    const title = document.getElementById("addTaskModalTitle");
    const saveButton = document.getElementById("saveTaskButton");

    if (title) title.textContent = "Edit Task ♡";
    if (saveButton) saveButton.textContent = "Save Changes";

    const modalElement = document.getElementById("addTaskModal");

    if (modalElement && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
}


// ==========================================
// 10. DELETE TASK
// ==========================================

function deleteTask(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    const tasks = getTasks().filter(task => String(task.id) !== String(id));

    saveTasks(tasks);

    refreshAllPages();
}


// ==========================================
// 11. CLOSE AND RESET TASK MODAL
// ==========================================

function closeTaskModal() {
    const modalElement = document.getElementById("addTaskModal");

    if (modalElement && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) modal.hide();
    }

    const title = document.getElementById("addTaskModalTitle");
    const saveButton = document.getElementById("saveTaskButton");

    if (title) title.textContent = "Add New Task ♡";
    if (saveButton) saveButton.textContent = "Save Task";
}


// ==========================================
// 12. CHANGE TASK STATUS
// ==========================================

function updateTaskStatus(id, newStatus) {
    const tasks = getTasks();

    const task = tasks.find(item => String(item.id) === String(id));

    if (!task) return;

    task.status = newStatus;

    if (newStatus === "Completed") {
        task.completedDate = task.completedDate || getTodayDate();
    } else {
        task.completedDate = null;
    }

    saveTasks(tasks);

    refreshAllPages();
}


// ==========================================
// 13. SEARCH AND FILTER TASKS
// ==========================================

function filterTasks() {
    const searchInput = document.getElementById("taskSearch");
    const statusFilter = document.getElementById("statusFilter");
    const tableBody = document.getElementById("taskTableBody");

    if (!tableBody) return;

    const searchText = searchInput?.value.toLowerCase() || "";
    const selectedStatus = statusFilter?.value || "All";

    const filteredTasks = getTasks().filter(task => {
        const name = (task.name || "").toLowerCase();
        const subject = (task.subject || "").toLowerCase();

        const matchesSearch =
            name.includes(searchText) || subject.includes(searchText);

        const matchesStatus =
            selectedStatus === "All" || task.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    tableBody.innerHTML = "";

    if (filteredTasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No matching tasks found ♡
                </td>
            </tr>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        tableBody.innerHTML += `
            <tr>
                <td>${escapeHTML(task.name)}</td>
                <td>${escapeHTML(task.subject)}</td>
                <td>${formatDate(task.date)}</td>

                <td>
                    <select class="form-select form-select-sm task-status"
                        data-id="${task.id}">
                        <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>
                        <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>
                            In Progress
                        </option>
                        <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>
                            Completed
                        </option>
                    </select>
                </td>

                <td>
                    <button class="btn btn-sm btn-outline-primary"
                        data-action="edit" data-id="${task.id}">
                        Edit
                    </button>

                    <button class="btn btn-sm btn-outline-danger"
                        data-action="delete" data-id="${task.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ==========================================
// 14. DISPLAY COMPLETED TASKS
// ==========================================

function displayCompletedTasks() {
    const tableBody = document.getElementById("completedTableBody");

    if (!tableBody) return;

    const completedTasks = getTasks().filter(
        task => task.status === "Completed"
    );

    tableBody.innerHTML = "";

    let onTimeCount = 0;
    let lateCount = 0;

    if (completedTasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No completed tasks yet ♡
                </td>
            </tr>
        `;
    }

    completedTasks.forEach(task => {
        const completedDate = task.completedDate || getTodayDate();

        const isOnTime = completedDate <= task.date;

        if (isOnTime) {
            onTimeCount++;
        } else {
            lateCount++;
        }

        tableBody.innerHTML += `
            <tr>
                <td>${escapeHTML(task.name)}</td>
                <td>${escapeHTML(task.subject)}</td>
                <td>${formatDate(completedDate)}</td>

                <td>
                    <span class="badge bg-${isOnTime ? "success" : "danger"}">
                        ${isOnTime ? "Completed On Time" : "Late Submission"}
                    </span>
                </td>
            </tr>
        `;
    });

    const completedCount = document.getElementById("completedCount");
    const onTimeElement = document.getElementById("onTimeCount");
    const lateElement = document.getElementById("lateCount");

    if (completedCount) completedCount.textContent = completedTasks.length;
    if (onTimeElement) onTimeElement.textContent = onTimeCount;
    if (lateElement) lateElement.textContent = lateCount;
}


// ==========================================
// 15. DASHBOARD SUMMARY
// ==========================================

function displayDashboard() {
    const totalElement = document.getElementById("dashboardTotal");

    if (!totalElement) return;

    const tasks = getTasks();

    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "Completed").length;
    const pending = tasks.filter(task => task.status !== "Completed").length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalElement.textContent = total;

    const completedElement = document.getElementById("dashboardCompleted");
    const pendingElement = document.getElementById("dashboardPending");
    const messageElement = document.getElementById("progressMessage");

    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = pending;

    if (messageElement) {
        messageElement.textContent =
            `🌸 You have completed ${percentage}% of your tasks!`;
    }

    displayUpcomingAssignments();
    displayTaskChart();
    displaySubjectChart();
}


// ==========================================
// 16. DOUGHNUT CHART
// ==========================================

let taskChart = null;

function displayTaskChart() {
    const canvas = document.getElementById("taskChart");

    if (!canvas || typeof Chart === "undefined") return;

    const tasks = getTasks();

    const completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    const notCompleted = tasks.length - completed;

    if (taskChart) {
        taskChart.destroy();
    }

    taskChart = new Chart(canvas, {
        type: "doughnut",

        data: {
            labels: ["Completed", "Not Completed"],

            datasets: [{
                data: [completed, notCompleted],
                backgroundColor: ["#A879CC", "#F4C9DA"],
                borderWidth: 2,
                borderColor: "#FFF8EC"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}


// ==========================================
// 17. BAR CHART - TASKS BY SUBJECT
// ==========================================

let subjectChart = null;

function displaySubjectChart() {
    const canvas = document.getElementById("subjectChart");

    if (!canvas || typeof Chart === "undefined") return;

    const tasks = getTasks();

    const subjectCounts = {};

    tasks.forEach(task => {
        const subject = task.subject && task.subject.trim()
            ? task.subject.trim()
            : "Other";

        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });

    const subjects = Object.keys(subjectCounts);
    const taskNumbers = Object.values(subjectCounts);

    if (subjectChart) {
        subjectChart.destroy();
    }

    subjectChart = new Chart(canvas, {
        type: "bar",

        data: {
            labels: subjects,

            datasets: [{
                label: "Number of Tasks",
                data: taskNumbers,

                backgroundColor: [
                    "#A879CC",
                    "#F4C9DA",
                    "#C9A7E8",
                    "#E8B9D0",
                    "#D8C5F0",
                    "#B99AD6"
                ],

                borderRadius: 8,
                borderSkipped: false
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: "Number of Tasks"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Subjects"
                    }
                }
            }
        }
    });
}


// ==========================================
// 18. UPCOMING ASSIGNMENTS
// ==========================================

function displayUpcomingAssignments() {
    const container = document.getElementById("upcomingAssignments");

    if (!container) return;

    const today = getTodayDate();

    const upcomingTasks = getTasks()
        .filter(task => task.status !== "Completed" && task.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    container.innerHTML = "";

    if (upcomingTasks.length === 0) {
        container.innerHTML = `
            <p class="text-muted">No upcoming assignments. Enjoy your free time! ♡</p>
        `;
        return;
    }

    const icons = ["📖", "✏️", "💻"];

    upcomingTasks.forEach((task, index) => {
        container.innerHTML += `
            <div class="upcoming-item">
                <span>${icons[index]}</span>

                <div>
                    <h6>${escapeHTML(task.name)}</h6>
                    <p>${escapeHTML(task.subject)} · Due ${formatDate(task.date)}</p>
                </div>
            </div>
        `;
    });
}


// ==========================================
// 19. STUDY PLANNER - GET AND SAVE
// ==========================================

function getStudyPlans() {
    try {
        return JSON.parse(localStorage.getItem("studyPlans")) || [];
    } catch (error) {
        return [];
    }
}


function saveStudyPlans(plans) {
    localStorage.setItem("studyPlans", JSON.stringify(plans));
}


// ==========================================
// 20. ADD STUDY PLAN
// ==========================================

function handlePlannerForm(event) {
    event.preventDefault();

    const subject = document.getElementById("studySubject")?.value.trim();
    const topic = document.getElementById("studyTopic")?.value.trim();
    const date = document.getElementById("studyDate")?.value;
    const time = document.getElementById("studyTime")?.value;

    if (!subject || !topic || !date || !time) {
        alert("Please complete all study plan details.");
        return;
    }

    const plans = getStudyPlans();

    plans.push({
        id: Date.now(),
        subject,
        topic,
        date,
        time
    });

    saveStudyPlans(plans);

    document.getElementById("plannerForm").reset();

    refreshAllPages();
}


// ==========================================
// 21. DISPLAY STUDY PLANS
// ==========================================

function displayStudyPlans() {
    const tableBody = document.getElementById("plannerTableBody");

    if (!tableBody) return;

    const plans = getStudyPlans().sort((a, b) => {
        return (a.date + a.time).localeCompare(b.date + b.time);
    });

    tableBody.innerHTML = "";

    if (plans.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No study plans added yet ♡
                </td>
            </tr>
        `;
        return;
    }

    plans.forEach(plan => {
        tableBody.innerHTML += `
            <tr>
                <td>${escapeHTML(plan.subject)}</td>
                <td>${escapeHTML(plan.topic)}</td>
                <td>${formatDate(plan.date)}</td>
                <td>${escapeHTML(plan.time)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger"
                        data-plan-delete="${plan.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ==========================================
// 22. DELETE STUDY PLAN
// ==========================================

function deleteStudyPlan(id) {
    if (!confirm("Are you sure you want to delete this study plan?")) {
        return;
    }

    const plans = getStudyPlans().filter(
        plan => String(plan.id) !== String(id)
    );

    saveStudyPlans(plans);

    refreshAllPages();
}


// ==========================================
// 23. DISPLAY STUDY PLANNER ON DASHBOARD
// ==========================================

function displayDashboardStudyPlans() {
    const container = document.getElementById("dashboardStudyPlans");

    if (!container) return;

    const plans = getStudyPlans()
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 3);

    container.innerHTML = "";

    if (plans.length === 0) {
        container.innerHTML = `
            <p class="text-muted">No study plans available yet ♡</p>
        `;
        return;
    }

    plans.forEach(plan => {
        container.innerHTML += `
            <div class="upcoming-item">
                <span>📚</span>

                <div>
                    <h6>${escapeHTML(plan.topic)}</h6>
                    <p>${escapeHTML(plan.subject)} · ${formatDate(plan.date)} · ${escapeHTML(plan.time)}</p>
                </div>
            </div>
        `;
    });
}


// ==========================================
// 24. DARK MODE AND LIGHT MODE
// ==========================================

function applyTheme(theme) {
    const themeIcon = document.getElementById("themeIcon");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");

        if (themeIcon) {
            themeIcon.textContent = "🌙";
        }
    } else {
        document.body.classList.remove("dark-mode");

        if (themeIcon) {
            themeIcon.textContent = "☀️";
        }
    }
}


function toggleTheme() {
    const currentTheme = localStorage.getItem("studyMateTheme") || "light";

    const newTheme = currentTheme === "light" ? "dark" : "light";

    localStorage.setItem("studyMateTheme", newTheme);

    applyTheme(newTheme);
}


// ==========================================
// 25. REFRESH ALL PAGES
// ==========================================

function refreshAllPages() {
    displayTasks();
    displayCompletedTasks();
    displayDashboard();
    displayStudyPlans();
    displayDashboardStudyPlans();
}


// ==========================================
// 26. INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Display saved theme
    const savedTheme = localStorage.getItem("studyMateTheme") || "light";

    applyTheme(savedTheme);


    // Dark mode button
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }


    // Task form
    const taskForm = document.getElementById("addTaskForm");

    if (taskForm) {
        taskForm.addEventListener("submit", handleTaskForm);
    }


    // Add task button resets the form
    const addTaskButton = document.getElementById("addTaskButton");

    if (addTaskButton) {
        addTaskButton.addEventListener("click", function () {
            const form = document.getElementById("addTaskForm");

            if (form) form.reset();

            const taskId = document.getElementById("taskId");
            if (taskId) taskId.value = "";

            const title = document.getElementById("addTaskModalTitle");
            const saveButton = document.getElementById("saveTaskButton");

            if (title) title.textContent = "Add New Task ♡";
            if (saveButton) saveButton.textContent = "Save Task";
        });
    }


    // Search tasks
    const taskSearch = document.getElementById("taskSearch");

    if (taskSearch) {
        taskSearch.addEventListener("input", filterTasks);
    }


    // Filter tasks
    const statusFilter = document.getElementById("statusFilter");

    if (statusFilter) {
        statusFilter.addEventListener("change", filterTasks);
    }


    // Task table buttons and status selection
    document.addEventListener("click", function (event) {

        const actionButton = event.target.closest("[data-action]");

        if (actionButton) {
            const id = actionButton.dataset.id;
            const action = actionButton.dataset.action;

            if (action === "edit") {
                editTask(id);
            }

            if (action === "delete") {
                deleteTask(id);
            }
        }


        // Delete study plan
        const planButton = event.target.closest("[data-plan-delete]");

        if (planButton) {
            deleteStudyPlan(planButton.dataset.planDelete);
        }
    });


    // Change task status
    document.addEventListener("change", function (event) {

        if (event.target.classList.contains("task-status")) {
            updateTaskStatus(
                event.target.dataset.id,
                event.target.value
            );
        }
    });


    // Study planner form
    const plannerForm = document.getElementById("plannerForm");

    if (plannerForm) {
        plannerForm.addEventListener("submit", handlePlannerForm);
    }


    // Initialize all page content
    refreshAllPages();

});
