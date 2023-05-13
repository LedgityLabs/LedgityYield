# UI

This DApp frontend relies on Tailwind CSS and Radix UI for its UI components.

Radix UI provides unstyled low-level primitives for common UI components. Those primitives implement basic components features while strictly following the [WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/) whenever possible. This allows to quickly build accessible and fully functional components, while being entirely free in term of styling.

The whole UI kit is accessible at [localhost:3000/ui](http://localhost:3000/ui) (or equivalent URL in production).

## Particularities

### CSS variables in `tailwind.config.js` file

A common way of defining custom colors and other values in Tailwind is to use [CSS variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables) in the `global.css` file.

```css
@layer base {
  :root {
    --background: theme(colors.white);
    --text: theme(colors.black);
  }
  .dark {
    --background: theme(colors.black);
    --text: theme(colors.white);
  }
```

This is a pretty convenient way as it allows to condition the variables values based on the current theme (light or dark) and so helps reducing the amount of written Tailwind classes. (e.g. `bg-background` instead of `bg-background-light dark:bg-background-dark`)

However this method has a drawback, if a non-RGB value is used, it will break the Tailwind [shorthand opacity modifier](https://tailwindcss.com/docs/background-color#changing-the-opacity) (e.g. `bg-primary/80`).
See: https://github.com/tailwindlabs/tailwindcss/issues/1692

Supporting opacity shorthand modifier is highly important as if for some properties like `bg` it is also possible to use the `bg-opacity-<number>` class to modify opacity, for some other like `border-color` there is no way to do so without the shorthand modifier (as there is no `border-opacity` CSS property).

> _What does the shorthand opacity does under the hood is that it adds an alpha channel to the provided color, which allows it to work on any color-related property, no matter if they have an opacity property or not._

Also, the opacity shorthand modifier removes the requirement of creating many pre-defined colors variable for each state (e.g., hovered, focused, disabled, etc.). Only a base single color is needed and can then be derived for any use case using the shortand opacity modifier.

In order to be able to use the opacity shorthand modifier and non-RGB values, CSS variables have been defined in `tailwind.config.js` instead, which are then inserted using a minimal Tailwind plugin (inspired from [this post](https://github.com/tailwindlabs/tailwindcss/discussions/8751)). So the above example becomes:

```js
import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";
import { parseColor } from "tailwindcss/lib/util/color";
const toRGB = (val) => parseColor(val).color.join(" ");

const vars = {
  ":root": {
    "--background": toRGB(colors.white),
    "--text": toRGB(colors.black),
  },
  ".dark": {
    "--background": toRGB(colors.black),
    "--text": toRGB(colors.white),
  },
};
export const theme = {
  // ...
};

export const plugins = [plugin(({ addBase }) => addBase(vars))];
```

This allows using JS to convert native Tailwind colors to RGB and has also the indirect advantage of grouping all the theme-related code in a single file.

## Standard

### Colors

Use the colors defined in the `tailwind.config.js` whenever possible.

### Radius

Use the radius defined in the `tailwind.config.js` whenever possible.

### Hover effects

It is recommended to use a 80% opacity for to illustrate a hover effect (e.g. `bg-primary hover:bg-primary/80`).
