/**
 * generate-assets.ts
 *
 * Committed source of truth for the twelve "Blue Ink Editorial" engravings
 * shipped in public/engravings/. See
 * docs/superpowers/specs/2026-09-09-blue-ink-editorial-design.md §4.
 *
 * This is a ONE-SHOT AUTHORING TOOL, run by hand. It is never part of
 * `pnpm build` and must never be wired into any build/CI step — a single
 * generation takes roughly half an hour of wall clock.
 *
 * Usage:
 *
 *   pnpm generate-assets                          # all twelve plates
 *   pnpm generate-assets toronto-skyline           # one named plate
 *   pnpm generate-assets home-hero og-card         # a subset
 *   pnpm generate-assets toronto-skyline --overwrite   # replace a shipped plate
 *
 * Each asset shells out to `codex exec`, instructing Codex to use its
 * `imagegen` skill and built-in `image_gen` tool. Every prompt is composed
 * as LOCKED_STYLE + SUBJECT + SAVE_INSTRUCTION so all plates read as one
 * hand (spec §4.1). Generation fans out in parallel batches rather than a
 * serial loop — twelve serial generations is not an acceptable wait.
 *
 * Each resulting PNG is converted to WebP with `cwebp` (Homebrew; `sips`
 * cannot write WebP on this machine) and the PNG is discarded (spec §4.3).
 */

import { execFileSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Locked style block — transcribed VERBATIM from the calibration probe.
// ---------------------------------------------------------------------------
//
// Do not edit casually. Three findings from that probe are encoded in this
// text and dropping any of them silently changes the house style
// (spec §4.1):
//
//   1. Codex crops tight by default — the "COMPOSITION: a wide shot in
//      which the ENTIRE subject is fully visible with generous empty cream
//      margin..." clause at the end of this block is load-bearing.
//   2. Codex renders heavier than the reference plates — the "LIGHT, OPEN,
//      AIRY... Do NOT let the image go dark, heavy, dense or muddy... not a
//      dark woodcut" clause is load-bearing.
//   3. A single 1024² PNG lands around 2.4MB uncompressed, hence the
//      mandatory WebP step below (see PLATE_BUDGET_BYTES / encodeToWebp).
const LOCKED_STYLE =
  'STYLE (follow exactly, non-negotiable): An antique copperplate ENGRAVING / ' +
  'etching illustration. Rendered in a SINGLE ink colour, deep navy blue ' +
  '#1B3A6B, printed on a warm cream paper ground #F7F3E7. LIGHT, OPEN, AIRY ' +
  'linework: fine parallel hatching and sparse crosshatch with a great deal ' +
  'of the cream paper left showing through. Do NOT let the image go dark, ' +
  'heavy, dense or muddy — it should read as a delicate 19th-century book ' +
  'plate, not a dark woodcut. Absolutely no colour other than that one blue ' +
  'ink and the cream ground. No text, no lettering, no numbers, no captions, ' +
  'no signature, no watermark, no drawn frame or border. COMPOSITION: a wide ' +
  'shot in which the ENTIRE subject is fully visible with generous empty ' +
  'cream margin on all four sides — do not crop or cut off any part of the ' +
  'subject.';

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

type AssetSize = '1536x1024' | '1024x1024';

interface AssetSpec {
  /** Output basename, without extension. Written to public/engravings/<name>.webp */
  readonly name: string;
  readonly size: AssetSize;
  /** The SUBJECT clause of the prompt — transcribed verbatim from the scratchpad calibration run. */
  readonly subject: string;
  /**
   * Filenames, relative to assets/reference-portraits/ (gitignored — source
   * photographs are never committed or deployed), that Codex must look at
   * via view_image before generating, to capture a likeness. Only
   * about-portrait uses this.
   */
  readonly referenceImages?: readonly string[];
}

const ASSETS: readonly AssetSpec[] = [
  {
    name: 'home-hero',
    size: '1536x1024',
    subject:
      'A wide, calm desk workspace seen from a slight three-quarter angle. On the desk: an open hardcover book, a few loosely stacked papers with faint hand-drawn line-chart and node-diagram marks, a fountain pen resting on a notebook, a small potted leafy plant, and a simple ceramic mug. Behind the desk a tall window opens onto a distant city waterfront skyline with a slender observation tower and a few sailboats on calm water. Everything sits in the frame with clear space around it.',
  },
  {
    name: 'about-portrait',
    size: '1536x1024',
    subject:
      'A portrait scene of THAT SAME MAN from the reference photographs — a Black man with short cropped hair, a short trimmed beard, and thin-rimmed glasses — seated at a wooden desk in three-quarter view, leaning slightly forward in thought with one hand near his chin, looking down at papers in front of him. He wears a soft collared shirt. On the desk: a stack of hardcover books, an open spiral notebook, loose sheets carrying faint hand-drawn chart and node-diagram marks, a ceramic mug, and a small potted leafy plant. Behind him a tall window opens onto a distant city waterfront skyline with a slender observation tower and sailboats on calm water. Render his likeness faithfully but translate it fully into the engraving language described above — built from fine hatched ink lines, never a photographic or airbrushed face. He is fully visible with clear space around him.',
    referenceImages: ['miguel-at-laptop.png', 'miguel-headshot.png', 'miguel-full-body.png'],
  },
  {
    name: 'work-still-life',
    size: '1536x1024',
    subject:
      'A neat stack of five hardcover books lying flat on a wooden desk, with a spiral-bound notebook open beside them, a fountain pen resting on the desk, a cup holding several pens and pencils, and a small potted leafy plant. Behind them, a window opens onto a distant city waterfront skyline with a slender observation tower, a domed stadium, and sailboats on calm water. Generous empty space around the whole arrangement.',
  },
  {
    name: 'writing-still-life',
    size: '1536x1024',
    subject:
      'An open blank notebook lying flat on a plain desk, a fountain pen resting diagonally beside it with its nib catching the light, two or three loose sheets of paper fanned nearby, a small glass inkwell, and a single sprig of leaves in a slim vase off to one side. Quiet, spacious, uncluttered composition.',
  },
  {
    name: 'notes-still-life',
    size: '1024x1024',
    subject:
      'A small closed pocket field notebook with an elastic band, lying on a plain surface beside a short sharpened pencil and a folded pair of reading glasses. Simple, sparse, plenty of empty space around the objects.',
  },
  {
    name: 'now-still-life',
    size: '1024x1024',
    subject:
      'A simple desk lamp with a conical shade casting light over a small open desk calendar and a plain ceramic coffee mug, with a folded newspaper edge just visible beneath. Calm and sparse, with plenty of empty space around the objects.',
  },
  {
    name: 'toronto-skyline',
    size: '1536x1024',
    subject:
      'A wide panoramic view of the Toronto waterfront seen from across the lake: the CN Tower rising tall at the centre, the domed Rogers Centre beside it, a dense cluster of downtown high-rise towers spreading to both sides, a treeline along the shore, several small sailboats on the calm water in the foreground, gentle reflections on the lake surface, a few birds in the open sky, and a leafy tree branch framing the far left edge. The lower third is water; the upper third is open, almost empty sky.',
  },
  {
    name: 'cap-applied-ai',
    size: '1024x1024',
    subject:
      'A small isometric technical diagram of a cluster of interlocking cubes arranged in a stepped three-dimensional formation, drawn on a faint dotted isometric construction grid, with a few thin leader lines and small circular node points at the corners. Compact object centred with wide empty margins — a schematic drawing, not a scene.',
  },
  {
    name: 'cap-product-analytics',
    size: '1024x1024',
    subject:
      'A small isometric technical diagram of a row of six rising three-dimensional bar columns of increasing height, with a smooth curved arrow sweeping upward across them, drawn on a faint dotted isometric construction grid. Compact object centred with wide empty margins — a schematic drawing, not a scene.',
  },
  {
    name: 'cap-data-systems',
    size: '1024x1024',
    subject:
      'A small isometric technical diagram of a vertical stack of four flat cylindrical disks resembling a layered data store, with thin connector lines running out to three small cubes floating to one side and a few circular node points, drawn on a faint dotted isometric construction grid. Compact object centred with wide empty margins — a schematic drawing, not a scene.',
  },
  {
    name: 'cap-building',
    size: '1024x1024',
    subject:
      'A small isometric technical diagram of four rectangular blocks of differing heights arranged like a simple built structure or bar form, one block shown in light wireframe outline as though still being constructed, drawn on a faint dotted isometric construction grid. Compact object centred with wide empty margins — a schematic drawing, not a scene.',
  },
  {
    name: 'og-card',
    size: '1536x1024',
    subject:
      'A calm horizontal still life: a fountain pen lying beside a single closed hardcover book and a folded pair of glasses on a plain desk, with a distant slender observation tower and a low city skyline suggested very faintly in the far background. Extremely spacious composition with a large area of empty cream paper across the upper half, as though leaving room for a title to be printed there later.',
  },
];

// ---------------------------------------------------------------------------
// Prompt assembly — LOCKED_STYLE + SUBJECT + SAVE_INSTRUCTION (spec §4.1)
// ---------------------------------------------------------------------------

const REFERENCE_PORTRAITS_DIR = path.join(process.cwd(), 'assets/reference-portraits');

function saveInstruction(name: string): string {
  return `Save the final PNG into the current working directory as ${name}.png and print the absolute saved path. Do not ask any questions; just generate and save.`;
}

function buildPrompt(asset: AssetSpec): string {
  const intro =
    asset.referenceImages && asset.referenceImages.length > 0
      ? [
          'First use the built-in view_image tool to look at all three of these reference photographs of the same man, so his likeness is in context:',
          asset.referenceImages.map((file) => path.join(REFERENCE_PORTRAITS_DIR, file)).join('\n'),
          '',
          `Then use your imagegen skill with the built-in image_gen tool to generate ONE image at size ${asset.size}.`,
        ].join('\n')
      : `Use your imagegen skill with the built-in image_gen tool to generate ONE image at size ${asset.size}.`;

  return [intro, LOCKED_STYLE, `SUBJECT: ${asset.subject}`, saveInstruction(asset.name)].join('\n\n');
}

// ---------------------------------------------------------------------------
// Codex invocation
// ---------------------------------------------------------------------------

function runCodex(prompt: string, cwd: string, logPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'codex',
      ['exec', '--skip-git-repo-check', '--dangerously-bypass-approvals-and-sandbox', prompt],
      { cwd }
    );
    const log = fs.createWriteStream(logPath);
    if (child.stdout) child.stdout.pipe(log, { end: false });
    if (child.stderr) child.stderr.pipe(log, { end: false });
    child.on('error', reject);
    child.on('close', (code) => {
      log.end();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`codex exec exited with code ${String(code)} in ${cwd} (see ${logPath})`));
      }
    });
  });
}

// ---------------------------------------------------------------------------
// WebP post-processing (spec §4.3)
// ---------------------------------------------------------------------------

const PLATE_BUDGET_BYTES = 180 * 1024; // under 180KB per plate
const TOTAL_BUDGET_BYTES = 1.4 * 1024 * 1024; // under 1.4MB for the full set

// Quality is stepped down first, at full size. Only once the quality ladder
// is exhausted do we downscale and restart the quality ladder — these are
// line drawings, and quality loss shows as hatching mush long before it
// shows as softness. about-portrait is the one plate that historically
// needed a downscale step (it shipped at 1280px wide, q78).
const QUALITY_STEPS: readonly number[] = [82, 74, 66, 58];
const WIDTH_SCALE_STEPS: readonly number[] = [1, 0.85, 0.7, 0.55];

interface EncodeResult {
  readonly bytes: number;
  readonly quality: number;
  readonly widthPx: number;
}

function encodeToWebp(pngPath: string, destPath: string, fullWidthPx: number): EncodeResult {
  for (const widthScale of WIDTH_SCALE_STEPS) {
    const targetWidth = Math.round(fullWidthPx * widthScale);
    for (const quality of QUALITY_STEPS) {
      const args = ['-q', String(quality)];
      if (widthScale !== 1) {
        args.push('-resize', String(targetWidth), '0');
      }
      args.push(pngPath, '-o', destPath);
      execFileSync('cwebp', args, { stdio: 'ignore' });
      const bytes = fs.statSync(destPath).size;
      if (bytes <= PLATE_BUDGET_BYTES) {
        return { bytes, quality, widthPx: widthScale === 1 ? fullWidthPx : targetWidth };
      }
    }
  }
  throw new Error(
    `${destPath}: could not fit under ${PLATE_BUDGET_BYTES} bytes even at the smallest width/quality step`
  );
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

const ENGRAVINGS_DIR = path.join(process.cwd(), 'public/engravings');
// Matches the historical scratchpad runs that produced the shipped plates —
// run.sh/run2.sh/run3.sh each grouped exactly four `gen` calls per batch.
// Not spec-mandated; 4 is just a value that is known to work.
const BATCH_SIZE = 4;

/** Bytes written to destPath — either freshly encoded, or the size of the existing file when skipped. */
async function generateOne(asset: AssetSpec, overwrite: boolean): Promise<number> {
  const destPath = path.join(ENGRAVINGS_DIR, `${asset.name}.webp`);

  // Never overwrite an existing shipped plate silently — someone re-running
  // this by accident must not destroy the shipped set.
  if (fs.existsSync(destPath) && !overwrite) {
    console.log(`SKIP ${asset.name}: ${destPath} already exists. Pass --overwrite to replace it.`);
    return fs.statSync(destPath).size;
  }

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), `generate-assets-${asset.name}-`));
  const logPath = path.join(workDir, `${asset.name}.log`);
  const prompt = buildPrompt(asset);

  console.log(`GEN  ${asset.name} (${asset.size}) — working dir ${workDir}`);
  await runCodex(prompt, workDir, logPath);

  const pngPath = path.join(workDir, `${asset.name}.png`);
  if (!fs.existsSync(pngPath)) {
    throw new Error(`${asset.name}: codex exec finished but ${pngPath} was not created (see ${logPath})`);
  }

  fs.mkdirSync(ENGRAVINGS_DIR, { recursive: true });
  const fullWidthPx = Number(asset.size.split('x')[0]);
  const result = encodeToWebp(pngPath, destPath, fullWidthPx);
  const scaledNote = result.widthPx !== fullWidthPx ? `, downscaled to ${result.widthPx}px wide` : '';
  console.log(`DONE ${asset.name}: ${(result.bytes / 1024).toFixed(0)}KB at q${result.quality}${scaledNote}`);

  fs.rmSync(workDir, { recursive: true, force: true });
  return result.bytes;
}

/** Bytes produced per successfully processed asset name (generated or skipped-existing). Throws if any asset failed. */
async function runInBatches(assets: readonly AssetSpec[], overwrite: boolean): Promise<Map<string, number>> {
  const failures: string[] = [];
  const bytesByName = new Map<string, number>();
  for (let i = 0; i < assets.length; i += BATCH_SIZE) {
    const batch = assets.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map((asset) => generateOne(asset, overwrite)));
    results.forEach((result, idx) => {
      const name = batch[idx]?.name ?? '(unknown)';
      if (result.status === 'rejected') {
        failures.push(name);
        console.error(`FAIL ${name}: ${String(result.reason)}`);
      } else {
        bytesByName.set(name, result.value);
      }
    });
  }
  if (failures.length > 0) {
    throw new Error(`${failures.length} asset(s) failed: ${failures.join(', ')}`);
  }
  return bytesByName;
}

interface DirectoryTotal {
  readonly totalBytes: number;
  /** True only if every asset in the manifest has a known size (freshly produced this run, or already on disk). */
  readonly complete: boolean;
  readonly missing: readonly string[];
}

/**
 * The real total payload across the full twelve-asset manifest: bytes
 * produced this run take priority, falling back to the on-disk size of
 * untouched files for a partial run. This is honest for both a full run
 * (every byte count comes from this run) and a partial run (regenerated
 * plates combine with the existing sizes of the ones left alone) — it never
 * reports a total for plates that have never been generated at all.
 */
function computeDirectoryTotal(producedThisRun: ReadonlyMap<string, number>): DirectoryTotal {
  let totalBytes = 0;
  const missing: string[] = [];
  for (const asset of ASSETS) {
    const known = producedThisRun.get(asset.name);
    if (known !== undefined) {
      totalBytes += known;
      continue;
    }
    const destPath = path.join(ENGRAVINGS_DIR, `${asset.name}.webp`);
    if (fs.existsSync(destPath)) {
      totalBytes += fs.statSync(destPath).size;
    } else {
      missing.push(asset.name);
    }
  }
  return { totalBytes, complete: missing.length === 0, missing };
}

interface ParsedArgs {
  readonly names: readonly string[];
  readonly overwrite: boolean;
}

function parseArgs(argv: readonly string[]): ParsedArgs {
  const overwrite = argv.includes('--overwrite');
  const names = argv.filter((arg) => !arg.startsWith('--'));
  return { names, overwrite };
}

async function main(): Promise<void> {
  const { names, overwrite } = parseArgs(process.argv.slice(2));

  let targets: readonly AssetSpec[];
  if (names.length === 0) {
    targets = ASSETS;
  } else {
    targets = names.map((name) => {
      const asset = ASSETS.find((a) => a.name === name);
      if (!asset) {
        const valid = ASSETS.map((a) => a.name).join(', ');
        throw new Error(`Unknown asset "${name}". Valid names: ${valid}`);
      }
      return asset;
    });
  }

  console.log(
    `Generating ${targets.length} asset(s) in batches of ${BATCH_SIZE}${overwrite ? ' (--overwrite)' : ''}. ` +
      `Budget: ${PLATE_BUDGET_BYTES / 1024}KB/plate, ${(TOTAL_BUDGET_BYTES / 1024 / 1024).toFixed(1)}MB total.`
  );
  const produced = await runInBatches(targets, overwrite);
  console.log('All requested assets generated.');

  // The per-plate cap is enforced inside encodeToWebp and throws on its own;
  // the 1.4MB total (spec §4.2/§4.3) is a separate hard requirement and must
  // be checked explicitly here — twelve plates each just under the 180KB
  // per-plate cap would total over 2MB and the per-plate check alone would
  // never catch it.
  const { totalBytes, complete, missing } = computeDirectoryTotal(produced);
  const totalKB = (totalBytes / 1024).toFixed(0);
  if (complete) {
    console.log(`Directory total: ${totalKB}KB across all twelve plates (budget ${TOTAL_BUDGET_BYTES / 1024}KB).`);
    if (totalBytes > TOTAL_BUDGET_BYTES) {
      throw new Error(
        `Total engraving payload ${totalKB}KB exceeds the ${TOTAL_BUDGET_BYTES / 1024}KB budget (spec §4.2/§4.3).`
      );
    }
  } else {
    console.log(
      `Directory total so far: ${totalKB}KB. Budget check SKIPPED — ${missing.length} plate(s) have never been ` +
        `generated and are not on disk yet: ${missing.join(', ')}.`
    );
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
