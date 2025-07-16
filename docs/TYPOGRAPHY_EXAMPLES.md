# Typography Component Examples

Practical before/after examples showing how to implement the semantic typography system across different components and contexts.

## Table of Contents

1. [Blog Post Layout](#blog-post-layout)
2. [Card Components](#card-components)
3. [Navigation Elements](#navigation-elements)
4. [Hero Sections](#hero-sections)
5. [Form Components](#form-components)
6. [List Layouts](#list-layouts)
7. [Modal Dialogs](#modal-dialogs)
8. [Footer Sections](#footer-sections)

---

## Blog Post Layout

### Before: Size-based Classes

```html
<article class="max-w-prose mx-auto">
  <header class="mb-8">
    <p class="text-sm text-gray-500 uppercase tracking-wide">
      Published January 15, 2024 • 5 min read
    </p>
    <h1 class="text-4xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
      Typography in Modern Web Design
    </h1>
    <p class="text-xl text-gray-700 leading-relaxed">
      An exploration of fluid typography systems and their impact on reading experience across devices.
    </p>
  </header>
  
  <div class="prose prose-lg">
    <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
      The Foundation of Good Typography
    </h2>
    <p class="text-base text-gray-800 leading-relaxed mb-4">
      Typography is the cornerstone of effective communication in web design...
    </p>
    
    <h3 class="text-xl font-medium text-gray-900 mt-6 mb-3">
      Fluid Type Scales
    </h3>
    <p class="text-base text-gray-800 leading-relaxed mb-4">
      Modern responsive design requires typography that adapts seamlessly...
    </p>
  </div>
</article>
```

### After: Semantic Classes

```html
<article class="measure-base mx-auto">
  <header class="mb-8b">
    <p class="text-meta">
      Published January 15, 2024 • 5 min read
    </p>
    <h1 class="heading-1">
      Typography in Modern Web Design
    </h1>
    <p class="text-lead">
      An exploration of fluid typography systems and their impact on reading experience across devices.
    </p>
  </header>
  
  <div class="content-spacing">
    <h2 class="heading-2">
      The Foundation of Good Typography
    </h2>
    <p class="text-body">
      Typography is the cornerstone of effective communication in web design...
    </p>
    
    <h3 class="heading-3">
      Fluid Type Scales
    </h3>
    <p class="text-body">
      Modern responsive design requires typography that adapts seamlessly...
    </p>
  </div>
</article>
```

**Benefits of the semantic approach:**
- Automatic spacing with baseline grid alignment
- Consistent hierarchy across all blog posts
- Easy theme switching and maintenance
- Better semantic meaning for screen readers

---

## Card Components

### Before: Mixed Sizing Approaches

```html
<div class="bg-white rounded-lg shadow-md p-6 max-w-sm">
  <img src="project.jpg" alt="Project" class="w-full h-48 object-cover rounded mb-4">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">
    Design System Implementation
  </h3>
  <p class="text-sm text-gray-600 mb-3 leading-relaxed">
    A comprehensive design system built with Tailwind CSS and component libraries.
  </p>
  <div class="flex items-center justify-between">
    <span class="text-xs text-gray-500 uppercase tracking-wide">
      Design System
    </span>
    <a href="#" class="text-blue-600 text-sm font-medium hover:text-blue-800">
      View Project →
    </a>
  </div>
</div>
```

### After: Semantic Typography

```html
<div class="bg-white rounded-lg shadow-md p-component max-w-sm">
  <img src="project.jpg" alt="Project" class="w-full h-48 object-cover rounded mb-4b">
  <h3 class="heading-4">
    Design System Implementation
  </h3>
  <p class="text-body-sm mb-3b">
    A comprehensive design system built with Tailwind CSS and component libraries.
  </p>
  <div class="flex items-center justify-between">
    <span class="text-meta">
      Design System
    </span>
    <a href="#" class="nav-link text-sm hover:text-accent-two">
      View Project →
    </a>
  </div>
</div>
```

**Improvements:**
- Consistent spacing using baseline grid tokens
- Semantic typography classes for better maintenance
- Proper text hierarchy within the component
- Theme-aware color usage

---

## Navigation Elements

### Before: Custom Navigation Styling

```html
<nav class="flex items-center justify-between p-4">
  <div class="flex items-center space-x-8">
    <a href="/" class="text-xl font-bold text-gray-900">
      Portfolio
    </a>
    <div class="hidden md:flex space-x-6">
      <a href="/posts" class="text-base text-gray-700 hover:text-gray-900 font-medium">
        Posts
      </a>
      <a href="/research" class="text-base text-gray-700 hover:text-gray-900 font-medium">
        Research
      </a>
      <a href="/projects" class="text-base text-gray-700 hover:text-gray-900 font-medium">
        Projects
      </a>
      <a href="/about" class="text-base text-gray-700 hover:text-gray-900 font-medium">
        About
      </a>
    </div>
  </div>
  
  <button class="p-2 text-gray-600 hover:text-gray-900">
    <span class="sr-only">Toggle theme</span>
    <!-- Icon -->
  </button>
</nav>
```

### After: Semantic Navigation

```html
<nav class="flex items-center justify-between p-component">
  <div class="flex items-center space-x-8b">
    <a href="/" class="feature-link">
      Portfolio
    </a>
    <div class="hidden md:flex space-x-6b">
      <a href="/posts" class="nav-link">
        Posts
      </a>
      <a href="/research" class="nav-link">
        Research
      </a>
      <a href="/projects" class="nav-link">
        Projects
      </a>
      <a href="/about" class="nav-link">
        About
      </a>
    </div>
  </div>
  
  <button class="btn-icon-toggle">
    <span class="sr-only">Toggle theme</span>
    <!-- Icon with .icon-toggle class -->
  </button>
</nav>
```

**Benefits:**
- Semantic link classes for different contexts
- Consistent spacing using baseline grid
- Unified button styling system
- Better accessibility with semantic naming

---

## Hero Sections

### Before: Large Custom Typography

```html
<section class="text-center py-20 px-4">
  <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
    Beautiful Typography for the Modern Web
  </h1>
  <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
    Discover how thoughtful typography can transform your digital experiences.
  </p>
  <div class="flex flex-col sm:flex-row gap-4 justify-center">
    <a href="#" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700">
      Get Started
    </a>
    <a href="#" class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50">
      Learn More
    </a>
  </div>
</section>
```

### After: Semantic Hero

```html
<section class="text-center section-spacing-large px-4b">
  <h1 class="heading-1 mb-6b">
    Beautiful Typography for the Modern Web
  </h1>
  <p class="text-lead mb-8b measure-wide mx-auto">
    Discover how thoughtful typography can transform your digital experiences.
  </p>
  <div class="flex flex-col sm:flex-row gap-component-gap justify-center">
    <a href="#" class="btn-primary">
      Get Started
    </a>
    <a href="#" class="btn-secondary">
      Learn More
    </a>
  </div>
</section>
```

**Improvements:**
- Fluid typography automatically scales with viewport
- Semantic spacing classes for consistency
- Reading measure applied to optimize line length
- Semantic button classes (would need to be defined)

---

## Form Components

### Before: Form with Mixed Typography

```html
<form class="max-w-md mx-auto space-y-6 p-6">
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Contact Us
    </h2>
    <p class="text-gray-600 mb-6">
      Send us a message and we'll get back to you.
    </p>
  </div>
  
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
      Full Name
    </label>
    <input 
      type="text" 
      id="name" 
      class="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
      placeholder="Enter your name"
    >
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
      Email Address
    </label>
    <input 
      type="email" 
      id="email" 
      class="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
      placeholder="Enter your email"
    >
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
      Message
    </label>
    <textarea 
      id="message" 
      rows="4" 
      class="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
      placeholder="Your message..."
    ></textarea>
  </div>
  
  <button 
    type="submit" 
    class="w-full bg-blue-600 text-white py-3 px-4 rounded-md text-base font-medium hover:bg-blue-700"
  >
    Send Message
  </button>
</form>
```

### After: Semantic Form

```html
<form class="measure-narrow mx-auto space-y-component-gap p-component">
  <div>
    <h2 class="heading-2">
      Contact Us
    </h2>
    <p class="text-body">
      Send us a message and we'll get back to you.
    </p>
  </div>
  
  <div>
    <label for="name" class="block text-body-sm font-medium mb-2b">
      Full Name
    </label>
    <input 
      type="text" 
      id="name" 
      class="w-full px-input py-input border border-color-200 rounded-md text-body"
      placeholder="Enter your name"
    >
  </div>
  
  <div>
    <label for="email" class="block text-body-sm font-medium mb-2b">
      Email Address
    </label>
    <input 
      type="email" 
      id="email" 
      class="w-full px-input py-input border border-color-200 rounded-md text-body"
      placeholder="Enter your email"
    >
  </div>
  
  <div>
    <label for="message" class="block text-body-sm font-medium mb-2b">
      Message
    </label>
    <textarea 
      id="message" 
      rows="4" 
      class="w-full px-input py-input border border-color-200 rounded-md text-body"
      placeholder="Your message..."
    ></textarea>
  </div>
  
  <button 
    type="submit" 
    class="w-full btn-primary"
  >
    Send Message
  </button>
</form>
```

**Benefits:**
- Consistent form typography across the application
- Semantic spacing using baseline grid tokens
- Better form width using reading measures
- Theme-aware border colors

---

## List Layouts

### Before: Blog Post List

```html
<div class="space-y-8">
  <div class="border-b border-gray-200 pb-8">
    <div class="flex items-center text-sm text-gray-500 mb-2">
      <time>January 15, 2024</time>
      <span class="mx-2">•</span>
      <span>5 min read</span>
    </div>
    <h2 class="text-2xl font-bold text-gray-900 mb-3">
      <a href="/posts/typography" class="hover:text-blue-600">
        Modern Typography Principles
      </a>
    </h2>
    <p class="text-gray-600 text-base leading-relaxed mb-4">
      Exploring the fundamental principles that make typography effective in digital design.
    </p>
    <div class="flex flex-wrap gap-2">
      <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Typography</span>
      <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Design</span>
    </div>
  </div>
</div>
```

### After: Semantic Post List

```html
<div class="space-y-8b">
  <article class="border-b border-color-200 pb-8b">
    <div class="flex items-center text-meta mb-2b">
      <time>January 15, 2024</time>
      <span class="mx-2">•</span>
      <span>5 min read</span>
    </div>
    <h2 class="heading-3 mb-3b">
      <a href="/posts/typography" class="feature-link hover:text-accent-two">
        Modern Typography Principles
      </a>
    </h2>
    <p class="text-body mb-4b">
      Exploring the fundamental principles that make typography effective in digital design.
    </p>
    <div class="flex flex-wrap gap-2b">
      <span class="tag-neutral">Typography</span>
      <span class="tag-neutral">Design</span>
    </div>
  </article>
</div>
```

**Improvements:**
- Semantic article structure
- Consistent spacing using baseline grid
- Semantic link classes for different contexts
- Unified tag styling system

---

## Modal Dialogs

### Before: Custom Modal Typography

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg max-w-md w-full p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        Confirm Action
      </h3>
      <button class="text-gray-400 hover:text-gray-600">
        <span class="sr-only">Close</span>
        ×
      </button>
    </div>
    
    <p class="text-gray-600 mb-6 text-base leading-relaxed">
      Are you sure you want to delete this item? This action cannot be undone.
    </p>
    
    <div class="flex gap-3 justify-end">
      <button class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
        Cancel
      </button>
      <button class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
        Delete
      </button>
    </div>
  </div>
</div>
```

### After: Semantic Modal

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4b">
  <div class="bg-white rounded-lg measure-narrow w-full p-component">
    <div class="flex items-center justify-between mb-4b">
      <h3 class="heading-4">
        Confirm Action
      </h3>
      <button class="btn-icon-close-sm">
        <span class="sr-only">Close</span>
        <!-- Icon with .icon-close class -->
      </button>
    </div>
    
    <p class="text-body mb-6b">
      Are you sure you want to delete this item? This action cannot be undone.
    </p>
    
    <div class="flex gap-3b justify-end">
      <button class="btn-secondary">
        Cancel
      </button>
      <button class="btn-danger">
        Delete
      </button>
    </div>
  </div>
</div>
```

**Benefits:**
- Semantic heading for proper hierarchy
- Consistent spacing throughout
- Reading measure for optimal text width
- Unified button and icon systems

---

## Footer Sections

### Before: Footer with Mixed Typography

```html
<footer class="bg-gray-900 text-gray-300 py-12 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-4 gap-8">
      <div>
        <h3 class="text-white text-lg font-semibold mb-4">Company</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white text-sm">About</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white text-sm">Careers</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white text-sm">Contact</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-white text-lg font-semibold mb-4">Resources</h3>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white text-sm">Blog</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white text-sm">Documentation</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white text-sm">Help Center</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-gray-800 mt-8 pt-8 text-center">
      <p class="text-gray-400 text-sm">
        © 2024 Company Name. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

### After: Semantic Footer

```html
<footer class="bg-color-900 text-color-300 section-spacing-large px-4b">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-4 gap-8b">
      <div>
        <h3 class="heading-5 text-color-100 mb-4b">Company</h3>
        <ul class="space-y-2b">
          <li><a href="#" class="nav-link text-color-400 hover:text-color-100">About</a></li>
          <li><a href="#" class="nav-link text-color-400 hover:text-color-100">Careers</a></li>
          <li><a href="#" class="nav-link text-color-400 hover:text-color-100">Contact</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="heading-5 text-color-100 mb-4b">Resources</h3>
        <ul class="space-y-2b">
          <li><a href="#" class="nav-link text-color-400 hover:text-color-100">Blog</a></li>
          <li><a href="#" class="nav-link text-color-400 hover:text-color-100">Documentation</a></li>
          <li><a href="#" class="nav-link text-color-400 hover:text-color-100">Help Center</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-color-800 mt-8b pt-8b text-center">
      <p class="text-caption">
        © 2024 Company Name. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

**Benefits:**
- Theme-aware color system works in dark contexts
- Semantic typography classes maintain hierarchy
- Consistent spacing using baseline grid
- Proper caption styling for copyright text

---

## Development Best Practices

### Component Development Workflow

1. **Start with semantic HTML structure**
2. **Apply semantic typography classes**
3. **Use baseline grid spacing**
4. **Test across themes and viewports**
5. **Validate with reading measures**

### Testing Checklist

```html
<!-- Enable during development -->
<body class="show-grid">
```

- [ ] Typography hierarchy is clear
- [ ] Reading measures are appropriate for content
- [ ] Spacing aligns to baseline grid
- [ ] Works in both light and dark themes
- [ ] Scales properly on mobile and desktop
- [ ] Passes accessibility contrast requirements

### Common Migration Patterns

| Old Pattern | New Pattern | Benefit |
|-------------|-------------|---------|
| `text-xl font-bold` | `heading-3` | Semantic meaning, consistent styling |
| `text-base leading-relaxed` | `text-body` | Optimal line height, theme integration |
| `text-sm text-gray-500` | `text-meta` | Semantic context, theme-aware colors |
| `max-w-2xl` | `measure-base` | Optimal reading experience |
| `py-8 px-4` | `section-spacing px-4b` | Baseline grid alignment |

For complete implementation details, see [docs/TYPOGRAPHY.md](TYPOGRAPHY.md) and [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).