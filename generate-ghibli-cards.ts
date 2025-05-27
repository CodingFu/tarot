import { spawn } from "child_process";
import fs from "fs";

function runScript(scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${scriptName}...\n`);

    const childProcess = spawn("bun", ["run", scriptName], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    childProcess.on("close", (code: number | null) => {
      if (code === 0) {
        console.log(`\n✅ ${scriptName} completed successfully!\n`);
        resolve();
      } else {
        reject(new Error(`${scriptName} failed with exit code ${code}`));
      }
    });

    childProcess.on("error", (error: Error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log("🎴 Studio Ghibli Tarot Card Generator Workflow");
  console.log("==============================================");

  try {
    // Step 1: Check if cards_1024 directory exists and has files
    const cards1024Dir = "./cards_1024";
    let needsPreparation = true;

    if (fs.existsSync(cards1024Dir)) {
      const files = fs.readdirSync(cards1024Dir);
      const imageFiles = files.filter(
        (file) =>
          file.toLowerCase().endsWith(".png") ||
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg")
      );

      if (imageFiles.length > 0) {
        console.log(
          `\n📁 Found ${imageFiles.length} prepared cards in ${cards1024Dir}`
        );
        console.log("Skipping preparation step...");
        needsPreparation = false;
      }
    }

    if (needsPreparation) {
      console.log("\n📐 Step 1: Preparing cards (resizing to 1024×1024)");
      await runScript("prepare-cards-1024.ts");
    }

    // Step 2: Generate Ghibli-style cards
    console.log("\n🎨 Step 2: Generating Studio Ghibli style cards");
    console.log("⚠️  Make sure your OPENAI_API_KEY is set!");

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "\n❌ Error: OPENAI_API_KEY environment variable is not set!"
      );
      console.log(
        "Please set it with: export OPENAI_API_KEY='your-api-key-here'"
      );
      process.exit(1);
    }

    await runScript("ghibli-cards-generator.ts");

    console.log("\n🎉 Complete! Your Studio Ghibli tarot cards are ready!");
    console.log(
      "📁 Check the ./ghibli_cards directory for your transformed cards."
    );
  } catch (error) {
    console.error("\n❌ Workflow failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
