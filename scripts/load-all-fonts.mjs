// Load all Google Fonts array
import fs from 'fs';
import path from 'path';

const allFontsFile = path.join(process.cwd(), 'all-google-fonts.js');
const fontsArrayContent = fs.readFileSync(allFontsFile, 'utf-8');

// Eval to get the array (safe because we generated it ourselves)
eval(fontsArrayContent);

export { FONTS_TO_TEST };
