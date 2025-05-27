import fs from "fs";
import path from "path";
import sharp from "sharp";

// Create output directory if it doesn't exist
const outputDir = "./cards_1024";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function resizeCard(inputPath: string, fileName: string): Promise<void> {
  try {
    console.log(`Processing ${fileName}...`);

    // Read the original image and get its dimensions
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`  Original size: ${metadata.width}×${metadata.height}`);

    // Create a 1024x1024 canvas with transparent background
    // and place the original image in the center
    const outputPath = path.join(outputDir, fileName);

    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      },
    })
      .composite([
        {
          input: inputPath,
          top: Math.round((1024 - (metadata.height || 527)) / 2), // Center vertically
          left: Math.round((1024 - (metadata.width || 300)) / 2), // Center horizontally
        },
      ])
      .png()
      .toFile(outputPath);

    console.log(`  ✅ Saved: ${outputPath}`);
  } catch (error) {
    console.error(`  ❌ Error processing ${fileName}:`, error);
  }
}

async function main() {
  const cardsDir = "./cards";

  // Read all files in the cards directory
  const files = fs.readdirSync(cardsDir);
  const imageFiles = files.filter(
    (file) =>
      file.toLowerCase().endsWith(".png") ||
      file.toLowerCase().endsWith(".jpg") ||
      file.toLowerCase().endsWith(".jpeg")
  );

  console.log(`Found ${imageFiles.length} card images to resize`);
  console.log("Converting to 1024×1024 centered format...\n");

  // Process each card
  for (const file of imageFiles) {
    const cardPath = path.join(cardsDir, file);
    await resizeCard(cardPath, file);
  }

  console.log("\n🎉 All cards have been resized!");
  console.log(
    `Check the ${outputDir} directory for your 1024×1024 centered cards.`
  );
  console.log(
    "You can now use these cards with the Studio Ghibli generator script."
  );
}

// Run the script
main().catch(console.error);
