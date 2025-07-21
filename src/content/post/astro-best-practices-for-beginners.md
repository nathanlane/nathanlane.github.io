---
title: Astro Best Practices for Static Sites
description: >-
  Essential best practices and conventions for building performant static sites
  with Astro. A guide for newcomers to the framework.
publishDate: '2024-07-04'
tags:
  - astro
  - web development
  - static sites
  - best practices
  - tutorial
---

Building static sites with Astro? Here's a comprehensive list of best practices and conventions that will help you create fast, maintainable, and scalable projects.

## 🚀 Performance First

### 1. **Zero JS by Default**
Astro ships zero JavaScript to the browser by default. Only add client-side JS when absolutely necessary.

```astro
<!-- Static by default - no JS -->
<button>Click me</button>

<!-- Only hydrate when needed -->
<ReactComponent client:visible />
```

### 2. **Use Appropriate Hydration Directives**
- `client:load` - Hydrate immediately (use sparingly)
- `client:idle` - Hydrate when browser is idle
- `client:visible` - Hydrate when component enters viewport
- `client:media` - Hydrate at specific breakpoints
- `client:only` - Skip server rendering entirely

### 3. **Optimize Images**
Always use Astro's built-in `<Image />` component for automatic optimization:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '/images/hero.jpg';
---

<Image src={heroImage} alt="Description" />
```

## 📁 Project Structure

### 4. **Follow Astro's Conventions**
```
src/
├── components/     # Reusable components
├── layouts/        # Page layouts
├── pages/          # File-based routing
├── content/        # Content collections
├── styles/         # Global styles
└── assets/         # Images, fonts, etc.
```

### 5. **Use Content Collections**
For any content-heavy features (blog, docs, portfolio), use Content Collections:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    description: z.string(),
  }),
});
```

### 6. **Leverage File-Based Routing**
- `pages/index.astro` → `/`
- `pages/about.astro` → `/about`
- `pages/blog/[slug].astro` → `/blog/:slug`
- `pages/[...slug].astro` → Catch-all routes

## 🎨 Component Best Practices

### 7. **Prefer Astro Components**
Use `.astro` components for static content. They're lighter than framework components:

```astro
---
// Component.astro
export interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

const { title, variant = 'primary' } = Astro.props;
---

<button class={`btn btn-${variant}`}>
  {title}
</button>
```

### 8. **Extract Reusable Logic**
Keep components focused and extract shared logic:

```astro
---
// utils/formatDate.ts
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US').format(date);
}

// Component.astro
import { formatDate } from '@/utils/formatDate';
const formattedDate = formatDate(new Date());
---
```

### 9. **Use TypeScript**
Astro has excellent TypeScript support. Use it for better DX:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
---
```

## 🎯 Data Fetching

### 10. **Fetch at Build Time**
Leverage Astro's static generation by fetching data in frontmatter:

```astro
---
// This runs at build time
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<ul>
  {data.map(item => <li>{item.name}</li>)}
</ul>
```

### 11. **Use getStaticPaths for Dynamic Routes**
```astro
---
export async function getStaticPaths() {
  const posts = await getCollection('blog');

  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---
```

## 🔧 Development Workflow

### 12. **Use Path Aliases**
Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"]
    }
  }
}
```

### 13. **Enable Prefetching**
Add prefetching for near-instant page navigations:

```astro
<a href="/about" data-astro-prefetch>About</a>

<!-- Or enable globally in config -->
export default defineConfig({
  prefetch: true
});
```

### 14. **Use Environment Variables**
Keep sensitive data secure:

```astro
---
// .env
API_KEY=secret_key

// Component.astro
const apiKey = import.meta.env.API_KEY;
---
```

## 🎭 Styling Best Practices

### 15. **Scope Styles by Default**
Astro automatically scopes styles in components:

```astro
<style>
  /* Only applies to this component */
  h1 {
    color: purple;
  }
</style>
```

### 16. **Use CSS Variables for Theming**
```css
:root {
  --color-primary: #0066cc;
  --spacing-unit: 8px;
}

.button {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 2);
}
```

### 17. **Import Global Styles Once**
```astro
---
// Layout.astro
import '@/styles/global.css';
---
```

## 🛠️ Build Optimization

### 18. **Minimize Third-Party Scripts**
When you must use external scripts, load them efficiently:

```astro
<!-- Defer non-critical scripts -->
<script defer src="analytics.js"></script>

<!-- Use type="module" for modern JS -->
<script type="module" src="app.js"></script>
```

### 19. **Configure Build Output**
Optimize your build output:

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    format: 'file', // or 'directory'
  },
});
```

### 20. **Use Compression**
Enable compression in your hosting platform or use Astro's compression integration.

## 📋 Common Patterns

### 21. **Layout Composition**
```astro
---
// BaseLayout.astro
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
---

<html>
  <body>
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

### 22. **Conditional Rendering**
```astro
---
const showBanner = true;
const items = ['one', 'two', 'three'];
---

{showBanner && <div>Banner</div>}

{items.length > 0 && (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
)}
```

### 23. **Error Handling**
```astro
---
let data;
try {
  const response = await fetch('/api/data');
  data = await response.json();
} catch (error) {
  console.error('Failed to fetch data:', error);
  data = { fallback: true };
}
---
```

## ✅ Deployment Checklist

### 24. **Before Deploying**
- Run `astro check` for TypeScript errors
- Test build locally with `astro build && astro preview`
- Check all environment variables are set
- Verify meta tags and SEO elements
- Test on multiple devices/browsers
- Enable caching headers

### 25. **Choose the Right Adapter**
- Static hosting: No adapter needed (Netlify, Vercel, GitHub Pages)
- SSR: Use appropriate adapter (`@astrojs/node`, `@astrojs/vercel`)
- Hybrid: Configure `output: 'hybrid'` for mixed static/dynamic

## 🎯 Key Takeaways

1. **Ship Less JavaScript** - Use Astro components and hydrate sparingly
2. **Build-Time Over Runtime** - Fetch data during build when possible
3. **Type Everything** - Use TypeScript for better developer experience
4. **Follow Conventions** - Stick to Astro's project structure
5. **Optimize Assets** - Use built-in image optimization
6. **Think Static First** - Only add dynamic features when necessary

Remember: Astro is designed for content-focused websites. Embrace its static-first philosophy, and you'll build incredibly fast sites with great developer experience.

---

*New to Astro? Check out the [official documentation](https://docs.astro.build) and join the [Discord community](https://astro.build/chat) for help!*
