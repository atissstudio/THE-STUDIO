/*
  Exporta una copia estática de la web que se abre con doble clic, sin servidor.

    npm run export

  Deja el resultado en `web-offline/`. Qué hace, y por qué hace falta cada paso:

  1. `/contacto` es dinámica en producción (lee ?ok=1 tras enviar el formulario).
     Sin servidor no puede serlo, así que para esta copia se prerenderiza. El
     archivo original se restaura siempre al terminar, incluso si algo falla.
  2. Los enlaces del sitio son absolutos (`/servicios`). Abiertos con file://
     apuntarían a la raíz del disco duro. Se reescriben a relativos, con el
     `index.html` explícito que file:// necesita.
  3. La tipografía Pinyon Script se sirve desde Google Fonts. Sin conexión el
     logo perdería la manuscrita, así que se incrusta en el propio CSS.
  4. El formulario no puede enviar nada sin servidor: se desactiva y se explica
     en pantalla, en vez de dejar un botón que finge funcionar.
*/
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "dist", "client");
// Va directo al escritorio, que es donde Alejandro la abre con doble clic.
const OUT = path.join(os.homedir(), "Desktop", "The Studio web");
const CONTACTO = path.join(ROOT, "src", "pages", "contacto.astro");

const log = (m) => console.log(`  ${m}`);

/* ---- 1. Build con /contacto estática ---- */
const original = fs.readFileSync(CONTACTO, "utf8");
let built = false;
try {
  fs.writeFileSync(CONTACTO, original.replace("export const prerender = false;", "export const prerender = true;"));
  log("Compilando el sitio completo en estático...");
  execSync("npx astro build", { cwd: ROOT, stdio: "pipe" });
  built = true;
} finally {
  fs.writeFileSync(CONTACTO, original);
}
if (!built) throw new Error("El build falló, no se ha tocado la carpeta del escritorio");

/* ---- 2. Copiar a web-offline/ ---- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });
for (const f of ["sitemap-index.xml", "sitemap-0.xml", "robots.txt"]) {
  fs.rmSync(path.join(OUT, f), { force: true });
}

const walk = (dir, acc = []) => {
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};
const files = walk(OUT);
const htmls = files.filter((f) => f.endsWith(".html"));

/* ---- 3. Incrustar la tipografía ---- */
const fontCss = ["latin", "latinext"]
  .map((n) => {
    const b64 = fs.readFileSync(path.join(ROOT, "scripts", "fonts", `pinyon-${n}.woff2`)).toString("base64");
    return `@font-face{font-family:'Pinyon Script';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  })
  .join("");

/* ---- 4. Reescribir rutas absolutas a relativas ---- */
const hasExtension = (p) => /\.[a-z0-9]{2,5}$/i.test(p.split("/").pop() ?? "");

function toRelative(url, depth) {
  const [bare, tail = ""] = url.split(/(?=[#?])/);
  const clean = bare.replace(/\/+$/, "");
  const prefix = depth === 0 ? "./" : "../".repeat(depth);
  if (clean === "" || clean === "/") return `${prefix}index.html${tail}`;
  const rel = clean.slice(1);
  return hasExtension(rel) ? `${prefix}${rel}${tail}` : `${prefix}${rel}/index.html${tail}`;
}

let rewritten = 0;
for (const file of htmls) {
  const depth = path.relative(OUT, path.dirname(file)).split(path.sep).filter(Boolean).length;
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(/(href|src)="(\/[^"]*)"/g, (_m, attr, url) => {
    rewritten++;
    return `${attr}="${toRelative(url, depth)}"`;
  });

  // La hoja de Google Fonts se sustituye por la tipografía incrustada.
  html = html
    .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/g, "")
    .replace(/<link[^>]+fonts\.gstatic\.com[^>]*>/g, "")
    .replace("</head>", `<style>${fontCss}</style></head>`);

  /*
    El formulario no puede enviarse sin servidor: se desactiva y se avisa.
    La nota va DESPUÉS de </form>, nunca dentro: el formulario del CTA es un
    flex, y metida dentro se colocaba como una columna más, al lado del botón.
  */
  html = html.replace(
    /<form([^>]*)action="[^"]*\/api\/lead"([^>]*)>/g,
    '<form$1$2 onsubmit="return false" data-offline="1">'
  );
  if (html.includes('data-offline="1"')) {
    html = html.replace(
      /<\/form>/g,
      '</form><p style="font-family:Arial,sans-serif;font-size:.76rem;line-height:1.5;opacity:.7;margin:16px auto 0;max-width:46ch;text-align:center">Copia para ver sin conexión. El formulario solo funciona en la web publicada.</p>'
    );
  }

  fs.writeFileSync(file, html);
}

// Rutas absolutas dentro del CSS compilado (imágenes de fondo, etc.)
for (const css of files.filter((f) => f.endsWith(".css"))) {
  const depth = path.relative(OUT, path.dirname(css)).split(path.sep).filter(Boolean).length;
  const text = fs.readFileSync(css, "utf8");
  const next = text.replace(/url\((\/[^)"']*)\)/g, (_m, url) => `url(${toRelative(url, depth)})`);
  if (next !== text) fs.writeFileSync(css, next);
}

/* ---- 5. Atajo para abrir ---- */
fs.writeFileSync(
  path.join(OUT, "LEEME.txt"),
  [
    "The Studio, by Atis — copia para ver sin conexión",
    "",
    "Abre index.html con doble clic. No hace falta servidor ni internet.",
    "",
    "Diferencias con la web publicada:",
    "  · El formulario de contacto no envía nada, solo se ve.",
    "  · Es una foto fija. Para actualizarla, ejecuta: npm run export",
    "",
    `Generada el ${new Date().toLocaleString("es-ES")}`,
  ].join("\n")
);

log(`Listo. ${htmls.length} páginas, ${rewritten} rutas reescritas.`);
log(`Está en el escritorio: "The Studio web" → abre index.html`);
