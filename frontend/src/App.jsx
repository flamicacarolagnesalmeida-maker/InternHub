import { useEffect, useState } from "react";
import "./App.css";

import Landing from "./landing";
import Icon from "./Icon";
import Interns from "./InternForm";
import Tasks from "./tasks";
import Projects from "./projects";
import Attendance from "./attendence";
import WorkReports from "./workReports";
import Feedback from "./feedback";

// One entry per module: used by the sidebar AND the landing page
const MODULES = [
  { id: "interns", label: "Interns", icon: "users", tone: "purple", component: Interns,
    blurb: "Add, view, edit and delete intern records — contact details, course, department and joining date." },
  { id: "tasks", label: "Tasks", icon: "tasks", tone: "plum", component: Tasks,
    blurb: "Create tasks, assign them to interns and projects, set due dates and track status." },
  { id: "projects", label: "Projects", icon: "folder", tone: "red", component: Projects,
    blurb: "Create and manage projects with start and end dates and a live timeline." },
  { id: "attendance", label: "Attendance", icon: "calendar", tone: "orange", component: Attendance,
    blurb: "Record daily attendance in a couple of taps and see the day's totals at a glance." },
  { id: "work-reports", label: "Work Reports", icon: "report", tone: "amber", component: WorkReports,
    blurb: "Interns submit progress reports; mentors view, edit or remove them." },
  { id: "feedback", label: "Feedback", icon: "star", tone: "yellow", component: Feedback,
    blurb: "Give star-rated performance feedback and keep a history for every intern." },
];

// =========================
// Tiny router using the URL hash:  #/            -> landing
//                                  #/interns     -> Interns module
// (No extra library needed, and the browser Back button works.)
// =========================
const readHash = () => window.location.hash.replace(/^#\/?/, "");

function useHashRoute() {
  const [route, setRoute] = useState(readHash);
  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = (to) => {
    window.location.hash = `/${to}`;
    window.scrollTo(0, 0);
  };
  return [route, navigate];
}

function App() {
  const [route, navigate] = useHashRoute();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const current = MODULES.find((m) => m.id === route);

  // Landing page
  if (!current) return <Landing modules={MODULES} onOpen={navigate} />;

  const Page = current.component;
  const go = (id) => {
    setMenuOpen(false);
    navigate(id);
  };

  // Dashboard
  return (
    <div className="shell">
      {/* Mobile top bar */}
      <header className="topbar">
        <button className="icon-btn icon-btn--light" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Icon name="menu" size={22} />
        </button>
        <a href="#/" className="brand brand--light">
          <span className="brand__mark" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
          InternHub
        </a>
      </header>

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="sidebar__top">
          <a href="#/" className="brand brand--light">
            <span className="brand__mark" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
            InternHub
          </a>
          <button className="icon-btn icon-btn--light sidebar__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Modules">
          {MODULES.map((m) => (
            <button
              key={m.id}
              className={`nav-item ${m.id === current.id ? "is-active" : ""}`}
              aria-current={m.id === current.id ? "page" : undefined}
              onClick={() => go(m.id)}
            >
              <span className={`nav-item__dot tone-${m.tone}`} />
              <Icon name={m.icon} size={19} />
              {m.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__foot">
          <button className="nav-item" onClick={() => go("")}>
            <Icon name="home" size={19} /> Back to home
          </button>
          <div className="sidebar__palette" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </div>
        </div>
      </aside>

      <main className="main" key={current.id}>
        <Page />
      </main>
    </div>
  );
}

export default App;
