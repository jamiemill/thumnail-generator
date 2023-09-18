const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { promisify } = require("util");

// Input and output directories
const inputDirectory = "./files";
const outputDirectory = "./thumbnails";

// Promisify sharp's toFile method
const sharpToFile = promisify(sharp().toFile);

// Function to recursively generate thumbnails
async function generateThumbnails(inputPath, outputPath) {
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Read the contents of the input directory
  const files = fs.readdirSync(inputPath);

  for (const file of files) {
    // Ignore files and directories starting with a dot
    if (file.startsWith(".")) {
      continue;
    }

    const inputFilePath = path.join(inputPath, file);
    const outputFilePath = path.join(outputPath, file);

    if (fs.statSync(inputFilePath).isDirectory()) {
      // If it's a directory, recursively process its contents
      await generateThumbnails(inputFilePath, outputFilePath);
    } else {
      // If it's a file, generate a thumbnail
      await generateThumbnail(inputFilePath, outputFilePath);
    }
  }
}

// Function to generate a thumbnail
async function generateThumbnail(inputFilePath, outputFilePath) {
  // You can customize thumbnail settings here
  try {
    await sharp(inputFilePath)
      .resize(200, 200) // Adjust the size as needed
      .toFile(outputFilePath);
    console.log(`Generated thumbnail: ${outputFilePath}`);
  } catch (err) {
    console.error(`Error processing ${inputFilePath}: ${err}`);
  }
}

// Start generating thumbnails
generateThumbnails(inputDirectory, outputDirectory)
  .then(() => {
    console.log("All thumbnails generated successfully.");
  })
  .catch((err) => {
    console.error("Error generating thumbnails:", err);
  });
