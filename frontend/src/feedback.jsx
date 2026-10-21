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

function Feedback() {

    // =========================
    // FORM VALUES
    // =========================

    const [intern_id, setInternId] = useState("");
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);
    const [date, setDate] = useState(today);

    const [feedbacks, setFeedbacks] = useState([]);
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
        setFeedback("");
        setRating(0);
        setDate(today);
        setEditId(null);
    };

    const internName = (id) => {
        const intern = interns.find((i) => String(i.id) === String(id));
        return intern ? intern.name : `Intern #${id}`;
    };


    // =========================
    // READ - GET
    // =========================

    const viewFeedback = async () => {

        try {

            const response = await fetch("http://localhost:3000/feedback", {
                method: "GET"
            });

            const data = await response.json();

            console.log(data);

            setFeedbacks(data.data || []);

        } catch (error) {

            console.log("Feedback could not be fetched");
            showMessage("Could not load feedback. Is the backend running?", "error");

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
        viewFeedback();
        loadInterns();
    }, []);


    // =========================
    // CREATE - POST
    // =========================

    const addFeedback = async () => {

        try {

            const response = await fetch("http://localhost:3000/feedback", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    intern_id: Number(intern_id),
                    feedback: feedback,
                    rating: rating,
                    date: date
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Feedback could not be added.", "error");
                return;
            }

            showMessage("Feedback added.", "success");
            clearForm();
            viewFeedback();

        } catch (error) {

            console.log("Feedback could not be added");
            showMessage("Feedback could not be added.", "error");

        }
    };


    // =========================
    // UPDATE - PUT
    // =========================

    const updateFeedback = async (id) => {

        try {

            const response = await fetch(`http://localhost:3000/feedback/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    intern_id: Number(intern_id),
                    feedback: feedback,
                    rating: rating,
                    date: date
                })
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Feedback could not be updated.", "error");
                return;
            }

            showMessage("Feedback updated.", "success");
            clearForm();
            viewFeedback();

        } catch (error) {

            console.log("Feedback could not be updated");
            showMessage("Feedback could not be updated.", "error");

        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteFeedback = async (item) => {

        if (!window.confirm("Delete this feedback?")) return;

        try {

            const response = await fetch(`http://localhost:3000/feedback/${item.id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                showMessage("Feedback could not be deleted.", "error");
                return;
            }

            if (editId === item.id) clearForm();

            showMessage("Feedback deleted.", "success");
            viewFeedback();

        } catch (error) {

            console.log("Feedback could not be deleted");
            showMessage("Feedback could not be deleted.", "error");

        }
    };


    // =========================
    // EDIT
    // =========================

    const editFeedback = (item) => {

        setEditId(item.id);

        setInternId(item.intern_id ? String(item.intern_id) : "");
        setFeedback(item.feedback || "");
        setRating(Number(item.rating) || 0);
        setDate(toDateInput(item.date));

        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    // =========================
    // SUBMIT - add or update
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (rating === 0) {
            showMessage("Please choose a rating from 1 to 5.", "error");
            return;
        }

        if (editId) {
            updateFeedback(editId);
        } else {
            addFeedback();
        }
    };


    // =========================
    // UI
    // =========================

    return (
        <section className="module">

            <header className="page-header">
                <span className="page-header__icon">⭐</span>
                <div>
                    <h1 className="page-header__title">
                        Feedback <span className="count-pill">{feedbacks.length}</span>
                    </h1>
                    <p className="page-header__sub">Add and manage performance feedback.</p>
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
                        {editId ? `Edit Feedback #${editId}` : "Add Feedback"}
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

                        <div className="field field--full">
                            <span className="field__label">Rating <span className="field__req">*</span></span>

                            {/* Five star buttons; clicking star 3 sets rating to 3 */}
                            <div className="star-input">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        className={n <= rating ? "is-on" : ""}
                                        onClick={() => setRating(n)}
                                    >
                                        ★
                                    </button>
                                ))}
                                <span className="star-input__label">
                                    {rating ? `${rating} / 5` : "Tap to rate"}
                                </span>
                            </div>
                        </div>

                        <label className="field field--full">
                            <span className="field__label">Feedback <span className="field__req">*</span></span>
                            <textarea
                                rows="4"
                                placeholder="Strengths, areas to improve..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                required
                            />
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

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn--primary">
                            {editId ? "Update Feedback" : "Add Feedback"}
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
                        <button className="btn btn--ghost" onClick={viewFeedback}>
                            ↻ Refresh
                        </button>
                    </div>

                    {feedbacks.length === 0 ? (

                        <div className="empty">
                            <h3>No feedback yet</h3>
                            <p>Add performance feedback for an intern.</p>
                        </div>

                    ) : (

                        <div className="record-grid">

                            {feedbacks.map((item) => (

                                <article key={item.id} className={`record ${editId === item.id ? "is-editing" : ""}`}>

                                    <header className="record__head">
                                        <span className="avatar">{initials(internName(item.intern_id))}</span>
                                        <div className="record__heading">
                                            <h3>{internName(item.intern_id)}</h3>
                                            <p>{toDateInput(item.date)}</p>
                                        </div>
                                        <span className="stars">
                                            {"★".repeat(Number(item.rating) || 0)}
                                            <span className="stars__off">{"★".repeat(5 - (Number(item.rating) || 0))}</span>
                                        </span>
                                    </header>

                                    <blockquote className="record__quote">{item.feedback}</blockquote>

                                    <footer className="record__actions">
                                        <span className="record__id">#{item.id}</span>
                                        <button className="btn btn--sm btn--ghost" onClick={() => editFeedback(item)}>
                                            Edit
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => deleteFeedback(item)}>
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

export default Feedback;