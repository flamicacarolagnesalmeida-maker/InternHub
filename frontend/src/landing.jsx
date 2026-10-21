import Icon from "./Icon";

const STEPS = [
  { title: "Add your interns", text: "Create a profile for each intern with their course, department and joining date." },
  { title: "Plan the work", text: "Set up projects, then create tasks with due dates and assign them to interns." },
  { title: "Track progress", text: "Record attendance daily, collect work reports and give rated feedback." },
];

function Landing({ modules, onOpen }) {
  return (
    <div className="landing">
      {/* ========== NAV ========== */}
      <nav className="lp-nav" aria-label="Main">
        <a href="#/" className="brand" aria-label="InternHub home">
          <span className="brand__mark" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </span>
          InternHub
        </a>
        <div className="lp-nav__links">
          <a href="#modules" onClick={(e) => { e.preventDefault(); document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" }); }}>
            Modules
          </a>
          <a href="#how" onClick={(e) => { e.preventDefault(); document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }); }}>
            How it works
          </a>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => onOpen(modules[0].id)}>
          Open dashboard
        </button>
      </nav>

      {/* ========== HERO ========== */}
      <header className="hero">
        <div className="hero__copy">
          <span className="eyebrow">Internship management, simplified</span>
          <h1 className="hero__title">
            Every intern, task and report in <span className="grad-text">one warm hub.</span>
          </h1>
          <p className="hero__lead">
            InternHub brings interns, projects, tasks, attendance, work reports and feedback together, so mentors
            spend less time chasing spreadsheets and more time mentoring.
          </p>
          <div className="hero__cta">
            <button className="btn btn--primary btn--lg" onClick={() => onOpen(modules[0].id)}>
              Get started <Icon name="arrow" size={18} />
            </button>
            <button className="btn btn--outline btn--lg" onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}>
              Explore modules
            </button>
          </div>
          <ul className="hero__ticks">
            <li><Icon name="check" size={16} /> Six modules</li>
            <li><Icon name="check" size={16} /> Works on any device</li>
            <li><Icon name="check" size={16} /> Full add · view · edit · delete</li>
          </ul>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="stripes">
            <span /><span /><span /><span /><span /><span />
          </div>
          <div className="float-card float-card--a">
            <span className="float-card__icon tone-orange"><Icon name="calendar" size={18} /></span>
            <div><small>Attendance</small><strong>Marked present</strong></div>
          </div>
          <div className="float-card float-card--b">
            <span className="float-card__icon tone-plum"><Icon name="tasks" size={18} /></span>
            <div><small>Task</small><strong>Login page · Completed</strong></div>
          </div>
          <div className="float-card float-card--c">
            <span className="float-card__icon tone-amber"><Icon name="star" size={18} /></span>
            <div><small>Feedback</small><strong className="float-card__stars">★★★★★</strong></div>
          </div>
        </div>
      </header>

      {/* ========== MODULES ========== */}
      <section id="modules" className="lp-section">
        <div className="lp-section__head">
          <span className="eyebrow">What's inside</span>
          <h2>Six modules. Every one fully editable.</h2>
          <p>Each module lets you add, view, edit and delete records, and they're linked, so tasks, attendance, reports and feedback all point back to an intern.</p>
        </div>

        <div className="feature-grid">
          {modules.map((m, i) => (
            <button key={m.id} className="feature" style={{ "--i": i }} onClick={() => onOpen(m.id)}>
              <span className={`feature__icon tone-${m.tone}`}>
                <Icon name={m.icon} size={24} />
              </span>
              <h3>{m.label}</h3>
              <p>{m.blurb}</p>
              <span className="feature__link">
                Open {m.label.toLowerCase()} <Icon name="arrow" size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how" className="lp-section lp-section--tint">
        <div className="lp-section__head">
          <span className="eyebrow">How it works</span>
          <h2>From first day to final review</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta">
        <div className="cta__inner">
          <h2>Ready to organise your internship program?</h2>
          <p>Jump into the dashboard and add your first intern.</p>
          <button className="btn btn--light btn--lg" onClick={() => onOpen(modules[0].id)}>
            Open dashboard <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>

      <footer className="lp-footer">
        <span className="brand brand--sm">
          <span className="brand__mark" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
          InternHub
        </span>
        <span>© {new Date().getFullYear()} InternHub. Built with React.</span>
      </footer>
    </div>
  );
}

export default Landing;