const fs = require("fs");
const path = require("path");

function addNamespaceToMethods(dirPath) {
  // Get all files and directories in the current directory
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively call the function on subdirectories
      addNamespaceToMethods(filePath);
    } else {
      // Check if the file is a JavaScript file
      if (path.extname(file) === ".js") {
        // Read the file contents
        const content = fs.readFileSync(filePath, "utf8");

        // Add the namespace comment at the beginning of the file
        const updatedContent = `/**
 * @namespace kowloon
 */
${content}`;

        // Write the updated content back to the file
        fs.writeFileSync(filePath, updatedContent, "utf8");
      }
    }
  });
}

// Call the function with the methods directory path
addNamespaceToMethods("./methods");
