const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "src/content/post");

console.log("🔍 Finding content issues...\n");

const files = fs
	.readdirSync(CONTENT_DIR)
	.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

const issues = {
	longTitles: [],
	shortDescriptions: [],
	longDescriptions: [],
	missingDescriptions: [],
	htmlInDescription: [],
};

files.forEach((file) => {
	try {
		const filePath = path.join(CONTENT_DIR, file);
		const content = fs.readFileSync(filePath, "utf-8");
		const { data } = matter(content);

		// Check title length
		if (data.title && data.title.length > 60) {
			issues.longTitles.push({
				file,
				title: data.title,
				length: data.title.length,
			});
		}

		// Check description
		if (!data.description) {
			issues.missingDescriptions.push(file);
		} else {
			if (data.description.length < 20) {
				issues.shortDescriptions.push({
					file,
					desc: data.description,
					length: data.description.length,
				});
			}
			if (data.description.length > 300) {
				issues.longDescriptions.push({
					file,
					desc: `${data.description.substring(0, 50)}...`,
					length: data.description.length,
				});
			}
			if (data.description.includes("<") || data.description.includes(">")) {
				issues.htmlInDescription.push({
					file,
					desc: `${data.description.substring(0, 50)}...`,
				});
			}
		}
	} catch (error) {
		console.error(`Error reading ${file}: ${error.message}`);
	}
});

// Report issues
if (issues.longTitles.length > 0) {
	console.log("❌ Posts with titles > 60 characters:");
	issues.longTitles.forEach(({ file, title, length }) => {
		console.log(`   ${file} (${length} chars)`);
		console.log(`   "${title}"`);
		console.log("");
	});
}

if (issues.shortDescriptions.length > 0) {
	console.log("\n⚠️  Posts with descriptions < 20 characters:");
	issues.shortDescriptions.forEach(({ file, length }) => {
		console.log(`   ${file} (${length} chars)`);
	});
}

if (issues.longDescriptions.length > 0) {
	console.log("\n⚠️  Posts with descriptions > 300 characters:");
	issues.longDescriptions.forEach(({ file, length }) => {
		console.log(`   ${file} (${length} chars)`);
	});
}

if (issues.htmlInDescription.length > 0) {
	console.log("\n⚠️  Posts with HTML in description:");
	issues.htmlInDescription.forEach(({ file }) => {
		console.log(`   ${file}`);
	});
}

const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
console.log(`\n📊 Total issues found: ${totalIssues}`);

// Save issues to file for reference
fs.writeFileSync("content-issues.json", JSON.stringify(issues, null, 2));
console.log("\n💾 Detailed issues saved to content-issues.json");
