import { useEffect, useState } from "react";

// Dates from the database look like "2026-10-18T18:30:00.000Z".
// <input type="date"> needs "2026-10-19", so we convert it.
function toDateInput(value) {
    if (!value) return "";
    if (value.length === 10) return value;
    const d = new Date(value);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

const STATUSES = ["Pending", "In Progress", "Completed"];

// Colour of the status badge (matches classes in App.css)
const STATUS_COLOR = {
    "Pending": "amber",
    "In Progress": "orange",
    "Completed": "plum"
};

function Tasks() {

    // =========================
    // FORM VALUES
    // =========================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [due_date, setDueDate] = useState("");
    const [intern_id, setInternId] = useState("");
    const [project_id, setProjectId] = useState("");

    // Tasks received from the backend
    const [tasks, setTasks] = useState([]);

    // Interns and projects, used for the dropdowns
    const [interns, setInterns] = useState([]);
    const [projects, setProjects] = useState([]);

    // ID of the task being edited (null = adding a new one)
    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");


    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setStatus("Pending");
        setDueDate("");
        setInternId("");
        setProjectId("");
        setEditId(null);
    };

    // Find a name by id, e.g. internName(3) -> "Priya Nair"
    const internName = (id) => {
        const intern = interns.find((i) => String(i.id) === String(id));
        return intern ? intern.name : `Intern #${id}`;
    };

    const projectName = (id) => {
        if (!id) return "—";
        const project = projects.find((p) => String(p.id) === String(id));
        return project ? project.name : `Project #${id}`;
    };


    // =========================
    // READ - GET
    // =========================

    const viewTasks = async () => {

        try {

            const response = await fetch("http://localhost:3000/tasks", {
                method: "GET"
            });

            const data = await response.json();

            console.log(data);

            setTasks(data.data || []);

        } catch (error) {

            console.log("Tasks could not be fetched");
            showMessage("Could not load tasks. Is the backend running?", "error");

        }
    };

    // Interns + projects for the dropdowns
    const loadDropdowns = async () => {

        try {

            const internResponse = await fetch("http://localhost:3000/interns");
            const internData = await internResponse.json();
            setInterns(internData.data || []);

            const projectResponse = await fetch("http://localhost:3000/projects");
            const projectData = await projectResponse.json();
            setProjects(projectData.data || []);

        } catch (error) {

            console.log("Dropdown data could not be fetched");

        }
    };

    // Runs once when the page opens
    useEffect(() => {
        viewTasks();
        loadDropdowns();
    }, []);


    // The body we send for both POST and PUT.
    // IDs are sent as numbers, or null if nothing is selected.
    const taskBody = () => {
        return JSON.stringify({
            title: title,
            description: description,
            status: status,
            due_date: due_date,
            intern_id: intern_id ? Number(intern_id) : null,
            project_id: project_id ? Number(project_id) : null
        });
    };


    // =========================
    // CREATE - POST
    // =========================

    const addTask = async () => {

        try {

            const response = await fetch("http://localhost:3000/tasks", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: taskBody()
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Task could not be added.", "error");
                return;
            }

            showMessage("Task added.", "success");
            clearForm();
            viewTasks();

        } catch (error) {

            console.log("Task could not be added");
            showMessage("Task could not be added.", "error");

        }
    };


    // =========================
    // UPDATE - PUT
    // =========================

    const updateTask = async (id) => {

        try {

            const response = await fetch(`http://localhost:3000/tasks/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: taskBody()
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Task could not be updated.", "error");
                return;
            }

            showMessage("Task updated.", "success");
            clearForm();
            viewTasks();

        } catch (error) {

            console.log("Task could not be updated");
            showMessage("Task could not be updated.", "error");

        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteTask = async (task) => {

        if (!window.confirm(`Delete task "${task.title}"?`)) return;

        try {

            const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Task could not be deleted.", "error");
                return;
            }

            if (editId === task.id) clearForm();

            showMessage("Task deleted.", "success");
            viewTasks();

        } catch (error) {

            console.log("Task could not be deleted");
            showMessage("Task could not be deleted.", "error");

        }
    };


    // =========================
    // EDIT
    // =========================

    const editTask = (task) => {

        setEditId(task.id);

        setTitle(task.title || "");
        setDescription(task.description || "");
        setStatus(task.status || "Pending");
        setDueDate(toDateInput(task.due_date));
        setInternId(task.intern_id ? String(task.intern_id) : "");
        setProjectId(task.project_id ? String(task.project_id) : "");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // =========================
    // SUBMIT - add or update
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (editId) {
            updateTask(editId);
        } else {
            addTask();
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <section className="module">

            <header className="page-header">
                <span className="page-header__icon">✅</span>
                <div>
                    <h1 className="page-header__title">
                        Tasks <span className="count-pill">{tasks.length}</span>
                    </h1>
                    <p className="page-header__sub">Create, assign, update and delete tasks.</p>
                </div>
            </header>

            {message && (
                <div className={`alert alert--${messageType}`}>
                    <span>{message}</span>
                    <button className="alert__close" onClick={() => setMessage("")}>✕</button>
                </div>
            )}

            <div className="module__grid">

                {/* ========== FORM ========== */}

                <form className={`panel form-panel ${editId ? "is-editing" : ""}`} onSubmit={handleSubmit}>

                    <h2 className="panel__title">
                        {editId ? `Edit Task #${editId}` : "Add Task"}
                    </h2>

                    <div className="form-grid">

                        <label className="field field--full">
                            <span className="field__label">Task Title <span className="field__req">*</span></span>
                            <input
                                placeholder="e.g. Build login page"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Description</span>
                            <textarea
                                rows="3"
                                placeholder="What needs to be done?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Assign to Intern <span className="field__req">*</span></span>
                            <select value={intern_id} onChange={(e) => setInternId(e.target.value)} required>
                                <option value="">Select intern</option>
                                {interns.map((intern) => (
                                    <option key={intern.id} value={intern.id}>
                                        {intern.name} (#{intern.id})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Project</span>
                            <select value={project_id} onChange={(e) => setProjectId(e.target.value)}>
                                <option value="">No project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name} (#{project.id})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="field">
                            <span className="field__label">Status <span className="field__req">*</span></span>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                                {STATUSES.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </label>

                        <label className="field">
                            <span className="field__label">Due Date <span className="field__req">*</span></span>
                            <input
                                type="date"
                                value={due_date}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </label>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Update Task" : "Add Task"}
                        </button>

                        {editId && (
                            <button type="button" className="btn btn--ghost" onClick={clearForm}>
                                Cancel
                            </button>
                        )}
                    </div>

                </form>


                {/* ========== LIST ========== */}

                <div className="list-panel">

                    <div className="list-toolbar">
                        <button className="btn btn--ghost" onClick={viewTasks}>
                            ↻ Refresh
                        </button>
                    </div>

                    {tasks.length === 0 ? (

                        <div className="empty">
                            <h3>No tasks yet</h3>
                            <p>Create a task and assign it to an intern.</p>
                        </div>

                    ) : (

                        <div className="record-grid">

                            {tasks.map((task) => (

                                <article key={task.id} className={`record ${editId === task.id ? "is-editing" : ""}`}>

                                    <header className="record__head record__head--split">
                                        <h3>{task.title}</h3>
                                        <span className={`badge badge--${STATUS_COLOR[task.status] || "neutral"}`}>
                                            {task.status || "No status"}
                                        </span>
                                    </header>

                                    {task.description && <p className="record__text">{task.description}</p>}

                                    <dl className="record__meta">
                                        <div><dt>Assigned to</dt><dd>{task.intern_id ? internName(task.intern_id) : "—"}</dd></div>
                                        <div><dt>Project</dt><dd>{projectName(task.project_id)}</dd></div>
                                        <div><dt>Due</dt><dd>{toDateInput(task.due_date) || "—"}</dd></div>
                                    </dl>

                                    <footer className="record__actions">
                                        <span className="record__id">#{task.id}</span>
                                        <button className="btn btn--sm btn--ghost" onClick={() => editTask(task)}>
                                            Edit
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => deleteTask(task)}>
                                            Delete
                                        </button>
                                    </footer>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
}

export default Tasks;