#!/usr/bin/env node

/**
 * Generate Social Card
 * ====================
 *
 * Purpose: Creates a default social-card.png for the website
 *
 * Usage: node scripts/generate-social-card.js
 *
 * Prerequisites:
 * - Node.js with @resvg/resvg-js and satori installed
 *
 * Output:
 * - Creates public/social-card.png
 *
 * Author: Claude Assistant
 * Date: July 2025
 */

import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

// Simple HTML for the social card
const cardHtml = {
  type: "div",
  props: {
    style: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "#f8f8f8",
      color: "#1a1a1a",
      padding: "80px",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
    },
    children: [
      {
        type: "h1",
        props: {
          style: {
            fontSize: "72px",
            fontWeight: "bold",
            marginBottom: "24px",
            color: "#224d67",
          },
          children: "Nathan Lane, PhD",
        },
      },
      {
        type: "p",
        props: {
          style: {
            fontSize: "36px",
            fontWeight: "normal",
            marginBottom: "48px",
            color: "#666",
            lineHeight: 1.4,
          },
          children: "Associate Professor of Economics at Oxford University",
        },
      },
      {
        type: "p",
        props: {
          style: {
            fontSize: "28px",
            fontWeight: "normal",
            color: "#888",
          },
          children:
            "Industrial Policy • Economic Development • Technology & Economics",
        },
      },
    ],
  },
};

async function generateSocialCard() {
  try {
    // Generate SVG using Satori
    const svg = await satori(cardHtml, {
      width: 1200,
      height: 630,
      fonts: [],
    });

    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: 1200,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Save the PNG file
    const outputPath = path.join(process.cwd(), "public", "social-card.png");
    fs.writeFileSync(outputPath, pngBuffer);

    console.log(
      "✅ Social card generated successfully at public/social-card.png",
    );
  } catch (error) {
    console.error("❌ Error generating social card:", error);
    process.exit(1);
  }
}

generateSocialCard();
