import fs from "fs";

const USERNAME = process.env.USERNAME;

const WIDTH = 1200;
const HEIGHT = 280;
const BLOCK = 14;
const GAP = 4;

/**
 * ✅ PUBLIC CONTRIBUTIONS FETCH
 * No GraphQL
 * No auth
 * No permissions issues
 */
async function getContributions() {
  const res = await fetch(
    `https://github.com/users/${USERNAME}/contributions`
  );

  const svgText = await res.text();

  // Extract real contribution counts
  const matches = [...svgText.matchAll(/data-count="(\d+)"/g)];
  return matches.map(m => Number(m[1]));
}

(async () => {
  const data = await getContributions();

  let enemies = "";
  let bulletAnimations = "";
  let explosions = "";

  let time = 0;

  data.forEach((hits, i) => {
    if (hits === 0) return;

    const col = i % 53;
    const row = Math.floor(i / 53);

    const x = 320 + col * (BLOCK + GAP);
    const y = 60 + row * (BLOCK + GAP);

    const hitDuration = hits * 0.4;

    // 🟩 Contribution block
    enemies += `
      <rect x="${x}" y="${y}"
        width="${BLOCK}" height="${BLOCK}"
        rx="3" fill="#2ecc71">
        <animate attributeName="opacity"
          from="1" to="0"
          begin="${time + hitDuration}s"
          dur="0.25s"
          fill="freeze"/>
      </rect>
    `;

    // 🔫 Bullet moves to THIS block only
    bulletAnimations += `
      <animate attributeName="x2"
        from="126" to="${x}"
        begin="${time}s"
        dur="${hitDuration}s"
        fill="freeze"/>
      <animate attributeName="y2"
        from="168" to="${y}"
        begin="${time}s"
        dur="${hitDuration}s"
        fill="freeze"/>
    `;

    // 💥 Explosion after destruction
    explosions += `
      <circle cx="${x + BLOCK / 2}"
        cy="${y + BLOCK / 2}"
        r="2" fill="#ffcc00" opacity="0">
        <animate attributeName="r"
          from="2" to="14"
          begin="${time + hitDuration}s"
          dur="0.4s"/>
        <animate attributeName="opacity"
          from="1" to="0"
          begin="${time + hitDuration}s"
          dur="0.4s"/>
      </circle>
    `;

    time += hitDuration + 0.4;
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

  <!-- 🚀 HORIZONTAL SHIP -->
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

  <!-- 🔫 SINGLE BULLET -->
  <line x1="126" y1="168" x2="126" y2="168"
    stroke="#00ffd5"
    stroke-width="2">
    ${bulletAnimations}
  </line>

  ${enemies}
  ${explosions}
</svg>
`;

  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("dist/github-space-shooter.svg", svg);

  console.log("✅ Space shooter SVG generated successfully");
})();
