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

const today = toDateInput(new Date().toISOString());

const STATUSES = ["Present", "Absent", "Late", "Half Day", "Leave"];

// Colour for each status (matches classes in App.css)
const STATUS_COLOR = {
    "Present": "plum",
    "Absent": "red",
    "Late": "amber",
    "Half Day": "amber",
    "Leave": "purple"
};

function Attendance() {

    // =========================
    // FORM VALUES
    // =========================

    const [intern_id, setInternId] = useState("");
    const [date, setDate] = useState(today);
    const [status, setStatus] = useState("Present");

    const [attendance, setAttendance] = useState([]);
    const [interns, setInterns] = useState([]);
    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");


    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const clearForm = () => {
        setInternId("");
        setDate(today);
        setStatus("Present");
        setEditId(null);
    };

    const internName = (id) => {
        const intern = interns.find((i) => String(i.id) === String(id));
        return intern ? intern.name : `Intern #${id}`;
    };


    // =========================
    // READ - GET
    // =========================

    const viewAttendance = async () => {

        try {

            const response = await fetch("http://localhost:3000/attendance", {
                method: "GET"
            });

            const data = await response.json();

            console.log(data);

            setAttendance(data.data || []);

        } catch (error) {

            console.log("Attendance could not be fetched");
            showMessage("Could not load attendance. Is the backend running?", "error");

        }
    };

    // Interns for the dropdown
    const loadInterns = async () => {

        try {

            const response = await fetch("http://localhost:3000/interns");
            const data = await response.json();
            setInterns(data.data || []);

        } catch (error) {

            console.log("Interns could not be fetched");

        }
    };

    useEffect(() => {
        viewAttendance();
        loadInterns();
    }, []);


    // =========================
    // CREATE - POST
    // =========================

    const addAttendance = async () => {

        try {

            const response = await fetch("http://localhost:3000/attendance", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    intern_id: Number(intern_id),
                    date: date,
                    status: status
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Attendance could not be added.", "error");
                return;
            }

            showMessage("Attendance recorded.", "success");
            clearForm();
            viewAttendance();

        } catch (error) {

            console.log("Attendance could not be added");
            showMessage("Attendance could not be added.", "error");

        }
    };


    // =========================
    // UPDATE - PUT
    // =========================

    const updateAttendance = async (id) => {

        try {

            const response = await fetch(`http://localhost:3000/attendance/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    intern_id: Number(intern_id),
                    date: date,
                    status: status
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Attendance could not be updated.", "error");
                return;
            }

            showMessage("Attendance updated.", "success");
            clearForm();
            viewAttendance();

        } catch (error) {

            console.log("Attendance could not be updated");
            showMessage("Attendance could not be updated.", "error");

        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteAttendance = async (item) => {

        if (!window.confirm("Delete this attendance record?")) return;

        try {

            const response = await fetch(`http://localhost:3000/attendance/${item.id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Attendance could not be deleted.", "error");
                return;
            }

            if (editId === item.id) clearForm();

            showMessage("Record deleted.", "success");
            viewAttendance();

        } catch (error) {

            console.log("Attendance could not be deleted");
            showMessage("Attendance could not be deleted.", "error");

        }
    };


    // =========================
    // EDIT
    // =========================

    const editAttendance = (item) => {

        setEditId(item.id);

        setInternId(item.intern_id ? String(item.intern_id) : "");
        setDate(toDateInput(item.date));
        setStatus(item.status || "Present");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // =========================
    // SUBMIT - add or update
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (editId) {
            updateAttendance(editId);
        } else {
            addAttendance();
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <section className="module">

            <header className="page-header">
                <span className="page-header__icon">📅</span>
                <div>
                    <h1 className="page-header__title">
                        Attendance <span className="count-pill">{attendance.length}</span>
                    </h1>
                    <p className="page-header__sub">Record and manage daily attendance.</p>
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
                        {editId ? `Edit Record #${editId}` : "Record Attendance"}
                    </h2>

                    <div className="form-grid">

                        <label className="field field--full">
                            <span className="field__label">Intern <span className="field__req">*</span></span>
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
                            <span className="field__label">Date <span className="field__req">*</span></span>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>

                        <div className="field field--full">
                            <span className="field__label">Status <span className="field__req">*</span></span>

                            {/* One button per status; the selected one is filled in */}
                            <div className="pills">
                                {STATUSES.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        className={`pill pill--${STATUS_COLOR[s]} ${status === s ? "is-on" : ""}`}
                                        onClick={() => setStatus(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Update Attendance" : "Record Attendance"}
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
                        <button className="btn btn--ghost" onClick={viewAttendance}>
                            ↻ Refresh
                        </button>
                    </div>

                    {attendance.length === 0 ? (

                        <div className="empty">
                            <h3>No records yet</h3>
                            <p>Record today's attendance using the form.</p>
                        </div>

                    ) : (

                        <div className="record-grid record-grid--compact">

                            {attendance.map((item) => (

                                <article key={item.id} className={`record ${editId === item.id ? "is-editing" : ""}`}>

                                    <header className="record__head">
                                        <span className="avatar">{initials(internName(item.intern_id))}</span>
                                        <div className="record__heading">
                                            <h3>{internName(item.intern_id)}</h3>
                                            <p>{toDateInput(item.date)}</p>
                                        </div>
                                        <span className={`badge badge--${STATUS_COLOR[item.status] || "neutral"}`}>
                                            {item.status}
                                        </span>
                                    </header>

                                    <footer className="record__actions">
                                        <span className="record__id">#{item.id}</span>
                                        <button className="btn btn--sm btn--ghost" onClick={() => editAttendance(item)}>
                                            Edit
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => deleteAttendance(item)}>
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

export default Attendance;