import { getCollection } from "astro:content";

/**
 * Audit content for SEO best practices
 */
export async function runSEOAudit() {
  console.log("🔍 Running SEO Audit...\n");
  
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Audit posts
  const posts = await getCollection("post");
  console.log(`📝 Checking ${posts.length} posts...`);
  
  posts.forEach(post => {
    const { title, description, slug } = post.data;
    
    // Title checks
    if (title.length > 60) {
      warnings.push(`Post "${title}" has title longer than 60 chars (${title.length})`);
    }
    
    // Description checks
    if (description.length < 120) {
      warnings.push(`Post "${title}" has short description (${description.length} chars) - aim for 120-160`);
    }
    if (description.length > 160) {
      issues.push(`Post "${title}" has description over 160 chars (${description.length}) - bad for SEO`);
    }
    
    // Slug checks
    if (slug !== post.id && slug.length > 50) {
      warnings.push(`Post "${title}" has long slug (${slug.length} chars)`);
    }
  });
  
  // Audit research
  const research = await getCollection("research");
  console.log(`🔬 Checking ${research.length} research items...`);
  
  research.forEach(item => {
    const { title, description } = item.data;
    
    if (description.length > 300) {
      warnings.push(`Research "${title}" has very long description (${description.length} chars)`);
    }
  });
  
  // Audit projects
  const projects = await getCollection("projects");
  console.log(`🚀 Checking ${projects.length} projects...`);
  
  projects.forEach(project => {
    const { title, description } = project.data;
    
    if (description.length < 120) {
      warnings.push(`Project "${title}" has short description (${description.length} chars)`);
    }
  });
  
  // Report results
  console.log("\n📊 SEO Audit Results:");
  console.log("===================");
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log("✅ All content passes SEO checks!");
  } else {
    if (issues.length > 0) {
      console.log(`\n❌ Issues (${issues.length}):`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${warnings.length}):`);
      warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    console.log("\n💡 Recommendations:");
    console.log("   - Keep titles under 60 characters");
    console.log("   - Aim for descriptions between 120-160 characters");
    console.log("   - Use descriptive but concise slugs");
  }
}

