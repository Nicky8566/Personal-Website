/* eslint-disable */
/* Pure pixel-art scenes — only rectangles, with Terraria-style multi-shade pixel art.
   Each scene draws into an SVG with shape-rendering="crispEdges". */

const { useMemo } = React;

/* ---------- helpers ---------- */

// A pixel "sprite" built from a bitmap of single-character cells.
// rows: array of strings; palette: { [ch]: color | null }. Use ' ' or '.' for transparent.
function Sprite({ x = 0, y = 0, rows, palette }) {
  const rects = [];
  for (let r = 0; r < rows.length; r++) {
    let runStart = -1;
    let runColor = null;
    for (let c = 0; c <= rows[r].length; c++) {
      const ch = rows[r][c];
      const color = ch === undefined ? null : (palette[ch] ?? null);
      if (color !== runColor) {
        if (runColor != null && runStart >= 0) {
          rects.push(
            <rect
              key={`${r}-${runStart}`}
              x={x + runStart}
              y={y + r}
              width={c - runStart}
              height={1}
              fill={runColor}
            />
          );
        }
        runStart = c;
        runColor = color;
      }
    }
  }
  return <>{rects}</>;
}

function Particles({ count = 24, kind = "dust", color = "#fff" }) {
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.round(Math.random() * 2) * 2,
        delay: -Math.random() * 12,
        dur: 6 + Math.random() * 12,
      });
    }
    return arr;
  }, [count, kind, color]);

  const anim =
    kind === "snow" ? "driftDown"
    : kind === "spark" ? "drift"
    : kind === "firefly" ? "float"
    : kind === "twinkle" ? "twinkle"
    : "drift";

  return (
    <div className="particle-layer" aria-hidden="true">
      {items.map(p => (
        <div
          key={p.i}
          className="particle"
          style={{
            left: p.left + "%",
            top: p.top + "%",
            width: p.size + "px",
            height: p.size + "px",
            background: color,
            boxShadow: kind === "firefly" || kind === "spark"
              ? `0 0 ${p.size}px ${color}`
              : "0 0 0 1px rgba(0,0,0,0.4)",
            animation: `${anim} ${p.dur}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* Wind — small motes (leaves / embers) tumble across the scene on a breeze. */
function WindLayer({ count = 12, colors = ["#7ac24a"], topRange = [20, 78], dur = [7, 13], glow = false, leaf = true }) {
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const w = leaf ? 4 + Math.round(Math.random() * 2) : 3 + Math.round(Math.random());
      arr.push({
        i,
        top: topRange[0] + Math.random() * (topRange[1] - topRange[0]),
        w,
        h: leaf ? 2 + Math.round(Math.random() * 1) : w,
        delay: -Math.random() * 16,
        dur: dur[0] + Math.random() * (dur[1] - dur[0]),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return arr;
  }, [count, topRange[0], topRange[1], dur[0], dur[1], glow, leaf]);

  return (
    <div className="particle-layer" aria-hidden="true">
      {items.map(p => (
        <div
          key={p.i}
          className="wind-mote"
          style={{
            top: p.top + "%",
            width: p.w + "px",
            height: p.h + "px",
            background: p.color,
            boxShadow: glow ? `0 0 ${p.w + 2}px ${p.color}` : "0 0 0 1px rgba(0,0,0,0.35)",
            animation: `windBlow ${p.dur}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Stars({ count = 40, top = 60 }) {
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        i,
        left: Math.random() * 100,
        top: Math.random() * top,
        size: Math.random() < 0.8 ? 2 : 4,
        delay: -Math.random() * 4,
        dur: 2 + Math.random() * 3,
      });
    }
    return arr;
  }, [count, top]);
  return (
    <div className="particle-layer" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.i}
          style={{
            position: "absolute",
            left: s.left + "%",
            top: s.top + "%",
            width: s.size + "px",
            height: s.size + "px",
            background: "#fff",
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function PixelStage({ vbW = 200, vbH = 112, children }) {
  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {children}
    </svg>
  );
}

function SkyGradient({ stops }) {
  const bg = `linear-gradient(180deg, ${stops.map(s => `${s[1]} ${s[0]}`).join(", ")})`;
  return <div className="sky" style={{ background: bg }} />;
}

/* ---------- shaded pixel-art sprites ----------
   Palettes use:
     H = highlight (light)   M = mid       D = dark   X = darkest/outline
     T = trunk light          t = trunk dark
*/

const PIXEL_CLOUD = {
  rows: [
    "  ##HHH##  ",
    " ##HHHHHHH#",
    "##HHHHHHHHH",
    "##HHHHHHHHH",
    "##MMMMMMMMM",
    " ##MMMMMMM ",
  ],
  palette: { "#": "#eaf2fa", H: "#ffffff", M: "#c8d6e8" },
};

const PIXEL_TREE = {
  // dark outline / mid green body / highlight top-left / trunk
  rows: [
    "  XXXX  ",
    " XHHMMX ",
    "XHHHMMMX",
    "XHHMMMDX",
    "XHMMMMDX",
    "XHMMMDDX",
    " XMMMDX ",
    "XHMMMDX ",
    "XHMMDDDX",
    " XMDDDX ",
    "  XTtX  ",
    "  XTtX  ",
  ],
  palette: { X: "#0a1808", H: "#7ac24a", M: "#3a8a28", D: "#1f5a18", T: "#3a2410", t: "#1a0e08" },
};

const PIXEL_TREE_TALL = {
  // narrower + taller
  rows: [
    "   XX   ",
    "  XHHX  ",
    " XHHMMX ",
    " XHMMDX ",
    "XHHMMMDX",
    "XHMMMDDX",
    " XMMMDX ",
    " XMMMDX ",
    "XHMMDDDX",
    " XMDDDX ",
    "  XMDX  ",
    "  XTtX  ",
    "  XTtX  ",
    "  XTtX  ",
  ],
  palette: { X: "#0a1808", H: "#7ac24a", M: "#3a8a28", D: "#1f5a18", T: "#3a2410", t: "#1a0e08" },
};

const PIXEL_TREE_ROUND = {
  // wider + rounder, classic deciduous
  rows: [
    "  XXXXXX  ",
    " XHHMMMMX ",
    "XHHHMMMMDX",
    "XHHMMMMDDX",
    "XHMMMMMDDX",
    "XHMMMMDDDX",
    " XMMMMDDX ",
    "  XMMDDX  ",
    "   XTtX   ",
    "   XTtX   ",
  ],
  palette: { X: "#0a1808", H: "#7ac24a", M: "#3a8a28", D: "#1f5a18", T: "#3a2410", t: "#1a0e08" },
};

const PIXEL_TREE_AUTUMN = {
  // orange/red autumn variant for variety
  rows: [
    "  XXXX  ",
    " XHHRRX ",
    "XHHMRRRX",
    "XHMMRRDX",
    "XHMRRRDX",
    "XMRRRDDX",
    " XRRRDX ",
    "XMRRRDX ",
    " XRRDDX ",
    "  XTtX  ",
    "  XTtX  ",
  ],
  palette: { X: "#280a04", H: "#ffd066", M: "#ff8838", R: "#e85820", D: "#a83a10", T: "#3a2410", t: "#1a0e08" },
};

const PIXEL_BUSH = {
  rows: [
    " XXXXXX ",
    "XHHMMMDX",
    "XHMMMMDX",
    "XHMMMDDX",
    " XMMDDX ",
    "  XMDX  ",
  ],
  palette: { X: "#0a1808", H: "#7ac24a", M: "#3a8a28", D: "#1f5a18" },
};

const PIXEL_FLOWER_RED = {
  rows: [
    " R ",
    "RYR",
    " G ",
    " G ",
  ],
  palette: { R: "#ff5a6b", Y: "#ffd866", G: "#3a8a28" },
};

const PIXEL_FLOWER_BLUE = {
  rows: [
    " B ",
    "BYB",
    " G ",
    " G ",
  ],
  palette: { B: "#6ec0ff", Y: "#ffd866", G: "#3a8a28" },
};

const PIXEL_TREE_DARK = {
  rows: [
    "  XXXX  ",
    " XDDMDX ",
    "XDDMMMDX",
    "XDMMMDDX",
    "XDMMDDDX",
    " XMMDDX ",
    "XDMDDDX ",
    " XDDDX  ",
    "  XTtX  ",
    "  XTtX  ",
  ],
  palette: { X: "#020806", D: "#0a1a0e", M: "#163a22", T: "#1a0e08", t: "#050a05" },
};

const PIXEL_PINE = {
  rows: [
    "   X   ",
    "  XHX  ",
    " XHMDX ",
    " XHMDX ",
    "XHMMDDX",
    "XHMMDDX",
    " XMMDX ",
    "  XtX  ",
    "  XtX  ",
  ],
  palette: { X: "#020806", H: "#1a3a20", M: "#0d2814", D: "#061a0a", t: "#0a0604" },
};

const PIXEL_HOUSE = {
  // red roof, brick walls, lit windows w/ frame, door
  rows: [
    "      RH      ",
    "     RHHR     ",
    "    RHHHHR    ",
    "   RHHHHMMR   ",
    "  RHHMMMMMMR  ",
    " RHMMMMMMMMDR ",
    "WWWWWWWWWWWWWW",
    "WBBBBBBBBBBBBW",
    "WB.FF.WW.FF.BW",
    "WB.YY.WW.YY.BW",
    "WB.YY.WW.YY.BW",
    "WB.FF.WW.FF.BW",
    "WBBBBBBBBBBBBW",
    "WBBBB.FF.BBBBW",
    "WBBBB.DD.BBBBW",
    "WBBBB.dd.BBBBW",
  ],
  palette: {
    R: "#3a0e08", H: "#c83018", M: "#7a1818", D: "#5a0e08",
    W: "#3a1a08", B: "#8a5a28", F: "#5a2a08",
    Y: "#ffd866", D: "#3a1a08", d: "#1a0a04"
  },
};

const PIXEL_HOUSE_TALL = {
  rows: [
    "     RH     ",
    "    RHHR    ",
    "   RHHHHR   ",
    "  RHHMMMHR  ",
    " RHMMMMMMDR ",
    "WWWWWWWWWWWW",
    "WBBBBBBBBBBW",
    "WB.YY.WW.B.W",
    "WB.YY.WW.B.W",
    "WBBBBBBBBBBW",
    "WB.YY.WW.B.W",
    "WB.YY.WW.B.W",
    "WBBBBBBBBBBW",
    "WBBB.DDD.BBW",
    "WBBB.DDD.BBW",
    "WBBB.ddd.BBW",
  ],
  palette: {
    R: "#1a0a28", H: "#5a3a78", M: "#3a2858", D: "#1a0a28",
    W: "#3a2818", B: "#7a5a30", Y: "#ffd866", D: "#3a1a08", d: "#1a0a04",
    ".": "#1a1008",
  },
};

const PIXEL_HOUSE_SQUAT = {
  rows: [
    "    RHHR    ",
    "  RHHHHHHR  ",
    "RHHMMMMMMHR ",
    "WWWWWWWWWWWW",
    "WBBBBBBBBBBW",
    "WB.YY.WW.B.W",
    "WB.YY.WW.B.W",
    "WBBBBBBBBBBW",
    "WBBB.DDD.BBW",
    "WBBB.DDD.BBW",
    "WBBB.ddd.BBW",
  ],
  palette: {
    R: "#08283a", H: "#28688a", M: "#185878", D: "#08283a",
    W: "#3a2818", B: "#7a5a30", Y: "#ffd866", D: "#3a1a08", d: "#1a0a04",
    ".": "#1a1008",
  },
};

const PIXEL_CHEST = {
  rows: [
    " XXXXXXXXXX ",
    "XXHHHHHHHHHX",
    "XHHHHHHHHHWX",
    "XHWWWWWWWWWX",
    "XXXXXXXXXXXX",
    "XBYYBBBBYYBX",
    "XBLLBBBBLLBX",
    "XXBLLBBBLLBX",
    "XXXXXXXXXXXX",
    "XHBBBBBBBBHX",
    "XXXXXXXXXXXX",
  ],
  palette: { X: "#1a0a04", H: "#d88a3a", W: "#a8703c", B: "#5a3a14", Y: "#ffd866", L: "#1a0e08" },
};

const PIXEL_TENT = {
  // proper pixel-art canvas tent — peaked roof, side guy-lines hinted, dark entrance slit
  rows: [
    "       X       ",
    "      XHX      ",
    "     XHMMX     ",
    "    XHHMMDX    ",
    "   XHHMMMDDX   ",
    "  XHHMMMMMDDX  ",
    " XHHMMMMMMMDDX ",
    "XHHMMMMMMMMMDDX",
    "XHMMMMMKKMMMMDX",
    "XHMMMMKKKKMMMDX",
    "XHMMMKKKKKKMMDX",
    "XXMMMKKKKKKMMXX",
    " XXXXKKKKKKXXX ",
  ],
  palette: { X: "#1a0a04", H: "#a8421a", M: "#7a2a10", D: "#4a1808", K: "#1a0a04" },
};

const PIXEL_ANVIL = {
  rows: [
    " HHHHHHHHHH ",
    "HHMMMMMMMMHH",
    "XXXXXXXXXXXX",
    " XXMMMMMMXX ",
    "  XMMMMMMX  ",
    "  XMMMMMMX  ",
    " XXMMMMMMXX ",
    "XXXXXXXXXXXX",
  ],
  palette: { X: "#0a0604", H: "#4a4038", M: "#2a2420" },
};

const PIXEL_FLAG = {
  rows: [
    "XHHH",
    "X##H",
    "X#H ",
    "X#  ",
    "X   ",
    "X   ",
    "X   ",
  ],
  palette: { X: "#1a0e08", "#": "#c81830", H: "#ff5a6b" },
};

const PIXEL_STUMP = {
  rows: [
    " HHHHHHHHHH ",
    "HMMMMMMMMMMH",
    "XMMMMMMMMMMX",
    "XXXXXXXXXXXX",
    " XXXXXXXXXX ",
  ],
  palette: { X: "#1a0a04", H: "#7a4818", M: "#3a2010" },
};

const PIXEL_IGLOO = {
  // dome of snow blocks with dark entrance
  rows: [
    "      HHHHHHHH      ",
    "    HHWWWWWWWWHH    ",
    "   HWWWWWWWWWWWWH   ",
    "  HWWWWMWWWWWWMWWH  ",
    " HWWWWWWWMWWWWWWWWH ",
    " HWWMWWWWWWWWMWWWWH ",
    "HWWWWWWWWWWWWWWWWWWH",
    "HWWWWWWMWWWWWWWWMWWH",
    "HWWWMWWWWWWMWWWWWWWH",
    "HWWWWWWWWWWWWWWWWWWH",
    "HWWWWWMWWWWWWWMWWWWH",
    "HWWWWWWWWXXXXWWWWWWH",
    "HWWMWWWWXKKKKXWWMWWH",
    "HWWWWWWWXKKKKXWWWWWH",
    "HWWWWWWWXKKKKXWWWWWH",
    "HWWWWWWWXKKKKXWWWWWH",
    "XXXXXXXXXXXXXXXXXXXX",
  ],
  palette: { H: "#a8c0d8", W: "#e8eef4", M: "#c8d6e0", X: "#3a4868", K: "#0a0612" },
};

const PIXEL_BARREL = {
  rows: [
    "XHHHHHHHHX",
    "XMMMMMMMMX",
    "XXXXXXXXXX",
    "XMMMMMMMMX",
    "XMMHMMHMMX",
    "XMMMMMMMMX",
    "XXXXXXXXXX",
    "XMMMMMMMMX",
    "XHHHHHHHHX",
  ],
  palette: { X: "#1a0e04", H: "#8a5a28", M: "#5a3a18" },
};

const PIXEL_SWORDS = {
  // crossed swords on a rack
  rows: [
    "  X     X   ",
    " XHX   XHX  ",
    "XHHHX XHHHX ",
    " XHX   XHX  ",
    "  X     X   ",
    "  X     X   ",
    "  X     X   ",
    "  X     X   ",
    "  XHX  XHX  ",
    "  XHX  XHX  ",
    " XHHHX XHHHX",
    " XGGGX XGGGX",
    "  XGX   XGX ",
  ],
  palette: { X: "#0a0604", H: "#c8c8d8", G: "#3a2410" },
};

const PIXEL_BELLOWS = {
  rows: [
    "  XHHHHHHHX  ",
    " XHMMMMMMMHX ",
    "XHMMMMMMMMMHX",
    "XHMMMMMMMMMHX",
    " XHMMMMMMMHX ",
    "  XHHHHHHHX  ",
    "    XNNNX    ",
    "    XNNNX    ",
  ],
  palette: { X: "#0a0604", H: "#5a3a18", M: "#8a5a28", N: "#1a0e08" },
};

const PIXEL_LOGPILE = {
  // pyramid of log cross-sections (end-view) — 3 on bottom, 2 in middle, 1 on top
  rows: [
    "      .XXX.      ",
    "      XHHHX      ",
    "      XHMHX      ",
    "      XHHHX      ",
    "      .XXX.      ",
    "   .XXX. .XXX.   ",
    "   XHHHX XHHHX   ",
    "   XHMHX XHMHX   ",
    "   XHHHX XHHHX   ",
    "   .XXX. .XXX.   ",
    ".XXX. .XXX. .XXX.",
    "XHHHX XHHHX XHHHX",
    "XHMHX XHMHX XHMHX",
    "XHHHX XHHHX XHHHX",
    ".XXX. .XXX. .XXX.",
  ],
  palette: { X: "#1a0a04", H: "#7a4818", M: "#a86838" },
};

const PIXEL_AXE = {
  // wedge-shaped axe head with blade edge on right, vertical wooden handle below
  rows: [
    " XXX  ",
    "XHHHX ",
    "XHMMMX",
    "XHMMMX",
    "XHHMX ",
    " XXX  ",
    " .XH. ",
    " .XH. ",
    " .XH. ",
    " .XH. ",
    " .XH. ",
    " .XH. ",
  ],
  palette: { X: "#0a0604", H: "#c8c8d8", M: "#8a8a98", ".": null },
};

const PIXEL_LANTERN = {
  rows: [
    "  XXX  ",
    "  XYX  ",
    " XHYHX ",
    "XHYYYHX",
    "XHYYYHX",
    " XHYHX ",
    "  XYX  ",
    "   X   ",
  ],
  palette: { X: "#1a0e08", H: "#5a3a18", Y: "#ffd866" },
};

const PIXEL_SIGNPOST = {
  rows: [
    " XHHHHHHHX ",
    "XHWWWWWWWHX",
    "XHWWWWWWWHX",
    "XHWWWWWWWHX",
    " XHHHHHHHX ",
    "    XHX    ",
    "    XHX    ",
    "    XHX    ",
    "    XHX    ",
  ],
  palette: { X: "#1a0a04", H: "#5a3a18", W: "#8a6448" },
};

/* ---------- 1. MEADOW (About) ---------- */

// Ominous dark spire standing on the distant flat grey cliffs. Tall splintered crown,
// a slim neck carrying the glowing lightning crack + "33", and a wide flaring base.
const TOWER_DARK = {
  rows: [
    "          K",
    "          KD",
    "          KD K",
    "        K KD KD",
    "        KDKD KD",
    "        KDKD KKD",
    "       KKDKD KDD",
    "    K  KDKDDKKDD",
    "    KD KDDDDDDDD K",
    "    KDKKDDDDDDDDKD",
    "     KDDDDDDDDDDDD",
    "   K KDDDDDDDDDDDDK",
    "   KDKDDDDDDDDDDDDK",
    "    KDDDDMMMMDDDDDK",
    "     KDDDMMMMMDDDK",
    "     KDDDMMMMMDDDK",
    "      KDDMMMMMDDK",
    "      KDDMMHMMDDK",
    "      KDDMHHMMDDK",
    "      KDDMHHMMDDK",
    "      KDDMMMMMDDK",
    "      KDDMMMMMDDK",
    "      KDDMMMMMDDK",
    "      KDDMMMMMDDK",
    "      KDDMMMMMDDK",
    "     KKDDMMMMMDDDK",
    "     KDDDMMMMMMDDKK",
    "    KKDDDMMMMMMDDDK",
    "   KKDDDDMMMMMMDDDDK",
    "   KDDDDDMMMMMMDDDKDK",
    "  KKDDDDDMMMMMMMDDDDKK",
    " K KDDDDDMMMMMMMDDDDDK",
    " KDKDDDDDMMMMMMMDDDDDKK",
    "KKDDDDDDDMMMMMMMMDDDDDDK",
    "KDDDDDDDDMMMMMMMMDDDDDDDK",
    " KDDDDKDDMMMMMMMMDDDDDDK",
    "KKDDDDDDDDMMMMMMMDDDKDDDK",
    "KDDDKDDDDDMMMMMMDDDDDDDDKK",
    " KDDDDDDDDDDMMMDDDDDDDKDDK",
    "KKKDDDDDDDDDDDDDDDDDDDDDDK",
    "KDDDDKDDDDDDDDDDDDDDDKDDDKK",
    " KKDDDDDDKDDDDDDDDDDDDDDDK",
    "K KKDDDDDDDDDDDDDDDKDDDKKK K",
  ],
  palette: { K: "#0f0a16", D: "#1b1426", M: "#2a2240", H: "#3c3154" },
};

const TOWER_GLOW = {
  rows: [
    "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "          Y",
    "         YY",
    "         Y",
    "        YY",
    "         Y",
    "",
    "        ### ###",
    "          #   #",
    "        ### ###",
    "          #   #",
    "        ### ###",
  ],
  palette: { Y: "#ffe23a", "#": "#ffe23a" },
};

// stepped pixel fir-tree silhouette — stacked triangles ending in a sharp point
function Fir({ cx, baseY, halfW, h, fill }) {
  const layers = 4;
  const parts = [];
  for (let i = 0; i < layers; i++) {
    const apex = baseY - h * ((i + 1) / layers);          // top of this layer
    const base = baseY - h * (i / layers) * 0.78;          // bottom of this layer (overlaps below)
    const w = halfW * 2 * (1 - i / layers);
    parts.push(
      <polygon key={i}
        points={`${cx},${apex} ${cx - w / 2},${base} ${cx + w / 2},${base}`}
        fill={fill} />
    );
  }
  parts.push(<rect key="trunk" x={cx - 0.6} y={baseY} width="1.2" height="2.2" fill={fill} />);
  return <g>{parts}</g>;
}

// a continuous ridge of firs across the scene width at a given depth
function FirRow({ baseY, halfW, h, fill, step, band }) {
  const trees = [];
  let k = 0;
  for (let x = -6; x <= 208; x += step) {
    const hh = h + ((k * 37) % 7) - 3;          // deterministic height jitter
    const by = baseY + ((k * 29) % 3);
    const dx = ((k * 17) % 5) - 2;
    trees.push(<Fir key={k} cx={x + dx} baseY={by} halfW={halfW} h={hh} fill={fill} />);
    k++;
  }
  return (
    <g>
      {band != null && <rect x="0" y={baseY - band} width="200" height={band + 2} fill={fill} />}
      {trees}
    </g>
  );
}

// rounded bright bush for the foreground grass (anchored so its base sits on baseY)
function ForestBush({ cx, baseY, w, dark = "#2f6f2c", mid = "#46962f", lite = "#67c24a" }) {
  return (
    <g>
      <ellipse cx={cx} cy={baseY - w * 0.34} rx={w / 2} ry={w * 0.34} fill={dark} />
      <ellipse cx={cx} cy={baseY - w * 0.5} rx={w * 0.42} ry={w * 0.3} fill={mid} />
      <ellipse cx={cx - w * 0.16} cy={baseY - w * 0.56} rx={w * 0.2} ry={w * 0.17} fill={lite} />
      <ellipse cx={cx + w * 0.14} cy={baseY - w * 0.48} rx={w * 0.14} ry={w * 0.12} fill={lite} opacity="0.8" />
    </g>
  );
}

// tiny toadstool
function Mushroom({ x, baseY, cap = "#c8453a" }) {
  return (
    <g>
      <rect x={x} y={baseY - 2} width="1.6" height="2" fill="#e8dcc0" />
      <rect x={x - 1} y={baseY - 3.4} width="3.6" height="1.6" fill={cap} />
      <rect x={x - 0.6} y={baseY - 4} width="2.8" height="1" fill={cap} />
      <rect x={x + 0.4} y={baseY - 3} width="0.6" height="0.6" fill="#f3e6c8" />
    </g>
  );
}

// floating sky-tower — stacked stone drums tapering into a crystal spire (pixel-art)
function FloatingTower({ cx = 30, topY = 20 }) {
  const SL = "#efe7d0", SM = "#d3c7a6", SS = "#b0a27c", SD = "#8a7c5c"; // stone shades
  const WIN = "#2e2a1f", ARCH = "#c9a648", GRN = "#6aa84f", GRND = "#4f8a3c";
  const CL = "#d2edf5", CM = "#8cc1da", CD = "#5189b4", CE = "#356f9c";   // crystal shades
  // each tier: [yTop, height, halfWidth]
  const tiers = [
    [topY + 6,  10, 4.6],   // top drum (narrow)
    [topY + 16, 10, 6.2],   // upper
    [topY + 26, 9,  7.8],   // mid
    [topY + 35, 7,  9.0],   // balcony (widest)
  ];
  const win = (wx, wy, h = 2.4) => (
    <g key={"w" + wx + "_" + wy}>
      <rect x={wx} y={wy} width="1.3" height={h} fill={WIN} />
      <rect x={wx} y={wy} width="1.3" height="0.6" fill={ARCH} opacity="0.85" />
    </g>
  );
  return (
    <g>
      {/* faint sky glow behind the tower */}
      <ellipse cx={cx} cy={topY + 30} rx="16" ry="30" fill="#eaf4fb" opacity="0.12" />

      {/* crown — little cap roof + spire nub */}
      <rect x={cx - 0.7} y={topY} width="1.4" height="3" fill={SS} />
      <rect x={cx - 4} y={topY + 3} width="8" height="2.4" fill={SM} />
      <rect x={cx - 4} y={topY + 3} width="8" height="0.8" fill={SL} />
      <rect x={cx - 4.6} y={topY + 5} width="9.2" height="1" fill={SD} />

      {/* stone tiers, top → bottom */}
      {tiers.map(([ty, th, hw], i) => (
        <g key={"t" + i}>
          {/* body */}
          <rect x={cx - hw} y={ty} width={hw * 2} height={th} fill={SM} />
          {/* left light edge, right shadow edge */}
          <rect x={cx - hw} y={ty} width="1.6" height={th} fill={SL} opacity="0.8" />
          <rect x={cx + hw - 1.8} y={ty} width="1.8" height={th} fill={SS} />
          <rect x={cx + hw - 0.8} y={ty} width="0.8" height={th} fill={SD} opacity="0.7" />
          {/* overhanging ledge at the base of each tier */}
          <rect x={cx - hw - 1} y={ty + th - 1.4} width={hw * 2 + 2} height="1.4" fill={SD} />
          <rect x={cx - hw - 1} y={ty + th - 1.4} width={hw * 2 + 2} height="0.5" fill={SS} />
          {/* arched windows row */}
          {[-1, 0, 1].map((k) => win(cx + k * (hw * 0.62) - 0.65, ty + 2.4, th - 4.4))}
        </g>
      ))}

      {/* hanging vines on a couple of ledges */}
      <rect x={cx - 5} y={topY + 25.5} width="1" height="3.2" fill={GRN} />
      <rect x={cx - 5} y={topY + 28} width="1.6" height="1.2" fill={GRND} />
      <rect x={cx + 4} y={topY + 15.5} width="1" height="2.6" fill={GRN} />
      <rect x={cx + 3.4} y={topY + 17.6} width="1.6" height="1" fill={GRND} />

      {/* little detached turret + walkway to the right */}
      <g>
        <rect x={cx + 11} y={topY + 30} width="3.2" height="7" fill={SM} />
        <rect x={cx + 11} y={topY + 30} width="1" height="7" fill={SL} opacity="0.7" />
        <rect x={cx + 13.2} y={topY + 30} width="1" height="7" fill={SD} />
        <rect x={cx + 10.6} y={topY + 29} width="4" height="1.4" fill={SD} />
        {win(cx + 12, topY + 32, 2)}
        {/* rope walkway */}
        {[0, 1, 2, 3].map((k) => (
          <rect key={"r" + k} x={cx + 9 - k * 0.0 + k * 0.55} y={topY + 33 + k * 0.4} width="0.6" height="0.6" fill={SD} />
        ))}
        <rect x={cx + 9} y={topY + 33.4} width="2.2" height="0.4" fill={SS} />
      </g>

      {/* crystal spire base — inverted, faceted, tapering to a point */}
      <polygon points={`${cx - 9},${topY + 42} ${cx + 9},${topY + 42} ${cx + 6.5},${topY + 50} ${cx + 3},${topY + 58} ${cx},${topY + 64} ${cx - 3.4},${topY + 57} ${cx - 6.8},${topY + 49}`} fill={CM} />
      {/* left lit facet */}
      <polygon points={`${cx - 9},${topY + 42} ${cx},${topY + 42} ${cx},${topY + 64} ${cx - 3.4},${topY + 57} ${cx - 6.8},${topY + 49}`} fill={CL} opacity="0.55" />
      {/* right shadow facet */}
      <polygon points={`${cx + 9},${topY + 42} ${cx + 2},${topY + 42} ${cx + 1.4},${topY + 56} ${cx + 3},${topY + 58} ${cx + 6.5},${topY + 50}`} fill={CD} />
      {/* facet seams */}
      <polygon points={`${cx - 3},${topY + 42} ${cx + 1},${topY + 42} ${cx},${topY + 64}`} fill={CE} opacity="0.45" />
      {/* hanging crystal chunks */}
      <polygon points={`${cx - 8},${topY + 45} ${cx - 5.5},${topY + 45} ${cx - 6.6},${topY + 51}`} fill={CM} />
      <polygon points={`${cx - 8},${topY + 45} ${cx - 6.75},${topY + 45} ${cx - 6.6},${topY + 51}`} fill={CL} opacity="0.6" />
      <polygon points={`${cx + 6},${topY + 46} ${cx + 8.4},${topY + 46} ${cx + 7.2},${topY + 53}`} fill={CD} />
      {/* glints */}
      <rect x={cx - 4} y={topY + 46} width="1" height="1" fill="#ffffff" opacity="0.8" />
      <rect x={cx - 1.5} y={topY + 52} width="0.8" height="0.8" fill="#ffffff" opacity="0.7" />
    </g>
  );
}

function SceneMeadow() {
  const clouds = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    x: (i * 38 + Math.random() * 12) % 220 - 10,
    y: 10 + Math.random() * 14,
    s: 1.0 + Math.random() * 0.4,
  })), []);

  // randomize trees — mix of tall, round, normal, autumn + a few bushes
  const treeVariants = [PIXEL_TREE, PIXEL_TREE_TALL, PIXEL_TREE_ROUND, PIXEL_TREE, PIXEL_TREE_AUTUMN];
  const trees = useMemo(() => {
    const positions = [8, 28, 50, 74, 96, 120, 146, 168, 188];
    return positions.map((x, i) => ({
      x: x + (Math.random() * 4 - 2) | 0,
      yOffset: (Math.random() * 4) | 0,
      sprite: treeVariants[Math.floor(Math.random() * treeVariants.length)],
    }));
  }, []);

  const bushes = useMemo(() => {
    const positions = [18, 60, 110, 154, 178];
    return positions.map(x => ({
      x: x + (Math.random() * 6 - 3) | 0,
      yOffset: (Math.random() * 2) | 0,
    }));
  }, []);

  // flowers planted on the FRONT meadow grass only, in the clear gaps
  // between trees (trunks at 8,28,50,74,96,120,146,168,188), bushes
  // (18,60,110,154,178) and the slime (~150). All sit on the ground (y=76).
  const flowers = useMemo(() => {
    const spots = [3, 38, 43, 66, 86, 103, 126, 132, 140, 196];
    return spots.map((x, i) => ({
      x,
      y: 76,
      kind: i % 2 ? "blue" : "red",
    }));
  }, []);

  return (
    <>
      <SkyGradient stops={[
        ["0%", "#3d7d72"], ["40%", "#5fa088"], ["72%", "#93c6a6"], ["100%", "#c2e2c9"]
      ]} />
      <PixelStage vbW={200} vbH={112}>
        {/* horizon mist haze */}
        <rect x="0" y="50" width="200" height="20" fill="#d2e8d6" opacity="0.45" />

        {/* farthest pine ridge — palest, ghostly */}
        <FirRow baseY={60} halfW={7} h={19} fill="#bcdcc3" step={9}  band={6} />
        {/* second ridge */}
        <FirRow baseY={67} halfW={8} h={23} fill="#8cbb9c" step={11} band={6} />

        {/* third pine ridge — mid-dark */}
        <FirRow baseY={75} halfW={9} h={26} fill="#3f7a64" step={13} band={6} />
        {/* nearest pine wall — darkest & tallest */}
        <FirRow baseY={83} halfW={11} h={35} fill="#1d3f3b" step={15} band={8} />

        {/* ===== floating sky-tower on the LEFT (gently bobbing, floats in front of the forest) ===== */}
        <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "birdFloat 6s ease-in-out infinite" }}>
          <g transform="translate(7.5, 7.1) scale(0.55)">
            <FloatingTower cx={30} topY={18} />
          </g>
        </g>

        {/* Rayquaza coiled in the sky on the right */}
        {(() => {
          const h = 18, w = h * window.RAYQUAZA_AR, rcx = 176, footY = 30;
          return (
            <g>
              <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "birdFloat 4.5s ease-in-out infinite" }}>
                <image href={window.RAYQUAZA_SRC} xlinkHref={window.RAYQUAZA_SRC}
                  x={rcx - w / 2} y={footY - h} width={w} height={h}
                  preserveAspectRatio="xMidYMax meet" style={{ imageRendering: "pixelated" }} />
              </g>
              <NameTag cx={rcx} top={footY - h - 4} text="Rayquaza" color="#7ee85f" />
            </g>
          );
        })()}

        {/* forest floor — dark void below a thin grass lip */}
        <rect x="0" y="80" width="200" height="32" fill="#070f0b" />
        <rect x="0" y="80" width="200" height="3"  fill="#163a22" />
        <rect x="0" y="80" width="200" height="2"  fill="#2f7a33" />
        <rect x="0" y="79" width="200" height="1"  fill="#5fb84a" />
        {/* faint texture in the void */}
        {Array.from({ length: 24 }).map((_, i) => (
          <rect key={"sf" + i} x={(i * 53) % 200} y={88 + (i * 17) % 20} width="2" height="1" fill="#101f17" opacity="0.7" />
        ))}
        {/* grass blades along the surface */}
        {Array.from({ length: 66 }).map((_, i) => {
          const x = i * 3 + (i % 2);
          const hh = 2 + (i % 3);
          return <rect key={"gb" + i} x={x} y={80 - hh} width="1" height={hh} fill={i % 3 === 0 ? "#67c24a" : "#3f8f3a"} />;
        })}

        {/* foreground bushes on the grass */}
        {[6, 42, 96, 130, 194].map((x, i) => (
          <ForestBush key={"fb" + i} cx={x} baseY={80} w={i % 2 ? 20 : 16} />
        ))}
        {/* toadstools dotting the grass */}
        {[[30, "#c8453a"], [64, "#d98a2b"], [118, "#c8453a"], [158, "#c8453a"]].map(([x, cap], i) => (
          <Mushroom key={"ms" + i} x={x} baseY={80} cap={cap} />
        ))}

        {/* Esquie — standing on the grass at the left, breathing idle like the others */}
        <KnightSprite src={window.ESQUIE_SRC} cx={20} footY={82} h={28} ar={window.ESQUIE_AR} flip
          name="Esquie" tagColor="#e9c97a" shadow={false} anim="charIdle 3s ease-in-out infinite" />

        {/* Barry — bear standing on the grass at the right (faces left) */}
        <KnightSprite src={window.BARRY_SRC} cx={176} footY={82} h={20} ar={window.BARRY_AR}
          name="Barry" tagColor="#e8b8b0" shadow={false} anim="charIdle 3.5s ease-in-out infinite" />

        {/* faint mist drifting low through the trunks */}
        <rect x="0" y="74" width="200" height="6" fill="#bcdcc3" opacity="0.06" />
      </PixelStage>
      <Particles count={20} kind="firefly" color="#dfffc8" />
      <WindLayer count={12} colors={["#7ac24a", "#3a8a28", "#9fe0a8"]} topRange={[22, 74]} dur={[8, 15]} leaf={true} />
    </>
  );
}

/* ---------- 2. CAVE (Skills) ---------- */
function SceneCave() {
  const crystals = useMemo(() => [
    { x: 14,  y: 78, c: "#6ee7ff", h: "#bef3ff", d: "#2a8fb8" },
    { x: 38,  y: 74, c: "#b48cff", h: "#dabaff", d: "#6840a8" },
    { x: 64,  y: 80, c: "#6ee7ff", h: "#bef3ff", d: "#2a8fb8" },
    { x: 90,  y: 72, c: "#ff9ad8", h: "#ffc8e8", d: "#a83878" },
    { x: 116, y: 78, c: "#6ee7ff", h: "#bef3ff", d: "#2a8fb8" },
    { x: 140, y: 76, c: "#ffd866", h: "#fff0a8", d: "#a87818" },
    { x: 164, y: 80, c: "#b48cff", h: "#dabaff", d: "#6840a8" },
    { x: 184, y: 74, c: "#6ee7ff", h: "#bef3ff", d: "#2a8fb8" },
  ], []);

  return (
    <>
      <SkyGradient stops={[
        ["0%", "#0a0612"], ["45%", "#1a1028"], ["100%", "#2a1838"]
      ]} />
      <PixelStage vbW={200} vbH={112}>
        {/* cave ceiling */}
        <rect x="0" y="0" width="200" height="4" fill="#0a0612" />
        <rect x="0" y="4" width="200" height="2" fill="#1a0e22" />

        {/* stalactites — shaded */}
        {[
          [0,8],[10,12],[22,8],[32,16],[44,10],[56,14],[70,8],[82,18],
          [96,10],[108,14],[122,8],[134,16],[148,10],[160,14],[174,18],[188,10]
        ].map(([x, h], i) => (
          <g key={i}>
            <rect x={x} y="6" width="8" height={h} fill="#1a0e22" />
            <rect x={x} y="6" width="2" height={h - 2} fill="#2a1838" />
            <rect x={x + 6} y="6" width="2" height={h} fill="#0a0612" />
            <rect x={x + 2} y={6 + h} width="4" height="2" fill="#1a0e22" />
            <rect x={x + 3} y={6 + h + 2} width="2" height="2" fill="#0a0612" />
          </g>
        ))}

        {/* cave back wall texture */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i * 11 + 3) % 200;
          const y = 26 + (i * 17) % 50;
          return <rect key={i} x={x} y={y} width="2" height="2" fill="#2a1838" />;
        })}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 7 + 1) % 200;
          const y = 30 + (i * 13) % 56;
          return <rect key={"d" + i} x={x} y={y} width="1" height="1" fill="#0a0612" />;
        })}

        {/* stalagmites — shaded */}
        {[
          [4,12],[20,8],[34,14],[50,10],[66,16],[82,8],[96,14],
          [112,10],[126,16],[142,8],[156,14],[172,10],[186,12]
        ].map(([x, h], i) => (
          <g key={i}>
            <rect x={x} y={94 - h} width="8" height={h} fill="#15091e" />
            <rect x={x} y={94 - h + 2} width="2" height={h - 2} fill="#2a1838" />
            <rect x={x + 6} y={94 - h} width="2" height={h} fill="#08040e" />
            <rect x={x + 2} y={94 - h - 2} width="4" height="2" fill="#15091e" />
            <rect x={x + 3} y={94 - h - 4} width="2" height="2" fill="#08040e" />
          </g>
        ))}

        {/* crystals — 4 shades each: outline + dark + mid + highlight */}
        {crystals.map((cr, i) => (
          <g key={i} style={{ filter: `drop-shadow(0 0 4px ${cr.c})` }}>
            {/* dark outline */}
            <rect x={cr.x + 2} y={cr.y - 7} width="2" height="1" fill={cr.d} />
            <rect x={cr.x + 1} y={cr.y - 6} width="4" height="1" fill={cr.d} />
            <rect x={cr.x}     y={cr.y - 4} width="6" height="1" fill={cr.d} />
            <rect x={cr.x}     y={cr.y - 3} width="6" height="1" fill={cr.d} />
            <rect x={cr.x + 1} y={cr.y - 1} width="4" height="1" fill={cr.d} />
            <rect x={cr.x + 2} y={cr.y}     width="2" height="1" fill={cr.d} />
            {/* mid body */}
            <rect x={cr.x + 2} y={cr.y - 6} width="2" height="1" fill={cr.c} />
            <rect x={cr.x + 1} y={cr.y - 5} width="4" height="1" fill={cr.c} />
            <rect x={cr.x + 2} y={cr.y - 4} width="4" height="1" fill={cr.c} />
            <rect x={cr.x + 2} y={cr.y - 3} width="4" height="1" fill={cr.c} />
            <rect x={cr.x + 2} y={cr.y - 2} width="3" height="1" fill={cr.c} />
            {/* highlight on left */}
            <rect x={cr.x + 2} y={cr.y - 5} width="1" height="4" fill={cr.h} />
            <rect x={cr.x + 1} y={cr.y - 4} width="1" height="1" fill={cr.h} />
          </g>
        ))}

        {/* ground */}
        <rect x="0" y="94" width="200" height="18" fill="#150818" />
        <rect x="0" y="94" width="200" height="1"  fill="#3a2058" />
        <rect x="0" y="95" width="200" height="1"  fill="#1a0e22" />
        {Array.from({ length: 25 }).map((_, i) => (
          <rect key={i} x={i * 8 + 1} y="98" width="2" height="1" fill="#3a2058" opacity="0.5" />
        ))}
        {/* dirt rocks */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={"r" + i} x={i * 14 + 4} y={100 + (i % 3) * 3} width="3" height="2" fill="#2a1838" />
        ))}

        {/* ===== CHARACTERS — left pair (Sherma + Hornet), right pair (Knight + Ember, facing) ===== */}
        {/* Sherma — straw-hat wanderer, far left, slow idle */}
        <KnightSprite src={window.CAVECHARS.sherma} cx={20} footY={95} h={16} ar={window.CAVECHARS_AR.sherma}
          name="Sherma" tagColor="#e6c27a" anim="charIdle 4.6s ease-in-out infinite" shadow={false} />
        {/* Hornet */}
        <KnightSprite src={window.CAVECHARS.hornet} cx={46} footY={95} h={24} ar={window.CAVECHARS_AR.hornet}
          name="Hornet" tagColor="#ff8aa8" anim="charIdle 3.1s ease-in-out infinite" shadow={false} />

        {/* Knight — the little vessel */}
        <KnightSprite src={window.CAVECHARS.knight} cx={150} footY={95} h={16} ar={window.CAVECHARS_AR.knight}
          name="Knight" tagColor="#dfe6f2" anim="charIdle 2.9s ease-in-out infinite" shadow={false} />
        {/* Ember Knight — tiny, same size as the little Knight */}
        <KnightSprite src={window.CAVECHARS.ember} cx={176} footY={95} h={16} ar={window.CAVECHARS_AR.ember} flip={true}
          name="Ember" tagColor="#6ec8ff" anim="charIdle 2.5s ease-in-out infinite" shadow={false} />
      </PixelStage>
      <Particles count={30} kind="spark" color="#6ee7ff" />
      <Particles count={12} kind="spark" color="#ffd866" />
    </>
  );
}

/* ---------- 3. TOWN AT DUSK (Education) ---------- */
/* ---------- 3. TOWN AT DUSK (Education) — close-up street view ---------- */

const PIXEL_HOUSE_BIG = {
  // detailed tudor-style cottage with timber frame, brick lower, lit windows, shingled roof
  rows: [
    "         RH         ",
    "        RHHR        ",
    "       RHHHHR       ",
    "      RHHHHHHR      ",
    "     RHHHHHHHHR     ",
    "    RHHHHHHHHHHR    ",
    "   RHHHHMMMMMHDDR   ",
    "  RHHHMMMMMMMMDDDR  ",
    " RHHMMMMMMMMMMMDDDR ",
    "WWWWWWWWWWWWWWWWWWWW",
    "WTTTTTTTTTTTTTTTTTTW",
    "WTBBBBBBBBBBBBBBBBTW",
    "WTB.YYY.WWWWW.YYY.BW",
    "WTB.YYY.WWWWW.YYY.BW",
    "WTB.YYY.WWWWW.YYY.BW",
    "WTB.YYY.WWWWW.YYY.BW",
    "WTBBBBBBBBBBBBBBBBTW",
    "WTTTTTTTTTTTTTTTTTTW",
    "WBBBBBB.DDDD.BBBBBBW",
    "WBBBBBB.DKKD.BBBBBBW",
    "WBBBBBB.DKKD.BBBBBBW",
    "WBBBBBB.DKKD.BBBBBBW",
    "WBBBBBB.DKKD.BBBBBBW",
    "WBBBBBB.DKKD.BBBBBBW",
  ],
  palette: {
    R: "#3a0e08", H: "#c83018", M: "#8a1818", D: "#5a0e08",
    W: "#3a1a08", T: "#5a3a18", B: "#a87048",
    Y: "#ffd866", ".": "#3a1a08", K: "#1a0e08", D: "#3a1a08",
  },
};

const PIXEL_HOUSE_INN = {
  // 2-story inn with sign hanging
  rows: [
    "    RH          ",
    "   RHHR         ",
    "  RHHHHR        ",
    " RHHHHHHR       ",
    "RHHHHHHHHR      ",
    "WWWWWWWWWWWWWWWW",
    "WTTTTTTTTTTTTTTW",
    "WT.YY.WW.YY.WWBW",
    "WT.YY.WW.YY.WWBW",
    "WTTTTTTTTTTTTTTW",
    "WT.YY.WW.YY.WWBW",
    "WT.YY.WW.YY.WWBW",
    "WTTTTTTTTTTTTTTW",
    "WBBBBB.DDDD.BBBW",
    "WBBBBB.DKKD.BBBW",
    "WBBBBB.DKKD.BBBW",
    "WBBBBB.DKKD.BBBW",
    "WBBBBB.DKKD.BBBW",
  ],
  palette: {
    R: "#1a0a28", H: "#5a3a78", W: "#3a2818", T: "#7a5a30",
    B: "#a87048", Y: "#ffd866", D: "#3a1a08", K: "#1a0e08", ".": "#3a1a08",
  },
};

const PIXEL_BANNER = {
  // hanging tavern sign
  rows: [
    "XXXXXX",
    "XHHHHX",
    "XHMMHX",
    "XHMMHX",
    "XHHHHX",
    "XXXXXX",
  ],
  palette: { X: "#1a0e08", H: "#8a3a18", M: "#ffd866" },
};

const PIXEL_BARREL_TOWN = {
  rows: [
    "XHHHHHHX",
    "XMMMMMMX",
    "XXXXXXXX",
    "XMMMMMMX",
    "XMHMMHMX",
    "XMMMMMMX",
    "XXXXXXXX",
    "XHHHHHHX",
  ],
  palette: { X: "#1a0e04", H: "#8a5a28", M: "#5a3a18" },
};

const PIXEL_CRATE = {
  rows: [
    "XXXXXXXX",
    "XHMMMMHX",
    "XMHMMHMX",
    "XMMHHMMX",
    "XMHMMHMX",
    "XHMMMMHX",
    "XXXXXXXX",
  ],
  palette: { X: "#1a0a04", H: "#8a5a28", M: "#5a3a18" },
};

const PIXEL_WELL = {
  // stone well with wooden roof + bucket
  rows: [
    "  XXXXXXXXXX  ",
    "  XHHHHHHHHX  ",
    "  XHMMMMMMHX  ",
    " XXXXXXXXXXXX ",
    "    X    X    ",
    "    X    X    ",
    "    X    X    ",
    "  SSSSSSSSSS  ",
    "  SHHHHHHHHS  ",
    "  SHHmmmmHHS  ",
    "  SHHmKKmHHS  ",
    "  SHHmmmmHHS  ",
    "  SSSSSSSSSS  ",
  ],
  palette: { X: "#1a0a04", H: "#a8421a", M: "#7a2a10", S: "#3a3038", m: "#5a5058", K: "#1a1018" },
};

/* ===== jungle scholar village (Education) sprites & helpers ===== */
const JUNGLE_LEAF_ROWS = [
  "   DDDDD   ",
  "  DMMMMMDD ",
  " DMMLLLMMMD",
  "DMMLLLLLMMD",
  "DMLLLHHLLMD",
  "DMLLLLLLLMD",
  "DMMLLLLLMMD",
  " DMMLLLMMD ",
  " DDMMMMMDD ",
  "   DDDDD   ",
];
const LEAF_PAL_BACK  = { D: "#0f2614", M: "#173a1d", L: "#235029", H: "#2e6332" };
const LEAF_PAL_MID   = { D: "#173a1d", M: "#235029", L: "#3a7a32", H: "#4f9a3a" };
const LEAF_PAL_FRONT = { D: "#235029", M: "#3a7a32", L: "#5aaa3e", H: "#8fd44f" };

function Trunk({ x, top, bottom, w = 6 }) {
  const h = bottom - top;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill="#3a2414" />
      <rect x={x} y={top} width="2" height={h} fill="#5a3a1f" />
      <rect x={x + w - 1} y={top} width="1" height={h} fill="#1f120a" />
      {Array.from({ length: Math.floor(h / 16) }).map((_, i) => (
        <rect key={i} x={x + 1} y={top + 10 + i * 16} width={w - 2} height="1" fill="#1f120a" opacity="0.6" />
      ))}
    </g>
  );
}

// a row of colored book spines on a shelf
function BookRow({ x, y, colors, h = 5 }) {
  return (
    <>
      {colors.map((c, i) => {
        const bh = h - (i % 3 === 0 ? 1 : 0);
        return <rect key={i} x={x + i * 2} y={y + (h - bh)} width="2" height={bh} fill={c} />;
      })}
    </>
  );
}
const BOOKS_A = ["#b03028", "#2a6a9a", "#c2902a", "#3a7a3a", "#7a3a8a", "#a85020"];
const BOOKS_B = ["#2a6a9a", "#a85020", "#3a7a3a", "#b03028", "#c2902a"];
const BOOKS_C = ["#7a3a8a", "#c2902a", "#b03028", "#2a6a9a", "#3a7a3a", "#a85020", "#7a3a8a"];

// small seated/standing scholar figure
function Scholar({ x, y, robe = "#3a6a9a", trim = "#ffd34d" }) {
  return (
    <g>
      <rect x={x + 1} y={y} width="3" height="3" fill="#e8c49a" />        {/* head */}
      <rect x={x + 1} y={y} width="3" height="1" fill="#5a3a22" />        {/* hair */}
      <rect x={x} y={y + 3} width="5" height="5" fill={robe} />            {/* robe */}
      <rect x={x + 2} y={y + 3} width="1" height="5" fill={trim} />        {/* sash */}
      <rect x={x} y={y + 3} width="1" height="5" fill="#000" opacity="0.25" />
    </g>
  );
}

/* ===== original chibi pixel-sprites of the party (recreated from reference) ===== */
const CHIBI_SHADOWHEART = {
  rows: [
    "......OOOO......",
    "....OOKKKKOO....",
    "...OKKKKKKKKO...",
    "..OKKKKKKKKKKO..",
    ".OKKKKKKKKKKKKO.",
    ".OKKKkkKKkkKKKO.",
    ".OKKSSSSSSSSKKO.",
    ".OKKSSSSSSSSKKO.",
    ".OKSSSSSSSSSSKO.",
    ".OKSSGGSSSGGSKO.",
    ".OKSSGGSSSGGSKO.",
    ".OKSSSSSSSSSSKO.",
    ".OKSSSSMMSSSSKO.",
    "..OKSSSSSSSSKO..",
    "..OKKSSSSSSKKO..",
    "...OKKKbbKKKO...",
    "...OTTTTTTTTO...",
    "..OTTtTTTTtTTO..",
    "..OTTTTTTTTTTO..",
    "...OTTTTTTTTO...",
    "....OOOOOOOO....",
  ],
  palette: { O: "#1b1320", K: "#191922", k: "#383848", S: "#e9c9a9", G: "#63b83a", M: "#b06a66", T: "#22383a", t: "#88a0a6", b: "#caa888" },
};
const CHIBI_LAEZEL = {
  rows: [
    ".......OO.......",
    "......OAAO......",
    ".....OAAAAO.....",
    "...OOAAAAAAOO...",
    "..OAAAAAAAAAAO..",
    ".OAAAAAAAAAAAAO.",
    ".OAAASSSSSSAAAO.",
    ".OAASSSSSSSSAAO.",
    ".OAASSSSSSSSAAO.",
    ".OASSDDSSSDDSAO.",
    ".OASSDDSSSDDSAO.",
    ".OASSSSSSSSSSAO.",
    ".OASSSSMMSSSSAO.",
    "..OASSSSSSSSAO..",
    "..OAASSSSSSAAO..",
    "...OAAAbbAAAO...",
    "...OWWWWWWWWO...",
    "..OWWcWWWWcWWO..",
    "..OCCCCCCCCCCO..",
    "...OCCCCCCCCO...",
    "....OOOOOOOO....",
  ],
  palette: { O: "#1b1320", A: "#a8551f", S: "#d6cf9e", D: "#241b2c", M: "#b06a66", W: "#ece4d2", c: "#b2aa92", C: "#2a2438", b: "#bcae84" },
};
const CHIBI_GALE = {
  rows: [
    "....OOBBBBOO....",
    "...OBBBBBBBBO...",
    "..OBBBBBBBBBBO..",
    ".OBBBBBBBBBBBBO.",
    ".OBBBBBBBBBBBBO.",
    ".OBBBSSSSSSBBBO.",
    ".OBBSSSSSSSSBBO.",
    ".OBSSSSSSSSSSBO.",
    ".OBSSDDSSSDDSBO.",
    ".OBSSDDSSSDDSBO.",
    ".OBSSSSSSSSSSBO.",
    ".OBSSSSMMSSSSBO.",
    ".OBBSBBBBBBSBBO.",
    "..OBBBBBBBBBBO..",
    "..OBBBBBBBBBBO..",
    "...OBBBbbBBBO...",
    "...ORRRRRRRRO...",
    "..ORRpRRRRpRRO..",
    "..ORRRRRRRRRRO..",
    "...ORRRRRRRRO...",
    "....OOOOOOOO....",
  ],
  palette: { O: "#1b1320", B: "#69431f", S: "#e1be97", D: "#241b2c", M: "#9a5446", R: "#56386f", p: "#6f4a8c", b: "#caa07a" },
};
const CHIBI_ASTARION = {
  rows: [
    "....OOHHHHOO....",
    "...OHHHHHHHHO...",
    "..OHHHHHHHHHHO..",
    ".OHHHHHHHHHHHHO.",
    ".OHHHhhHHhhHHHO.",
    ".OHHHSSSSSSHHHO.",
    ".OHHSSSSSSSSHHO.",
    ".OHSSSSSSSSSSHO.",
    ".OHSSRRSSSRRSHO.",
    ".OHSSRRSSSRRSHO.",
    ".OHSSSSSSSSSSHO.",
    ".OHSSSSMMSSSSHO.",
    "..OHSSSSSSSSHO..",
    "..OHHSSSSSSHHO..",
    "...OHHSSSSHHO...",
    "...OHHHbbHHHO...",
    "...OrrrCCrrrO...",
    "..OCCrCCCCrCCO..",
    "..OCCCCqqCCCCO..",
    "...OCCCCCCCCO...",
    "....OOOOOOOO....",
  ],
  palette: { O: "#1b1320", H: "#e0e1e7", h: "#a9afbb", S: "#ecd3bd", R: "#c12f39", M: "#b0696a", C: "#262230", r: "#8a2a31", q: "#3a5c8c", b: "#caa888" },
};

// place a chibi sprite standing on the ground, with a name tag above
function ChibiChar({ sprite, cx, footY, scale = 0.9, name, tagColor, anim = "charIdle 2.8s ease-in-out infinite" }) {
  const w = Math.max(...sprite.rows.map(r => r.length));
  const h = sprite.rows.length;
  return (
    <g style={{ animation: anim, transformBox: "fill-box", transformOrigin: "center bottom" }}>
      <g transform={`translate(${cx - (w * scale) / 2} ${footY - h * scale}) scale(${scale})`}>
        <Sprite rows={sprite.rows} palette={sprite.palette} />
      </g>
      {name ? <NameTag cx={cx} top={footY - h * scale - 5} text={name} color={tagColor} px={0.4} /> : null}
    </g>
  );
}

function SceneTown() {
  // layered jungle canopy of leaf clumps
  const canopy = useMemo(() => {
    const arr = [];
    let id = 0;
    for (let x = -8; x < 212; x += 21) arr.push({ id: id++, x: x + ((Math.random() * 6 - 3) | 0), y: -6 + ((Math.random() * 6) | 0), s: 3, pal: LEAF_PAL_BACK });
    for (let x = -4; x < 212; x += 25) arr.push({ id: id++, x: x + ((Math.random() * 6 - 3) | 0), y: 4 + ((Math.random() * 8) | 0), s: 3, pal: LEAF_PAL_MID });
    for (let x = 2; x < 208; x += 29) arr.push({ id: id++, x: x + ((Math.random() * 8 - 4) | 0), y: 18 + ((Math.random() * 8) | 0), s: 2, pal: LEAF_PAL_FRONT });
    return arr;
  }, []);

  // little drifting glow-spores
  return (
    <>
      <SkyGradient stops={[
        ["0%", "#4a7c4e"], ["40%", "#2c5a2c"], ["100%", "#143012"]
      ]} />
      <PixelStage vbW={200} vbH={112}>
        {/* deep-jungle back wall behind everything */}
        <rect x="0" y="0" width="200" height="112" fill="#173a1d" />
        {/* faint shafts of light through the canopy */}
        <rect x="40" y="0" width="10" height="70" fill="#bfe89a" opacity="0.06" transform="skewX(-8)" />
        <rect x="150" y="0" width="14" height="78" fill="#bfe89a" opacity="0.06" transform="skewX(-8)" />

        {/* tall jungle trunks (behind houses, visible in the gaps) */}
        <Trunk x={-2} top={6} bottom={92} w={7} />
        <Trunk x={76} top={2} bottom={92} w={6} />
        <Trunk x={107} top={4} bottom={92} w={6} />
        <Trunk x={192} top={6} bottom={92} w={8} />

        {/* canopy: big overlapping leaf clumps across the top */}
        {canopy.map(c => (
          <g key={c.id} transform={`translate(${c.x}, ${c.y}) scale(${c.s})`}>
            <Sprite rows={JUNGLE_LEAF_ROWS} palette={c.pal} />
          </g>
        ))}

        {/* a few dark leaf clumps lower down for depth behind the houses */}
        {[[18, 56], [62, 60], [150, 54], [186, 58]].map(([x, y], i) => (
          <g key={"lc" + i} transform={`translate(${x}, ${y}) scale(2)`}>
            <Sprite rows={JUNGLE_LEAF_ROWS} palette={LEAF_PAL_BACK} />
          </g>
        ))}

        {/* hanging vines from the canopy */}
        {[[80, 26, 22], [110, 30, 18], [44, 28, 16], [164, 32, 20]].map(([x, top, len], i) => (
          <g key={"v" + i}>
            <rect x={x} y={top} width="1" height={len} fill="#2e6332" />
            <rect x={x} y={top + len} width="2" height="2" fill="#5aaa3e" />
            <rect x={x - 1} y={top + len - 3} width="2" height="2" fill="#4f9a3a" />
          </g>
        ))}

        {/* ===== GROUND ===== */}
        <rect x="0" y="90" width="200" height="22" fill="#3a2616" />
        {/* dirt speckle */}
        {Array.from({ length: 26 }).map((_, i) => (
          <rect key={"ds" + i} x={(i * 8 + 2) % 200} y={94 + (i % 4) * 4} width="3" height="2" fill="#2a1a0e" />
        ))}
        {/* grass cap on the two ledges (none over the water) */}
        <rect x="0" y="89" width="112" height="2" fill="#3a7a2e" />
        <rect x="0" y="89" width="112" height="1" fill="#5aaa3e" />
        <rect x="178" y="89" width="22" height="2" fill="#3a7a2e" />
        <rect x="178" y="89" width="22" height="1" fill="#5aaa3e" />
        {/* grass tufts */}
        {[6, 22, 40, 58, 74, 96, 182, 196].map((x, i) => (
          <g key={"gt" + i}>
            <rect x={x} y="88" width="1" height="1" fill="#5aaa3e" />
            <rect x={x + 1} y="87" width="1" height="2" fill="#7ec24a" />
            <rect x={x + 2} y="88" width="1" height="1" fill="#5aaa3e" />
          </g>
        ))}

        {/* ===== WATER POOL under the big house ===== */}
        <rect x="110" y="91" width="68" height="21" fill="#1d6b76" />
        <rect x="110" y="91" width="68" height="1" fill="#5ac0c8" />
        <rect x="116" y="95" width="40" height="1" fill="#3a9aa6" opacity="0.7" />
        <rect x="128" y="100" width="44" height="1" fill="#3a9aa6" opacity="0.5" />
        {/* bank edges sloping into the pool */}
        <rect x="108" y="90" width="4" height="3" fill="#4a3020" />
        <rect x="176" y="90" width="4" height="3" fill="#4a3020" />

        {/* ===== Reaper Leviathan surfacing in the pool ===== */}
        {(() => {
          const w = 56, h = w / window.REAPER_AR, cx = 144, surfaceY = 91, footY = 110;
          return (
            <g>
              {/* clip the body so only the part above the pool bottom shows, then overlay water on the submerged half */}
              <g style={{ transformBox: "fill-box", transformOrigin: "center bottom", animation: "charIdle 4s ease-in-out infinite" }}>
                <image href={window.REAPER_SRC} xlinkHref={window.REAPER_SRC}
                  x={cx - w / 2} y={footY - h} width={w} height={h}
                  preserveAspectRatio="xMidYMax meet" style={{ imageRendering: "pixelated" }} />
              </g>
              {/* translucent water over the submerged lower portion */}
              <rect x="110" y={surfaceY + 1} width="68" height="20" fill="#1d6b76" opacity="0.5" />
              <rect x="110" y={surfaceY} width="68" height="1" fill="#7fd6dc" opacity="0.8" />
              {/* ripple lines around where it breaks the surface */}
              <rect x={cx - 16} y={surfaceY} width="12" height="1" fill="#8fe0e6" opacity="0.7" />
              <rect x={cx + 6} y={surfaceY} width="14" height="1" fill="#8fe0e6" opacity="0.6" />
              {/* name tag over the sprite, near his lower body */}
              <NameTag cx={cx} top={footY - 5} text="Reaper Leviathan" color="#c87a72" />
            </g>
          );
        })()}

        {/* ============ LEFT HOUSE — study (blue-grey roof) ============ */}
        {/* stilts */}
        {[10, 28, 46, 60].map((x, i) => (
          <g key={"ls" + i}>
            <rect x={x} y="78" width="3" height="12" fill="#4a3018" />
            <rect x={x} y="78" width="1" height="12" fill="#6a4a2a" />
          </g>
        ))}
        {/* deck / floor */}
        <rect x="5" y="75" width="61" height="3" fill="#6a4a2a" />
        <rect x="5" y="75" width="61" height="1" fill="#8a6440" />
        <rect x="5" y="77" width="61" height="1" fill="#3a2414" />
        {/* back wall (cream plaster) + frame */}
        <rect x="10" y="56" width="51" height="19" fill="#d6c4a0" />
        <rect x="10" y="56" width="51" height="2" fill="#c2ac84" />
        <rect x="7" y="54" width="4" height="22" fill="#6a4a2a" />
        <rect x="60" y="54" width="4" height="22" fill="#6a4a2a" />
        <rect x="5" y="54" width="60" height="3" fill="#7a5630" />
        {/* roof — blue-grey pagoda */}
        <rect x="2" y="50" width="63" height="6" fill="#4f6678" />
        <rect x="2" y="50" width="63" height="2" fill="#6a849a" />
        <rect x="2" y="54" width="63" height="2" fill="#3a4a5a" />
        <rect x="0" y="48" width="4" height="4" fill="#3a4a5a" />
        <rect x="63" y="48" width="4" height="4" fill="#3a4a5a" />
        <rect x="16" y="45" width="35" height="5" fill="#4f6678" />
        <rect x="16" y="45" width="35" height="2" fill="#6a849a" />
        <rect x="14" y="43" width="39" height="2" fill="#3a4a5a" />
        {/* roof tile texture */}
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={"lt" + i} x={5 + i * 4} y="52" width="1" height="3" fill="#3a4a5a" opacity="0.6" />
        ))}
        {/* roof torch — standing on the roof */}
        <rect x="9" y="44" width="2" height="6" fill="#3a2414" />
        <rect x="8" y="41" width="4" height="3" fill="#ff8838" style={{ animation: "flicker 0.6s infinite" }} />
        <rect x="9" y="40" width="2" height="2" fill="#ffd34d" style={{ animation: "flicker 0.45s infinite" }} />
        <rect x="6" y="39" width="8" height="6" fill="#ffb84d" opacity="0.14" />
        {/* --- interior --- */}
        <rect x="12" y="73" width="47" height="2" fill="#8a3a30" opacity="0.85" />  {/* rug */}
        {/* bookshelf */}
        <rect x="12" y="58" width="9" height="17" fill="#4a3018" />
        <rect x="12" y="58" width="9" height="1" fill="#6a4a2a" />
        {[60, 65, 70].map((sy, i) => <rect key={"lsh" + i} x="12" y={sy} width="9" height="1" fill="#2a1c0e" />)}
        <BookRow x={13} y={59} colors={BOOKS_B} />
        <BookRow x={13} y={66} colors={BOOKS_A.slice(0, 4)} />
        <BookRow x={13} y={71} colors={BOOKS_C.slice(0, 4)} />
        {/* painting */}
        <rect x="40" y="59" width="9" height="8" fill="#3a2414" />
        <rect x="41" y="60" width="7" height="6" fill="#6a849a" />
        <rect x="41" y="63" width="7" height="3" fill="#3a7a3a" />
        <rect x="44" y="61" width="2" height="2" fill="#ffd34d" />
        {/* hanging lantern */}
        <rect x="53" y="57" width="1" height="3" fill="#3a2414" />
        <rect x="51" y="60" width="5" height="6" fill="#3a2414" />
        <rect x="52" y="61" width="3" height="4" fill="#ffd34d" style={{ animation: "flicker 0.8s infinite" }} />
        <rect x="49" y="59" width="9" height="9" fill="#ffd34d" opacity="0.12" />
        {/* desk + candle + scholar */}
        <rect x="26" y="69" width="16" height="2" fill="#6a4a2a" />
        <rect x="27" y="71" width="2" height="4" fill="#5a3a1f" />
        <rect x="39" y="71" width="2" height="4" fill="#5a3a1f" />
        <rect x="29" y="67" width="5" height="2" fill="#efe6cf" />            {/* open book */}
        <rect x="37" y="66" width="1" height="3" fill="#cfc0a0" />
        <rect x="37" y="64" width="1" height="2" fill="#ffd34d" style={{ animation: "flicker 0.5s infinite" }} />
        <Scholar x={31} y={62} robe="#6a4a8a" />
        {/* window glow */}
        <rect x="9" y="56" width="53" height="20" fill="#ffd34d" opacity="0.05" />

        {/* ============ CENTER — jade torii gate ============ */}
        <rect x="84" y="88" width="24" height="2" fill="#5a3a1f" />
        <rect x="90" y="62" width="3" height="28" fill="#2f8a78" />
        <rect x="90" y="62" width="1" height="28" fill="#4fb89a" />
        <rect x="101" y="62" width="3" height="28" fill="#2f8a78" />
        <rect x="101" y="62" width="1" height="28" fill="#4fb89a" />
        <rect x="85" y="60" width="24" height="3" fill="#2f8a78" />
        <rect x="85" y="60" width="24" height="1" fill="#5ad0b8" />
        <rect x="83" y="58" width="4" height="2" fill="#256a5c" />
        <rect x="107" y="58" width="4" height="2" fill="#256a5c" />
        <rect x="88" y="65" width="18" height="2" fill="#2f8a78" />
        <rect x="88" y="65" width="18" height="1" fill="#5ad0b8" />
        {/* glowing core orb */}
        <rect x="94" y="72" width="5" height="8" fill="#8affd8" style={{ animation: "flicker 1.1s infinite" }} />
        <rect x="95" y="70" width="3" height="12" fill="#caffea" opacity="0.5" />
        <rect x="90" y="70" width="13" height="12" fill="#8affd8" opacity="0.16" />
        <rect x="92" y="74" width="9" height="4" fill="#caffea" opacity="0.3" />

        {/* ============ RIGHT HOUSE — two-floor library (red pagoda) ============ */}
        {/* stilts into the water */}
        {[118, 140, 162, 184].map((x, i) => (
          <g key={"rs" + i}>
            <rect x={x} y="82" width="3" height="18" fill="#4a3018" />
            <rect x={x} y="82" width="1" height="18" fill="#6a4a2a" />
            <rect x={x} y="99" width="3" height="2" fill="#0f3a40" opacity="0.5" />
          </g>
        ))}
        {/* lower deck */}
        <rect x="112" y="80" width="78" height="3" fill="#6a4a2a" />
        <rect x="112" y="80" width="78" height="1" fill="#8a6440" />
        {/* lower room wall */}
        <rect x="116" y="64" width="70" height="16" fill="#d6c4a0" />
        <rect x="116" y="64" width="70" height="2" fill="#c2ac84" />
        {/* mid deck (upper floor) */}
        <rect x="112" y="62" width="78" height="3" fill="#6a4a2a" />
        <rect x="112" y="62" width="78" height="1" fill="#8a6440" />
        {/* upper room wall */}
        <rect x="116" y="46" width="70" height="16" fill="#d6c4a0" />
        <rect x="116" y="46" width="70" height="2" fill="#c2ac84" />
        {/* corner frame posts */}
        <rect x="113" y="44" width="4" height="38" fill="#6a4a2a" />
        <rect x="185" y="44" width="4" height="38" fill="#6a4a2a" />
        {/* roof — red pagoda, two tiers */}
        <rect x="108" y="40" width="82" height="6" fill="#8a3020" />
        <rect x="108" y="40" width="82" height="2" fill="#a84030" />
        <rect x="108" y="44" width="82" height="2" fill="#6a2418" />
        <rect x="106" y="37" width="4" height="4" fill="#6a2418" />
        <rect x="188" y="37" width="4" height="4" fill="#6a2418" />
        <rect x="124" y="30" width="52" height="10" fill="#8a3020" />
        <rect x="124" y="28" width="52" height="3" fill="#a84030" />
        <rect x="120" y="26" width="60" height="2" fill="#6a2418" />
        <rect x="118" y="24" width="4" height="3" fill="#6a2418" />
        <rect x="178" y="24" width="4" height="3" fill="#6a2418" />
        {/* roof tile texture */}
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={"rt" + i} x={110 + i * 4} y="42" width="1" height="3" fill="#6a2418" opacity="0.6" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <rect key={"rt2" + i} x={125 + i * 4} y="32" width="1" height="6" fill="#6a2418" opacity="0.5" />
        ))}
        {/* roof-corner torches */}
        {[120, 178].map((x, i) => (
          <g key={"rtorch" + i}>
            <rect x={x} y="20" width="2" height="6" fill="#3a2414" />
            <rect x={x - 1} y="17" width="4" height="3" fill="#ff8838" style={{ animation: "flicker 0.6s infinite" }} />
            <rect x={x} y="16" width="2" height="2" fill="#ffd34d" style={{ animation: "flicker 0.45s infinite" }} />
            <rect x={x - 3} y="15" width="8" height="6" fill="#ffb84d" opacity="0.14" />
          </g>
        ))}
        {/* --- lower interior: library --- */}
        <rect x="118" y="78" width="66" height="2" fill="#8a3a30" opacity="0.7" />  {/* rug */}
        {/* long bookshelf */}
        <rect x="118" y="66" width="30" height="14" fill="#4a3018" />
        <rect x="118" y="66" width="30" height="1" fill="#6a4a2a" />
        {[70, 74].map((sy, i) => <rect key={"rlsh" + i} x="118" y={sy} width="30" height="1" fill="#2a1c0e" />)}
        <BookRow x={119} y={67} colors={BOOKS_C} />
        <BookRow x={133} y={67} colors={BOOKS_A} />
        <BookRow x={119} y={75} colors={BOOKS_A} />
        <BookRow x={133} y={75} colors={BOOKS_B} />
        {/* ladder to upper floor */}
        <rect x="150" y="64" width="1" height="16" fill="#5a3a1f" />
        <rect x="154" y="64" width="1" height="16" fill="#5a3a1f" />
        {[66, 70, 74, 78].map((ry, i) => <rect key={"lad" + i} x="150" y={ry} width="5" height="1" fill="#5a3a1f" />)}
        {/* desk + candle */}
        <rect x="158" y="74" width="14" height="2" fill="#6a4a2a" />
        <rect x="159" y="76" width="2" height="4" fill="#5a3a1f" />
        <rect x="170" y="76" width="2" height="4" fill="#5a3a1f" />
        <rect x="161" y="72" width="5" height="2" fill="#efe6cf" />
        <rect x="168" y="70" width="1" height="2" fill="#ffd34d" style={{ animation: "flicker 0.5s infinite" }} />
        {/* potted plant */}
        <rect x="178" y="74" width="5" height="4" fill="#7a5630" />
        <rect x="178" y="71" width="5" height="3" fill="#3a7a3a" />
        <rect x="179" y="68" width="3" height="3" fill="#4f9a3a" />
        <Scholar x={163} y={68} robe="#3a6a9a" />
        {/* --- upper interior: study --- */}
        {/* chalkboard */}
        <rect x="119" y="48" width="17" height="12" fill="#5a4030" />
        <rect x="120" y="49" width="15" height="10" fill="#243028" />
        <rect x="122" y="51" width="9" height="1" fill="#c8d8c0" opacity="0.8" />
        <rect x="122" y="53" width="11" height="1" fill="#c8d8c0" opacity="0.6" />
        <rect x="122" y="55" width="6" height="1" fill="#c8d8c0" opacity="0.7" />
        <rect x="129" y="55" width="4" height="3" fill="#8fd44f" opacity="0.7" />
        {/* desk + candle */}
        <rect x="140" y="56" width="14" height="2" fill="#6a4a2a" />
        <rect x="141" y="58" width="2" height="4" fill="#5a3a1f" />
        <rect x="152" y="58" width="2" height="4" fill="#5a3a1f" />
        <rect x="143" y="54" width="5" height="2" fill="#efe6cf" />
        <rect x="150" y="52" width="1" height="2" fill="#ffd34d" style={{ animation: "flicker 0.5s infinite" }} />
        {/* bookshelf right */}
        <rect x="168" y="48" width="16" height="13" fill="#4a3018" />
        <rect x="168" y="48" width="16" height="1" fill="#6a4a2a" />
        {[52, 56].map((sy, i) => <rect key={"rush" + i} x="168" y={sy} width="16" height="1" fill="#2a1c0e" />)}
        <BookRow x={169} y={49} colors={BOOKS_A} />
        <BookRow x={169} y={53} colors={BOOKS_C.slice(0, 6)} />
        <BookRow x={169} y={57} colors={BOOKS_B} />
        {/* painting */}
        <rect x="156" y="49" width="9" height="7" fill="#3a2414" />
        <rect x="157" y="50" width="7" height="5" fill="#1d6b76" />
        <rect x="157" y="53" width="7" height="2" fill="#3a9aa6" />
        <Scholar x={159} y={58} robe="#7a3a3a" />
        {/* window glows */}
        <rect x="114" y="46" width="74" height="16" fill="#ffd34d" opacity="0.05" />
        <rect x="114" y="64" width="74" height="16" fill="#ffd34d" opacity="0.05" />

        {/* ===== FOREGROUND PLANTS ===== */}
        {/* glowing blue mushrooms (left) */}
        {[[3, 86], [8, 87], [5, 84]].map(([x, y], i) => (
          <g key={"mush" + i}>
            <rect x={x} y={y + 2} width="1" height="2" fill="#cfe6ea" />
            <rect x={x - 1} y={y} width="3" height="2" fill="#5ac0ff" />
            <rect x={x - 1} y={y} width="3" height="1" fill="#aee6ff" />
            <rect x={x - 2} y={y - 1} width="5" height="4" fill="#5ac0ff" opacity="0.18" />
          </g>
        ))}
        {/* crystal shard (left) */}
        <rect x="14" y="84" width="2" height="6" fill="#7a6ad0" />
        <rect x="14" y="84" width="1" height="6" fill="#b8a8ff" />
        <rect x="13" y="86" width="1" height="3" fill="#5a4aa8" />
        <rect x="12" y="82" width="6" height="9" fill="#7a6ad0" opacity="0.14" />
        {/* ferns on the ledges */}
        {[[68, 88], [40, 88], [96, 88], [182, 88], [196, 88]].map(([x, y], i) => (
          <g key={"fern" + i}>
            <rect x={x} y={y - 3} width="1" height="4" fill="#3a7a3a" />
            <rect x={x - 2} y={y - 1} width="2" height="1" fill="#4f9a3a" />
            <rect x={x + 1} y={y - 1} width="2" height="1" fill="#4f9a3a" />
            <rect x={x - 1} y={y - 3} width="1" height="1" fill="#5aaa3e" />
            <rect x={x + 1} y={y - 4} width="1" height="2" fill="#5aaa3e" />
          </g>
        ))}
        {/* small bush */}
        <g transform="translate(72, 84)">
          <Sprite rows={PIXEL_BUSH.rows} palette={PIXEL_BUSH.palette} />
        </g>
        {/* lily pad on the pool */}
        <rect x="150" y="92" width="6" height="1" fill="#3a7a3a" />
        <rect x="151" y="91" width="4" height="1" fill="#4f9a3a" />

        {/* ===== Minecraft villagers ===== */}
        {/* Enderman — standing on top of the blue house roof */}
        <KnightSprite src={window.MC.enderman} cx={33} footY={44} h={23} ar={window.MC_AR.enderman}
          name="Enderman" tagColor="#d24bff" shadow={false} tagGap={2} anim="charIdle 3.4s ease-in-out infinite" />
        {/* Villager — inside the blue house (study) */}
        <KnightSprite src={window.MC.villager} cx={37} footY={75} h={15} ar={window.MC_AR.villager}
          name="Villager" tagColor="#d8c8a4" shadow={false} tagGap={2} anim="charIdle 2.9s ease-in-out infinite" />
        {/* Steve — standing beside the bush, on its right */}
        <KnightSprite src={window.MC.steve} cx={84} footY={90} h={15} ar={window.MC_AR.steve * 0.68}
          name="Steve" tagColor="#cfe0ff" shadow shadowRx={4} tagGap={-2} anim="charIdle 3.1s ease-in-out infinite" />
        {/* Creeper — perched on the right side of the red house roof */}
        <KnightSprite src={window.MC.creeper} cx={181} footY={40} h={14} ar={window.MC_AR.creeper} flip
          name="Creeper" tagColor="#8fd44f" shadow={false} tagGap={2} anim="charIdle 2.6s ease-in-out infinite" />
      </PixelStage>
      <Particles count={22} kind="firefly" color="#aef0a0" />
      <Particles count={10} kind="firefly" color="#8affd8" />
    </>
  );
}

/* ---------- 4. FORGE (Experience) ---------- */
function SceneForge() {
  return (
    <>
      <SkyGradient stops={[
        ["0%", "#1a0a08"], ["50%", "#3a1612"], ["100%", "#1a0a08"]
      ]} />
      <PixelStage vbW={200} vbH={112}>
        {/* stone brick wall — shaded */}
        <rect x="0" y="0" width="200" height="112" fill="#1a0e0a" />
        {Array.from({ length: 16 }).map((_, r) =>
          Array.from({ length: 25 }).map((_, c) => {
            const offsetX = (r % 2) * 4;
            const x = c * 8 + offsetX;
            const y = r * 6;
            return (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y} width="7" height="5" fill="#2a160e" />
                <rect x={x} y={y} width="7" height="1" fill="#3a1f14" />
                <rect x={x + 6} y={y + 1} width="1" height="4" fill="#150a06" />
              </g>
            );
          })
        )}

        {/* support beams */}
        <rect x="6"   y="0" width="6" height="92" fill="#1a0a04" />
        <rect x="6"   y="0" width="2" height="92" fill="#3a2010" />
        <rect x="10"  y="0" width="2" height="92" fill="#080402" />
        <rect x="188" y="0" width="6" height="92" fill="#1a0a04" />
        <rect x="188" y="0" width="2" height="92" fill="#3a2010" />
        <rect x="192" y="0" width="2" height="92" fill="#080402" />
        <rect x="0" y="0" width="200" height="6" fill="#1a0a04" />
        <rect x="0" y="0" width="200" height="2" fill="#3a2010" />

        {/* hanging tools */}
        <rect x="36" y="6" width="1" height="14" fill="#0a0604" />
        <rect x="32" y="20" width="9" height="3" fill="#5a4030" />
        <rect x="32" y="20" width="9" height="1" fill="#8a6450" />
        <rect x="32" y="22" width="9" height="1" fill="#3a2818" />
        <rect x="66"  y="6"  width="1" height="10" fill="#0a0604" />
        <rect x="60"  y="16" width="13" height="2" fill="#5a4030" />
        <rect x="60"  y="16" width="13" height="1" fill="#8a6450" />
        <rect x="60"  y="18" width="2" height="6" fill="#5a4030" />
        <rect x="71"  y="18" width="2" height="6" fill="#5a4030" />
        <rect x="142" y="6"  width="1" height="16" fill="#0a0604" />
        <rect x="138" y="22" width="9" height="4" fill="#5a4030" />
        <rect x="138" y="22" width="9" height="1" fill="#8a6450" />

        {/* forge — shaded brick */}
        <g transform="translate(70, 60)">
          <rect x="0" y="20" width="60" height="22" fill="#1a0a06" />
          <rect x="0" y="20" width="60" height="2" fill="#3a1808" />
          <rect x="0" y="40" width="60" height="2" fill="#080402" />
          <rect x="6" y="14" width="48" height="8" fill="#0a0604" />
          <rect x="6" y="14" width="48" height="2" fill="#2a1408" />
          <rect x="10" y="22" width="40" height="14" fill="#3a1208" />
          {/* fire — 4 shades */}
          <rect x="14" y="24" width="32" height="10" fill="#c83820" style={{ animation: "flicker 0.7s infinite" }} />
          <rect x="16" y="26" width="28" height="8"  fill="#ff8838" style={{ animation: "flicker 0.6s infinite" }} />
          <rect x="20" y="28" width="20" height="5"  fill="#ffd866" style={{ animation: "flicker 0.5s infinite" }} />
          <rect x="24" y="30" width="12" height="3"  fill="#fff5a0" style={{ animation: "flicker 0.4s infinite" }} />
          <rect x="28" y="22" width="4"  height="2"  fill="#ff8838" style={{ animation: "flicker 0.6s infinite" }} />
        </g>
        {/* forge glow halo */}
        <rect x="60" y="56" width="80" height="40" fill="#ff8838" opacity="0.18" />
        <rect x="50" y="64" width="100" height="32" fill="#ff8838" opacity="0.08" />

        {/* anvil — grounded */}
        <g transform="translate(28, 92)">
          <Sprite rows={PIXEL_ANVIL.rows} palette={PIXEL_ANVIL.palette} />
        </g>

        {/* glowing horseshoe on anvil */}
        <rect x="32" y="90" width="6" height="1" fill="#ff8838" style={{ animation: "flicker 0.7s infinite" }} />
        <rect x="32" y="91" width="2" height="1" fill="#ff5a18" />
        <rect x="36" y="91" width="2" height="1" fill="#ff5a18" />

        {/* sword rack on the wall (right side) */}
        <g transform="translate(160, 36)">
          <Sprite rows={PIXEL_SWORDS.rows} palette={PIXEL_SWORDS.palette} />
        </g>
        {/* horizontal bar under the rack */}
        <rect x="158" y="56" width="20" height="2" fill="#3a2010" />
        <rect x="158" y="56" width="20" height="1" fill="#5a3a18" />

        {/* water barrel (grounded), in the gap before the forge */}
        <g transform="translate(60, 91)">
          <Sprite rows={PIXEL_BARREL.rows} palette={PIXEL_BARREL.palette} />
        </g>
        {/* small water surface highlight on barrel */}
        <rect x="61" y="91" width="8" height="1" fill="#3a6080" opacity="0.7" />

        {/* bellows hanging on left wall */}
        <g transform="translate(18, 40)">
          <Sprite rows={PIXEL_BELLOWS.rows} palette={PIXEL_BELLOWS.palette} />
        </g>
        {/* bellows pipe extending right toward forge */}
        <rect x="35" y="48" width="36" height="2" fill="#5a3a18" />
        <rect x="35" y="48" width="36" height="1" fill="#8a5a28" />

        {/* tongs on the wall */}
        <rect x="56" y="36" width="1" height="14" fill="#0a0604" />
        <rect x="52" y="50" width="2" height="6" fill="#3a2818" />
        <rect x="58" y="50" width="2" height="6" fill="#3a2818" />

        {/* water trough on the right */}
        <g transform="translate(176, 92)">
          <rect x="0" y="0" width="20" height="8" fill="#1a0e08" />
          <rect x="2" y="2" width="16" height="4" fill="#2a4870" />
          <rect x="2" y="2" width="16" height="1" fill="#5a8aaf" />
          <rect x="0" y="0" width="20" height="1" fill="#3a2010" />
          <rect x="0" y="7" width="20" height="1" fill="#0a0604" />
        </g>

        {/* ground */}
        <rect x="0" y="100" width="200" height="12" fill="#1a0a04" />
        <rect x="0" y="100" width="200" height="1"  fill="#3a2010" />
        {Array.from({ length: 25 }).map((_, i) => (
          <g key={i}>
            <rect x={i * 8} y="103" width="6" height="2" fill="#2a160e" />
            <rect x={i * 8} y="103" width="6" height="1" fill="#3a1f14" />
          </g>
        ))}
        {/* ===== KNIGHTS — four of them, just standing and idling ===== */}
        <KnightSprite src={window.KNIGHTS.red} cx={15} footY={100} h={18} ar={0.9} flip={true}
          name="Red" tagColor="#ff6b6b" anim="charIdle 2.5s ease-in-out infinite" />
        <KnightSprite src={window.KNIGHTS.blue} cx={50} footY={100} h={18} ar={0.9}
          name="Blue" tagColor="#6ab0ff" anim="charIdle 2.8s ease-in-out infinite" />
        <KnightSprite src={window.KNIGHTS.green} cx={144} footY={100} h={18} ar={0.9}
          name="Green" tagColor="#6ce06a" anim="charIdle 2.6s ease-in-out infinite" />
        {/* Claptrap — to the left of Green, flipped to face him */}
        <KnightSprite src={window.CLAPTRAP_SRC} cx={122} footY={100} h={18} ar={window.CLAPTRAP_AR} flip
          name="Claptrap" tagColor="#ffd34d" shadow anim="charIdle 3.2s ease-in-out infinite" />
        <KnightSprite src={window.KNIGHTS.orange} cx={166} footY={100} h={18} ar={0.9}
          name="Orange" tagColor="#ffae4a" anim="charIdle 3s ease-in-out infinite" />

      </PixelStage>
      <Particles count={40} kind="spark" color="#ffa040" />
      <Particles count={16} kind="spark" color="#fff" />
      <WindLayer count={9} colors={["#ff8838", "#c8651a", "#6a5a52"]} topRange={[28, 70]} dur={[6, 11]} glow={true} leaf={false} />
    </>
  );
}

/* ---------- 5. TREASURE VAULT (Projects) ---------- */
function SceneVault() {
  // distant skyline towers (hazy, behind everything)
  const farTowers = [
    { x: 6,   w: 14, top: 30, c: "#8a9bc4", t: "#9fb0d6" },
    { x: 22,  w: 10, top: 22, c: "#7d8fbb", t: "#94a6cf" },
    { x: 40,  w: 16, top: 16, c: "#8a9bc4", t: "#a2b3d8", spire: true },
    { x: 70,  w: 12, top: 26, c: "#7d8fbb", t: "#94a6cf" },
    { x: 90,  w: 18, top: 10, c: "#93a3cb", t: "#aab9dc", spire: true, flag: true },
    { x: 116, w: 12, top: 24, c: "#8090bd", t: "#97a7d0" },
    { x: 132, w: 20, top: 18, c: "#8a9bc4", t: "#9fb0d6" },
    { x: 160, w: 14, top: 28, c: "#7d8fbb", t: "#94a6cf" },
    { x: 178, w: 16, top: 22, c: "#8a9bc4", t: "#9fb0d6" },
  ];
  // foreground storefront row (full width). base/sidewalk top = 90
  const BASE = 90;
  const blocks = [
    { x: 0,   w: 26, top: 56, c: "#b1543f", d: "#8c3f2f", trim: "#d8b48c", awn: "#3f7a6e" },
    { x: 26,  w: 22, top: 50, c: "#c8804e", d: "#a3623a", trim: "#efd9b0", awn: "#b1543f" },
    { x: 48,  w: 20, top: 46, c: "#cdab78", d: "#a8865a", trim: "#3a2a1c", awn: "#5f9a92" },
    { x: 68,  w: 30, top: 38, c: "#9c5340", d: "#7c3f30", trim: "#e0c49a", awn: "#c8804e", sign: true },
    { x: 98,  w: 22, top: 52, c: "#6c7fa6", d: "#51618a", trim: "#cdd6e8", awn: "#c84a4a" },
    { x: 120, w: 24, top: 44, c: "#bd5a44", d: "#963f30", trim: "#e8cba0", awn: "#3f7a6e" },
    { x: 144, w: 20, top: 50, c: "#5f9a92", d: "#437068", trim: "#e0ead0", awn: "#c8804e" },
    { x: 164, w: 22, top: 42, c: "#c8804e", d: "#a3623a", trim: "#efd9b0", awn: "#6c7fa6" },
    { x: 186, w: 14, top: 54, c: "#a85a8a", d: "#83406a", trim: "#e8cbe0", awn: "#5f9a92" },
  ];
  return (
    <>
      <SkyGradient stops={[
        ["0%", "#3f9fd6"], ["55%", "#62b4e6"], ["100%", "#9ad4f2"]
      ]} />
      <PixelStage vbW={200} vbH={112}>
        {/* ===== soft haze band above the skyline ===== */}
        <rect x="0" y="40" width="200" height="22" fill="#bfe0f2" opacity="0.45" />

        {/* ===== drifting clouds ===== */}
        {[[28, 12, 1], [120, 8, 1.3], [168, 18, 0.9]].map(([cx, cy, s], i) => (
          <g key={"cl" + i} style={{ animation: `cloudDrift ${36 + i * 10}s linear infinite`, transformBox: "view-box" }}>
            <g transform={`translate(${cx}, ${cy}) scale(${s})`}>
              <rect x="0" y="3" width="22" height="4" fill="#eaf4fb" />
              <rect x="4" y="0" width="14" height="4" fill="#f4fbff" />
              <rect x="-3" y="5" width="28" height="2" fill="#dcebf6" />
            </g>
          </g>
        ))}

        {/* ===== distant skyline ===== */}
        {farTowers.map((b, i) => (
          <g key={"ft" + i}>
            <rect x={b.x} y={b.top} width={b.w} height={62 - b.top} fill={b.c} />
            <rect x={b.x} y={b.top} width={b.w} height="2" fill={b.t} />
            <rect x={b.x} y={b.top} width="2" height={62 - b.top} fill={b.t} opacity="0.6" />
            {b.spire && <>
              <rect x={b.x + b.w / 2 - 2} y={b.top - 5} width="4" height="5" fill={b.c} />
              <rect x={b.x + b.w / 2 - 2} y={b.top - 5} width="1" height="5" fill={b.t} />
              <rect x={b.x + b.w / 2 - 1} y={b.top - 9} width="1" height="4" fill="#9fb0d6" />
            </>}
            {b.flag && <>
              <rect x={b.x + b.w / 2} y={b.top - 14} width="1" height="6" fill="#5a6a90" />
              <rect x={b.x + b.w / 2 + 1} y={b.top - 14} width="4" height="3" fill="#d8413a" />
            </>}
            {/* window grid */}
            {Array.from({ length: Math.floor((62 - b.top) / 5) }).map((_, r) =>
              Array.from({ length: Math.floor(b.w / 4) }).map((_, c) => (
                <rect key={r + "_" + c} x={b.x + 2 + c * 4} y={b.top + 4 + r * 5} width="2" height="3"
                  fill={(r * 3 + c * 5 + i) % 4 === 0 ? "#e9f1a8" : "#aab9d8"} opacity="0.7" />
              ))
            )}
          </g>
        ))}

        {/* ground/haze line behind storefronts */}
        <rect x="0" y="58" width="200" height="6" fill="#9fc9e0" opacity="0.5" />

        {/* ===== foreground storefront row ===== */}
        {blocks.map((b, i) => {
          const floors = Math.floor((BASE - 12 - b.top) / 9);
          return (
            <g key={"bl" + i}>
              {/* body */}
              <rect x={b.x} y={b.top} width={b.w} height={BASE - b.top} fill={b.c} />
              {/* left light edge + right shadow edge */}
              <rect x={b.x} y={b.top} width="1.5" height={BASE - b.top} fill="#ffffff" opacity="0.12" />
              <rect x={b.x + b.w - 1.5} y={b.top} width="1.5" height={BASE - b.top} fill="#000000" opacity="0.18" />
              {/* cornice / roof trim */}
              <rect x={b.x - 1} y={b.top - 2} width={b.w + 2} height="3" fill={b.trim} />
              <rect x={b.x - 1} y={b.top - 2} width={b.w + 2} height="1" fill="#ffffff" opacity="0.35" />
              <rect x={b.x - 1} y={b.top + 1} width={b.w + 2} height="1" fill={b.d} />
              {/* rooftop sign on the tall central building */}
              {b.sign && <>
                <rect x={b.x + 6} y={b.top - 12} width={b.w - 12} height="9" fill="#2b2f3a" />
                <rect x={b.x + 6} y={b.top - 12} width={b.w - 12} height="1" fill="#46506a" />
                <rect x={b.x + 9} y={b.top - 9} width={b.w - 18} height="3" fill="#ffd34d" opacity="0.85" style={{ animation: "flicker 1.4s infinite" }} />
                <rect x={b.x + b.w / 2 - 1} y={b.top - 3} width="2" height="3" fill="#2b2f3a" />
              </>}
              {/* upper-floor window rows */}
              {Array.from({ length: floors }).map((_, r) => {
                const wy = b.top + 4 + r * 9;
                const cols = Math.max(2, Math.floor(b.w / 7));
                const gap = (b.w - 2) / cols;
                return Array.from({ length: cols }).map((_, c) => {
                  const wx = b.x + 2 + c * gap;
                  const lit = (r * 2 + c * 3 + i) % 5 === 0;
                  return (
                    <g key={r + "_" + c}>
                      {/* sill */}
                      <rect x={wx - 0.5} y={wy + 4} width={gap - 1.5} height="1" fill={b.trim} opacity="0.8" />
                      {/* glass */}
                      <rect x={wx} y={wy} width={gap - 2.5} height="4.5" fill={lit ? "#ffe9a8" : "#3a5566"} />
                      <rect x={wx} y={wy} width={gap - 2.5} height="1.4" fill={lit ? "#fff6d8" : "#577287"} />
                      {/* muntin */}
                      <rect x={wx + (gap - 2.5) / 2 - 0.3} y={wy} width="0.6" height="4.5" fill={b.d} opacity="0.5" />
                    </g>
                  );
                });
              })}
              {/* ===== ground-floor shopfront ===== */}
              {/* awning */}
              <rect x={b.x - 1} y={BASE - 13} width={b.w + 2} height="4" fill={b.awn} />
              <rect x={b.x - 1} y={BASE - 13} width={b.w + 2} height="1" fill="#ffffff" opacity="0.3" />
              {/* awning scallops + stripes */}
              {Array.from({ length: Math.ceil((b.w + 2) / 4) }).map((_, s) => (
                <g key={"sc" + s}>
                  {s % 2 === 0 && <rect x={b.x - 1 + s * 4} y={BASE - 13} width="2" height="4" fill="#ffffff" opacity="0.28" />}
                  <polygon points={`${b.x - 1 + s * 4},${BASE - 9} ${b.x - 1 + s * 4 + 4},${BASE - 9} ${b.x - 1 + s * 4 + 2},${BASE - 7}`} fill={b.awn} />
                </g>
              ))}
              {/* shopfront base wall */}
              <rect x={b.x} y={BASE - 9} width={b.w} height="9" fill={b.d} />
              {/* big glass window */}
              <rect x={b.x + 2} y={BASE - 8} width={b.w - 9} height="7" fill="#bfe2e8" opacity="0.85" />
              <rect x={b.x + 2} y={BASE - 8} width={b.w - 9} height="2" fill="#e6f5f7" opacity="0.7" />
              <rect x={b.x + 2 + (b.w - 9) / 2} y={BASE - 8} width="0.6" height="7" fill={b.d} />
              {/* door */}
              <rect x={b.x + b.w - 6} y={BASE - 9} width="5" height="9" fill="#2e2a26" />
              <rect x={b.x + b.w - 6} y={BASE - 9} width="5" height="1" fill={b.trim} opacity="0.6" />
              <rect x={b.x + b.w - 3} y={BASE - 5} width="1" height="1" fill="#d8c48a" />
            </g>
          );
        })}

        {/* ===== street trees ===== */}
        {[16, 56, 110, 156, 192].map((tx, i) => {
          const burning = tx === 110;
          return (
          <g key={"tr" + i}>
            <rect x={tx} y={BASE - 6} width="2" height="6" fill="#5a3f28" />
            {burning ? (
              <>
                {/* green canopy (kept) */}
                <rect x={tx - 4} y={BASE - 14} width="10" height="9" fill="#3f8a3f" />
                <rect x={tx - 3} y={BASE - 16} width="8" height="4" fill="#4f9e46" />
                <rect x={tx - 1} y={BASE - 17} width="4" height="2" fill="#62b552" />
                <rect x={tx - 4} y={BASE - 14} width="10" height="1" fill="#62b552" opacity="0.6" />
                <rect x={tx - 4} y={BASE - 8} width="10" height="2" fill="#2f6a30" opacity="0.5" />
                {/* warm glow halo behind the flames */}
                <ellipse cx={tx + 1} cy={BASE - 11} rx="9" ry="11" fill="#ff7a1a" opacity="0.16" />
                <ellipse cx={tx + 1} cy={BASE - 11} rx="6" ry="8" fill="#ffb43a" opacity="0.12" />
                {/* flame tongues wrapping the whole canopy (base, sides, gaps, crown) */}
                {[
                  { x: tx - 4, y: BASE - 7,  s: 0.9, a: "A", d: 0.0,  h: 6 },
                  { x: tx + 4, y: BASE - 7,  s: 0.9, a: "B", d: 0.15, h: 6 },
                  { x: tx - 5, y: BASE - 11, s: 0.8, a: "B", d: 0.3,  h: 5 },
                  { x: tx + 5, y: BASE - 11, s: 0.85,a: "A", d: 0.1,  h: 6 },
                  { x: tx - 2, y: BASE - 15, s: 1.0, a: "A", d: 0.25, h: 7 },
                  { x: tx + 2, y: BASE - 15, s: 1.05,a: "B", d: 0.05, h: 8 },
                  { x: tx,     y: BASE - 17, s: 1.15,a: "A", d: 0.2,  h: 9 },
                  { x: tx - 3, y: BASE - 13, s: 0.7, a: "B", d: 0.35, h: 5 },
                  { x: tx + 3, y: BASE - 13, s: 0.75,a: "A", d: 0.4,  h: 5 },
                ].map((f, k) => (
                  <g key={"fl" + k}
                    style={{ transformBox: "fill-box", transformOrigin: "center bottom",
                      animation: `flameSway${f.a} ${(0.5 + f.s * 0.18).toFixed(2)}s ease-in-out ${f.d}s infinite` }}>
                    {/* outer (red) tongue */}
                    <path d={`M ${f.x} ${f.y}
                       C ${f.x - 2.4 * f.s} ${f.y - f.h * 0.45}, ${f.x - 1.1 * f.s} ${f.y - f.h * 0.7}, ${f.x - 0.4 * f.s} ${f.y - f.h}
                       C ${f.x + 0.2 * f.s} ${f.y - f.h * 0.75}, ${f.x + 2.2 * f.s} ${f.y - f.h * 0.5}, ${f.x} ${f.y} Z`}
                      fill="#e23a12" />
                    {/* mid (orange) */}
                    <path d={`M ${f.x} ${f.y}
                       C ${f.x - 1.4 * f.s} ${f.y - f.h * 0.4}, ${f.x - 0.6 * f.s} ${f.y - f.h * 0.62}, ${f.x - 0.1 * f.s} ${f.y - f.h * 0.84}
                       C ${f.x + 0.4 * f.s} ${f.y - f.h * 0.6}, ${f.x + 1.3 * f.s} ${f.y - f.h * 0.42}, ${f.x} ${f.y} Z`}
                      fill="#ff8a1e" />
                    {/* inner (yellow) core */}
                    <path d={`M ${f.x} ${f.y - f.h * 0.12}
                       C ${f.x - 0.7 * f.s} ${f.y - f.h * 0.4}, ${f.x - 0.2 * f.s} ${f.y - f.h * 0.55}, ${f.x} ${f.y - f.h * 0.68}
                       C ${f.x + 0.5 * f.s} ${f.y - f.h * 0.5}, ${f.x + 0.7 * f.s} ${f.y - f.h * 0.36}, ${f.x} ${f.y - f.h * 0.12} Z`}
                      fill="#ffe06a" />
                  </g>
                ))}
                {/* floating embers */}
                {[[-3, -18, 0.6], [4, -16, 0.8], [0, -21, 0.5], [-1, -13, 0.7]].map(([ex, ey, sp], k) => (
                  <rect key={"em" + k} x={tx + ex} y={BASE + ey} width="1" height="1" fill="#ffc24a"
                    style={{ animation: `flicker ${sp}s infinite` }} />
                ))}
                {/* smoke puffs rising */}
                {[[1, 0], [-2, 1], [3, 2]].map(([sx, dd], k) => (
                  <rect key={"sm" + k} x={tx + sx} y={BASE - 24 - dd * 3} width="2" height="2" fill="#6b6b6b"
                    opacity="0.35" style={{ animation: `cloudDrift ${5 + dd}s ease-in-out infinite` }} />
                ))}
              </>
            ) : (
              <>
                <rect x={tx - 4} y={BASE - 14} width="10" height="9" fill="#3f8a3f" />
                <rect x={tx - 3} y={BASE - 16} width="8" height="4" fill="#4f9e46" />
                <rect x={tx - 1} y={BASE - 17} width="4" height="2" fill="#62b552" />
                <rect x={tx - 4} y={BASE - 14} width="10" height="1" fill="#62b552" opacity="0.6" />
                <rect x={tx - 4} y={BASE - 8} width="10" height="2" fill="#2f6a30" opacity="0.5" />
              </>
            )}
          </g>
          );
        })}

        {/* ===== sidewalk ===== */}
        <rect x="0" y={BASE} width="200" height="6" fill="#a9a6a0" />
        <rect x="0" y={BASE} width="200" height="1" fill="#c6c3bd" />
        {Array.from({ length: 25 }).map((_, i) => (
          <rect key={"sw" + i} x={i * 8} y={BASE} width="1" height="6" fill="#8b887f" opacity="0.7" />
        ))}
        {/* curb */}
        <rect x="0" y={BASE + 6} width="200" height="1.5" fill="#6f6c64" />

        {/* ===== asphalt road ===== */}
        <rect x="0" y={BASE + 7} width="200" height={112 - (BASE + 7)} fill="#3b3c42" />
        <rect x="0" y={BASE + 7} width="200" height="1" fill="#4a4b52" />
        {/* dashed centre line */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={"ln" + i} x={i * 15 + 3} y={BASE + 12} width="8" height="1.4" fill="#e8d27a" opacity="0.9" />
        ))}
        {/* speckle */}
        {Array.from({ length: 30 }).map((_, i) => (
          <rect key={"sp" + i} x={(i * 53) % 200} y={BASE + 8 + (i * 17) % 6} width="1" height="1" fill={i % 2 ? "#33343a" : "#46474e"} opacity="0.6" />
        ))}

        {/* ===== a little white car ===== */}
        <g transform={`translate(150, ${BASE + 8})`}>
          <rect x="0" y="2" width="22" height="6" fill="#e6e8ec" />
          <rect x="0" y="2" width="22" height="1" fill="#ffffff" />
          <rect x="4" y="-1" width="13" height="4" fill="#dfe2e7" />
          <rect x="5" y="0" width="5" height="3" fill="#7fb4d6" />
          <rect x="11" y="0" width="5" height="3" fill="#7fb4d6" />
          <rect x="0" y="7" width="22" height="1" fill="#9aa0a8" />
          <rect x="3" y="7" width="4" height="3" fill="#222428" />
          <rect x="15" y="7" width="4" height="3" fill="#222428" />
          <rect x="21" y="3" width="1" height="2" fill="#ffd34d" />
        </g>

        {/* ===== city characters ===== */}
        {/* Rem — standing on the leftmost red building's rooftop */}
        <KnightSprite src={window.CITY.rem} cx={19} footY={54} h={8} ar={window.CITY_AR.rem} flip
          name="Rem" tagColor="#8fd0ff" shadow={false} tagGap={5} anim="charIdle 3s ease-in-out infinite" />

        {/* Doorman + door as one static sprite (no breathing), frame foot on the sidewalk */}
        <KnightSprite src={window.CITY.doorman} cx={182} footY={90} h={18} ar={window.CITY_AR.doorman}
          name="Doorman" tagColor="#ffd34d" shadow={false} tagGap={5} anim="none" />

        {/* Kelvin — ice path gliding out from the left border */}
        {/* ice-path extension: trails out from under his feet and off the left edge */}
        <g>
          {/* ledge underside shadow */}
          <rect x={-10} y={39.4} width={24} height={1.4} fill="#5fa6cf" opacity="0.85" />
          {/* ledge body */}
          <rect x={-10} y={37.6} width={24} height={2} fill="#bfe6f4" />
          {/* glossy top highlight */}
          <rect x={-10} y={37.6} width={24} height={0.7} fill="#eef9ff" />
          <rect x={-6} y={38.1} width={7} height={0.5} fill="#ffffff" opacity="0.7" />
          {/* hanging icicles of varying length */}
          {[[-9, 2.2], [-6.5, 1.4], [-4, 2.8], [-1.5, 1.6], [1, 2.4], [3.5, 1.3], [6, 2.0], [8.5, 1.5]].map(([ix, len], k) => (
            <polygon key={"ic" + k} points={`${ix},40.6 ${ix + 1.5},40.6 ${ix + 0.75},${40.6 + len}`} fill="#a9dcf0" />
          ))}
          {/* frosty sparkles drifting along the path */}
          {[[-8, 36.6, 1.1], [-3, 36.2, 1.5], [2, 36.8, 0.9], [7, 36.3, 1.3]].map(([sx, sy, sp], k) => (
            <rect key={"sp" + k} x={sx} y={sy} width="0.8" height="0.8" fill="#eef9ff"
              style={{ animation: `flicker ${sp}s infinite` }} />
          ))}
        </g>
        <KnightSprite src={window.CITY.kelvin} cx={11} footY={40} h={16} ar={window.CITY_AR.kelvin}
          name="Kelvin" tagColor="#9fe0ff" shadow={false} tagGap={5} anim="charIdle 3.3s ease-in-out infinite" />
        {/* Dynamo — on the sidewalk, left-of-centre (floating hands & head) */}
        <KnightSprite src={window.CITY.dynamo} cx={46} footY={95} h={16} ar={window.CITY_AR.dynamo}
          name="Dynamo" tagColor="#ffd34d" shadow={false} tagGap={5} anim="charIdle 2.9s ease-in-out infinite" />
        {/* Batmobile — parked on the road, same level as the white car */}
        {(() => {
          const w = 30, h = w / window.BATMOBILE_AR, footY = 108, cx = 76;
          return (
            <image href={window.BATMOBILE_SRC} xlinkHref={window.BATMOBILE_SRC}
              x={cx - w / 2} y={footY - h} width={w} height={h}
              preserveAspectRatio="xMidYMax meet" style={{ imageRendering: "pixelated" }} />
          );
        })()}
        {/* Infernus — on the footpath, between Dynamo and Drifter */}
        <KnightSprite src={window.CITY.infernus} cx={104} footY={95} h={19} ar={window.CITY_AR.infernus}
          name="Infernus" tagColor="#ff7a3a" shadow={false} tagGap={5} anim="charIdle 3s ease-in-out infinite" />
        {/* Drifter — standing on top of the car */}
        <KnightSprite src={window.CITY.drifter} cx={161} footY={96} h={16} ar={window.CITY_AR.drifter}
          name="Drifter" tagColor="#ff7a7a" shadow={false} tagGap={5} anim="charIdle 3.1s ease-in-out infinite" />

        {/* green goo dripping over the right orange building's roof (cornice at y≈40, x164–186) */}
        <g>
          {/* puddle pooled on the rooftop */}
          <rect x="164" y="38" width="22" height="3" fill="#3fae33" />
          <rect x="164" y="37" width="22" height="1.4" fill="#62d14e" />
          <rect x="166" y="36" width="10" height="1.4" fill="#7ee85f" opacity="0.9" />
          {/* drips running down the facade */}
          {[[166,6],[171,10],[176,4],[181,8],[184,5]].map(([dx,len],i)=>(
            <g key={"goo"+i}>
              <rect x={dx} y="40" width="2.4" height={len} fill="#3fae33" />
              <rect x={dx} y="40" width="1" height={len} fill="#62d14e" />
              <rect x={dx-0.4} y={40+len} width="3.2" height="2" rx="1" fill="#3fae33" />
              <rect x={dx} y={40+len} width="1.4" height="1.4" fill="#7ee85f" opacity="0.8" />
            </g>
          ))}
          {/* glossy highlight blobs on the puddle */}
          <rect x="168" y="38" width="2" height="1" fill="#a6f58a" opacity="0.7" />
          <rect x="179" y="38" width="2" height="1" fill="#a6f58a" opacity="0.7" />
        </g>
        {/* Viscous — standing on the goo-covered orange rooftop */}
        <KnightSprite src={window.CITY.viscous} cx={175} footY={38} h={15} ar={window.CITY_AR.viscous} flip
          name="Viscous" tagColor="#6ee85f" shadow={false} tagGap={5} anim="charIdle 3.2s ease-in-out infinite" />
      </PixelStage>
    </>
  );
}

/* ---------- 6. MOUNTAIN PEAK (Achievements) ---------- */

/* tiny 5px pixel font for Minecraft-style name tags (extend glyphs as needed) */
const PIXEL_FONT = {
  "R": ["###.", "#..#", "###.", "#.#.", "#..#"],
  "T": ["###", ".#.", ".#.", ".#.", ".#."],
  "B": ["###.", "#..#", "###.", "#..#", "###."],
  "G": [".###", "#...", "#.##", "#..#", ".###"],
  "O": [".##.", "#..#", "#..#", "#..#", ".##."],
  "C": [".###", "#...", "#...", "#...", ".###"],
  "S": [".##", "#..", ".#.", "..#", "##."],
  "H": ["#.#", "#.#", "###", "#.#", "#.#"],
  "K": ["#.#", "#.#", "##.", "#.#", "#.#"],
  "k": ["#..", "#.#", "##.", "#.#", "#.#"],
  "D": ["##.", "#.#", "#.#", "#.#", "##."],
  "E": ["###", "#..", "##.", "#..", "###"],
  "L": ["#..", "#..", "#..", "#..", "###"],
  "A": [".#.", "#.#", "###", "#.#", "#.#"],
  "V": ["#.#", "#.#", "#.#", "#.#", ".#."],
  "W": ["#...#", "#...#", "#.#.#", "#.#.#", ".#.#."],
  "v": ["...", "...", "#.#", "#.#", ".#."],
  "a": ["...", ".##", "#.#", "#.#", ".##"],
  "s": ["...", ".##", "##.", "..#", "##."],
  "w": [".....", ".....", "#...#", "#.#.#", ".#.#."],
  "z": ["...", "...", "###", ".#.", "###"],
  "x": ["...", "...", "#.#", ".#.", "#.#"],
  "'": ["#", "#", ".", ".", "."],
  "o": ["...", ".#.", "#.#", "#.#", ".#."],
  "c": ["...", ".##", "#..", "#..", ".##"],
  "p": ["...", "##.", "#.#", "##.", "#.."],
  "n": ["...", "...", "##.", "#.#", "#.#"],
  "i": ["#", ".", "#", "#", "#"],
  "I": ["###", ".#.", ".#.", ".#.", "###"],
  "e": [".#.", "#.#", "###", "#..", ".##"],
  "d": ["..#", "..#", ".##", "#.#", ".##"],
  "l": ["#", "#", "#", "#", "#"],
  "u": ["...", "...", "#.#", "#.#", ".##"],
  "q": [".##", "#.#", ".##", "..#", "..#"],
  "r": ["...", "...", "#.#", "##.", "#.."],
  "f": [".##", ".#.", "###", ".#.", ".#."],
  "y": ["...", "#.#", ".##", "..#", "##."],
  "g": ["...", ".##", "#.#", ".##", "##."],
  "h": ["#..", "#..", "##.", "#.#", "#.#"],
  "t": [".#.", "###", ".#.", ".#.", "..#"],
  "b": ["#..", "#..", "##.", "#.#", "##."],
  "m": [".....", ".....", "#####", "#.#.#", "#.#.#"],
  " ": ["..", "..", "..", "..", ".."],
};
function PixelText({ text, x, y, color, px = 1, gap = 1 }) {
  const rects = [];
  let cx = x, k = 0;
  for (const ch of text) {
    const g = PIXEL_FONT[ch] || PIXEL_FONT[" "];
    const w = Math.max(...g.map(r => r.length));
    for (let r = 0; r < g.length; r++)
      for (let c = 0; c < g[r].length; c++)
        if (g[r][c] === "#")
          rects.push(<rect key={k++} x={cx + c * px} y={y + r * px} width={px} height={px} fill={color} />);
    cx += w * px + gap * px;
  }
  return <>{rects}</>;
}

function measurePixel(text, px, gap) {
  let w = 0;
  for (const ch of text) {
    const g = PIXEL_FONT[ch] || PIXEL_FONT[" "];
    w += Math.max(...g.map(r => r.length)) * px + gap * px;
  }
  return w - gap * px;
}

// Minecraft-style floating name tag, horizontally centered on cx, baseline-top at `top`.
function NameTag({ cx, top, text, color = "#ffffff", px = 0.5, gap = 1 }) {
  const w = measurePixel(text, px, gap);
  const padX = 1.4, padY = 1;
  return (
    <>
      <rect x={cx - w / 2 - padX} y={top - padY} width={w + padX * 2} height={5 * px + padY * 2} fill="#000" opacity="0.4" />
      <PixelText text={text} x={cx - w / 2 + px * 0.8} y={top + px * 0.8} px={px} gap={gap} color="#1a1a1a" />
      <PixelText text={text} x={cx - w / 2} y={top} px={px} gap={gap} color={color} />
    </>
  );
}

// A knight sprite (from the sliced sheet) standing on the ground with a name tag.
function KnightSprite({ src, cx, footY, h, ar = 0.9, flip = false, anim = "charIdle 2.4s ease-in-out infinite", name, tagColor, shadowRx, shadow = true, glow = false, tagGap = 5 }) {
  const w = h * ar;
  const rx = shadowRx != null ? shadowRx : w * 0.42;
  const filter = glow
    ? "drop-shadow(0 0 0.7px rgba(255,196,120,0.9)) drop-shadow(0 0 1.4px rgba(255,150,70,0.45))"
    : undefined;
  return (
    <g>
      {shadow ? <ellipse cx={cx} cy={footY + 0.5} rx={rx} ry={1.6} fill="#0a0402" opacity="0.4" /> : null}
      <g style={{ transformBox: "fill-box", transformOrigin: "center bottom", animation: anim }}>
        <image href={src} xlinkHref={src}
          x={cx - w / 2} y={footY - h} width={w} height={h}
          preserveAspectRatio="xMidYMax meet"
          style={{ imageRendering: "pixelated", filter, transformBox: "fill-box", transformOrigin: "center", transform: flip ? "scaleX(-1)" : "none" }} />
      </g>
      {name ? <NameTag cx={cx} top={footY - h - tagGap} text={name} color={tagColor} /> : null}
    </g>
  );
}

// A camp tent in a custom canvas color, scaled, resting on the ground.
function Tent({ cx, footY, scale = 2, palette }) {
  const w = Math.max(...PIXEL_TENT.rows.map(r => r.length));
  const h = PIXEL_TENT.rows.length;
  return (
    <g transform={`translate(${cx - (w * scale) / 2} ${footY - h * scale}) scale(${scale})`}>
      <Sprite rows={PIXEL_TENT.rows} palette={palette} />
    </g>
  );
}
const TENT_PALETTES = {
  gale:        { X: "#0a1020", H: "#3a5aa6", M: "#26407e", D: "#162652", K: "#0a1024" },
  astarion:    { X: "#14080a", H: "#9a3038", M: "#6e1f26", D: "#431216", K: "#160809" },
  laezel:      { X: "#15151a", H: "#7a8088", M: "#565b63", D: "#383c43", K: "#1a1c20" },
  shadowheart: { X: "#160a1c", H: "#7a4aa6", M: "#553080", D: "#341a52", K: "#160a24" },
};

// A framed portrait card (cream photo + wood frame + nameplate) hung in the scene.
function Portrait({ src, ar = 0.88, cx, topY, w = 19, name, tagColor = "#f0e4c6" }) {
  const ph = w / ar;            // photo height
  const pad = 1.6;              // frame thickness
  const fw = w + pad * 2, fh = ph + pad * 2;
  const fx = cx - fw / 2, fy = topY;
  return (
    <g style={{ animation: "float 4.5s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center top" }}>
      {/* hanging nail + cord */}
      <rect x={cx - 0.4} y={topY - 4} width="0.8" height="4" fill="#2a1c10" />
      <rect x={cx - 1.6} y={topY - 5} width="3.2" height="1.6" fill="#caa23a" />
      {/* wood frame */}
      <rect x={fx} y={fy} width={fw} height={fh} fill="#3a2614" />
      <rect x={fx} y={fy} width={fw} height="0.8" fill="#6a4a2a" />
      <rect x={fx} y={fy + fh - 0.8} width={fw} height="0.8" fill="#1f140a" />
      {/* photo */}
      <image href={src} xlinkHref={src} x={cx - w / 2} y={fy + pad} width={w} height={ph}
        preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }} />
      <rect x={cx - w / 2} y={fy + pad} width={w} height={ph} fill="none" stroke="#1f140a" strokeWidth="0.4" />
      {/* nameplate */}
      <NameTag cx={cx} top={fy + fh + 1.6} text={name} color={tagColor} px={0.4} />
    </g>
  );
}
function GoldenTree({ baseX = 96, baseY = 80, trunkLen = 15, depth = 7, color = "#caa23a", litColor = "#ffe9a0" }) {
  const { segs, tips } = useMemo(() => {
    let seed = 9173;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const segs = [];
    const tips = [];
    function branch(x, y, ang, len, w, d) {
      const x2 = x + Math.cos(ang) * len;
      const y2 = y + Math.sin(ang) * len;
      segs.push({ x1: x, y1: y, x2, y2, w });
      if (d <= 0 || len < 2.0) { tips.push({ x: x2, y: y2 }); return; }
      const n = 2 + (rnd() < 0.7 ? 1 : 0) + (rnd() < 0.25 ? 1 : 0);   // 2–4 children → dense crown
      for (let i = 0; i < n; i++) {
        const spread = (rnd() - 0.5) * 1.9;           // wide, every-which-way
        const nl = len * (0.62 + rnd() * 0.24);
        if (rnd() < 0.3) tips.push({ x: x2, y: y2 }); // occasional twig stub
        branch(x2, y2, ang + spread, nl, Math.max(0.5, w * 0.68), d - 1);
      }
    }
    branch(baseX, baseY, -Math.PI / 2, trunkLen, 3, depth);
    return { segs, tips };
  }, [baseX, baseY, trunkLen, depth]);

  return (
    <g style={{ transformBox: "fill-box", transformOrigin: "center bottom", animation: "erdSway 7s ease-in-out infinite" }}>
      {/* shadow/underlayer for depth */}
      {segs.map((s, i) => (
        <line key={"u" + i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="#7a5e24" strokeWidth={s.w + 0.5} strokeLinecap="round" />
      ))}
      {/* golden branches — all glowing */}
      {segs.map((s, i) => (
        <line key={"b" + i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={s.w > 1.8 ? color : litColor} strokeWidth={s.w} strokeLinecap="round" />
      ))}
      {/* glowing tips on the twig ends */}
      {tips.map((t, i) => (
        <rect key={"t" + i} x={t.x - 0.7} y={t.y - 0.7} width="1.4" height="1.4" fill="#fff6cf"
          style={i % 3 === 0 ? { animation: `flicker ${2 + (i % 4) * 0.4}s infinite` } : undefined} />
      ))}
    </g>
  );
}

function SceneMountain() {
  return (
    <>
      <SkyGradient stops={[
        ["0%", "#0a0628"], ["40%", "#1a1248"], ["100%", "#3a2868"]
      ]} />
      <Stars count={60} top={70} />
      <div style={{
        position: "absolute", top: "10%", left: 0, right: 0, height: "30%",
        background: "linear-gradient(180deg, transparent 0%, rgba(110,231,255,0.18) 40%, rgba(143,224,110,0.18) 60%, transparent 100%)",
        animation: "sway 8s ease-in-out infinite",
      }} />
      <PixelStage vbW={200} vbH={112}>
        {/* far peaks — base + light face + shadow face */}
        {[
          { x: 10, y: 46, w: 8 },
          { x: 18, y: 44, w: 8 },
          { x: 26, y: 42, w: 8 },
          { x: 34, y: 40, w: 8 },
          { x: 42, y: 42, w: 8 },
          { x: 50, y: 44, w: 8 },
          { x: 58, y: 46, w: 8 },
          { x: 68, y: 44, w: 8 },
          { x: 76, y: 40, w: 8 },
          { x: 84, y: 36, w: 8 },
          { x: 92, y: 34, w: 8 },
          { x: 100, y: 36, w: 8 },
          { x: 108, y: 40, w: 8 },
          { x: 116, y: 44, w: 8 },
          { x: 128, y: 42, w: 8 },
          { x: 136, y: 38, w: 8 },
          { x: 144, y: 34, w: 8 },
          { x: 152, y: 32, w: 8 },
          { x: 160, y: 34, w: 8 },
          { x: 168, y: 38, w: 8 },
          { x: 176, y: 42, w: 8 },
          { x: 184, y: 46, w: 8 },
        ].map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={p.y} width={p.w} height={58 - p.y} fill="#2a2048" />
            <rect x={p.x} y={p.y} width={2} height={58 - p.y} fill="#4a3a68" />
            <rect x={p.x + p.w - 2} y={p.y} width={2} height={58 - p.y} fill="#1a1038" />
          </g>
        ))}
        <rect x="0" y="58" width="200" height="20" fill="#2a2048" />
        <rect x="0" y="58" width="200" height="1" fill="#4a3a68" />

        {/* snow caps on far peaks */}
        {[[34, 40], [92, 34], [152, 32]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 2} y={y - 1} width="12" height="1" fill="#fff" />
            <rect x={x - 2} y={y}     width="12" height="2" fill="#fff" />
            <rect x={x}     y={y + 2} width="8"  height="2" fill="#fff" />
            <rect x={x + 2} y={y + 4} width="4"  height="2" fill="#fff" />
            <rect x={x + 2} y={y + 2} width="4"  height="1" fill="#c8d6e0" />
          </g>
        ))}

        {/* ===== distant STONE MOUNTAIN (background, far right) — base hidden behind the near range; natural snowy crown holds Caligo ===== */}
        <g>
          {/* main mass */}
          <polygon points="146,82 158,62 168,48 177,38 184,33 192,31 200,32 200,82" fill="#454f6e" />
          {/* lit left ridge */}
          <polygon points="158,62 168,48 177,38 184,33 192,31 192,33 184,36 177,42 168,53 158,67" fill="#5c6a92" />
          {/* right shadow face */}
          <polygon points="192,31 200,32 200,82 193,82" fill="#373f5a" opacity="0.85" />
          {/* snow draping naturally over the crown + upper slopes (irregular edge) */}
          <polygon points="168,48 173,42 178,38 182,35 187,33 192,31 196,31 200,32 200,37 195,36 190,35 185,37 180,40 175,45 171,51" fill="#dfe8f1" />
          <polygon points="171,51 175,45 180,40 180,43 175,49 172,55" fill="#c2cedd" />
          {/* little snowy lumps to soften the crown */}
          <rect x="183" y="33.5" width="3" height="1.5" fill="#eef3f8" />
          <rect x="189" y="31.5" width="4" height="1.5" fill="#eef3f8" />
          <rect x="196" y="32" width="3" height="1.5" fill="#eef3f8" />
        </g>

        {/* Caligo — dragon perched on the summit, facing left, breathing */}
        <g style={{ animation: "charIdle 3.6s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center bottom" }}>
          <image href={window.CALIGO_SRC} xlinkHref={window.CALIGO_SRC}
            x="175" y="16" width="18" height="17.5"
            preserveAspectRatio="xMidYMax meet"
            style={{ imageRendering: "pixelated", transformBox: "fill-box", transformOrigin: "center", transform: "scaleX(-1)" }} />
        </g>
        {/* Caligo name tag */}
        <NameTag cx={184} top={10} text="Caligo" color="#dfe8f1" px={0.5} />

        {/* ===== glowing golden tree (center background, between the peaks) — bare branches, gently sways ===== */}
        <GoldenTree baseX={96} baseY={80} trunkLen={15} depth={8} />

        {/* near peaks — shaded */}
        {[
          [0, 72], [12, 68], [24, 64], [36, 60], [48, 64], [60, 68], [72, 72],
          [86, 66], [98, 58], [110, 52], [122, 56], [134, 62], [146, 68],
          [158, 64], [170, 58], [182, 62], [194, 68]
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="12" height={78 - y} fill="#3a4868" />
            <rect x={x} y={y} width="2"  height={78 - y} fill="#5a6888" />
            <rect x={x + 10} y={y} width="2" height={78 - y} fill="#2a3858" />
          </g>
        ))}
        <rect x="0" y="78" width="200" height="22" fill="#3a4868" />
        <rect x="0" y="78" width="200" height="1" fill="#5a6888" />

        {/* near snow caps */}
        {[[36, 60], [110, 52], [170, 58]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 2} y={y - 1} width="16" height="1" fill="#fff" />
            <rect x={x - 2} y={y}     width="16" height="2" fill="#fff" />
            <rect x={x}     y={y + 2} width="12" height="2" fill="#fff" />
            <rect x={x + 2} y={y + 4} width="8"  height="2" fill="#fff" />
            <rect x={x + 2} y={y + 2} width="8"  height="1" fill="#c8d6e0" />
          </g>
        ))}

        {/* foreground snow ground */}
        <rect x="0" y="100" width="200" height="12" fill="#e8eef4" />
        <rect x="0" y="100" width="200" height="1"  fill="#fff" />
        {Array.from({ length: 25 }).map((_, i) => (
          <g key={i}>
            <rect x={i * 8 + 1} y="104" width="3" height="2" fill="#c8d6e0" />
            <rect x={i * 8 + 1} y="104" width="3" height="1" fill="#dae6f0" />
          </g>
        ))}
        {/* snow drifts */}
        {[10, 70, 180].map((x, i) => (
          <g key={i}>
            <rect x={x} y="100" width="20" height="1" fill="#fff" />
            <rect x={x + 2} y="99" width="16" height="1" fill="#fff" />
            <rect x={x + 6} y="98" width="8" height="1" fill="#fff" />
          </g>
        ))}

        {/* ===== SNOWY WIZARD TOWER (left) ===== */}
        <g>
          {/* base */}
          <rect x="8" y="88" width="34" height="12" fill="#2a3450" />
          <rect x="8" y="88" width="2" height="12" fill="#46587c" />
          <rect x="40" y="88" width="2" height="12" fill="#1a2236" />
          <rect x="8" y="87" width="34" height="1" fill="#e8eef4" />
          {/* icy doorway */}
          <rect x="19" y="90" width="12" height="10" fill="#1f2a44" />
          <rect x="21" y="92" width="8" height="8" fill="#2a7ac0" />
          <rect x="23" y="93" width="4" height="7" fill="#5ac0ff" />
          <rect x="24" y="94" width="2" height="6" fill="#bfeaff" style={{ animation: "flicker 1.2s infinite" }} />
          <rect x="16" y="88" width="18" height="12" fill="#5ac0ff" opacity="0.18" />
          {/* ice crystals flanking the base */}
          <polygon points="4,100 6,90 8,100" fill="#5ac0ff" />
          <polygon points="6,90 8,100 6,100" fill="#2a7ac0" />
          <polygon points="7,100 9,94 11,100" fill="#6ad0ff" />
          <rect x="3" y="90" width="9" height="11" fill="#5ac0ff" opacity="0.16" />
          <polygon points="40,100 43,89 46,100" fill="#5ac0ff" />
          <polygon points="43,89 46,100 44,100" fill="#2a7ac0" />
          <polygon points="45,100 47,93 49,100" fill="#6ad0ff" />
          <rect x="39" y="89" width="11" height="12" fill="#5ac0ff" opacity="0.16" />

          {/* mid body */}
          <rect x="12" y="60" width="26" height="28" fill="#36425e" />
          <rect x="12" y="60" width="2" height="28" fill="#56688c" />
          <rect x="36" y="60" width="2" height="28" fill="#232c42" />
          <rect x="14" y="66" width="22" height="1" fill="#2a3450" opacity="0.7" />
          <rect x="14" y="72" width="22" height="1" fill="#2a3450" opacity="0.7" />
          <rect x="14" y="78" width="22" height="1" fill="#2a3450" opacity="0.7" />
          <rect x="14" y="84" width="22" height="1" fill="#2a3450" opacity="0.7" />
          {/* warm cozy window */}
          <rect x="21" y="67" width="8" height="9" fill="#1c2236" />
          <rect x="23" y="69" width="4" height="6" fill="#ffce6a" style={{ animation: "flicker 0.7s infinite" }} />
          <rect x="24" y="71" width="2" height="3" fill="#ff8838" style={{ animation: "flicker 0.5s infinite" }} />
          <rect x="19" y="66" width="12" height="11" fill="#ffae4a" opacity="0.18" />

          {/* balcony ring */}
          <rect x="10" y="56" width="30" height="4" fill="#56688c" />
          <rect x="10" y="55" width="30" height="1" fill="#e8eef4" />
          <rect x="11" y="55" width="2" height="2" fill="#232c42" />
          <rect x="18" y="55" width="2" height="2" fill="#232c42" />
          <rect x="29" y="55" width="2" height="2" fill="#232c42" />
          <rect x="37" y="55" width="2" height="2" fill="#232c42" />
          {/* hanging icicles */}
          <rect x="12" y="60" width="1" height="3" fill="#bfeaff" />
          <rect x="18" y="60" width="1" height="2" fill="#bfeaff" />
          <rect x="26" y="60" width="1" height="3" fill="#bfeaff" />
          <rect x="33" y="60" width="1" height="2" fill="#bfeaff" />

          {/* upper body */}
          <rect x="16" y="45" width="18" height="11" fill="#36425e" />
          <rect x="16" y="45" width="2" height="11" fill="#56688c" />
          <rect x="32" y="45" width="2" height="11" fill="#232c42" />
          <rect x="22" y="47" width="5" height="8" fill="#2a3450" />
          <rect x="23" y="48" width="3" height="6" fill="#bfeaff" style={{ animation: "flicker 1.6s infinite" }} />
          <rect x="20" y="46" width="9" height="10" fill="#5ac0ff" opacity="0.15" />

          {/* conical snowy roof — stone steps */}
          <rect x="24" y="26" width="3" height="3" fill="#232c42" />
          <rect x="22" y="29" width="7" height="3" fill="#232c42" />
          <rect x="20" y="32" width="11" height="3" fill="#232c42" />
          <rect x="18" y="35" width="15" height="3" fill="#232c42" />
          <rect x="16" y="38" width="19" height="3" fill="#232c42" />
          <rect x="14" y="41" width="23" height="3" fill="#232c42" />
          {/* snow on the left-lit roof face */}
          <rect x="24" y="26" width="2" height="3" fill="#e8eef4" />
          <rect x="22" y="29" width="4" height="3" fill="#e8eef4" />
          <rect x="20" y="32" width="6" height="3" fill="#e8eef4" />
          <rect x="18" y="35" width="8" height="3" fill="#e8eef4" />
          <rect x="16" y="38" width="10" height="3" fill="#e8eef4" />
          <rect x="14" y="41" width="12" height="3" fill="#e8eef4" />
          <rect x="26" y="29" width="2" height="15" fill="#c8d6e0" opacity="0.6" />
          {/* roof trim */}
          <rect x="13" y="43" width="25" height="2" fill="#56688c" />
          <rect x="13" y="42" width="25" height="1" fill="#e8eef4" />
          {/* finial + glowing crystal tip */}
          <rect x="25" y="22" width="2" height="4" fill="#56688c" />
          <rect x="24" y="19" width="4" height="3" fill="#6ad0ff" style={{ animation: "flicker 1.4s infinite" }} />
          <rect x="23" y="18" width="6" height="5" fill="#6ad0ff" opacity="0.2" />
        </g>

        {/* igloo on the snow */}
        <g transform="translate(120, 83)">
          <Sprite rows={PIXEL_IGLOO.rows} palette={PIXEL_IGLOO.palette} />
        </g>
        {/* warm light glow from igloo entrance */}
        <rect x="134" y="94" width="6" height="6" fill="#ffd866" opacity="0.25" />
        <rect x="132" y="96" width="10" height="4" fill="#ffd866" opacity="0.12" />

        {/* witch companion "Ranni" sitting beside the igloo (idle "breathing") */}
        <g style={{ animation: "charIdle 2.4s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center bottom" }}>
          <image href={window.WITCH_SRC} xlinkHref={window.WITCH_SRC}
            x="103" y="86" width="13" height="15"
            preserveAspectRatio="xMidYMax meet"
            style={{ imageRendering: "pixelated", transformBox: "fill-box", transformOrigin: "center", transform: "scaleX(-1)" }} />
        </g>
        {/* Minecraft-style floating name tag — small pixel text + 1px drop shadow */}
        <rect x="104.5" y="79" width="10" height="4.4" fill="#000" opacity="0.4" />
        <PixelText text="Ranni" x={106.42} y={80.42} px={0.42} color="#3a3a3a" />
        <PixelText text="Ranni" x={106} y={80} px={0.42} color="#ffffff" />

        {/* The Tarnished — mounted knight standing to the left of Ranni (idle, no shadow) */}
        <KnightSprite src={window.TARNISHED_SRC} cx={90} footY={101} h={20} ar={window.TARNISHED_AR}
          name="Tarnished" tagColor="#e6e1d6" shadow={false} tagGap={3} anim="charIdle 2.8s ease-in-out infinite" />

        {/* Bladid — armoured cat knight standing to the right of the igloo (idle, no shadow) */}
        <KnightSprite src={window.BLADID_SRC} cx={156} footY={101} h={17} ar={window.BLADID_AR}
          name="Bladid" tagColor="#b8c4dc" shadow={false} anim="charIdle 3s ease-in-out infinite" />

        {/* tiny chimney smoke from igloo */}
        <rect x="135" y="80" width="2" height="2" fill="#e8eef4" opacity="0.6" />
        <rect x="134" y="78" width="3" height="1" fill="#e8eef4" opacity="0.5" />
        <rect x="133" y="76" width="4" height="1" fill="#e8eef4" opacity="0.35" />
        <rect x="132" y="74" width="3" height="1" fill="#e8eef4" opacity="0.2" />
      </PixelStage>
      <Particles count={60} kind="snow" color="#fff" />
    </>
  );
}

/* ---------- 7. CAMPFIRE NIGHT (Contact) ---------- */

// Soft halftone "dither" glow ring — used for the moonlight haze.
function DitherGlow({ cx, cy, rInner, rOuter, color = "#cfe0ee", cell = 2, baseOpacity = 0.45 }) {
  const dots = [];
  for (let y = Math.round(cy - rOuter); y <= cy + rOuter; y += cell) {
    for (let x = Math.round(cx - rOuter); x <= cx + rOuter; x += cell) {
      const gx = Math.round((x - (cx - rOuter)) / cell);
      const gy = Math.round((y - (cy - rOuter)) / cell);
      if ((gx + gy) % 2 !== 0) continue;
      const d = Math.hypot(x - cx, y - cy);
      if (d < rInner || d > rOuter) continue;
      const t = 1 - (d - rInner) / (rOuter - rInner);
      dots.push(<rect key={x + "_" + y} x={x} y={y} width={cell - 0.4} height={cell - 0.4} fill={color} opacity={+(baseOpacity * t * t).toFixed(2)} />);
    }
  }
  return <g>{dots}</g>;
}

// A tall moonlit tree trunk for framing the clearing. rim = side facing the moon.
function FrameTrunk({ x, w, top, bottom, rim = "right", core = "#0a1124", shadow = "#04070d", rimColor = "#2f5e6c", rimHi = "#62a0ae" }) {
  const innerEdge = rim === "right" ? x + w - 1 : x;
  const outerEdge = rim === "right" ? x : x + w - 1;
  const h = bottom - top;
  const notches = [];
  for (let i = 4; i < h; i += 8) {
    notches.push(<rect key={i} x={x + (i % 2 ? 1 : w - 2)} y={top + i} width="1" height="3" fill={shadow} opacity="0.6" />);
  }
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={core} />
      <rect x={outerEdge} y={top} width="1" height={h} fill={shadow} />
      <rect x={innerEdge} y={top} width="1" height={h} fill={rimColor} />
      <rect x={innerEdge + (rim === "right" ? -0.6 : 0.6)} y={top} width="0.6" height={h} fill={rimHi} opacity="0.5" />
      {notches}
    </g>
  );
}

// downward-hanging pine bough for the top canopy
const PIXEL_BOUGH = {
  rows: [
    "H#######H",
    "X#BBBBB#X",
    "X#MBBBM#X",
    " XMBBBMX ",
    " XMMBMMX ",
    "  XMBMX  ",
    "  XMMX   ",
    "   XBX   ",
    "   XMX   ",
    "    X    ",
  ],
  palette: { H: "#356676", "#": "#1d3b48", B: "#15303c", M: "#0d212e", X: "#050d15" },
};

// moonlit cool-green grass / undergrowth palette
const GRASS_PAL = { X: "#06170f", H: "#2f7256", M: "#1b4a36", D: "#0e2c20" };
const GRASS_PAL_DIM = { X: "#050f0a", H: "#1f4a38", M: "#143324", D: "#0a2016" };

function SceneCampfire() {
  return (
    <>
      <SkyGradient stops={[
        ["0%", "#070a18"], ["42%", "#0b1126"], ["70%", "#13203f"], ["100%", "#1a2b50"]
      ]} />
      <Stars count={95} top={48} />
      <PixelStage vbW={200} vbH={112}>
        {/* ===== distant forest haze behind the moon ===== */}
        <rect x="0" y="40" width="200" height="28" fill="#16264a" opacity="0.45" />
        <DitherGlow cx={96} cy={29} rInner={2} rOuter={32} color="#9fb6d4" cell={2} baseOpacity={0.42} />

        {/* ===== the moon ===== */}
        <circle cx="96" cy="28" r="13" fill="#aab9cc" />
        <circle cx="96" cy="28" r="12" fill="#d6e1ef" />
        <circle cx="91" cy="24" r="1.8" fill="#bcc9da" />
        <circle cx="100" cy="31" r="2.4" fill="#bcc9da" />
        <circle cx="94" cy="32" r="1.3" fill="#bcc9da" />
        <circle cx="99" cy="23" r="1.1" fill="#bcc9da" />

        {/* ===== distant pine ridges (back = lighter blue, front = darker) ===== */}
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={"rb" + i} transform={`translate(${i * 9 - 2}, ${51 + (i % 3)})`}>
            <Sprite rows={PIXEL_PINE.rows} palette={{ X: "#0c1c34", H: "#213a58", M: "#172c46", D: "#0e1e36", t: "#0a1626" }} />
          </g>
        ))}

        {Array.from({ length: 20 }).map((_, i) => (
          <g key={"rf" + i} transform={`translate(${i * 11 - 4}, ${58 + (i % 2) * 2})`}>
            <Sprite rows={PIXEL_PINE.rows} palette={{ X: "#06101e", H: "#102036", M: "#0a182a", D: "#06101e", t: "#050b16" }} />
          </g>
        ))}

        {/* ===== forest floor ===== */}
        <rect x="0" y="64" width="200" height="48" fill="#13201a" />
        <rect x="0" y="64" width="200" height="3" fill="#1c3a28" opacity="0.7" />
        {/* dirt clearing */}
        <ellipse cx="100" cy="99" rx="66" ry="22" fill="#33220f" />
        <ellipse cx="100" cy="96" rx="54" ry="16" fill="#44301a" />
        <ellipse cx="100" cy="94" rx="40" ry="10" fill="#523c22" />
        {/* dirt speckle */}
        {Array.from({ length: 26 }).map((_, i) => (
          <rect key={"d" + i} x={40 + (i * 47) % 120} y={88 + (i * 29) % 18} width="2" height="1" fill={i % 2 ? "#2a1c0e" : "#5c4226"} opacity="0.7" />
        ))}

        {/* Volatile — lurking in the back, behind the tents (small, dim, no firelit glow) */}
        <g style={{ filter: "brightness(0.72) saturate(0.9)" }}>
          <KnightSprite src={window.VOLATILE_SRC} cx={28} footY={68} h={11} ar={window.VOLATILE_AR}
            name="Volatile" tagColor="#ff7a4a" shadow={false} anim="charIdle 3.4s ease-in-out infinite" />
          {/* Excalibur — standing on the left of Volatile, same height */}
          <KnightSprite src={window.EXCALIBUR_SRC} cx={9} footY={68} h={11} ar={window.EXCALIBUR_AR}
            name="Excalibur" tagColor="#d8e0ff" shadow={false} anim="charIdle 3.1s ease-in-out infinite" />
          {/* Sneaky Golem — lurking in the back on the right, same height */}
          <KnightSprite src={window.GOLEM_SRC} cx={186} footY={68} h={11} ar={window.GOLEM_AR}
            name="Sneaky Golem" tagColor="#67c8e0" shadow={false} anim="charIdle 3.6s ease-in-out infinite" />
        </g>

        {/* ===== four camp tents around the clearing (L→R: Gale, Astarion, Lae'zel, Shadowheart) ===== */}
        <Tent cx={40}  footY={85} scale={1.85} palette={TENT_PALETTES.gale} />
        <Tent cx={66}  footY={93} scale={2.15} palette={TENT_PALETTES.astarion} />
        <Tent cx={134} footY={93} scale={2.15} palette={TENT_PALETTES.laezel} />
        <Tent cx={160} footY={85} scale={1.85} palette={TENT_PALETTES.shadowheart} />

        {/* campfire — shaded, center of the clearing */}
        <g transform="translate(100, 90) scale(1.45)">
          {/* ground glow pool */}
          <ellipse cx="4" cy="14" rx="20" ry="5" fill="#ff7a28" opacity="0.10" />
          {/* logs */}
          <rect x="-6" y="10" width="20" height="4" fill="#3a2010" />
          <rect x="-6" y="10" width="20" height="1" fill="#5a3a18" />
          <rect x="-6" y="13" width="20" height="1" fill="#1a0e08" />
          <rect x="-3" y="8"  width="14" height="2" fill="#5a3018" />
          <rect x="-3" y="8"  width="14" height="1" fill="#8a5028" />
          {/* fire — 4 shades */}
          <rect x="-2" y="2"  width="12" height="6" fill="#c83820" style={{ animation: "flicker 0.7s infinite" }} />
          <rect x="0"  y="0"  width="8"  height="2" fill="#c83820" style={{ animation: "flicker 0.65s infinite" }} />
          <rect x="0"  y="3"  width="8"  height="5" fill="#ff8838" style={{ animation: "flicker 0.55s infinite" }} />
          <rect x="2"  y="4"  width="4"  height="4" fill="#ffd866" style={{ animation: "flicker 0.45s infinite" }} />
          <rect x="3"  y="5"  width="2"  height="2" fill="#fff5a0" style={{ animation: "flicker 0.4s infinite" }} />
          {/* glow */}
          <rect x="-12" y="2" width="32" height="10" fill="#ff5a18" opacity="0.18" />
          <rect x="-16" y="4" width="40" height="8"  fill="#ff5a18" opacity="0.08" />
        </g>

        {/* ===== companions idling at their tent entrances ===== */}
        <KnightSprite src={window.COMP.gale}        cx={40}  footY={94}  h={20} ar={window.COMP_AR.gale}
          name="Gale"        tagColor="#8fb0ef" shadow shadowRx={4} glow anim="charIdle 3.1s ease-in-out infinite" />
        <KnightSprite src={window.COMP.astarion}    cx={66}  footY={101} h={20} ar={window.COMP_AR.astarion}
          name="Astarion"    tagColor="#e3b0b6" shadow shadowRx={4} glow anim="charIdle 2.7s ease-in-out infinite" />
        <KnightSprite src={window.COMP.laezel}      cx={134} footY={101} h={21} ar={window.COMP_AR.laezel}
          name="Lae'zel"     tagColor="#b6c79a" shadow shadowRx={5} glow anim="charIdle 2.9s ease-in-out infinite" />
        <KnightSprite src={window.COMP.shadowheart} cx={160} footY={94}  h={21} ar={window.COMP_AR.shadowheart}
          name="Shadowheart" tagColor="#c4a8e0" shadow shadowRx={5} glow anim="charIdle 3.3s ease-in-out infinite" />

        {/* Volatile — standing on the grass on the left, same size as the companions */}

        {/* ===== grass tufts & undergrowth around the clearing ===== */}
        {[[16,82,1.1],[170,84,1.0],[184,88,1.1],[10,95,1.4],[26,100,1.3],[176,97,1.4],[190,101,1.3]].map(([gx,gy,s],i)=>(
          <g key={"g" + i} transform={`translate(${gx}, ${gy}) scale(${s})`}>
            <Sprite rows={PIXEL_BUSH.rows} palette={i % 3 ? GRASS_PAL : GRASS_PAL_DIM} />
          </g>
        ))}

        {/* rock bottom-right (lit by moon) */}
        <g transform="translate(150, 103)">
          <rect x="0" y="2" width="13" height="7" fill="#39424f" />
          <rect x="1" y="1" width="11" height="2" fill="#586374" />
          <rect x="1" y="1" width="6"  height="1" fill="#6e7a8c" />
          <rect x="1" y="7" width="12" height="2" fill="#242a34" />
        </g>

        {/* ===== foreground forest frame ===== */}

        {/* dark foliage at the lower corners */}
        {[[3,112,2.6],[188,112,2.6]].map(([fx,fy,s],i)=>(
          <g key={"fol" + i} transform={`translate(${fx}, ${fy}) scale(${s})`}>
            <Sprite rows={PIXEL_BUSH.rows} palette={GRASS_PAL_DIM} />
          </g>
        ))}
      </PixelStage>
      <Particles count={30} kind="spark" color="#ffa040" />
      <Particles count={16} kind="firefly" color="#ffe07a" />
    </>
  );
}

/* ---------- exports ---------- */
window.Scenes = {
  about: SceneMeadow,
  skills: SceneCave,
  education: SceneTown,
  experience: SceneForge,
  projects: SceneVault,
  achievements: SceneMountain,
  contact: SceneCampfire,
};

window.SceneStage = function SceneStage({ active }) {
  const Comp = window.Scenes[active] || window.Scenes.about;
  return (
    <div className="scene-stage" aria-hidden="true">
      <div key={active} className="scene active">
        <Comp />
      </div>
    </div>
  );
};
