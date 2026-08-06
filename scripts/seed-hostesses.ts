/**
 * Seeds the 12 real hostess documents into Sanity (production dataset).
 *
 * SAFE BY DEFAULT:
 *  - Runs as a dry run unless you pass --commit. Dry run only *reads*
 *    (no token needed) to compute displayOrder/rating/gradient the same
 *    way Studio would, and prints exactly what it would create.
 *  - Never touches a document that already exists unless you pass
 *    --overwrite (still scoped to only the 12 hostess-<slug> ids below).
 *  - Hard-verifies projectId/dataset against known-good values before
 *    any write, so it can never silently run against the wrong project.
 *  - Only ever creates/replaces documents — never deletes anything.
 *
 * Usage:
 *   npx tsx scripts/seed-hostesses.ts                 # dry run (no token needed)
 *   npx tsx scripts/seed-hostesses.ts --commit         # real run (needs SANITY_API_WRITE_TOKEN)
 *   npx tsx scripts/seed-hostesses.ts --commit --overwrite   # also updates existing docs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

// ─── Guardrails ──────────────────────────────────────────────────────────
// Must match the new project you gave me. If .env.local ever points
// somewhere else, abort instead of writing to the wrong project.
const EXPECTED_PROJECT_ID = "l99dynmd";
const EXPECTED_DATASET = "production";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOSTESSES_DIR = path.join(ROOT, "public", "hostesses");

// ─── Minimal .env.local loader (no dependency on the `dotenv` package) ───
function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const COMMIT = process.argv.includes("--commit");
const OVERWRITE = process.argv.includes("--overwrite");

// ─── The roster ────────────────────────────────────────────────────────
// Order matters: it drives displayOrder (spaced by 10, same convention as
// hostessDefaults.ts).
const ROSTER = [
  "Alycia",
  "Anika",
  "Anissa",
  "Emma",
  "Jade",
  "Laura",
  "Lucy",
  "Mia",
  "Sara",
  "Sophia",
  "Stéphanie",
  "Saphyra",
];

// ── Clearly-marked placeholders ────────────────────────────────────────
// These three are REQUIRED by the schema (Rule.required()) and cannot be
// left blank, so they must hold *some* value. The numbers are deliberately
// implausible so they're obvious to spot and fix in Studio. Every other
// optional field (measurements, shortDescription, availableUntil,
// services, languages, gallery) is left unset — the frontend already
// renders those gracefully when absent, so nothing fabricated ships to
// the site for those.
const PLACEHOLDER_AGE = 99;
const PLACEHOLDER_HEIGHT_CM = 999;
const PLACEHOLDER_WEIGHT_LB = 999;

// Same 6-pair palette as sanity/schemaTypes/hostessDefaults.ts, cycled the
// same way Studio's own initialValue resolvers would (which never run
// when documents are created via the API instead of the Studio UI).
const GRADIENT_PALETTE: [string, string][] = [
  ["#4a1626", "#e87896"],
  ["#2a1420", "#c69a72"],
  ["#4a1626", "#e8c9ab"],
  ["#2a1420", "#e87896"],
  ["#4a1626", "#c69a72"],
  ["#2a1420", "#f2ddc3"],
];

function normalize(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function slugify(name: string) {
  return normalize(name).replace(/[^a-z0-9]+/g, "");
}

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function findImageFile(name: string): string {
  const files = fs.readdirSync(HOSTESSES_DIR);
  const target = normalize(name);
  const match = files.find((f) => normalize(path.parse(f).name) === target);
  if (!match) {
    throw new Error(`No image found in public/hostesses for "${name}"`);
  }
  return match;
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

  console.log(`Project ID: ${projectId}`);
  console.log(`Dataset:    ${dataset}`);
  console.log(`Mode:       ${COMMIT ? "COMMIT (writes to Sanity)" : "DRY RUN (no writes)"}${OVERWRITE ? " + overwrite" : ""}`);
  console.log("");

  if (projectId !== EXPECTED_PROJECT_ID || dataset !== EXPECTED_DATASET) {
    throw new Error(
      `Refusing to run: expected project "${EXPECTED_PROJECT_ID}"/"${EXPECTED_DATASET}", ` +
        `but .env.local resolved to "${projectId}"/"${dataset}". This script will never write ` +
        `to a project other than the one it was explicitly verified against.`
    );
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (COMMIT && !token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN is not set in .env.local. Add a write token (Editor permission) " +
        "before running with --commit. See the script header / project docs for how to create one."
    );
  }

  // Read client — no token needed, matches sanity/lib/client.ts (public reads).
  const readClient = createClient({ projectId, dataset, apiVersion, useCdn: false });
  // Write client — only constructed when actually committing, so a dry run
  // never even touches the token.
  const writeClient = COMMIT
    ? createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    : null;

  const existingCount: number = await readClient.fetch(`count(*[_type == "hostess"])`);
  const existingMaxOrder: number | null = await readClient.fetch(
    `math::max(*[_type == "hostess"].displayOrder)`
  );
  let nextOrder = (existingMaxOrder ?? 0);

  console.log(`Existing hostess documents in dataset: ${existingCount}`);
  console.log("");

  const plan = ROSTER.map((name, index) => {
    const slug = slugify(name);
    const id = `hostess-${slug}`;
    const imageFile = findImageFile(name);
    nextOrder += 10;
    const paletteIndex = (existingCount + index) % GRADIENT_PALETTE.length;
    const [gradientFrom, gradientTo] = GRADIENT_PALETTE[paletteIndex];
    return {
      name,
      id,
      imageFile,
      displayOrder: nextOrder,
      gradientFrom,
      gradientTo,
    };
  });

  console.log("Planned documents:");
  for (const p of plan) {
    console.log(
      `  ${p.id.padEnd(20)} name="${p.name}" image=${p.imageFile} displayOrder=${p.displayOrder}`
    );
  }
  console.log("");

  if (!COMMIT) {
    console.log("Dry run complete — no data was written. Re-run with --commit to import for real.");
    return;
  }

  for (const p of plan) {
    const existing = await readClient.fetch<{ _id: string } | null>(
      `*[_id == $id][0]{_id}`,
      { id: p.id }
    );
    if (existing && !OVERWRITE) {
      console.log(`SKIP  ${p.id} — already exists (pass --overwrite to update it)`);
      continue;
    }

    const imagePath = path.join(HOSTESSES_DIR, p.imageFile);
    const ext = path.extname(p.imageFile).toLowerCase();
    const contentType = CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream";
    const buffer = fs.readFileSync(imagePath);

    const asset = await writeClient!.assets.upload("image", buffer, {
      filename: p.imageFile,
      contentType,
    });

    const doc = {
      _id: p.id,
      _type: "hostess",
      name: p.name,
      age: PLACEHOLDER_AGE,
      height: PLACEHOLDER_HEIGHT_CM,
      weight: PLACEHOLDER_WEIGHT_LB,
      mainPhoto: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
      status: "available",
      active: true,
      premium: false,
      popularToday: false,
      newArrival: false,
      staffFavorite: false,
      displayOrder: p.displayOrder,
      rating: 5,
      gradientFrom: p.gradientFrom,
      gradientTo: p.gradientTo,
    };

    if (existing) {
      await writeClient!.createOrReplace(doc);
      console.log(`UPDATE ${p.id} — "${p.name}" (image asset ${asset._id})`);
    } else {
      await writeClient!.create(doc);
      console.log(`CREATE ${p.id} — "${p.name}" (image asset ${asset._id})`);
    }
  }

  console.log("");
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed script failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
