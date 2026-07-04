import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "video", "generated");
const shotsDir = path.join(outDir, "screenshots");
const voicePath = path.join(outDir, "voix-off-movia.mp3");
const customVoiceoverPath = "C:\\Users\\HP\\Music\\voix off.mp4";
const useCustomVoiceover = false;
const useBurnedCaptions = false;
const edgeVoice = "fr-FR-HenriNeural";
const concatPath = path.join(outDir, "scenes.txt");
const captionsPath = path.join(outDir, "captions.ass");
const outputPath = path.join(outDir, "movia-presentation.mp4");
const voiceTextPath = path.join(root, "video", "voix-off-movia.txt");
let port = 4174;
let baseUrl = `http://127.0.0.1:${port}`;

const scenes = [
  {
    name: "01-accueil",
    url: "/",
    chapter: "Introduction",
    captions: [
      "Bienvenue sur Movia, une plateforme moderne pensée pour simplifier la location et la vente de véhicules premium au Sénégal.",
    ],
  },
  {
    name: "02-page-accueil",
    url: "/",
    chapter: "Page d’accueil",
    captions: [
      "Dès la page d’accueil, l’utilisateur découvre une interface claire, élégante et facile à parcourir. Le menu permet d’accéder rapidement aux principales sections de la plateforme.",
      "La page met en avant l’univers Movia, les véhicules disponibles, les offres tarifaires, le fonctionnement du service, les témoignages clients ainsi que les informations essentielles en bas de page.",
    ],
  },
  {
    name: "03-solution",
    url: "/",
    chapter: "Solution automobile",
    captions: [
      "La section principale présente Movia comme une solution fiable pour trouver un véhicule adapté à chaque besoin.",
      "Que ce soit pour un déplacement professionnel, un voyage, un événement ou une utilisation personnelle, la plateforme accompagne l’utilisateur dans son choix.",
    ],
  },
  {
    name: "04-vehicules",
    url: "/",
    chapter: "Véhicules",
    evaluate: () => {
      document.querySelector("#vehicles")?.scrollIntoView({ block: "center" });
    },
    captions: [
      "La partie véhicules permet de découvrir différentes catégories de voitures, comme les citadines, les berlines, les SUV, les véhicules de luxe ou encore les modèles haut de gamme.",
      "L’objectif est de proposer une expérience automobile complète, accessible depuis une seule interface.",
    ],
  },
  {
    name: "05-offres",
    url: "/",
    chapter: "Offres",
    evaluate: () => {
      document.querySelector("#offers")?.scrollIntoView({ block: "center" });
    },
    captions: [
      "La section offres présente les différentes formules disponibles. L’utilisateur peut comparer les services, consulter les avantages proposés et choisir l’offre qui correspond le mieux à ses attentes.",
    ],
  },
  {
    name: "06-fonctionnement",
    url: "/",
    chapter: "Fonctionnement",
    evaluate: () => {
      document.querySelector("#how")?.scrollIntoView({ block: "center" });
    },
    captions: [
      "La plateforme explique également son fonctionnement de manière simple : choisir un véhicule, définir ses dates, confirmer sa réservation et prendre la route en toute tranquillité.",
      "Cette approche rend le service rapide, clair et accessible à tous.",
    ],
  },
  {
    name: "07-temoignages",
    url: "/",
    chapter: "Témoignages",
    evaluate: () => {
      document.querySelector("#testimonials")?.scrollIntoView({ block: "center" });
    },
    captions: [
      "Les témoignages clients renforcent la confiance en montrant les retours d’expérience des utilisateurs.",
      "Ils permettent de mettre en avant la qualité du service, la fiabilité des véhicules et l’accompagnement proposé par Movia.",
    ],
  },
  {
    name: "08-connexion",
    url: "/login/client",
    chapter: "Connexion",
    captions: [
      "Pour accéder à son espace personnel, l’utilisateur peut se connecter avec son adresse email et son mot de passe.",
    ],
  },
  {
    name: "09-inscription",
    url: "/register",
    chapter: "Inscription",
    captions: [
      "S’il n’a pas encore de compte, il peut s’inscrire facilement.",
      "Lors de l’inscription, le nouveau client renseigne ses informations personnelles afin de créer son compte.",
    ],
  },
  {
    name: "10-recuperation",
    url: "/forgot-password",
    chapter: "Récupération",
    captions: [
      "En cas d’oubli, une option de récupération du mot de passe est également disponible.",
    ],
  },
  {
    name: "11-espace-client",
    url: "/client/dashboard",
    chapter: "Espace client",
    storage: {
      utilisateur: "true",
      userEmail: "client@movia.sn",
      clientProfile: JSON.stringify({
        nom: "Client Movia",
        email: "client@movia.sn",
        telephone: "+221 77 000 00 00",
      }),
    },
    captions: [
      "Une fois connecté, il accède à son espace client, un tableau de bord conçu pour centraliser toutes ses informations importantes.",
      "Dans l’espace client, l’utilisateur retrouve ses données personnelles, ses réservations, les statuts associés et les paiements éventuels à effectuer.",
    ],
  },
  {
    name: "12-reservations",
    url: "/client/dashboard",
    chapter: "Réservations",
    storage: {
      utilisateur: "true",
      clientProfile: JSON.stringify({
        nom: "Client Movia",
        email: "client@movia.sn",
        telephone: "+221 77 000 00 00",
      }),
    },
    captions: [
      "Il peut suivre l’évolution de ses demandes, voir les réservations en attente, confirmées ou terminées, et agir rapidement lorsque cela est nécessaire.",
      "La gestion des réservations est au cœur de la plateforme.",
      "Chaque client peut suivre ses réservations, vérifier leur état, consulter les informations associées et procéder au paiement lorsqu’une réservation est en attente.",
    ],
  },
  {
    name: "13-profil-client",
    url: "/client/profile",
    chapter: "Profil client",
    storage: {
      utilisateur: "true",
      clientProfile: JSON.stringify({
        nom: "Client Movia",
        email: "client@movia.sn",
        telephone: "+221 77 000 00 00",
      }),
    },
    captions: [
      "La partie profil permet au client de consulter et modifier ses informations, comme son nom, son email ou son numéro de téléphone.",
      "Cette fonctionnalité lui donne plus d’autonomie et lui permet de garder ses données à jour.",
    ],
  },
  {
    name: "14-admin",
    url: "/admin/dashboard",
    chapter: "Administration",
    storage: {
      adminAuthenticated: "true",
      adminEmail: "movia@automobile.com",
    },
    captions: [
      "Movia dispose également d’un espace administrateur.",
      "Cet espace permet de superviser l’activité de la plateforme, de suivre les clients, les réservations, les paiements et l’état général du service.",
      "L’administrateur peut ainsi mieux organiser la gestion quotidienne et assurer un suivi efficace.",
    ],
  },
  {
    name: "15-final",
    finalCard: true,
    chapter: "Conclusion",
    captions: [
      "Avec Movia, la location et la vente de véhicules deviennent plus simples, plus rapides et plus fiables.",
      "La plateforme réunit dans un seul espace les outils nécessaires pour découvrir, réserver, gérer et suivre son expérience automobile.",
      "Movia, votre partenaire automobile pour avancer en toute confiance.",
    ],
  },
];

async function ensureDirectories() {
  await mkdir(shotsDir, { recursive: true });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: false,
      ...options,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function runAndCapture(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
      ...options,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("exit", (code) => {
      if (code === 0 || stderr.includes("Duration:")) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

function startVite() {
  const viteBin = path.join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "vite.cmd" : "vite"
  );

  const command = process.platform === "win32" ? "cmd.exe" : viteBin;
  const args =
    process.platform === "win32"
      ? ["/c", viteBin, "--host", "127.0.0.1", "--port", String(port)]
      : ["--host", "127.0.0.1", "--port", String(port)];

  const child = spawn(command, args, {
    cwd: root,
    stdio: "pipe",
    shell: false,
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  return child;
}

function stopProcessTree(child) {
  if (!child?.pid) return;

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
      shell: false,
    });
    return;
  }

  child.kill("SIGTERM");
}

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Vite server did not start in time.");
}

async function generateVoiceover() {
  if (useCustomVoiceover && existsSync(customVoiceoverPath)) return;

  if (existsSync(voicePath)) {
    const voiceUpdatedAt = statSync(voicePath).mtimeMs;
    const textUpdatedAt = statSync(voiceTextPath).mtimeMs;
    if (voiceUpdatedAt >= textUpdatedAt) return;
  }

  const edgeTtsArgs = [
    "-m",
    "edge_tts",
    "--voice",
    edgeVoice,
    "--rate=-8%",
    "--volume=+8%",
    "--file",
    voiceTextPath,
    "--write-media",
    voicePath,
  ];

  await run("python", edgeTtsArgs);
}

async function getAudioDuration(audioPath) {
  const { stderr } = await runAndCapture(ffmpegPath, ["-i", audioPath]);
  const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);

  if (!match) {
    return 180;
  }

  const [, hours, minutes, seconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function getSceneText(scene) {
  return (scene.captions || []).join(" ");
}

async function syncSceneDurationsToAudio() {
  const audioPath = useCustomVoiceover && existsSync(customVoiceoverPath) ? customVoiceoverPath : voicePath;
  const audioDuration = await getAudioDuration(audioPath);
  const availableDuration = Math.max(60, audioDuration - 0.5);
  const minimumSceneDuration = 6;
  const finalMinimumDuration = 12;
  const minimumTotal = scenes.reduce(
    (sum, scene) => sum + (scene.finalCard ? finalMinimumDuration : minimumSceneDuration),
    0
  );
  const flexibleDuration = Math.max(0, availableDuration - minimumTotal);
  const totalCharacters = scenes.reduce((sum, scene) => sum + getSceneText(scene).length, 0) || 1;

  for (const scene of scenes) {
    const minimum = scene.finalCard ? finalMinimumDuration : minimumSceneDuration;
    const share = getSceneText(scene).length / totalCharacters;
    scene.duration = Number((minimum + flexibleDuration * share).toFixed(2));
  }

  const totalSceneDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  scenes.at(-1).duration = Number((scenes.at(-1).duration + availableDuration - totalSceneDuration).toFixed(2));
}

async function captureScreenshots() {
  port = await getFreePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const vite = startVite();

  try {
    await waitForServer();

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });

    for (const scene of scenes) {
      if (scene.image) continue;

      const page = await context.newPage();

      if (scene.finalCard) {
        await page.setContent(`
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8" />
              <style>
                * { box-sizing: border-box; }
                body {
                  margin: 0;
                  width: 1920px;
                  height: 1080px;
                  overflow: hidden;
                  font-family: Inter, Arial, sans-serif;
                  color: #ffffff;
                  background:
                    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(0, 0, 0, 0.82)),
                    url("${pathToFileURL(path.join(root, "public", "images", "mercedes.jpg")).href}");
                  background-size: cover;
                  background-position: center;
                }
                main {
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  padding: 120px;
                }
                .logo {
                  width: 260px;
                  height: 260px;
                  object-fit: contain;
                  border-radius: 26px;
                  background: rgba(255, 255, 255, 0.96);
                  padding: 28px;
                  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
                  margin-bottom: 48px;
                }
                h1 {
                  margin: 0;
                  font-size: 92px;
                  line-height: 1;
                  letter-spacing: 0;
                  text-transform: uppercase;
                }
                .slogan {
                  margin: 34px 0 0;
                  color: #fb923c;
                  font-size: 42px;
                  font-weight: 800;
                  text-transform: uppercase;
                  letter-spacing: 0.08em;
                }
                .thanks {
                  margin: 46px 0 0;
                  max-width: 1150px;
                  font-size: 44px;
                  line-height: 1.25;
                  font-weight: 700;
                }
              </style>
            </head>
            <body>
              <main>
                <img class="logo" src="${pathToFileURL(path.join(root, "public", "images", "logo.png")).href}" />
                <h1>Movia Automobile</h1>
                <p class="slogan">Avancer en toute confiance</p>
                <p class="thanks">Movia Automobile vous remercie de votre aimable attention</p>
              </main>
            </body>
          </html>
        `);

        await page.screenshot({
          path: path.join(shotsDir, `${scene.name}.png`),
          fullPage: false,
        });
        await page.close();
        continue;
      }

      await page.addInitScript((storage) => {
        Object.entries(storage || {}).forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });
      }, scene.storage || {});

      await page.goto(`${baseUrl}${scene.url}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(1000);

      if (scene.evaluate) {
        await page.evaluate(scene.evaluate);
        await page.waitForTimeout(600);
      }

      await page.screenshot({
        path: path.join(shotsDir, `${scene.name}.png`),
        fullPage: false,
      });

      await page.close();
    }

    await browser.close();
  } finally {
    stopProcessTree(vite);
  }
}

function toFfmpegPath(filePath) {
  return filePath.replaceAll("\\", "/").replaceAll("'", "'\\''");
}

async function writeConcatFile() {
  const lines = [];

  for (const scene of scenes) {
    const filePath = scene.image || path.join(shotsDir, `${scene.name}.png`);
    lines.push(`file '${toFfmpegPath(filePath)}'`);
    lines.push(`duration ${scene.duration}`);
  }

  const lastScene = scenes.at(-1);
  const lastFilePath = lastScene.image || path.join(shotsDir, `${lastScene.name}.png`);
  lines.push(`file '${toFfmpegPath(lastFilePath)}'`);

  await writeFile(concatPath, `${lines.join("\n")}\n`, "utf8");
}

function formatAssTime(seconds) {
  const centiseconds = Math.round(seconds * 100);
  const cs = centiseconds % 100;
  const totalSeconds = Math.floor(centiseconds / 100);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);

  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function escapeAssText(value) {
  return value
    .replaceAll("{", "")
    .replaceAll("}", "")
    .replaceAll("\n", " ")
    .trim();
}

function splitCaptionText(text) {
  const sentences = text
    .replace(/\r/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const chunks = [];

  for (const sentence of sentences) {
    if (sentence.length <= 95) {
      chunks.push(sentence);
      continue;
    }

    const words = sentence.split(/\s+/);
    let current = "";

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > 95 && current) {
        chunks.push(current);
        current = word;
      } else {
        current = next;
      }
    }

    if (current) chunks.push(current);
  }

  return chunks;
}

async function writeCaptionsFile() {
  const dialogues = [];
  let sceneStart = 0;

  for (const scene of scenes) {
    if (scene.chapter) {
      dialogues.push(
        `Dialogue: 0,${formatAssTime(sceneStart)},${formatAssTime(sceneStart + scene.duration)},Chapter,,0,0,0,,${escapeAssText(scene.chapter)}`
      );
    }

    const text = (scene.captions || []).join(" ");
    const chunks = splitCaptionText(text);
    const totalCharacters = chunks.reduce((sum, chunk) => sum + chunk.length, 0) || 1;
    let captionStart = sceneStart;

    chunks.forEach((chunk, index) => {
      const proportional = (chunk.length / totalCharacters) * scene.duration;
      const start = captionStart;
      const end =
        index === chunks.length - 1
          ? sceneStart + scene.duration
          : Math.min(sceneStart + scene.duration, start + Math.max(1.8, proportional));

      captionStart = end;
      dialogues.push(
        `Dialogue: 0,${formatAssTime(start)},${formatAssTime(end)},Caption,,0,0,0,,${escapeAssText(chunk)}`
      );
    });

    sceneStart += scene.duration;
  }

  const ass = `[Script Info]
Title: Movia captions
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,Arial,38,&H00FFFFFF,&H000000FF,&H00111111,&HCC000000,-1,0,0,0,100,100,0,0,3,2,0,2,130,130,72,1
Style: Chapter,Arial,44,&H000079F9,&H000000FF,&H00FFFFFF,&H99000000,-1,0,0,0,100,100,0,0,3,2,0,7,70,70,58,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${dialogues.join("\n")}
`;

  await writeFile(captionsPath, ass, "utf8");
}

async function renderVideo() {
  const audioPath = useCustomVoiceover && existsSync(customVoiceoverPath) ? customVoiceoverPath : voicePath;
  const subtitlesFilterPath = "video/generated/captions.ass";
  const videoFilters = [
    "scale=1920:1080:force_original_aspect_ratio=decrease",
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
    ...(useBurnedCaptions ? [`ass=${subtitlesFilterPath}`] : []),
    "format=yuv420p",
  ].join(",");

  await run(ffmpegPath, [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatPath,
    "-i",
    audioPath,
    "-vf",
    videoFilters,
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    outputPath,
  ]);
}

await ensureDirectories();
await generateVoiceover();
await syncSceneDurationsToAudio();
await captureScreenshots();
await writeConcatFile();
await writeCaptionsFile();
await renderVideo();

console.log(`\nVideo generated: ${outputPath}`);
