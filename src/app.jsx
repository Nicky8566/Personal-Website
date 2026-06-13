/* eslint-disable */
const { useState, useEffect } = React;

const TABS = [
  { id: "about",        label: "ABOUT",        icon: "#8fe06e" },
  { id: "skills",       label: "SKILLS",       icon: "#6ee7ff" },
  { id: "education",    label: "EDUCATION",    icon: "#ffd866" },
  { id: "experience",   label: "EXPERIENCE",   icon: "#ff8a3a" },
  { id: "projects",     label: "PROJECTS",     icon: "#b48cff" },
  { id: "achievements", label: "ACHIEVEMENTS", icon: "#fff" },
  { id: "contact",      label: "CONTACT",      icon: "#ffa040" },
];

function App() {
  const [tab, setTab] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && TABS.find(t => t.id === hash)) return hash;
    }
    return "about";
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ntheme") || "night";
    }
    return "night";
  });

  useEffect(() => {
    document.body.classList.toggle("day", theme === "day");
    localStorage.setItem("ntheme", theme);
  }, [theme]);

  useEffect(() => {
    window.location.hash = tab;
  }, [tab]);

  const Panel = window.Panels[tab];

  return (
    <>
      <window.SceneStage active={tab} />
      <div className="vignette" />
      <div className="scanlines" />

      <header className="hud">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div>
            <div className="brand-name">NICKY TIAN</div>
            <div className="brand-sub">~/adventurer's log</div>
          </div>
        </div>
        <div className="hud-right">
          <div className="bar hp">
            <span className="bar-label">HP</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: "88%" }} /></div>
          </div>
          <div className="bar xp">
            <span className="bar-label">XP</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: "72%" }} /></div>
          </div>
          <button className="toggle-btn" onClick={() => setTheme(theme === "night" ? "day" : "night")}>
            {theme === "night" ? "☾ NIGHT" : "☀ DAY"}
          </button>
        </div>
      </header>

      <main className="stage">
        <aside className="character">
          <div className="portrait-frame">
            <img src="assets/avatar.png" alt="Nicky" />
            <div className="lvl-badge">LV 21</div>
          </div>
          <h1>{window.CV.name}</h1>
          <div className="class">SOFTWARE ENGINEER</div>
          <div className="stat-row">
            <div className="stat"><div className="v">∞</div><div className="k">CURIOSITY</div></div>
            <div className="stat"><div className="v">99</div><div className="k">FOCUS</div></div>
            <div className="stat"><div className="v">42</div><div className="k">CAFFEINE</div></div>
          </div>
          <div className="socials">
            <a href={window.CV.contact.githubUrl} target="_blank" rel="noreferrer">
              <span className="glyph" style={{ background: "#b48cff" }} />
              <span className="social-label">GitHub</span>
              <span className="social-handle">@{window.CV.contact.github}</span>
            </a>
            <a href={window.CV.contact.linkedinUrl} target="_blank" rel="noreferrer">
              <span className="glyph" style={{ background: "#6ee7ff" }} />
              <span className="social-label">LinkedIn</span>
              <span className="social-handle">{window.CV.contact.linkedin}</span>
            </a>
            <a href={"mailto:" + window.CV.contact.email}>
              <span className="glyph" style={{ background: "#ffd866" }} />
              <span className="social-label">Email</span>
              <span className="social-handle">↗</span>
            </a>
          </div>
          <div className="tiny" style={{ marginTop: 14, textAlign: "center" }}>
            v1.0 — built with ♥ + react
          </div>
        </aside>

        <section className="panel-wrap">
          <div className="tabs" role="tablist">
            {TABS.map(t => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={"tab" + (tab === t.id ? " active" : "")}
                onClick={() => setTab(t.id)}
              >
                <span className="tab-icon" style={{ background: t.icon }} />
                {t.label}
              </button>
            ))}
          </div>
          {Panel && <Panel key={tab} />}
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
