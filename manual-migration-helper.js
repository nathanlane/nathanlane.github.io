#!/usr/bin/env node

/**
 * Manual Migration Helper - Lists Jekyll posts for manual migration
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const JEKYLL_POSTS_DIR = '/Users/nathanlane/code/nathanlane_github_io_archive/_posts';
const ASTRO_CONTENT_DIR = '/Users/nathanlane/code/nathanlane.github.io/src/content/post';

console.log('Jekyll to Astro Migration Helper\n');
console.log('================================\n');

// Check if directories exist
if (!fs.existsSync(JEKYLL_POSTS_DIR)) {
  console.error(`❌ Jekyll posts directory not found: ${JEKYLL_POSTS_DIR}`);
  process.exit(1);
}

if (!fs.existsSync(ASTRO_CONTENT_DIR)) {
  console.error(`❌ Astro content directory not found: ${ASTRO_CONTENT_DIR}`);
  process.exit(1);
}

// Get all Jekyll posts
const files = fs.readdirSync(JEKYLL_POSTS_DIR)
  .filter(file => file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.markdown'))
  .sort();

console.log(`Found ${files.length} Jekyll posts to migrate:\n`);

// Already migrated posts
const migratedPosts = [
  'industrial-policy-a-round-up-of-historical-case-studies-and-beyond.md',
  'tutorial-r-code-style-for-empirical-economists.md',
  'saying-the-quiet-part.md'
];

console.log('✅ Already migrated:');
migratedPosts.forEach(post => console.log(`   - ${post}`));
console.log('');

// Group posts by year
const postsByYear = {};
files.forEach(file => {
  const year = file.substring(0, 4);
  if (!postsByYear[year]) postsByYear[year] = [];
  postsByYear[year].push(file);
});

// Display posts by year
Object.keys(postsByYear).sort().reverse().forEach(year => {
  console.log(`\n📅 ${year} (${postsByYear[year].length} posts):`);
  console.log('━'.repeat(40));
  
  postsByYear[year].forEach(file => {
    try {
      const filePath = path.join(JEKYLL_POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter } = matter(fileContent);
      
      const title = frontmatter.title || 'Untitled';
      const categories = Array.isArray(frontmatter.categories) 
        ? frontmatter.categories.join(', ') 
        : frontmatter.categories || 'none';
      
      console.log(`📄 ${file}`);
      console.log(`   Title: ${title}`);
      console.log(`   Categories: ${categories}`);
      console.log('');
    } catch (error) {
      console.log(`📄 ${file} - Error reading: ${error.message}`);
    }
  });
});

console.log('\n\n💡 To migrate more posts:');
console.log('1. The migration script is ready at: migrate-jekyll-archive.js');
console.log('2. Run: node migrate-jekyll-archive.js');
console.log('3. Or manually copy and convert posts as needed\n');

// Check for existing images directory
const imagesDirs = [
  '/Users/nathanlane/code/nathanlane_github_io_archive/uploads',
  '/Users/nathanlane/code/nathanlane_github_io_archive/assets'
];

console.log('📸 Image directories to migrate:');
imagesDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f));
    console.log(`   ✓ ${dir} (${imageFiles.length} images)`);
  } else {
    console.log(`   ✗ ${dir} (not found)`);
  }
});