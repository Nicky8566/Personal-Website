/* eslint-disable */
/* Panel content for each tab. */

const { useState } = React;

function PanelHead({ title, sub }) {
  return (
    <div className="panel-head">
      <h2>{title}</h2>
      <div className="panel-sub">{sub}</div>
    </div>
  );
}

/* QuestSelect — chapter-style nav for paginating multi-entry panels.
   Renders a row of numbered buttons + the active item below. */
function QuestSelect({ items, labels, render, color }) {
  const [idx, setIdx] = useState(0);
  const cur = items[Math.min(idx, items.length - 1)];
  return (
    <>
      <div className="quest-nav">
        <button
          className="quest-arrow"
          onClick={() => setIdx((idx - 1 + items.length) % items.length)}
          aria-label="previous"
        >◀</button>
        <div className="quest-chips">
          {items.map((it, i) => (
            <button
              key={i}
              className={"quest-chip" + (i === idx ? " active" : "")}
              onClick={() => setIdx(i)}
              style={i === idx && color ? { boxShadow: `inset 0 0 0 2px #000, inset 0 0 0 4px ${color}, 0 4px 0 0 #000` } : null}
              title={labels?.[i] || ""}
            >
              <span className="quest-num">{String(i + 1).padStart(2, "0")}</span>
              {labels?.[i] && <span className="quest-label">{labels[i]}</span>}
            </button>
          ))}
        </div>
        <button
          className="quest-arrow"
          onClick={() => setIdx((idx + 1) % items.length)}
          aria-label="next"
        >▶</button>
      </div>
      <div className="quest-body" key={idx}>{render(cur, idx)}</div>
    </>
  );
}

function AboutPanel() {
  const cv = window.CV;
  return (
    <div className="panel">
      <PanelHead title="About" sub="// character.bio()" />
      <p style={{ fontSize: 17 }}>{cv.summary}</p>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="k">CLASS</div>
          <div className="v">Software Engineer</div>
        </div>
        <div className="stat-card">
          <div className="k">RACE</div>
          <div className="v">Human · NZ</div>
        </div>
        <div className="stat-card">
          <div className="k">LEVEL</div>
          <div className="v">21 · Final Year</div>
        </div>
        <div className="stat-card">
          <div className="k">GUILD</div>
          <div className="v">UoA · WDCC</div>
        </div>
        <div className="stat-card">
          <div className="k">WEAPON</div>
          <div className="v">TypeScript</div>
        </div>
        <div className="stat-card">
          <div className="k">RESPAWN</div>
          <div className="v">Auckland, NZ</div>
        </div>
      </div>
      <div className="dialog" style={{ marginTop: 18 }}>
        Welcome, traveller. Each tab is its own realm — pick one and explore.
      </div>
    </div>
  );
}

function SkillsPanel() {
  const skills = window.CV.skills;
  return (
    <div className="panel">
      <PanelHead title="Skills" sub="// inventory.equipped()" />
      {Object.entries(skills).map(([group, items]) => (
        <div className="skill-group" key={group}>
          <h3>{group.toUpperCase()}</h3>
          <div className="chips">
            {items.map(s => <span className="chip" key={s}>{s}</span>)}
          </div>
        </div>
      ))}
      <div className="dialog">
        Crystals hum quietly. Each one's a tool I've sharpened on a real project.
      </div>
    </div>
  );
}

function EducationPanel() {
  const cv = window.CV;
  const items = [
    ...cv.education,
    { school: "NCEA Level 2 & 3", degree: "Endorsed with Excellence", location: "—", period: "Pre-2022", details: ["High-school qualification, double-endorsed."] },
  ];
  const labels = items.map(e => e.school.replace("University of ", "").replace("NCEA ", "NCEA ").slice(0, 16));
  return (
    <div className="panel">
      <PanelHead title="Education" sub="// quest.log/scholarly" />
      <QuestSelect
        items={items}
        labels={labels}
        color="#ffd866"
        render={(e) => (
          <div className="entry">
            <div className="entry-head">
              <h3>{e.school}</h3>
              <div className="when">{e.period}</div>
            </div>
            <div className="where">{e.degree}{e.location !== "—" ? ` · ${e.location}` : ""}</div>
            <ul>
              {e.details.map((d, j) => <li key={j}>{d}</li>)}
            </ul>
          </div>
        )}
      />
      <div className="dialog">Torches flicker in the library windows. Lessons in progress…</div>
    </div>
  );
}

function ExperiencePanel() {
  const cv = window.CV;
  const items = [
    ...cv.experience.map(e => ({ ...e, kind: "work" })),
    ...cv.clubs.map(c => ({ company: c.name, role: c.role, period: c.period, location: "Auckland, NZ", bullets: [c.blurb], kind: "club" })),
  ];
  const labels = items.map(e => e.company.replace(/\s+—\s+.*/, "").replace(/^Web Development.*/, "WDCC").slice(0, 12));
  return (
    <div className="panel">
      <PanelHead title="Experience" sub="// forge.history()" />
      <QuestSelect
        items={items}
        labels={labels}
        color="#ff8a3a"
        render={(x) => (
          <div className="entry">
            <div className="entry-head">
              <h3>{x.role} · <span style={{ color: "var(--accent)" }}>{x.company}</span></h3>
              <div className="when">{x.period}</div>
            </div>
            <div className="where">{x.location}{x.kind === "club" ? " · Club" : ""}</div>
            <ul>
              {x.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        )}
      />
      <div className="dialog">Hammer and sparks. Every shift, a little better.</div>
    </div>
  );
}

function ProjectsPanel() {
  const cv = window.CV;
  const items = [
    ...cv.projects,
    { name: "[ slot empty ]", role: "—", period: "soon", tech: [], bullets: ["Side projects not yet catalogued. The chest gets fuller every semester."], placeholder: true },
  ];
  const labels = items.map(p => p.name
    .replace("Project Zombie — Roguelite", "P.ZOMBIE")
    .replace("APParel — Interactive Web CTF Lab", "APPAREL CTF")
    .replace("Solar-Powered Micro Data Centre", "SOLAR MDC")
    .replace("AUSA Website — WDCC", "AUSA")
    .replace("Guess Who", "GUESS WHO")
    .replace("[ slot empty ]", "EMPTY")
    .slice(0, 14));
  return (
    <div className="panel">
      <PanelHead title="Projects" sub="// loot.inspect()" />
      <QuestSelect
        items={items}
        labels={labels}
        color="#b48cff"
        render={(p) => (
          <div className={"entry" + (p.placeholder ? " entry-empty" : "")}>
            <div className="entry-head">
              <h3>{p.name}</h3>
              <div className="when">{p.period}</div>
            </div>
            {p.role !== "—" && <div className="where">{p.role}</div>}
            <ul>
              {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
            {p.tech && p.tech.length > 0 && (
              <div className="tech">
                {p.tech.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
            )}
          </div>
        )}
      />
      <div className="dialog">Gold glints. Pick a slot to inspect the loot inside.</div>
    </div>
  );
}

function AchievementsPanel() {
  const cv = window.CV;
  const items = cv.achievements;
  const labels = items.map((a, i) => `★${i + 1}`);
  return (
    <div className="panel">
      <PanelHead title="Achievements" sub="// trophies.unlocked()" />
      <QuestSelect
        items={items}
        labels={labels}
        color="#fff"
        render={(a) => (
          <div className="entry">
            <div className="entry-head">
              <h3 style={{ color: "var(--accent-2)" }}>★ {a.title}</h3>
            </div>
            {a.bullets.length > 0 ? (
              <ul>
                {a.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            ) : (
              <p style={{ color: "var(--ink-dim)" }}>Unlocked.</p>
            )}
          </div>
        )}
      />
      <div className="dialog">Wind whistles past the peak. Plant a flag, descend, repeat.</div>
    </div>
  );
}

function ContactPanel() {
  const c = window.CV.contact;
  return (
    <div className="panel">
      <PanelHead title="Contact" sub="// open.dialog()" />
      <p style={{ fontSize: 17 }}>
        Sit by the fire. I'm open to a chat — internships, collabs, game-dev experiments, or just a kōrero about tech.
      </p>
      <div className="contact-grid">
        <a className="contact-card" href={"mailto:" + c.email}>
          <div className="k">EMAIL</div>
          <div className="v">{c.email}</div>
        </a>
        <a className="contact-card" href={c.githubUrl} target="_blank" rel="noreferrer">
          <div className="k">GITHUB</div>
          <div className="v">@{c.github}</div>
        </a>
        <a className="contact-card" href={c.linkedinUrl} target="_blank" rel="noreferrer">
          <div className="k">LINKEDIN</div>
          <div className="v">{c.linkedin}</div>
        </a>
      </div>
      <div className="dialog">
        Press F to pay respects. Press anything else to drop me a line.
      </div>
    </div>
  );
}

window.Panels = {
  about: AboutPanel,
  skills: SkillsPanel,
  education: EducationPanel,
  experience: ExperiencePanel,
  projects: ProjectsPanel,
  achievements: AchievementsPanel,
  contact: ContactPanel,
};
