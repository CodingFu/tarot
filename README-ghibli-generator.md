# Studio Ghibli Tarot Card Generator

This script transforms your existing tarot card images into Studio Ghibli style artwork using OpenAI's DALL-E 2 API.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key with access to DALL-E 2
2. **Node.js/Bun**: This project uses Bun as the runtime

## Setup

1. Set your OpenAI API key as an environment variable:

   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

   Or create a `.env` file in the project root:

   ```
   OPENAI_API_KEY=your-api-key-here
   ```

2. Install dependencies (already done if you ran the setup):
   ```bash
   bun install
   ```

## Usage

### Option 1: Complete Workflow (Recommended)

Run the complete workflow that handles both preparation and generation:

```bash
bun run generate-ghibli-cards.ts
```

This will:

1. Resize all cards from 300×527 to 1024×1024 (centered) if not already done
2. Generate Studio Ghibli versions using OpenAI API

### Option 2: Manual Steps

If you prefer to run steps individually:

1. **Prepare cards** (resize to 1024×1024):

   ```bash
   bun run prepare-cards-1024.ts
   ```

2. **Generate Ghibli versions**:
   ```bash
   bun run ghibli-cards-generator.ts
   ```

## What it does

1. **Reads all image files** from the `./cards` directory (PNG, JPG, JPEG)
2. **Creates output directory** `./ghibli_cards` if it doesn't exist
3. **Processes each card** by sending it to OpenAI's DALL-E 2 with a Studio Ghibli style prompt
4. **Saves the results** as `ghibli-[original-filename]` in the output directory
5. **Includes rate limiting** (1 second delay between requests) to avoid API limits

## Expected Output

- All transformed cards will be saved in the `./ghibli_cards` directory
- Files will be named with the `ghibli-` prefix (e.g., `ghibli-00-TheFool.png`)
- Images will be 1024x1024 pixels in PNG format

## Notes

- **Cost**: Each image transformation costs credits according to OpenAI's DALL-E 2 pricing
- **Time**: With 70+ cards and rate limiting, expect the process to take 1-2 minutes
- **Quality**: The script maintains the symbolic elements while applying Ghibli's aesthetic
- **Error handling**: Failed transformations are logged but don't stop the entire process

## Troubleshooting

- **API Key Issues**: Make sure your OpenAI API key is correctly set and has DALL-E 2 access
- **Rate Limiting**: If you hit rate limits, the script includes delays, but you may need to increase them
- **File Permissions**: Ensure the script has write permissions for creating the output directory

Enjoy your Studio Ghibli style tarot deck! 🎴✨
