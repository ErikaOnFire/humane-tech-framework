# Humane Tech Linter

A CLI tool to scan codebases for dark patterns and other anti-patterns that undermine humane technology. This tool helps developers identify and remove manipulative or harmful UX practices from their products.

## Features
- Scans JavaScript, HTML, and other text files for 50+ dark patterns
- Reports file, line, and pattern detected
- Easy to extend with new rules
- Includes a web viewer for non-technical users
- **NEW:** Scan any public GitHub repository by just pasting its URL!

## How to Use

### 1. Prerequisites
- You need [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your computer.
- You do **not** need to be a developer to use the web viewer, but you do need Node.js and Git to run the linter.

### 2. Scan a Local Folder
- Open a terminal and navigate to the `humane-linter` directory.
- Run the linter on your codebase:
  ```sh
  node index.js <path-to-scan>
  ```
  - Example: `node index.js ../my-project`
- The linter will print results to the console and write a report to `humane-linter-report.json` in the current directory.

### 3. Scan a GitHub Repository (Easiest Way!)
- Copy the URL of any **public** GitHub repository (for example: `https://github.com/ErikaOnFire/humane-tech-framework`).
- In your terminal, run:
  ```sh
  node index.js --github <github-repo-url>
  ```
  - Example: `node index.js --github https://github.com/ErikaOnFire/humane-tech-framework`
- The linter will:
  1. Download the code from GitHub (no need to install or clone anything yourself!)
  2. Scan it for dark patterns
  3. Print results to the console
  4. Save a report as `humane-linter-report.json` in your current folder
  5. Clean up after itself automatically

### 4. View Results in the Web Viewer
- Open `web-viewer/index.html` in your web browser (no server or build step needed).
- Click the file input and select your `humane-linter-report.json` file.
- The results will be displayed in a user-friendly format.

## Dark Patterns Detected
- Hidden costs
- Forced continuity
- Roach motel
- Privacy Zuckering
- Bait and switch
- Confirmshaming
- Disguised ads
- Misdirection
- Scarcity/urgency manipulation
- Trick questions
- Preselected options
- Friend spam
- Fake social proof
- Obscured unsubscribe
- ...and many more

## Contributing
Add new rules in `rules/dark-patterns.js` and submit a pull request!
