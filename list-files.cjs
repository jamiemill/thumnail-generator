const fs = require("fs");
const path = require("path");

// Function to recursively gather files and generate HTML
async function generateHTML(rootDir, outputHtmlPath) {
  const fileTree = await gatherFiles(rootDir);

  const html = generateHTMLFromFiles(fileTree, rootDir);
  fs.writeFileSync(outputHtmlPath, html);
  console.log(`HTML file generated at ${outputHtmlPath}`);
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

// Function to generate HTML from the file tree
function generateHTMLFromFiles(fileTree, rootDir) {
  let html = "<html><body style='font-size:6pt;'>";

  function processFiles(files, currentPath) {
    for (const item of files) {
      if (item.directory) {
        html += `<h1>${currentPath}/${item.directory}</h1>`;
        html += "<div style='display: flex; flex-wrap:wrap;'>";
        processFiles(item.files, `${currentPath}/${item.directory}`);
        html += "</div>";
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
          const imagePath = path.join(rootDir, currentPath, item.file);

          html += `<div style="margin-bottom: 3em; margin-right: 1em;">`;
          html += `<p>${item.file}</p>`;
          html += `<img src="${imagePath}" alt="${item.file}" width="100" />`;
          html += `</div>`;
        }
      }
    }
  }

  processFiles(fileTree, "");

  html += "</body></html>";
  return html;
}

// Usage: Call generateHTML with your root directory and output HTML path
generateHTML("./files", "output.html");
