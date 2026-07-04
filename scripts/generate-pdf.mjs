import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "video", "generated");
const outputHtml = path.join(outputDir, "presentation-movia.html");
const outputPdf = path.join(outputDir, "presentation-movia.pdf");

const voiceover = await readFile(path.join(root, "video", "voix-off-movia.txt"), "utf8");
const storyboard = await readFile(path.join(root, "video", "storyboard-movia.md"), "utf8");

const screenshots = [
  ["Page d'accueil", "01-accueil.png"],
  ["Véhicules", "02-vehicules.png"],
  ["Offres", "03-offres.png"],
  ["Connexion", "04-connexion.png"],
  ["Inscription", "05-inscription.png"],
  ["Mot de passe oublié", "06-recuperation.png"],
  ["Espace client", "07-espace-client.png"],
  ["Profil client", "08-profil-client.png"],
  ["Espace administrateur", "09-admin.png"],
  ["Conclusion", "10-final.png"],
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function markdownLite(value) {
  return escapeHtml(value)
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^Temps : (.*)$/gm, '<p class="meta"><strong>Temps :</strong> $1</p>')
    .replace(/^Image[s]? : (.*)$/gm, '<p class="meta"><strong>Images :</strong> $1</p>')
    .replace(/^Texte ecran : (.*)$/gm, '<p class="meta"><strong>Texte écran :</strong> $1</p>')
    .replace(/^Sous-texte : (.*)$/gm, '<p class="meta"><strong>Sous-texte :</strong> $1</p>')
    .replace(/^Voix off : (.*)$/gm, '<p class="quote">$1</p>')
    .replace(/^Mouvement : (.*)$/gm, '<p class="meta"><strong>Mouvement :</strong> $1</p>')
    .replace(/\n{2,}/g, "\n")
    .replace(/\n/g, "<br />");
}

function toAscii(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function escapePdfText(value) {
  return toAscii(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function wrapLine(line, maxLength = 88) {
  const words = toAscii(line).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

async function writeSimplePdf(pdfPath) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 54;
  const lineHeight = 15;
  const titleLineHeight = 24;
  const usableHeight = pageHeight - margin * 2;

  const sections = [
    {
      title: "Presentation video Movia",
      lines: [
        "Location & vente de vehicules premium",
        "Movia Automobile vous remercie de votre aimable attention.",
      ],
    },
    {
      title: "Voix off",
      lines: voiceover.split(/\r?\n/),
    },
    {
      title: "Storyboard",
      lines: storyboard
        .replace(/^#+\s*/gm, "")
        .replace(/`/g, "")
        .split(/\r?\n/),
    },
    {
      title: "Fichier video",
      lines: [
        `MP4 genere : ${path.join(outputDir, "movia-presentation.mp4")}`,
        "Le dossier video/generated contient aussi les captures d'ecran utilisees.",
      ],
    },
  ];

  const pages = [];
  let current = [];
  let yUsed = 0;

  function newPage() {
    if (current.length) pages.push(current);
    current = [];
    yUsed = 0;
  }

  function addLine(text, options = {}) {
    const height = options.title ? titleLineHeight : lineHeight;
    if (yUsed + height > usableHeight) newPage();
    current.push({ text, ...options });
    yUsed += height;
  }

  for (const section of sections) {
    if (current.length) newPage();
    addLine(section.title, { title: true });
    addLine("");

    for (const rawLine of section.lines) {
      if (!rawLine.trim()) {
        addLine("");
        continue;
      }

      for (const line of wrapLine(rawLine)) {
        addLine(line);
      }
    }
  }

  if (current.length) pages.push(current);

  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const fontObject = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageObjects = [];

  for (const pageLines of pages) {
    let cursorY = pageHeight - margin;
    const streamLines = ["BT"];

    for (const line of pageLines) {
      const size = line.title ? 22 : 11;
      cursorY -= line.title ? titleLineHeight : lineHeight;
      streamLines.push(`/F1 ${size} Tf`);
      streamLines.push(`${margin} ${cursorY} Td`);
      streamLines.push(`(${escapePdfText(line.text)}) Tj`);
      streamLines.push(`${-margin} ${-cursorY} Td`);
    }

    streamLines.push("ET");
    const stream = streamLines.join("\n");
    const contentObject = addObject(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    const pageObject = addObject(
      `<< /Type /Page /Parent __PAGES__  /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObject} 0 R >> >> /Contents ${contentObject} 0 R >>`
    );
    pageObjects.push(pageObject);
  }

  const pagesObjectBody = `<< /Type /Pages /Kids [${pageObjects.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjects.length} >>`;
  const pagesObject = addObject(pagesObjectBody);
  const catalogObject = addObject(`<< /Type /Catalog /Pages ${pagesObject} 0 R >>`);

  for (const pageObject of pageObjects) {
    objects[pageObject - 1] = objects[pageObject - 1].replace("__PAGES__", `${pagesObject} 0 R`);
  }

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObject} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  await writeFile(pdfPath, pdf, "binary");
}

await mkdir(outputDir, { recursive: true });

const screenshotCards = screenshots
  .map(([title, file]) => {
    const src = pathToFileURL(path.join(outputDir, "screenshots", file)).href;
    return `
      <article class="shot">
        <h3>${escapeHtml(title)}</h3>
        <img src="${src}" alt="${escapeHtml(title)}" />
      </article>
    `;
  })
  .join("");

const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Présentation vidéo Movia</title>
    <style>
      @page { size: A4; margin: 18mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        color: #111827;
        background: #fff;
        line-height: 1.55;
      }
      .cover {
        min-height: 92vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-bottom: 8px solid #f97316;
      }
      .logo {
        width: 150px;
        height: 150px;
        object-fit: contain;
        margin-bottom: 30px;
      }
      h1 {
        font-size: 42px;
        line-height: 1.05;
        margin: 0 0 18px;
        text-transform: uppercase;
      }
      h2 {
        font-size: 24px;
        margin: 34px 0 12px;
        color: #0f172a;
      }
      h3 {
        font-size: 16px;
        margin: 0 0 8px;
        color: #f97316;
        text-transform: uppercase;
      }
      .subtitle {
        font-size: 20px;
        color: #f97316;
        font-weight: 700;
        text-transform: uppercase;
      }
      .thanks {
        margin-top: 34px;
        font-size: 18px;
        font-weight: 700;
      }
      .section {
        break-before: page;
      }
      .voice {
        white-space: pre-line;
        font-size: 15px;
      }
      .storyboard {
        font-size: 13px;
      }
      .meta {
        margin: 4px 0;
      }
      .quote {
        margin: 10px 0;
        padding: 10px 12px;
        border-left: 4px solid #f97316;
        background: #fff7ed;
        font-weight: 700;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .shot {
        break-inside: avoid;
        border: 1px solid #e5e7eb;
        padding: 10px;
        margin-bottom: 14px;
      }
      .shot img {
        width: 100%;
        display: block;
      }
    </style>
  </head>
  <body>
    <section class="cover">
      <img class="logo" src="${pathToFileURL(path.join(root, "public", "images", "logo.png")).href}" />
      <h1>Présentation vidéo Movia</h1>
      <p class="subtitle">Location & vente de véhicules premium</p>
      <p class="thanks">Movia Automobile vous remercie de votre aimable attention.</p>
    </section>

    <section class="section">
      <h2>Voix Off</h2>
      <div class="voice">${escapeHtml(voiceover)}</div>
    </section>

    <section class="section">
      <h2>Storyboard</h2>
      <div class="storyboard">${markdownLite(storyboard)}</div>
    </section>

    <section class="section">
      <h2>Captures De La Plateforme</h2>
      <div class="grid">${screenshotCards}</div>
    </section>
  </body>
</html>`;

await writeFile(outputHtml, html, "utf8");

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(outputHtml).href, { waitUntil: "load" });
  await page.pdf({
    path: outputPdf,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
} catch (error) {
  console.warn(`Chromium PDF blocked, using simple PDF fallback: ${error.message}`);
  await writeSimplePdf(outputPdf);
}

console.log(`PDF generated: ${outputPdf}`);
