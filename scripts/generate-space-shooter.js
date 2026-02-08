import fs from "fs";

const WIDTH = 1200;
const HEIGHT = 280;

const WEEKS = 53;
const DAYS = 7;
const BLOCK = 14;
const GAP = 4;

// mock data (0–5 contributions)
const contributions = Array.from({ length: WEEKS * DAYS }, () =>
  Math.floor(Math.random() * 6)
);

let enemies = "";
let laserAnims = "";
let explosions = "";

let currentTime = 0;

contributions.forEach((hits, i) => {
  if (hits === 0) return;

  const col = i % WEEKS;
  const row = Math.floor(i / WEEKS);

  const x = 320 + col * (BLOCK + GAP);
  const y = 60 + row * (BLOCK + GAP);

  const destroyTime = hits * 0.6;

  // ENEMY BLOCK
  enemies += `
  <rect x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK}" rx="3"
        fill="#2ecc71">
    <animate attributeName="opacity"
      from="1" to="0"
      begin="${currentTime + destroyTime}s"
      dur="0.3s"
      fill="freeze"/>
  </rect>
  `;

  // LASER TARGETING THIS BLOCK
  laserAnims += `
  <animate x2="${x}"
    y2="${y}"
    begin="${currentTime}s"
    dur="0.01s"
    fill="freeze"/>
  `;

  // EXPLOSION
  explosions += `
  <circle cx="${x + BLOCK / 2}" cy="${y + BLOCK / 2}"
          r="2" fill="#ffcc00" opacity="0">
    <animate attributeName="r"
      from="2" to="14"
      begin="${currentTime + destroyTime}s"
      dur="0.4s"/>
    <animate attributeName="opacity"
      from="1" to="0"
      begin="${currentTime + destroyTime}s"
      dur="0.4s"/>
  </circle>
  `;

  currentTime += destroyTime + 0.4;
});

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  xmlns="http://www.w3.org/2000/svg"
  style="background:#060b18">

  <text x="20" y="28"
    fill="#00ff99"
    font-size="16"
    font-family="monospace">
    GITHUB CONTRIBUTION SPACE BATTLE
  </text>

  <!-- SHIP (UNCHANGED) -->
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
  </g>

  <!-- SINGLE LASER -->
  <line x1="126" y1="168" x2="126" y2="168"
        stroke="#00ffd5"
        stroke-width="2">
    ${laserAnims}
  </line>

  <!-- ENEMIES -->
  ${enemies}

  <!-- EXPLOSIONS -->
  ${explosions}

</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/github-space-shooter.svg", svg);

console.log("✅ Sequential shooter generated");
