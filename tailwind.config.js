/** @packageDocumentation Learn more about this configuration file in docs/ui.md */
import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";
import { parseColor } from "tailwindcss/lib/util/color";
const toRGB = (val) => parseColor(val).color.join(" ");

// Define some CSS variables
const vars = {
  ":root": {
    // Default background (bg) and text-color (fg) applied to <body/>
    "--bg": toRGB(colors.indigo[100]),
    "--fg": toRGB(colors.slate[800]),

    // Accentuated versions of default background and foreground
    // Used for:
    // - <Button variant="outline"/> component hover state
    // - <Card/> component hover glow effect
    "--accent-bg": toRGB(colors.indigo[50]),
    // "--accent-fg": toRGB(colors.slate[800]),

    // Primary colors
    // Used for:
    // - <Button variant = "default"/> component
    "--primary-bg": toRGB(colors.indigo[500]),
    "--primary-fg": toRGB(colors.indigo[100]),

    // Destructive colors (intended to notice a destructive or critical action to the user)
    // Used for:
    // - <Button variant="secondary/> component
    "--destructive-bg": toRGB(colors.red[500]),
    "--destructive-fg": toRGB(colors.slate[200]),

    // Border colors for inputs components (input, select, textarea, ...)
    "--border": toRGB(colors.slate[300]),

    // Focus ring color
    "--ring": toRGB(colors.indigo[300]),
  },
  ".dark": {},
};

/** @type {import("tailwindcss").Config} */
export const content = ["./src/**/*.{js,ts,jsx,tsx,mdx}"];
export const darkMode = ["class"];
export const theme = {
  fontFamily: {
    heading: ["var(--font-heading)"],
    body: ["var(--font-body)"],
  },
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      hero: "repeating-conic-gradient(black 0%, gray 0.7%), repeating-conic-gradient(gray 0.0000001%, grey 0.000104%)",

      "card-border": `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg) / 0.8), transparent), linear-gradient(rgb(var(--border) / 0.8), rgb(var(--border) / 0.8))`,
      "card-border-default": `
        radial-gradient(300px circle at 50% 100%, rgb(var(--primary-bg) / 0.5), transparent), radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg) / 0.8), transparent), linear-gradient(rgb(var(--border) / 0.8), rgb(var(--border) / 0.8))`,

      "card-illustrations": `
        radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg)), transparent), radial-gradient(300px circle at 50% 60%, rgb(var(--primary-bg) / 0.5), transparent)`,
    },
    colors: {
      bg: "rgb(var(--bg) / <alpha-value>)",
      fg: "rgb(var(--fg) / <alpha-value>)",
      primary: {
        DEFAULT: "rgb(var(--primary-bg) / <alpha-value>)",
        fg: "rgb(var(--primary-fg) / <alpha-value>)",
      },
      accent: {
        DEFAULT: "rgb(var(--accent-bg) / <alpha-value>)",
        fg: "rgb(var(--accent-fg) / <alpha-value>)",
      },
      destructive: {
        DEFAULT: "rgb(var(--destructive-bg) / <alpha-value>)",
        fg: "rgb(var(--destructive-fg) / <alpha-value>)",
      },
      border: "rgb(var(--border) / <alpha-value>)",
      ring: "rgb(var(--ring) / <alpha-value>)",
    },
    keyframes: {
      // Used by <Scroller/> UI component
      roll: {
        "0%": { opacity: 0 },
        "20%": { marginTop: "0", opacity: 1 },
        "80%": { marginTop: "16px", opacity: 1 },
        "100%": { opacity: 0 },
      },
    },
    animation: {
      // Used by <Scroller/> UI component
      roll: "2s infinite normal roll ease",
    },
  },
};
export const plugins = [plugin(({ addBase }) => addBase(vars))];
