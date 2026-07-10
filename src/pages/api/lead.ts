import type { APIRoute } from "astro";
import { Client } from "@notionhq/client";

// Server-side: necesita el adapter de Vercel. El resto del sitio sigue siendo estático.
export const prerender = false;

// Mapeo a la Base de datos de clientes real de Notion (esquema confirmado 2026-07-10):
// Negocio (title), Persona de contacto (text), Email (email), Notas (text), Estado (select).
// No se rellenan Tipo/Presencia digital/Tamaño/Teléfono/Web/Ubicación: el formulario no los pide
// (mínimo dato necesario — GDPR) y no se inventan valores para campos de un select real.
export const POST: APIRoute = async ({ request, redirect }) => {
  const notionToken = import.meta.env.NOTION_TOKEN;
  const databaseId = import.meta.env.NOTION_CLIENTS_DB_ID;

  if (!notionToken || !databaseId) {
    console.error("Faltan NOTION_TOKEN o NOTION_CLIENTS_DB_ID en las variables de entorno.");
    return redirect("/contacto?error=1");
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const business = String(form.get("business") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!email || !email.includes("@")) {
    return redirect("/contacto?error=1");
  }

  const notion = new Client({ auth: notionToken });

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Negocio: {
          title: [{ text: { content: business || name || "Lead de la web" } }],
        },
        Email: { email },
        ...(name && { "Persona de contacto": { rich_text: [{ text: { content: name } }] } }),
        Estado: { select: { name: "Por contactar" } },
        Notas: {
          rich_text: [
            {
              text: {
                content: `Lead de la web (formulario "plan gratis").${message ? ` Mensaje: ${message}` : ""}`,
              },
            },
          ],
        },
      },
    });
  } catch (err) {
    console.error("Error creando el lead en Notion:", err);
    return redirect("/contacto?error=1");
  }

  return redirect("/contacto?ok=1");
};
