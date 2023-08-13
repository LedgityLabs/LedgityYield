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

    // Used by <DApp/> component to customize backdrop color of Rainbox kit modals
    // It is required because Rainbow kit theme doesn't support direct values like "rgb(var(--fg)/0.5)"
    // and will parse them as "rgb(var(--fg)0.5)", which breaks the color.
    "--modal-backdrop": "rgb(var(--fg)/0.5)",
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
      // hero: "repeating-conic-gradient(black 0%, gray 0.7%), repeating-conic-gradient(gray 0.0000001%, grey 0.000104%)",

      "card-border": `radial-gradient(var(--circle-size) circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg) / 0.8), transparent), linear-gradient(rgb(var(--border) / 0.8), rgb(var(--border) / 0.8))`,
      "card-border-default": `
        radial-gradient(var(--circle-size) circle at 50% 100%, rgb(var(--primary-bg) / 0.5), transparent), radial-gradient(var(--circle-size) circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg) / 0.8), transparent), linear-gradient(rgb(var(--border) / 0.8), rgb(var(--border) / 0.8))`,

      "card-content": `radial-gradient(var(--circle-size) circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg) / var(--circle-intensity)), transparent), linear-gradient(rgb(var(--accent-bg)), rgb(var(--accent-bg)))`,
      "card-content-default": `
        radial-gradient(var(--circle-size) circle at 50% 100%, rgb(var(--primary-bg) / var(--circle-intensity)), transparent), radial-gradient(var(--circle-size) circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg) / var(--circle-intensity)), transparent), linear-gradient(rgb(var(--accent-bg)), rgb(var(--accent-bg)))`,

      "card-illustrations": `
        radial-gradient(var(--circle-size) circle at var(--mouse-x) var(--mouse-y), rgb(var(--primary-bg)), transparent), radial-gradient(300px circle at 50% 60%, rgb(var(--primary-bg) / 0.9), transparent)`,
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
        "20%": { opacity: 1 },
        "80%": { opacity: 1 },
        "100%": { opacity: 0 },
      },
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      fadeOut: {
        "0%": { opacity: 1 },
        "100%": { opacity: 0 },
      },
      fadeAndMoveIn: {
        "0%": { opacity: 0, transform: "scale(0.95) translateY(75px)" },
        "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
      },
      fadeAndMoveOut: {
        "0%": { opacity: 1, transform: "scale(1) translateY(0)" },
        "100%": { opacity: 0, transform: "scale(0.95) translateY(75px)" },
      },
    },
    animation: {
      // Used by <Scroller/> UI component
      roll: "2s infinite normal roll ease",
      // Used by <Dialog/> and <AlertDialog/>
      fadeIn: "300ms ease-in-out forwards fadeIn",
      fadeOut: "300ms ease-in-out forwards fadeOut",
      fadeAndMoveIn: "300ms ease-in-out forwards fadeAndMoveIn",
      fadeAndMoveOut: "300ms ease-in-out forwards fadeAndMoveOut",
    },
  },
};
export const plugins = [plugin(({ addBase }) => addBase(vars))];
