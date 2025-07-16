import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, '..', 'src', 'content');

// Posts that need descriptions shortened (from audit)
const postsToShorten = [
  "Astro Best Practices Audit",
  "Fixing a Broken CSS Header System",
  "Fixing Tiny Headers: Fluid Typography Debugging",
  "Example of 60 chars Master Header and other Various Headings",
  "Optimizing IBM Plex Sans for Perfect Body Typography",
  "Perfecting Code Typography with IBM Plex Mono",
  "Markdown Admonitions",
  "Optimizing Newsreader: A Deep Dive into Header Typography",
  "Baseline Grid & Semantic Tokens - Complete"
];

function findMarkdownFile(dir, title) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const found = findMarkdownFile(fullPath, title);
      if (found) return found;
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data } = matter(content);
      if (data.title === title) {
        return fullPath;
      }
    }
  }
  
  return null;
}

function truncateDescription(description, maxLength = 160) {
  if (description.length <= maxLength) return description;
  
  // Try to cut at a sentence boundary
  const sentences = description.match(/[^.!?]+[.!?]+/g) || [];
  let truncated = '';
  
  for (const sentence of sentences) {
    if ((truncated + sentence).length <= maxLength) {
      truncated += sentence;
    } else {
      break;
    }
  }
  
  // If no complete sentences fit, cut at word boundary
  if (!truncated) {
    const words = description.split(' ');
    truncated = '';
    
    for (const word of words) {
      if ((truncated + ' ' + word).trim().length <= maxLength - 3) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
    
    truncated += '...';
  }
  
  return truncated.trim();
}

function optimizeDescriptions() {
  console.log("🔧 Optimizing content descriptions...\n");
  
  const postDir = path.join(contentDir, 'post');
  let updated = 0;
  
  for (const title of postsToShorten) {
    const filePath = findMarkdownFile(postDir, title);
    
    if (filePath) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      
      if (parsed.data.description && parsed.data.description.length > 160) {
        const oldDesc = parsed.data.description;
        const newDesc = truncateDescription(oldDesc, 160);
        
        parsed.data.description = newDesc;
        
        const newContent = matter.stringify(parsed.content, parsed.data);
        fs.writeFileSync(filePath, newContent);
        
        console.log(`✅ Updated: ${title}`);
        console.log(`   Old (${oldDesc.length} chars): ${oldDesc.substring(0, 50)}...`);
        console.log(`   New (${newDesc.length} chars): ${newDesc}\n`);
        
        updated++;
      }
    } else {
      console.log(`⚠️  Could not find file for: ${title}`);
    }
  }
  
  console.log(`\n✨ Optimized ${updated} descriptions!`);
  console.log("\nNext steps:");
  console.log("1. Review the changes to ensure descriptions still make sense");
  console.log("2. For posts with short descriptions, consider expanding them to 120-160 chars");
  console.log("3. Run 'pnpm build' to verify all content passes validation");
}

optimizeDescriptions();