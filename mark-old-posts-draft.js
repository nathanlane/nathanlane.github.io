#!/usr/bin/env node

/**
 * Mark Old Posts as Draft
 * Marks posts older than a specified year as drafts
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = '/Users/nathanlane/code/nathanlane.github.io/src/content/post';
const CUTOFF_YEAR = 2017; // Posts before this year will be marked as draft

console.log(`Marking posts before ${CUTOFF_YEAR} as drafts...\n`);

// Get all markdown files
const files = fs.readdirSync(CONTENT_DIR)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

let updatedCount = 0;
let skippedCount = 0;

files.forEach(file => {
  const filePath = path.join(CONTENT_DIR, file);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Check if post has a date
    if (frontmatter.publishDate || frontmatter.date) {
      const postDate = new Date(frontmatter.publishDate || frontmatter.date);
      const postYear = postDate.getFullYear();
      
      if (postYear < CUTOFF_YEAR && !frontmatter.draft) {
        // Mark as draft
        frontmatter.draft = true;
        
        // Write back
        const newContent = matter.stringify(content, frontmatter);
        fs.writeFileSync(filePath, newContent);
        
        console.log(`✅ Marked as draft: ${file} (${postYear})`);
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log(`\n✨ Done!`);
console.log(`   Updated: ${updatedCount} posts`);
console.log(`   Skipped: ${skippedCount} posts`);