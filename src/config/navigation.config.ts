import { siteConfig } from "@/site.config";

export interface NavLink {
  title: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavSection {
  title: string;
  href?: string;
  icon?: string;
  items?: NavLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export const navigationConfig = {
  // Header configuration
  header: {
    logo: {
      text: "Nathan Lane",
      href: "/",
      show: false
    },
    
    primary: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Research", href: "/research" },
      { title: "Writing", href: "/writing" },
      { title: "Email", href: `mailto:${siteConfig.email}` }
    ]
  },
  
  // Footer configuration - minimal version
  footer: {
    sections: [
      {
        title: "Explore",
        links: [
          { title: "About", href: "/about" },
          { title: "Research", href: "/research" },
          { title: "Writing", href: "/writing" },
          { title: "Blog", href: "/posts" }
        ]
      },
      {
        title: "Browse",
        links: [
          { title: "Projects", href: "/projects" },
          { title: "Notes", href: "/notes" },
          { title: "Tags", href: "/tags" },
          { title: "Archive", href: "/archive" }
        ]
      },
      {
        title: "Connect",
        links: [
          { title: "Email", href: `mailto:${siteConfig.email}` },
          { title: "CV", href: "/cv" },
          { title: "RSS", href: "/rss.xml" },
          { title: "Sitemap", href: "/sitemap.xml" }
        ]
      }
    ]
  }
};