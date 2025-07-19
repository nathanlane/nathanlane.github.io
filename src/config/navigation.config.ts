import { siteConfig, socialLinks } from "@/site.config";

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
      show: false,
    },

    primary: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Research", href: "/research" },
      { title: "Writing", href: "/writing" },
      { title: "Media", href: "/media" },
    ],
  },

  // Footer configuration - minimal version
  // To customize footer content, modify the sections below:
  // - Add new sections by creating new objects with title and links
  // - Add new links by adding objects with title and href
  // - Use "#" for href to create non-clickable descriptive text
  // - Reference siteConfig values like ${siteConfig.email} for dynamic content
  footer: {
    sections: [
      {
        title: "Here",
        links: [
          { title: "Home", href: "/" },
          { title: "About", href: "/about" },
          { title: "Research", href: "/research" },
          { title: "Writing", href: "/writing" },
          { title: "Blog", href: "/posts" },
          { title: "Sitemap", href: "/sitemap.xml" },
        ],
      },
      {
        title: "Elsewhere",
        links: socialLinks
          .filter((social) =>
            ["Github", "LinkedIn", "Twitter", "Bluesky"].includes(
              social.friendlyName,
            ),
          )
          .map((social) => ({ title: social.friendlyName, href: social.link })),
      },
      {
        title: "Contact",
        links: [
          { title: "Email", href: `mailto:${siteConfig.email}` },
          { title: "CV", href: siteConfig.resumeUrl || "/cv.pdf" },
        ],
      },
      {
        title: "About this site",
        links: [
          {
            title:
              "Built by me, Nathan Lane, with care using Astro/Tailwind/GitHub Pages, designed with typography in mind. I use Newsreader (headers) and Inter (body) for typography.",
            href: "#",
          },
        ],
      },
    ],
  },
};
