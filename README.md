# 🗡️ Personal Website — Nicky (Ziyang) Tian

A pixel-art, game-styled personal portfolio. Instead of the usual scrolling résumé, every section is a hand-built **pixel scene** — a meadow, a snowy peak, a blacksmith's forge, a moonlit campfire, a New York street — populated with cameo characters, secret creatures, and animated details.

Built as a single-page app with a retro **game-HUD** wrapping live, interactive scenes.

---

## 🎮 The Tabs

Each tab is its own illustrated world with a matching info panel:

| Tab | Scene | Holds |
|-----|-------|-------|
| **About** | Misty pine forest at dusk | Bio, a floating sky-tower, Rayquaza, Esquie, Barry the bear, a Plants vs. Zombies cameo |
| **Skills** | Glowing crystal cavern | Tech stack as collectible gems (one's a hidden face 👀) |
| **Experience** | Blacksmith's forge | Work history, with display items on the walls + Claptrap & Starfly |
| **Education** | Minecraft village | Studies, guarded by Steve, a Villager, a Creeper, an Enderman & a Reaper Leviathan |
| **Projects** | New York street | Project log, watched over by Drifter, Dynamo, Kelvin, Infernus, Viscous, Rem, the Doorman & the Batmobile |
| **Achievements** | Snowy mountain peak | Highlights, beneath an ominous glowing tower and the dragon Caligo |
| **Contact** | Moonlit campfire | Get in touch — with Volatile, Excalibur & a Sneaky Golem lurking in the dark |

> Tip: hover around and look closely — there are a lot of little characters hiding in each scene.

---

## 🛠️ Built With

- **React 18** (via in-browser Babel — no build step)
- **Hand-drawn SVG pixel art** — every scene, character, and animation is composed in code
- **Plain CSS** for the game-HUD chrome, responsive layout, and the retro look
- Character **sprites** keyed out and embedded as data-URIs in `src/*-data.jsx`

No framework CLI, no bundler required — it's just HTML, JSX, CSS, and a folder of art.

---

## 📁 Structure

```
index.html              # entry point — loads React + all scripts
src/
  app.jsx               # top-level layout & tab state
  scenes.jsx            # all seven pixel scenes + sprite helpers
  panels.jsx            # the info panels / quest-style content
  data.jsx              # résumé content (projects, experience, etc.)
  styles.css            # HUD chrome, layout, responsive rules
  *-data.jsx            # embedded character sprites (base64)
assets/                 # source PNG sprites
```

---

## 🚀 Running it

It loads its scripts over HTTP, so **double-clicking `index.html` won't work** (the browser blocks `file://` fetches). Serve it instead:

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just deploy — any static host (Vercel, Netlify, GitHub Pages) serves it as-is, no build step.

---

## 📱 Responsive

Scales from ultrawide desktop down to phones — on small screens the scenes letterbox cleanly and the tab navigation collapses to a single arrow-paged view so nothing stretches off-screen.

---

*Made with a lot of tiny rectangles.*
