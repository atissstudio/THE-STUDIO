import opentype from "opentype.js";
import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";

// Rasteriza un SVG ya escrito a PNG nítido (fondo transparente salvo que el SVG
// ya traiga su propio <rect> de fondo, como el perfil).
function rasterize(svgFileName, targetWidth) {
  const svgPath = path.join("design/logo", svgFileName);
  const pngPath = svgPath.replace(/\.svg$/, ".png");
  const svg = fs.readFileSync(svgPath, "utf-8");
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: targetWidth } });
  const png = resvg.render().asPng();
  fs.writeFileSync(pngPath, png);
  console.log("wrote", path.basename(pngPath));
}

// Se lee directo del sistema (macOS) en vez de mantener una copia del .ttf en el repo.
const boldFont = opentype.parse(
  toArrayBuffer(fs.readFileSync("/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
);
const scriptFont = opentype.parse(
  toArrayBuffer(fs.readFileSync("design/logo/tmp/PinyonScript-Regular.ttf"))
);

function toArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

// --- helpers -----------------------------------------------------------
function runPath(font, text, x, y, fontSize, trackingEm = 0) {
  let cx = x;
  let d = "";
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const p = glyph.getPath(cx, y, fontSize);
    d += p.toPathData(2) + " ";
    cx += (glyph.advanceWidth / font.unitsPerEm) * fontSize + trackingEm * fontSize;
  }
  return { d: d.trim(), width: cx - x };
}

function textWidth(font, text, fontSize, trackingEm = 0) {
  let w = 0;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    w += (glyph.advanceWidth / font.unitsPerEm) * fontSize + trackingEm * fontSize;
  }
  return w;
}

// --- horizontal lockup ---------------------------------------------------
// Mirrors .logo / .logo .scr / .logo .hvy in design/identity-manual.html:
// gap .26em, script 1.5em + translateY(.06em), bold letter-spacing -.03em uppercase.
function buildHorizontal({ boldColor, scriptColor, fileName }) {
  const base = 120; // baseFontSize (bold caps), arbitrary canvas unit
  const scriptSize = base * 1.5;
  const gap = base * 0.26;
  const trackingEm = -0.03;
  const scriptDy = base * 0.06;

  let x = 0;
  const parts = [];

  const the = runPath(scriptFont, "the", x, scriptDy, scriptSize);
  parts.push({ d: the.d, color: scriptColor });
  x += the.width + gap;

  const studio = runPath(boldFont, "STUDIO", x, 0, base, trackingEm);
  parts.push({ d: studio.d, color: boldColor });
  x += studio.width + gap;

  const by = runPath(scriptFont, "by", x, scriptDy, scriptSize);
  parts.push({ d: by.d, color: scriptColor });
  x += by.width + gap;

  const atis = runPath(boldFont, "ATIS", x, 0, base, trackingEm);
  parts.push({ d: atis.d, color: boldColor });
  x += atis.width;

  // vertical extents: ascent/descent from the taller (script) run, roughly.
  const ascent = (scriptFont.ascender / scriptFont.unitsPerEm) * scriptSize + scriptDy;
  const descent = (-scriptFont.descender / scriptFont.unitsPerEm) * scriptSize + scriptDy;
  const padding = base * 0.15;
  const vbX = -padding;
  const vbY = -ascent - padding;
  const vbW = x + padding * 2;
  const vbH = ascent + descent + padding * 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}">
${parts.map((p) => `  <path d="${p.d}" fill="${p.color}"/>`).join("\n")}
</svg>
`;
  fs.writeFileSync(path.join("design/logo", fileName), svg);
  console.log("wrote", fileName);
  rasterize(fileName, 2100); // ancho fijo, alto proporcional al viewBox
}

// --- profile (vertical, right-aligned) lockup -----------------------------
// Mirrors .logo-profile in design/identity-manual.html:
// two lines (STUDIO / ATIS) in bold, right-aligned, "the"/"by" in script
// overlapping the bottom-left corner of each line, diagonal down-right overall.
function buildProfile({ boldColor, scriptColor, bgColor, fileName }) {
  const box = 340; // 2x the manual's 170px reference, for crisper vector detail
  const radius = 52;
  const padRight = 44;
  const hvySize = 64; // 2rem @ 32px base, scaled 2x like the box
  const scrSize = 50; // un punto más grande — feedback 2026-07-10 (segunda vuelta)
  const lineGap = hvySize * -0.06; // a punto de chocar — feedback 2026-07-10 (tercera vuelta)
  const trackingEm = -0.03;

  const studioW = textWidth(boldFont, "STUDIO", hvySize, trackingEm);
  const atisW = textWidth(boldFont, "ATIS", hvySize, trackingEm);
  const contentRight = box - padRight;

  // Baselines (Arial cap-height ≈ 0.716 * unitsPerEm)
  const capHeight = (boldFont.tables.os2.sCapHeight ?? boldFont.unitsPerEm * 0.716) / boldFont.unitsPerEm;
  const scriptDescent = (-scriptFont.descender / scriptFont.unitsPerEm) * scrSize;

  // Posiciones relativas primero; se centran verticalmente como bloque después.
  let line1Baseline = hvySize * capHeight;
  let line2Baseline = line1Baseline + hvySize * 0.86 + lineGap;
  // "the"/"by" pisan la base de la S/A: la línea de base del script cae un poco
  // por debajo de la de la palabra en bold, para que el script muerda su base.
  let theY = line1Baseline + scrSize * 0.32;
  let byY = line2Baseline + scrSize * 0.32;

  const blockTop = 0;
  const blockBottom = byY + scriptDescent;
  const blockHeight = blockBottom - blockTop;
  const centerOffset = (box - blockHeight) / 2 - blockTop;
  line1Baseline += centerOffset;
  line2Baseline += centerOffset;
  theY += centerOffset;
  byY += centerOffset;

  const studioX = contentRight - studioW;
  const atisX = contentRight - atisW;

  const studio = runPath(boldFont, "STUDIO", studioX, line1Baseline, hvySize, trackingEm);
  const atis = runPath(boldFont, "ATIS", atisX, line2Baseline, hvySize, trackingEm);

  // script "the"/"by": arranca a la izquierda de la S/A, para pisarla por abajo
  // (corrido 2 puntos más a la izquierda — feedback 2026-07-10, segunda vuelta).
  const theX = studioX - scrSize * 0.42;
  const byX = atisX - scrSize * 0.42;

  const the = runPath(scriptFont, "the", theX, theY, scrSize);
  const by = runPath(scriptFont, "by", byX, byY, scrSize);

  const bg = bgColor
    ? `<rect x="0" y="0" width="${box}" height="${box}" rx="${radius}" fill="${bgColor}"/>\n`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}">
${bg}  <path d="${studio.d}" fill="${boldColor}"/>
  <path d="${atis.d}" fill="${boldColor}"/>
  <path d="${the.d}" fill="${scriptColor}"/>
  <path d="${by.d}" fill="${scriptColor}"/>
</svg>
`;
  fs.writeFileSync(path.join("design/logo", fileName), svg);
  console.log("wrote", fileName);
  rasterize(fileName, 680); // 2x el tamaño de referencia del manual (170px)
}

// --- variant matrix --------------------------------------------------------
const INK = "#111520";
const NEAR_WHITE = "#EEF1F6";
const PLATA_OSCURA = "#565E6C";
const PLATA_CLARA = "#EEF1F7";
const AZUL = "#334BA4";
const BLACK = "#000000"; // excepción explícita del founder al "negro nunca fondo" — solo para este uso del logo
const WHITE = "#FFFFFF";

// Set final tras revisión 2026-07-10 (segunda vuelta): fuera sobre-plata; fondo oscuro
// pasa de navy a negro puro. Quedan 3: blanco, negro, azul-sobre-blanco.
const variants = [
  { name: "sobre-blanco", boldColor: INK, scriptColor: PLATA_OSCURA, bg: WHITE },
  { name: "sobre-negro", boldColor: NEAR_WHITE, scriptColor: PLATA_CLARA, bg: BLACK },
  { name: "azul-sobre-blanco", boldColor: AZUL, scriptColor: PLATA_OSCURA, bg: WHITE },
  { name: "blanco-sobre-azul", boldColor: NEAR_WHITE, scriptColor: PLATA_CLARA, bg: AZUL },
];

for (const v of variants) {
  buildHorizontal({
    boldColor: v.boldColor,
    scriptColor: v.scriptColor,
    fileName: `horizontal-${v.name}.svg`,
  });
  buildProfile({
    boldColor: v.boldColor,
    scriptColor: v.scriptColor,
    bgColor: v.bg,
    fileName: `perfil-${v.name}.svg`,
  });
}
