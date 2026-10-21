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

const STATUSES = ["Planned", "Active", "On Hold", "Completed"];

// Colour of the status badge (matches classes in App.css)
const STATUS_COLOR = {
    "Planned": "amber",
    "Active": "orange",
    "On Hold": "purple",
    "Completed": "plum"
};

function Projects() {

    // =========================
    // FORM VALUES
    // =========================

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [status, setStatus] = useState("Planned");

    const [projects, setProjects] = useState([]);
    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");


    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const clearForm = () => {
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("Planned");
        setEditId(null);
    };


    // =========================
    // READ - GET
    // =========================

    const viewProjects = async () => {

        try {

            const response = await fetch("http://localhost:3000/projects", {
                method: "GET"
            });

            const data = await response.json();

            console.log(data);

            setProjects(data.data || []);

        } catch (error) {

            console.log("Projects could not be fetched");
            showMessage("Could not load projects. Is the backend running?", "error");

        }
    };

    useEffect(() => {
        viewProjects();
    }, []);


    // =========================
    // CREATE - POST
    // =========================

    const addProject = async () => {

        try {

            const response = await fetch("http://localhost:3000/projects", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    description: description,
                    start_date: start_date,
                    end_date: end_date,
                    status: status
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Project could not be added.", "error");
                return;
            }

            showMessage("Project added.", "success");
            clearForm();
            viewProjects();

        } catch (error) {

            console.log("Project could not be added");
            showMessage("Project could not be added.", "error");

        }
    };


    // =========================
    // UPDATE - PUT
    // =========================

    const updateProject = async (id) => {

        try {

            const response = await fetch(`http://localhost:3000/projects/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    description: description,
                    start_date: start_date,
                    end_date: end_date,
                    status: status
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Project could not be updated.", "error");
                return;
            }

            showMessage("Project updated.", "success");
            clearForm();
            viewProjects();

        } catch (error) {

            console.log("Project could not be updated");
            showMessage("Project could not be updated.", "error");

        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteProject = async (project) => {

        if (!window.confirm(`Delete project "${project.name}"?`)) return;

        try {

            const response = await fetch(`http://localhost:3000/projects/${project.id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                // Usually happens if tasks still use this project
                showMessage("Project could not be deleted. Do tasks still use it?", "error");
                return;
            }

            if (editId === project.id) clearForm();

            showMessage("Project deleted.", "success");
            viewProjects();

        } catch (error) {

            console.log("Project could not be deleted");
            showMessage("Project could not be deleted.", "error");

        }
    };


    // =========================
    // EDIT
    // =========================

    const editProject = (project) => {

        setEditId(project.id);

        setName(project.name || "");
        setDescription(project.description || "");
        setStartDate(toDateInput(project.start_date));
        setEndDate(toDateInput(project.end_date));
        setStatus(project.status || "Planned");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // =========================
    // SUBMIT - add or update
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (start_date && end_date && end_date < start_date) {
            showMessage("End date can't be before the start date.", "error");
            return;
        }

        if (editId) {
            updateProject(editId);
        } else {
            addProject();
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <section className="module">

            <header className="page-header">
                <span className="page-header__icon">📁</span>
                <div>
                    <h1 className="page-header__title">
                        Projects <span className="count-pill">{projects.length}</span>
                    </h1>
                    <p className="page-header__sub">Create and manage projects.</p>
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
                        {editId ? `Edit Project #${editId}` : "Add Project"}
                    </h2>

                    <div className="form-grid">

                        <label className="field field--full">
                            <span className="field__label">Project Name <span className="field__req">*</span></span>
                            <input
                                placeholder="e.g. Customer portal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Description</span>
                            <textarea
                                rows="3"
                                placeholder="Goal and scope"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Start Date <span className="field__req">*</span></span>
                            <input
                                type="date"
                                value={start_date}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">End Date</span>
                            <input
                                type="date"
                                value={end_date}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Status <span className="field__req">*</span></span>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                                {STATUSES.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </label>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Update Project" : "Add Project"}
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
                        <button className="btn btn--ghost" onClick={viewProjects}>
                            ↻ Refresh
                        </button>
                    </div>

                    {projects.length === 0 ? (

                        <div className="empty">
                            <h3>No projects yet</h3>
                            <p>Create your first project.</p>
                        </div>

                    ) : (

                        <div className="record-grid">

                            {projects.map((project) => (

                                <article key={project.id} className={`record ${editId === project.id ? "is-editing" : ""}`}>

                                    <header className="record__head record__head--split">
                                        <h3>{project.name}</h3>
                                        <span className={`badge badge--${STATUS_COLOR[project.status] || "neutral"}`}>
                                            {project.status || "No status"}
                                        </span>
                                    </header>

                                    {project.description && <p className="record__text">{project.description}</p>}

                                    <dl className="record__meta">
                                        <div><dt>Start</dt><dd>{toDateInput(project.start_date) || "—"}</dd></div>
                                        <div><dt>End</dt><dd>{toDateInput(project.end_date) || "—"}</dd></div>
                                    </dl>

                                    <footer className="record__actions">
                                        <span className="record__id">#{project.id}</span>
                                        <button className="btn btn--sm btn--ghost" onClick={() => editProject(project)}>
                                            Edit
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => deleteProject(project)}>
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

export default Projects;