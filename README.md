<h1 align="center">
  Lane Website
</h1>

A typography-focused personal website built with Astro. This project emphasizes excellent typography and readability while maintaining modern blog functionality.

### Typography System Features

- **Fluid Typography**: Responsive type scale using `tailwindcss-fluid-type` plugin
- **Professional Font Stack**: 
  - Newsreader (serif) for headings with variable weights
  - IBM Plex Sans for body text
  - IBM Plex Mono for code blocks
- **6px Baseline Grid**: All spacing aligned to 6px increments for perfect vertical rhythm
- **Optimized Reading Experience**:
  - Reduced base font size (15-17px) for better readability
  - Refined header weight progression (375-625) with enhanced optical sizing
  - Semantic spacing tokens aligned to typography scale
  - Clean, minimal blog layouts without sticky elements
- **Enhanced Components**: Button, Badge, and link components with refined typography
- **Media Section**: Dedicated section for interviews, podcasts, and press coverage

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [📚 Documentation](#-documentation)
- [Key Features](#key-features)
- [Demo](#demo)
- [Quick start](#quick-start)
- [Commands](#commands)
- [Development Workflow](#development-workflow)
  - [Getting Started](#getting-started)
  - [Development Process](#development-process)
  - [Git Workflow](#git-workflow)
  - [Testing Your Changes](#testing-your-changes)
  - [Key Files for Typography Work](#key-files-for-typography-work)
  - [Private Notes for Personal Documentation](#private-notes-for-personal-documentation)
- [Configure](#configure)
- [Updating](#updating)
- [Adding posts and notes](#adding-posts-and-notes)
  - [Private Notes (Personal Documentation)](#private-notes-personal-documentation)
  - [Post Frontmatter](#post-frontmatter)
  - [Note Frontmatter](#note-frontmatter)
  - [Frontmatter snippet](#frontmatter-snippet)
- [Analytics](#analytics)
- [Deploy](#deploy)
- [Acknowledgment](#acknowledgment)
- [License](#license)

## 📚 Documentation

- **[Webmaster Guide](WEBMASTER_GUIDE.md)** - Complete guide for managing and deploying the site (also available at `/series/lane-docs/webmaster-guide/`)
- **[Claude.md](CLAUDE.md)** - AI assistant instructions and project context
- **[Changelog](Changelog.md)** - Detailed record of all changes and improvements

## Key Features

- Astro v5 Fast 🚀
- TailwindCSS Utility classes with fluid typography plugin
- Accessible, semantic HTML markup
- Responsive & SEO-friendly
- Dark / Light mode, using Tailwind and CSS variables
- Multiple content types:
  - Blog posts & notes (MD/MDX with admonitions)
  - Research papers and academic content
  - Projects portfolio
  - Creative writing section
  - Media appearances and interviews
- [Satori](https://github.com/vercel/satori) for creating open graph png images
- [Automatic RSS feed](https://docs.astro.build/en/guides/rss)
- [Webmentions](https://webmention.io/)
- Auto-generated:
  - [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
  - [robots.txt](https://github.com/alextim/astro-lib/blob/main/packages/astro-robots-txt/README.md)
  - [web app manifest](https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md)
- [Astro Icon](https://github.com/natemoo-re/astro-icon) svg icon component
- [Rehype Pretty Code](https://rehype-pretty.pages.dev/) code blocks with rose-pine themes

## Demo

Check out the live site at [nathanlane.com](https://nathanlane.com/)

## Quick start

Clone this repository to get started.

```bash
# Clone the repository
git clone https://github.com/nathanlane/nathanlane.github.io.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Commands

Replace npm with your choice of npm / yarn / pnpm

| Command          | Action                                                         |
| :--------------- | :------------------------------------------------------------- |
| `npm install`    | Installs dependencies                                          |
| `npm run dev`    | Starts local dev server at `localhost:4321`                   |
| `npm run build`  | Build your production site to `./dist/`                       |
| `npm run preview` | Preview your build locally, before deploying                 |
| `npm run check`  | TypeScript type checking                                       |
| `npm run lint`   | Run Biome linting                                             |
| `npm run format:code` | Format code with Biome and Prettier                      |

## Development Workflow

### Getting Started
1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd nathanlane.github.io
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   
3. **Open in browser:**
   - **Local**: `http://localhost:4321/`
   - **Network**: `http://192.168.1.103:4321/` (for mobile testing)

### Development Process
- **Live reload**: Changes automatically refresh the browser
- **Typography focus**: This project emphasizes typography and readability
- **Hot module replacement**: Instant updates without losing state
- **Error reporting**: Build errors appear in the terminal

### Git Workflow
- **Main branch**: `main` - Production-ready code
- **Feature branch**: `feat/typography-enhancement` - Active development
- **Workflow**:
  ```bash
  git checkout feat/typography-enhancement  # Switch to dev branch
  # Make your changes
  git add .
  git commit -m "Your descriptive commit message"
  ```

### Testing Your Changes
1. **Development**: `npm run dev` for live development
2. **Production test**: `npm run build && npm run preview`
3. **Type checking**: `npm run check`
4. **Code quality**: `npm run lint`

### Key Files for Typography Work
- `src/styles/global.css` - Base typography styles and CSS variables
- `src/layouts/BlogPost.astro` - Reading experience optimization
- `tailwind.config.ts` - Fluid typography plugin and spacing configuration
- `src/components/Button.astro` - Enhanced button typography
- `src/components/Badge.astro` - Tag and badge styling
- `src/components/ContactBox.astro` - Navigation hub component
- `context/` - Typography reference materials from leading experts
- `CLAUDE.md` - Development guidance for AI assistants

### Private Notes for Personal Documentation
- `src/content/private-note/` - Personal markdown files (never web-accessible)
- Use for project notes, ideas, development documentation
- Full markdown/MDX support with frontmatter
- Version controlled but completely excluded from website builds

## Configure

- Edit the config file `src/site.config.ts` for basic site meta data and navigation links
- Update file `astro.config.ts`
  - **Important**: the site property with your own domain.
  - [astro-webmanifest options](https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md)
- Replace & update files within the `/public` folder:
  - icon.svg - used as the source to create favicons & manifest icons
  - social-card.png - used as the default og:image
- Modify file `src/styles/global.css` with your own light and dark styles.
  - You can also modify the theme(s) for markdown code blocks generated by [Rehype Pretty Code](https://rehype-pretty.pages.dev/). Astro Citrus has both a dark (rose-pine) and light (rose-pine-dawn) theme, which can be found in `src/site.config.ts`. You can find more theme(s) and options [here](https://shiki.matsu.io/).
- Edit social links in `src/site.config.ts` to add/replace your media profiles. Icons can be found @ [icones.js.org](https://icones.js.org/), per [Astro Icon's instructions](https://www.astroicon.dev/guides/customization/#find-an-icon-set).
- Add/edit media appearances in `src/data/media.ts` for interviews, podcasts, and press coverage
- Create/edit content within these directories:
  - `src/content/post/` & `src/content/note/` - Blog posts and notes
  - `src/content/research/` - Academic papers and research
  - `src/content/projects/` - Project documentation
  - `src/content/writing/` - Creative writing
  - Read [this post](http://astrocitrus.artemkutsan.pp.ua/posts/webmentions/) for adding webmentions to your site.
- OG Image:
  - If you would like to change the style of the generated image the Satori library creates, open up `src/pages/og-image/[slug].png.ts` to the markup function where you can edit the html/tailwind-classes as necessary. You can use this [playground](https://og-playground.vercel.app/) to aid your design.
  - You can also create your own og images and skip satori generating it for you by adding an ogImage property in the frontmatter with a link to the asset, an example can be found in `src/content/post/social-image.md`. More info on frontmatter can be found [here](#frontmatter)
- Optional:
  - Fonts: The theme uses Newsreader (serif) for headings and IBM Plex Sans for body text. You can change fonts in `src/styles/fonts.css` and update the font-family references in `tailwind.config.ts`.

## Updating

If you've forked the template, you can [sync the fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) with your own project, remembering to **not** click Discard Changes as you will lose your own.

If you have a template repository, you can add this template as a remote, as discussed [here](https://stackoverflow.com/questions/56577184/github-pull-changes-from-a-template-repository).

## Adding posts and notes

This theme utilises [Content Collections](https://docs.astro.build/en/guides/content-collections/) to organise local Markdown and MDX files, as well as type-checking frontmatter with a schema -> `src/content/config.ts`.

Adding a post/note is as simple as adding your .md(x) files to the `src/content/post` and/or `src/content/note` folder, the filename of which will be used as the slug/url. The posts included with this template are there as an example of how to structure your frontmatter. Additionally, the [Astro docs](https://docs.astro.build/en/guides/markdown-content/) has a detailed section on markdown pages.

### Private Notes (Personal Documentation)

For personal documentation that should never appear on the website, you can create files in `src/content/private-note/`:

- **Never web-accessible**: Private notes are completely excluded from all website builds
- **Personal use**: Perfect for project notes, ideas, development logs, meeting notes
- **Full markdown support**: Uses the same frontmatter schema as regular notes
- **Version controlled**: Stored in your git repository but never published
- **Organized**: Use tags, dates, and subdirectories to organize your private notes

**Example private note frontmatter:**
```yaml
---
title: "My Development Notes"
description: "Personal notes about the project"
publishDate: "2024-01-01T12:00:00Z"
tags: ["development", "personal", "ideas"]
---
```

**Security note**: While private notes are not web-accessible, they are part of your git repository. Avoid storing sensitive information like passwords or API keys.

### Post Frontmatter

| Property (\* required) | Description |
|------------------------|-------------|
| **title \***          | Self-explanatory. Used as the text link to the post, the h1 on the post's page, and the page's title property. Has a max length of 60 chars, set in `src/content/config.ts`. |
| **description \***    | Similar to above, used as the SEO description property. Has a min length of 50 and a max length of 160 chars, set in the post schema. |
| **publishDate \***    | Again, pretty simple. To change the date format/locale, currently **en-GB**, update the date option in `src/site.config.ts`. Note you can also pass additional options to the `<FormattedDate>` component if required. |
| **updatedDate**       | This is an optional date representing when a post has been updated, in the same format as the `publishDate`. |
| **seriesId**          | An optional property that groups posts into a series. Posts with the same `seriesId` are considered part of the same series and can be displayed together in order. This allows for better organization of related content. |
| **orderInSeries**     | A numeric value defining the position of a post within a series. Lower values indicate earlier posts in the series, while higher values appear later. Used for sorting and navigation between posts within the same series. |
| **tags**             | Tags are optional with any created post. Any new tag(s) will be shown in `yourdomain.com/posts` & `yourdomain.com/tags`, and generate the page(s) `yourdomain.com/tags/[yourTag]`. |
| **coverImage**       | This is an optional object that will add a cover image to the top of a post. Include both `src`: "_path-to-image_" and `alt`: "_image alt_". You can view an example in `src/content/post/cover-image.md`. |
| **ogImage**          | This is an optional property. An OG Image will be generated automatically for every post where this property **isn't** provided. If you would like to create your own for a specific post, include this property and a link to your image, the theme will then skip automatically generating one. |
| **draft**            | This is an optional property as it is set to `false` by default in the schema. By setting it to `true`, the post will be filtered out of the production build in a number of places, including `getAllPosts()` calls, OG images, RSS feeds, and generated page[s]. You can view an example in `src/content/post/draft-post.md`. |


### Note Frontmatter

| Property (\* required) | Description                                        |
| ---------------------- | -------------------------------------------------- |
| title \*               | string, max length 60 chars.                       |
| description            | to be used for the head meta description property. |
| publishDate \*         | ISO 8601 format with offsets allowed.              |

### Frontmatter snippet

Astro Citrus includes a helpful VSCode snippet which creates a frontmatter 'stub' for posts and note's, found here -> `.vscode/post.code-snippets`. Start typing the word `frontmatter` on your newly created .md(x) file to trigger it. Visual Studio Code snippets appear in IntelliSense via (⌃Space) on mac, (Ctrl+Space) on windows.


## Analytics

You may want to track the number of visitors you receive to your blog/website in order to understand trends and popular posts/pages you've created. There are a number of providers out there one could use, including web hosts such as [vercel](https://vercel.com/analytics), [netlify](https://www.netlify.com/products/analytics/), and [cloudflare](https://www.cloudflare.com/web-analytics/).

This theme/template doesn't include a specific solution due to there being a number of use cases and/or options which some people may or may not use.

You may be asked to included a snippet inside the **HEAD** tag of your website when setting it up, which can be found in `src/layouts/Base.astro`. Alternatively, you can add the snippet in `src/components/BaseHead.astro`.

## Deploy

[Astro docs](https://docs.astro.build/en/guides/deploy/) has a great section and breakdown of how to deploy your own Astro site on various platforms and their idiosyncrasies.

By default the site will be built (see [Commands](#commands) section above) to a `/dist` directory.

## Acknowledgment

**This theme was inspired by [Astro Theme Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by [Chriss Williams](https://github.com/chrismwilliams). Huge thanks to Chriss for his amazing work and inspiration!** 🚀👏

## License

MIT
