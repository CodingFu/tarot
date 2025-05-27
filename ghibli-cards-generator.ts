import fs from "fs";
import path from "path";
import OpenAI, { toFile } from "openai";

const client = new OpenAI();

// Create output directory if it doesn't exist
const outputDir = "./ghibli_cards";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processCard(cardPath: string, cardName: string): Promise<void> {
  try {
    console.log(`Processing ${cardName}...`);

    // Convert the image file to the format expected by OpenAI
    const imageFile = await toFile(fs.createReadStream(cardPath), cardName, {
      type: "image/png",
    });

    // Call OpenAI API to redraw the card in Studio Ghibli style
    const response = await client.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt:
        "Redraw this tarot card in Studio Ghibli style, maintaining the same symbolic elements and composition but with the characteristic soft, whimsical, and nature-inspired aesthetic of Studio Ghibli films. Keep the mystical and spiritual essence of the tarot card while adding Ghibli's signature dreamy atmosphere, gentle colors, and organic flowing lines. Make sure that resulting image is pushed to the edge of the canvas",
      size: "1024x1536",
      background: "transparent",
    });

    // Save the generated image
    if (response.data && response.data[0]?.url) {
      const imageUrl = response.data[0].url;
      console.log(`  📥 Downloading from: ${imageUrl}`);

      // Download the image from the URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to download image: ${imageResponse.statusText}`
        );
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const outputPath = path.join(outputDir, `ghibli-${cardName}`);
      fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
      console.log(`  ✅ Saved: ${outputPath}`);
    } else if (response.data && response.data[0]?.b64_json) {
      // Fallback for base64 format (if API returns this format)
      const imageBase64 = response.data[0].b64_json;
      const imageBytes = Buffer.from(imageBase64, "base64");
      const outputPath = path.join(outputDir, `ghibli-${cardName}`);
      fs.writeFileSync(outputPath, imageBytes);
      console.log(`  ✅ Saved: ${outputPath}`);
    } else {
      console.error(`  ❌ No image data received for ${cardName}`);
      console.log("  Response data:", JSON.stringify(response.data, null, 2));
    }

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error(`❌ Error processing ${cardName}:`, error);
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

  // Sort the image files alphabetically by filename
  imageFiles.sort((a, b) => a.localeCompare(b));

  console.log(`Found ${imageFiles.length} card images to process`);
  console.log("Starting Studio Ghibli transformation...\n");

  // Process each card
  for (const file of imageFiles) {
    const cardPath = path.join(cardsDir, file);
    await processCard(cardPath, file);
  }

  console.log("\n🎉 All cards have been processed!");
  console.log(
    `Check the ${outputDir} directory for your Studio Ghibli style tarot cards.`
  );
}

// Run the script
main().catch(console.error);
