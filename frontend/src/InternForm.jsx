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

// "Ananya Sharma" -> "AS"
function initials(name) {
    if (!name) return "?";
    return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

function Interns() {

    // =========================
    // FORM VALUES
    // =========================

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");
    const [joining_date, setJoiningDate] = useState("");

    // Interns received from the backend
    const [interns, setInterns] = useState([]);

    // ID of the intern being edited (null = adding a new one)
    const [editId, setEditId] = useState(null);

    // Success / error message shown at the top
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");


    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const clearForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setCourse("");
        setDepartment("");
        setJoiningDate("");
        setEditId(null);
    };


    // =========================
    // READ - GET
    // =========================

    const viewIntern = async () => {

        try {

            const response = await fetch("http://localhost:3000/interns", {
                method: "GET"
            });

            const data = await response.json();

            console.log(data);

            // "|| []" stops .map() crashing if data.data is missing
            setInterns(data.data || []);

        } catch (error) {

            console.log("Data could not be fetched");
            showMessage("Could not load interns. Is the backend running?", "error");

        }
    };

    // Load the list once when the page opens
    useEffect(() => {
        viewIntern();
    }, []);


    // =========================
    // CREATE - POST
    // =========================

    const addIntern = async () => {

        try {

            const response = await fetch("http://localhost:3000/interns", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    course: course,
                    department: department,
                    joining_date: joining_date
                })
            });

            const data = await response.json();

            console.log(data);

            // fetch does NOT throw on 400/500 errors, so check it ourselves
            if (!response.ok) {
                showMessage("Intern could not be added.", "error");
                return;
            }

            showMessage("Intern added.", "success");
            clearForm();
            viewIntern();

        } catch (error) {

            console.log("Error:", error);
            showMessage("Intern could not be added.", "error");

        }
    };


    // =========================
    // UPDATE - PUT
    // =========================

    const updateIntern = async (id) => {

        try {

            const response = await fetch(`http://localhost:3000/interns/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    course: course,
                    department: department,
                    joining_date: joining_date
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Intern could not be updated.", "error");
                return;
            }

            showMessage("Intern updated.", "success");
            clearForm();
            viewIntern();

        } catch (error) {

            console.log("Data could not be updated");
            showMessage("Intern could not be updated.", "error");

        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteIntern = async (intern) => {

        if (!window.confirm(`Delete ${intern.name}?`)) return;

        try {

            const response = await fetch(`http://localhost:3000/interns/${intern.id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Intern could not be deleted.", "error");
                return;
            }

            if (editId === intern.id) clearForm();

            showMessage("Intern deleted.", "success");
            viewIntern();

        } catch (error) {

            console.log("Data could not be deleted");
            showMessage("Intern could not be deleted.", "error");

        }
    };


    // =========================
    // EDIT - put the intern's values into the form
    // =========================

    const editIntern = (intern) => {

        setEditId(intern.id);

        // "|| ''" stops errors when a value is null in the database
        setName(intern.name || "");
        setEmail(intern.email || "");
        setPhone(intern.phone || "");
        setCourse(intern.course || "");
        setDepartment(intern.department || "");
        setJoiningDate(toDateInput(intern.joining_date));

        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // =========================
    // SUBMIT - add or update
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault(); // stops the page from reloading

        if (editId) {
            updateIntern(editId);
        } else {
            addIntern();
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <section className="module">

            <header className="page-header">
                <span className="page-header__icon">👥</span>
                <div>
                    <h1 className="page-header__title">
                        Interns <span className="count-pill">{interns.length}</span>
                    </h1>
                    <p className="page-header__sub">Add, view, edit and delete intern records.</p>
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
                        {editId ? `Edit Intern #${editId}` : "Add Intern"}
                    </h2>

                    <div className="form-grid">

                        <label className="field field--full">
                            <span className="field__label">Name <span className="field__req">*</span></span>
                            <input
                                placeholder="e.g. Ananya Sharma"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Email <span className="field__req">*</span></span>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Phone</span>
                            <input
                                placeholder="98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Course</span>
                            <input
                                placeholder="e.g. B.Tech CSE"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Department</span>
                            <input
                                placeholder="e.g. Engineering"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Joining Date <span className="field__req">*</span></span>
                            <input
                                type="date"
                                value={joining_date}
                                onChange={(e) => setJoiningDate(e.target.value)}
                                required
                            />
                        </label>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Update Intern" : "Add Intern"}
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
                        <button className="btn btn--ghost" onClick={viewIntern}>
                            ↻ Refresh
                        </button>
                    </div>

                    {interns.length === 0 ? (

                        <div className="empty">
                            <h3>No interns yet</h3>
                            <p>Add your first intern using the form.</p>
                        </div>

                    ) : (

                        <div className="record-grid">

                            {interns.map((intern) => (

                                <article key={intern.id} className={`record ${editId === intern.id ? "is-editing" : ""}`}>

                                    <header className="record__head">
                                        <span className="avatar">{initials(intern.name)}</span>
                                        <div className="record__heading">
                                            <h3>{intern.name}</h3>
                                            <p>{intern.email}</p>
                                        </div>
                                    </header>

                                    <dl className="record__meta">
                                        <div><dt>Phone</dt><dd>{intern.phone || "—"}</dd></div>
                                        <div><dt>Course</dt><dd>{intern.course || "—"}</dd></div>
                                        <div><dt>Department</dt><dd>{intern.department || "—"}</dd></div>
                                        <div><dt>Joined</dt><dd>{toDateInput(intern.joining_date) || "—"}</dd></div>
                                    </dl>

                                    <footer className="record__actions">
                                        <span className="record__id">#{intern.id}</span>
                                        <button className="btn btn--sm btn--ghost" onClick={() => editIntern(intern)}>
                                            Edit
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => deleteIntern(intern)}>
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

export default Interns;