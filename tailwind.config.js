/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "on-primary": "#ffffff",
        "secondary-fixed": "#50fdc7",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "inverse-surface": "#2d3133",
        "secondary": "#006c50",
        "surface-bright": "#f7f9fb",
        "on-secondary-container": "#007054",
        "surface-container": "#eceef0",
        "surface-variant": "#e0e3e5",
        "error": "#ba1a1a",
        "on-tertiary-fixed-variant": "#38485d",
        "tertiary": "#19293d",
        "surface-container-highest": "#e0e3e5",
        "on-secondary": "#ffffff",
        "primary-fixed": "#e1e0ff",
        "on-surface": "#191c1e",
        "outline-variant": "#c7c5d4",
        "on-secondary-fixed-variant": "#00513c",
        "on-secondary-fixed": "#002116",
        "surface-dim": "#d8dadc",
        "secondary-container": "#4cfac4",
        "secondary-fixed-dim": "#1ee0ac",
        "primary": "#15157d",
        "tertiary-container": "#2f3f54",
        "background": "#f7f9fb",
        "inverse-primary": "#c0c1ff",
        "primary-fixed-dim": "#c0c1ff",
        "on-tertiary-container": "#9aaac3",
        "on-primary-container": "#9da1ff",
        "on-surface-variant": "#464652",
        "on-error-container": "#93000a",
        "inverse-on-surface": "#eff1f3",
        "on-primary-fixed": "#04006d",
        "on-error": "#ffffff",
        "on-background": "#191c1e",
        "tertiary-fixed-dim": "#b7c8e1",
        "on-tertiary-fixed": "#0b1c30",
        "on-tertiary": "#ffffff",
        "primary-container": "#2e3192",
        "surface-container-low": "#f2f4f6",
        "surface-container-high": "#e6e8ea",
        "surface-tint": "#4f54b4",
        "surface": "#f7f9fb",
        "outline": "#777683",
        "on-primary-fixed-variant": "#373a9b",
        "tertiary-fixed": "#d3e4fe"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "stack-sm": "8px",
        "stack-md": "16px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "stack-lg": "24px"
      },
      "fontFamily": {
        "label-caps": ["Inter"],
        "budget-display": ["Plus Jakarta Sans"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "headline-lg": ["Plus Jakarta Sans"],
        "headline-md": ["Plus Jakarta Sans"],
        "body-sm": ["Inter"]
      },
      "fontSize": {
        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "budget-display": ["20px", {"lineHeight": "24px", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["30px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
