const fs = require("fs");
const path = require("path");

// Function to recursively gather files and generate HTML
async function generateCSV(rootDir, outputCsvPath) {
  const fileTree = await gatherFiles(rootDir);

  const csv = generateCsvFromFiles(fileTree, rootDir);
  fs.writeFileSync(outputCsvPath, csv);
  console.log(`CSV file generated at ${outputCsvPath}`);
}

// Function to gather files recursively
async function gatherFiles(dir) {
  const files = [];
  const subdirs = await fs.promises.readdir(dir);

  for (const subdir of subdirs) {
    const fullPath = path.join(dir, subdir);
    const isDir = (await fs.promises.stat(fullPath)).isDirectory();

    if (isDir) {
      const nestedFiles = await gatherFiles(fullPath);
      files.push({ directory: subdir, files: nestedFiles });
    } else if (!subdir.startsWith(".")) {
      files.push({ file: subdir });
    }
  }

  return files;
}

function generateCsvFromFiles(fileTree, rootDir) {
  let csv = "";

  function processFiles(files, currentPath) {
    for (const item of files) {
      if (item.directory) {
        // html += `<h1>${currentPath}/${item.directory}</h1>`;
        // html += "<div style='display: flex; flex-wrap:wrap;'>";
        processFiles(item.files, `${currentPath}/${item.directory}`);
        // html += "</div>";
      } else {
        // Check if the file is an image (you can customize the file extensions)
        const imageExtensions = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".tiff",
          ".tif",
        ];
        const ext = path.extname(item.file).toLowerCase();

        if (imageExtensions.includes(ext)) {
          const imagePath = path.join(currentPath, item.file);
          csv += `${currentPath}\t`;
          csv += `${item.file}\t`;
          csv += `${imagePath}\n`;
        }
      }
    }
  }

  processFiles(fileTree, "");

  return csv;
}

generateCSV("./thumbnails", "output.csv");
