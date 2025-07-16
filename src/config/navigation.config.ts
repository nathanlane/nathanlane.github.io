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
      href: "/"
    },
    
    primary: [
      {
        title: "About",
        items: [
          { title: "About", href: "/about", description: "Learn about my work" },
          { title: "CV", href: "/cv", description: "Academic curriculum vitae" },
          { title: "Email", href: "mailto:nathan@example.com", description: "Get in touch" }
        ]
      },
      {
        title: "Research", 
        href: "/research", // Direct link + dropdown
        items: [
          { title: "All Papers", href: "/research", description: "Complete research archive" },
          { title: "Industrial Policy", href: "/research/industrial-policy", description: "Policy analysis" },
          { title: "Manufacturing", href: "/research/manufacturing", description: "Manufacturing studies" },
          { title: "Development", href: "/research/development", description: "Development economics" }
        ]
      },
      {
        title: "Work",
        items: [
          { title: "Blog", href: "/posts", description: "Latest thoughts and updates" },
          { title: "Writing", href: "/writing", description: "Essays and creative work" },
          { title: "Projects", href: "/projects", description: "Technical projects" },
          { title: "Documentation", href: "/series/lane-docs", description: "Site guides" }
        ]
      }
    ],
    
    cta: {
      icon: "lucide:mail", // Using lucide icons
      href: "mailto:nathan@example.com",
      ariaLabel: "Send email"
    }
  },
  
  // Footer configuration - expanded version
  footer: {
    brand: {
      name: "Nathan Lane",
      tagline: "Economist, Writer, Typography Enthusiast",
      bio: "Exploring the intersection of economic policy, digital design, and beautiful typography."
    },
    
    sections: [
      {
        title: "About",
        links: [
          { title: "About Me", href: "/about" },
          { title: "Curriculum Vitae", href: "/cv" },
          { title: "Contact", href: "/contact" },
          { title: "Now", href: "/now" }
        ]
      },
      {
        title: "Research",
        links: [
          { title: "All Research", href: "/research" },
          { title: "Industrial Policy", href: "/research/industrial-policy" },
          { title: "Manufacturing", href: "/research/manufacturing" },
          { title: "Development Economics", href: "/research/development" },
          { title: "Working Papers", href: "/research/working-papers" }
        ]
      },
      {
        title: "Writing & Ideas",
        links: [
          { title: "Blog", href: "/posts" },
          { title: "Essays", href: "/writing" },
          { title: "Projects", href: "/projects" },
          { title: "Media Appearances", href: "/media" },
          { title: "Newsletter Archive", href: "/newsletter" }
        ]
      },
      {
        title: "Resources",
        links: [
          { title: "Documentation", href: "/series/lane-docs" },
          { title: "Typography Guide", href: "/series/typography" },
          { title: "Tags", href: "/tags" },
          { title: "Archive", href: "/archive" },
          { title: "RSS Feed", href: "/rss.xml" }
        ]
      }
    ],
    
    social: [
      { platform: "Twitter", href: "https://twitter.com/yourusername", icon: "lucide:twitter" },
      { platform: "GitHub", href: "https://github.com/nathanlane", icon: "lucide:github" },
      { platform: "LinkedIn", href: "https://linkedin.com/in/yourusername", icon: "lucide:linkedin" },
      { platform: "Email", href: "mailto:nathan@example.com", icon: "lucide:mail" }
    ]
  }
};