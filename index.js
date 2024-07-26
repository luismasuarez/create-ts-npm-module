#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");

// Define paths for the .npmignore file and its backup
const npmignorePath = path.join(__dirname, "template", ".npmignore");
const backupPath = path.join(__dirname, "template", "npmignore.bak");

// Restore the .npmignore file from backup if it exists
if (fs.existsSync(backupPath)) {
  fs.renameSync(backupPath, npmignorePath); // Restore the original .npmignore file
  fs.unlinkSync(backupPath); // Remove the backup file
}

// Define questions to prompt the user for module details
const questions = [
  {
    type: "input",
    name: "moduleName",
    message: "Enter the name of your npm module:",
    default: "my-npm-module",
  },
  {
    type: "input",
    name: "description",
    message: "Enter a description for your npm module:",
    default: "A new npm module",
  },
  {
    type: "input",
    name: "version",
    message: "Enter the initial version for your npm module:",
    default: "0.0.1",
  },
  {
    type: "input",
    name: "author",
    message: "Enter the author of the npm module:",
    default: "Your Name",
  },
  {
    type: "input",
    name: "license",
    message: "Enter the license for your npm module:",
    default: "MIT",
  },
];

// Function to display a welcome message
function displayWelcomeMessage() {
  console.log(`
    🎉=========================================🎉
      Welcome to the npm Module Scaffold Creator!
    🎉=========================================🎉

    🚀 Let's get your new npm module set up with a few quick details.
  `);
}

// Main function to handle module creation
async function main() {
  try {
    // Display a welcome message to the user
    displayWelcomeMessage();
    // Prompt user for module details
    const answers = await inquirer.prompt(questions);
    // Determine the target directory for the new module
    const targetDirectory = path.join(process.cwd(), answers.moduleName);

    // Directory containing the template files
    const scaffoldDirectory = path.join(__dirname, "template");

    // Copy template files to the new module directory
    await fs.copy(scaffoldDirectory, targetDirectory);
    console.log(`Module ${answers.moduleName} created successfully!`);

    // Customize the package.json file with user-provided details
    customizePackageJson(targetDirectory, answers);
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    process.exit(1);
  }
}

// Update the package.json file with module details
function customizePackageJson(targetDirectory, answers) {
  // Path to the package.json file in the new module directory
  const packageJsonPath = path.join(targetDirectory, "package.json");

  // Read and modify the package.json file
  const packageJson = require(packageJsonPath);
  packageJson.name = answers.moduleName;
  packageJson.description = answers.description;
  packageJson.version = answers.version;
  packageJson.author = answers.author;
  packageJson.license = answers.license;

  // Save the updated package.json file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Module scaffold created successfully!");
}

// Execute the main function
main();
