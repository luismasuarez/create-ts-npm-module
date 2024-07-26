#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

// Define the GitHub repository URL for the template
const repoUrl = "https://github.com/luismasuarez/npm-module-template.git";

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

    // Clone the GitHub repository to the target directory
    console.log(`Cloning template from ${repoUrl} into ${targetDirectory}...`);
    execSync(`git clone ${repoUrl} ${targetDirectory}`, { stdio: "inherit" });

    // Remove the `.git` directory to avoid interfering with user's project
    const gitDirectory = path.join(targetDirectory, ".git");
    if (fs.existsSync(gitDirectory)) {
      fs.removeSync(gitDirectory);
    }

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
  console.log("Module scaffold created and package.json updated successfully!");
}

// Execute the main function
main();
