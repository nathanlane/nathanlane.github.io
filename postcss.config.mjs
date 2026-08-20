import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
// `tailwindcss` 3.4 ships no `exports` map, so the bare `tailwindcss/nesting`
// specifier is a directory import and throws ERR_UNSUPPORTED_DIR_IMPORT here.
import nesting from "tailwindcss/nesting/index.js";

// Replaces @astrojs/tailwind, which was deprecated with no Astro 6/7 release.
// Plugin order mirrors the integration exactly: nesting, Tailwind, Autoprefixer.
export default { plugins: [nesting(), tailwindcss(), autoprefixer()] };
