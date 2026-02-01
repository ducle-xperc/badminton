import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const PUBLIC_DIR = "./public";
const FAVICON_SVG = join(PUBLIC_DIR, "favicon.svg");

// Read SVG
const svgBuffer = readFileSync(FAVICON_SVG);

// Define sizes
const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

async function generateFavicons() {
  console.log("Generating favicons from SVG...\n");

  for (const { name, size } of sizes) {
    const outputPath = join(PUBLIC_DIR, name);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Generate ICO file (multi-resolution)
  // ICO format requires multiple sizes bundled together
  // We'll create PNG buffers for 16, 32, and 48 sizes

  const ico16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const ico48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // Create a simple ICO file with the 32x32 size as primary
  // For a proper ICO, you'd need an ICO encoder, but for now we'll use the 32x32 PNG
  // Modern browsers prefer PNG favicons anyway

  console.log("\n✓ All favicon sizes generated!");
  console.log("\nNote: For a proper favicon.ico, consider using an online tool like");
  console.log("https://realfavicongenerator.net with the generated favicon.svg");
}

generateFavicons().catch(console.error);
