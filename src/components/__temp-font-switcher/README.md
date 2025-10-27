# TEMP Font Switcher Tool

**This is a temporary development tool. Delete when no longer needed.**

## What it does

- Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows) to open font switcher
- Select font from list (Inter, Shadows Into Light, zedou)
- Changes `src/styles/typography.css` file physically - not just temporary override
- Page auto-reloads with new font

## To remove this tool completely:

1. Delete this folder: `src/components/__temp-font-switcher/`
2. Remove import in `src/App.vue`:
   - Remove: `import FontSwitcher from "./components/__temp-font-switcher/FontSwitcher.vue";`
   - Remove: `<FontSwitcher />` from template
3. Remove plugin from `vite.config.js`:
   - Delete `tempFontSwitcherPlugin` function
   - Remove `tempFontSwitcherPlugin()` from plugins array
4. Done!
