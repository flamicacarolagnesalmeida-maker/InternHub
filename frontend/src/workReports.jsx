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

function WorkReports() {

    // =========================
    // FORM VALUES
    // =========================

    const [intern_id, setInternId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [report_date, setReportDate] = useState(today);

    const [reports, setReports] = useState([]);
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
        setTitle("");
        setDescription("");
        setReportDate(today);
        setEditId(null);
    };

    const internName = (id) => {
        const intern = interns.find((i) => String(i.id) === String(id));
        return intern ? intern.name : `Intern #${id}`;
    };


    // =========================
    // READ - GET
    // =========================

    const viewReports = async () => {

        try {

            const response = await fetch("http://localhost:3000/work-reports", {
                method: "GET"
            });

            const data = await response.json();

            console.log(data);

            setReports(data.data || []);

        } catch (error) {

            console.log("Work reports could not be fetched");
            showMessage("Could not load reports. Is the backend running?", "error");

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
        viewReports();
        loadInterns();
    }, []);


    // =========================
    // CREATE - POST
    // =========================

    const addReport = async () => {

        try {

            const response = await fetch("http://localhost:3000/work-reports", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    intern_id: Number(intern_id),
                    title: title,
                    description: description,
                    report_date: report_date
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Work report could not be added.", "error");
                return;
            }

            showMessage("Report submitted.", "success");
            clearForm();
            viewReports();

        } catch (error) {

            console.log("Work report could not be added");
            showMessage("Work report could not be added.", "error");

        }
    };


    // =========================
    // UPDATE - PUT
    // =========================

    const updateReport = async (id) => {

        try {

            const response = await fetch(`http://localhost:3000/work-reports/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    intern_id: Number(intern_id),
                    title: title,
                    description: description,
                    report_date: report_date
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Work report could not be updated.", "error");
                return;
            }

            showMessage("Report updated.", "success");
            clearForm();
            viewReports();

        } catch (error) {

            console.log("Work report could not be updated");
            showMessage("Work report could not be updated.", "error");

        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteReport = async (report) => {

        if (!window.confirm(`Delete report "${report.title}"?`)) return;

        try {

            const response = await fetch(`http://localhost:3000/work-reports/${report.id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Work report could not be deleted.", "error");
                return;
            }

            if (editId === report.id) clearForm();

            showMessage("Report deleted.", "success");
            viewReports();

        } catch (error) {

            console.log("Work report could not be deleted");
            showMessage("Work report could not be deleted.", "error");

        }
    };


    // =========================
    // EDIT
    // =========================

    const editReport = (report) => {

        setEditId(report.id);

        setInternId(report.intern_id ? String(report.intern_id) : "");
        setTitle(report.title || "");
        setDescription(report.description || "");
        setReportDate(toDateInput(report.report_date));

        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // =========================
    // SUBMIT - add or update
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (editId) {
            updateReport(editId);
        } else {
            addReport();
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <section className="module">

            <header className="page-header">
                <span className="page-header__icon">📝</span>
                <div>
                    <h1 className="page-header__title">
                        Work Reports <span className="count-pill">{reports.length}</span>
                    </h1>
                    <p className="page-header__sub">Submit, view, edit and delete reports.</p>
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
                        {editId ? `Edit Report #${editId}` : "Submit Work Report"}
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
                            <span className="field__label">Report Title <span className="field__req">*</span></span>
                            <input
                                placeholder="e.g. Week 3 progress"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Description <span className="field__req">*</span></span>
                            <textarea
                                rows="5"
                                placeholder="What was done, blockers, next steps..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Report Date <span className="field__req">*</span></span>
                            <input
                                type="date"
                                value={report_date}
                                onChange={(e) => setReportDate(e.target.value)}
                                required
                            />
                        </label>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Update Report" : "Submit Report"}
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
                        <button className="btn btn--ghost" onClick={viewReports}>
                            ↻ Refresh
                        </button>
                    </div>

                    {reports.length === 0 ? (

                        <div className="empty">
                            <h3>No reports yet</h3>
                            <p>Submit the first work report.</p>
                        </div>

                    ) : (

                        <div className="record-grid">

                            {reports.map((report) => (

                                <article key={report.id} className={`record ${editId === report.id ? "is-editing" : ""}`}>

                                    <header className="record__head">
                                        <span className="avatar">{initials(internName(report.intern_id))}</span>
                                        <div className="record__heading">
                                            <h3>{report.title}</h3>
                                            <p>{internName(report.intern_id)} · {toDateInput(report.report_date)}</p>
                                        </div>
                                    </header>

                                    {report.description && (
                                        <p className="record__text record__text--long">{report.description}</p>
                                    )}

                                    <footer className="record__actions">
                                        <span className="record__id">#{report.id}</span>
                                        <button className="btn btn--sm btn--ghost" onClick={() => editReport(report)}>
                                            Edit
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => deleteReport(report)}>
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

export default WorkReports;