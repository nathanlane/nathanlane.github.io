const fs = require('fs');
const path = require('path');

const JEKYLL_POSTS_DIR = '/Users/nathanlane/code/nathanlane_github_io_archive/_posts';

console.log('Testing Jekyll archive access...');
console.log('Jekyll posts directory:', JEKYLL_POSTS_DIR);

try {
  const files = fs.readdirSync(JEKYLL_POSTS_DIR);
  console.log(`Found ${files.length} files in Jekyll archive`);
  console.log('First 5 files:', files.slice(0, 5));
} catch (error) {
  console.error('Error accessing Jekyll archive:', error.message);
}