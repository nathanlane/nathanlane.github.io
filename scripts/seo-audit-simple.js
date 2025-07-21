import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(__dirname, "..", "src", "content");

function getMarkdownFiles(dir) {
	const files = [];
	const items = fs.readdirSync(dir);

	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			files.push(...getMarkdownFiles(fullPath));
		} else if (item.endsWith(".md") || item.endsWith(".mdx")) {
			files.push(fullPath);
		}
	}

	return files;
}

function runAudit() {
	console.log("🔍 Running SEO Audit...\n");

	const issues = [];
	const warnings = [];

	// Check posts
	const postDir = path.join(contentDir, "post");
	const postFiles = getMarkdownFiles(postDir);
	console.log(`📝 Checking ${postFiles.length} posts...`);

	postFiles.forEach((file) => {
		const content = fs.readFileSync(file, "utf-8");
		const { data } = matter(content);

		if (!data.draft) {
			// Title checks
			if (data.title && data.title.length > 60) {
				warnings.push(`Post "${data.title}" has title longer than 60 chars (${data.title.length})`);
			}

			// Description checks
			if (!data.description) {
				issues.push(`Post "${data.title}" is missing description`);
			} else {
				if (data.description.length < 120) {
					warnings.push(
						`Post "${data.title}" has short description (${data.description.length} chars) - aim for 120-160`,
					);
				}
				if (data.description.length > 160) {
					issues.push(
						`Post "${data.title}" has description over 160 chars (${data.description.length}) - bad for SEO`,
					);
				}
			}
		}
	});

	// Check research
	const researchDir = path.join(contentDir, "research");
	if (fs.existsSync(researchDir)) {
		const researchFiles = getMarkdownFiles(researchDir);
		console.log(`🔬 Checking ${researchFiles.length} research items...`);

		researchFiles.forEach((file) => {
			const content = fs.readFileSync(file, "utf-8");
			const { data } = matter(content);

			if (data.description && data.description.length > 300) {
				warnings.push(
					`Research "${data.title}" has very long description (${data.description.length} chars)`,
				);
			}
		});
	}

	// Check projects
	const projectsDir = path.join(contentDir, "projects");
	if (fs.existsSync(projectsDir)) {
		const projectFiles = getMarkdownFiles(projectsDir);
		console.log(`🚀 Checking ${projectFiles.length} projects...`);

		projectFiles.forEach((file) => {
			const content = fs.readFileSync(file, "utf-8");
			const { data } = matter(content);

			if (data.description && data.description.length < 120) {
				warnings.push(
					`Project "${data.title}" has short description (${data.description.length} chars)`,
				);
			}
		});
	}

	// Report results
	console.log("\n📊 SEO Audit Results:");
	console.log("===================");

	if (issues.length === 0 && warnings.length === 0) {
		console.log("✅ All content passes SEO checks!");
	} else {
		if (issues.length > 0) {
			console.log(`\n❌ Issues (${issues.length}):`);
			issues.forEach((issue) => console.log(`   - ${issue}`));
		}

		if (warnings.length > 0) {
			console.log(`\n⚠️  Warnings (${warnings.length}):`);
			warnings.forEach((warning) => console.log(`   - ${warning}`));
		}

		console.log("\n💡 Recommendations:");
		console.log("   - Keep titles under 60 characters");
		console.log("   - Aim for descriptions between 120-160 characters");
		console.log("   - Use descriptive but concise slugs");
	}
}

runAudit();
