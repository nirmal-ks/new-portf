const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Use the ORIGINAL avatar.png (the blue bg photo from the portfolio)
const AVATAR_PATH = path.join(__dirname, '..', 'public', 'avatar.png');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'avatar_new.png');

async function run() {
  const avatar = sharp(AVATAR_PATH);
  const meta = await avatar.metadata();
  const { width, height } = meta;
  console.log(`Avatar size: ${width}x${height}`);

  // Get raw RGB pixels
  const rawBuf = await sharp(AVATAR_PATH).raw().toBuffer();

  // Build RGBA buffer — remove cyan/blue background
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = rawBuf[i * 3 + 0];
    const g = rawBuf[i * 3 + 1];
    const b = rawBuf[i * 3 + 2];

    // Detect cyan/blue background: low R, medium-high G, high B
    // Original photo bg is bright cyan ~(0, 174, 239) or similar
    const isBg = (r < 120 && g > 140 && b > 170 && b > r + 80 && g > r + 50);

    rgba[i * 4 + 0] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = isBg ? 0 : 255;
  }

  // Feather edges: soften the mask boundary (3x3 neighborhood)
  const feathered = Buffer.from(rgba);
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const idx = (y * width + x) * 4;
      if (rgba[idx + 3] === 255) {
        let bgCount = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const ni = ((y + dy) * width + (x + dx)) * 4;
            if (rgba[ni + 3] === 0) bgCount++;
          }
        }
        if (bgCount > 0) {
          feathered[idx + 3] = Math.round(255 * (1 - bgCount / 25));
        }
      }
    }
  }

  // Create person cutout PNG
  const personBuf = await sharp(feathered, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();

  // Create a professional dark gradient background
  // Deep charcoal/navy vignette — modern developer portfolio look
  const bgRaw = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const nx = x / width - 0.5;
      const ny = y / height - 0.4;
      const dist = Math.sqrt(nx * nx + ny * ny);
      
      // Center is lighter (subtle radial gradient)
      const light = Math.max(0, 1 - dist * 1.8);

      // Base: dark navy #0f1923 to #1a2535
      const baseR = 15, baseG = 25, baseB = 35;
      const highlightR = 30, highlightG = 45, highlightB = 65;

      bgRaw[idx + 0] = Math.round(baseR + (highlightR - baseR) * light);
      bgRaw[idx + 1] = Math.round(baseG + (highlightG - baseG) * light);
      bgRaw[idx + 2] = Math.round(baseB + (highlightB - baseB) * light);
    }
  }

  const bgBuf = await sharp(bgRaw, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();

  // Composite person over background
  await sharp(bgBuf)
    .composite([{ input: personBuf, top: 0, left: 0 }])
    .png()
    .toFile(OUTPUT_PATH);

  console.log(`✅ Done! Saved to ${OUTPUT_PATH}`);
}

run().catch(console.error);
