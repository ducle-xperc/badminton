import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { encode } from "sharp-ico";

const PUBLIC_DIR = "./public";
const APP_DIR = "./src/app";
const FAVICON_SVG = join(PUBLIC_DIR, "favicon.svg");

async function generateIco() {
  const svgBuffer = readFileSync(FAVICON_SVG);

  // Generate PNG buffers for ICO
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map(async (size) => {
      return sharp(svgBuffer).resize(size, size).png().toBuffer();
    })
  );

  // Encode to ICO
  const icoBuffer = await encode(images);

  // Write to both public and src/app
  writeFileSync(join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  writeFileSync(join(APP_DIR, "favicon.ico"), icoBuffer);

  console.log(`✓ Generated favicon.ico (${icoBuffer.length} bytes)`);
}

generateIco().catch(console.error);
