/*
  Guardián de los shaders (2026-08-21).

  No es un lujo: los dos fallos que comprueba han costado ya cuatro
  compilaciones rotas en este proyecto, y los dos son INVISIBLES al leer, porque
  el código parece correcto.

  1 · COMILLA INVERTIDA DENTRO DEL GLSL. El shader vive en una plantilla de
      JavaScript, así que una comilla invertida —aunque esté en un comentario—
      corta la cadena y el archivo deja de ser JavaScript válido. Ha pasado tres
      veces, la última hoy.

  2 · USO ANTES DE DECLARAR. GLSL no iza declaraciones. Usar una variable unas
      líneas antes de crearla compila mal, y como el error solo aparece en la
      consola del navegador, el síntoma es que el paisaje NO ARRANCA y la página
      se ve sin él, sin ningún aviso. Se comprueba con los comentarios ya
      quitados, o los propios comentarios dan falsos positivos.

  Uso: node scripts/revisar-shader.mjs
*/
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CARPETA = "src/scripts";
const TIPOS = "float|vec2|vec3|vec4|int|bool|mat2|mat3|mat4";
let fallos = 0;

const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

for (const archivo of readdirSync(CARPETA).filter((f) => f.endsWith(".ts"))) {
  const ruta = join(CARPETA, archivo);
  const texto = readFileSync(ruta, "utf8");

  for (const nombre_ of ["vertex", "fragment"]) {
    const bloque = texto.match(new RegExp("const " + nombre_ + " = `([\\s\\S]*?)`;"));
    if (!bloque) continue;
    const glsl = bloque[1];

    if (glsl.includes("`")) {
      console.error(`✗ ${ruta} · ${nombre_}: comilla invertida dentro del GLSL. Corta la plantilla.`);
      fallos++;
    }

    const limpio = sinComentarios(glsl);

    /*
      3 · CONSTANTE EN MAYÚSCULAS SIN DECLARAR. Al renombrar una frontera del
      mundo (ORILLA pasó a COSTA) quedaron usos del nombre viejo, el shader no
      compiló y el paisaje simplemente no salió, sin ningún aviso. Es el mismo
      final que los otros dos fallos: falla en silencio.
    */
    const declaradas = new Set(
      [...limpio.matchAll(new RegExp(`const\\s+(?:${TIPOS})\\s+([A-Z][A-Z0-9_]*)`, "g"))].map((m) => m[1])
    );
    const usadas = new Set([...limpio.matchAll(/\b([A-Z][A-Z0-9_]{2,})\b/g)].map((m) => m[1]));
    const RESERVADAS = new Set(["GL_ES", "GL_FRAGMENT_PRECISION_HIGH"]);
    for (const nombre of usadas) {
      if (!declaradas.has(nombre) && !RESERVADAS.has(nombre)) {
        console.error(`✗ ${ruta} · ${nombre_}: "${nombre}" se usa y no está declarada como constante.`);
        fallos++;
      }
    }
    const main = limpio.slice(limpio.indexOf("void main()"));
    const lineas = main.split("\n");
    const declarada = new Map();
    lineas.forEach((linea, i) => {
      const d = linea.match(new RegExp(`^\\s*(?:${TIPOS})\\s+([A-Za-z_]\\w*)\\s*=`));
      if (d && !declarada.has(d[1])) declarada.set(d[1], i);
    });
    for (const [variable, enLinea] of declarada) {
      for (let i = 0; i < enLinea; i++) {
        /*
          ⚠️ EL PUNTO TAMBIÉN ES FRONTERA DE PALABRA, así que un `\b` a secas
          hacía que `uv.y` contara como uso de una variable llamada "y" y
          `b.w` como uso de "w". Con eso el guardián daba falsos positivos en
          el mar y bloqueaba el build. Se exige que delante no haya ni punto ni
          carácter de palabra: así solo cuenta la variable de verdad, no el
          componente de un vector.
        */
        if (new RegExp(`(?<![.\\w])${variable}(?![\\w])`).test(lineas[i])) {
          console.error(
            `✗ ${ruta} · ${nombre_}: "${variable}" se usa en la línea ${i + 1} y se declara en la ${enLinea + 1}.`
          );
          fallos++;
          break;
        }
      }
    }
  }
}

if (fallos) {
  console.error(`\n${fallos} problema(s). El shader no compilaría y el efecto no arrancaría.`);
  process.exit(1);
}
console.log("✓ Shaders revisados: sin comillas invertidas y sin uso antes de declarar.");
