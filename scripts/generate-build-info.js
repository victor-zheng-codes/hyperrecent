// scripts/generate-build-info.js
const fs = require('fs');
const execSync = require('child_process').execSync;

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.info('Git command failed, commit hash unavailable');
    return 'unknown'; // Return a default value if git is not available
  }
}

// Get commit hash
const commitHash = getGitCommitHash()

// Get build time
const buildTime = new Date().toISOString();

// Generate build info file
const buildInfo = {
  commitHash,
  buildTime,
};

fs.writeFileSync('./public/build-info.json', JSON.stringify(buildInfo, null, 2));

console.log('Build info generated:', buildInfo);
