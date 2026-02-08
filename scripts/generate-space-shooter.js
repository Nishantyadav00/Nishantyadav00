import fs from "fs";

const WIDTH = 1200;
const HEIGHT = 280;

const WEEKS = 53;
const DAYS = 7;

const BLOCK = 14;
const GAP = 4;

// MOCK contribution data (replace with real API later)
const contributions = Array.from({ length: WEEKS * DAYS }, () =>
  Math.floor(Math.random() * 6)
);

let enemies = "";
let lasers = "";
let explosions = "";

contributions.forEach((hits, i) => {
  const col = i % WEEKS;
  const row = Math.floor(i / WEEKS);

  const x = 320 + col * (BLOCK + GAP);
  const y = 60 + row * (BLOCK + GAP);

  enemies += `
  <rect x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK}" rx="3"
        fill="#2ecc71">
    <animate attributeName="opacity"
             from="1" to="0"
             dur="${hits || 1}s"
             begin="0s"
             fill="freeze"/>
  </rect>`;

  if (hits > 0) {
    lasers += `
    <line x1="126" y1="168" x2="${x}" y2="${y}"
          stroke="#00ffd5"
          stroke-width="2">
      <animate attributeName="opacity"
               from="1" to="0"
               dur="${hits}s"
               repeatCount="indefinite"/>
    </line>`;

    explosions += `
    <circle cx="${x + BLOCK / 2}" cy="${y + BLOCK / 2}"
            r="6" fill="#ffcc00">
      <animate attributeName="r"
               from="2" to="14"
               dur="0.6s"
               begin="${hits}s"
               fill="freeze"/>
      <animate attributeName="opacity"
               from="1" to="0"
               dur="0.6s"
               begin="${hits}s"
               fill="freeze"/>
    </circle>`;
  }
});

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     xmlns="http://www.w3.org/2000/svg"
     style="background:#060b18">

  <!-- SCORE -->
  <text x="20" y="28"
        fill="#00ff99"
        font-size="16"
        font-family="monospace">
    GITHUB CONTRIBUTION SPACE BATTLE
  </text>

  <!-- HORIZONTAL SPACESHIP -->
  <g>
    <rect x="60" y="160" width="46" height="16" rx="4" fill="#ffffff"/>
    <polygon points="106,160 126,168 106,176" fill="#ffffff"/>
    <polygon points="72,156 90,160 72,164" fill="#cccccc"/>
    <polygon points="72,176 90,176 72,180" fill="#cccccc"/>
    <rect x="50" y="164" width="10" height="8" fill="#00e5ff">
      <animate attributeName="opacity"
               from="0.4" to="1"
               dur="0.4s"
               repeatCount="indefinite"/>
    </rect>

    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 -4" to="0 4"
      dur="1s"
      repeatCount="indefinite"/>
  </g>

  <!-- LASERS -->
  ${lasers}

  <!-- ENEMIES -->
  ${enemies}

  <!-- EXPLOSIONS -->
  ${explosions}

</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/github-space-shooter.svg", svg);

console.log("✅ Space shooter SVG generated");
