import css from 'css';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const inputFile = path.resolve('src/styles/themes.css');
const outputTypeFile = path.resolve('./src/types/types.ts');
const outputNamesFile = path.resolve('./src/utils/themeNames.js');

/**
 * Theme Builder Script
 *
 * Automatically generates TypeScript types and JavaScript constants from CSS theme definitions.
 *
 * Input: src/styles/themes.css
 * Outputs:
 * - src/types/types.ts: TypeScript union type of theme names
 * - src/utils/themeNames.js: JavaScript array of theme names
 *
 * Usage:
 * - Extracts theme names from CSS classes starting with '.theme-'
 * - Special handling for :root theme (defaults to 'theme-light')
 * - Auto-updates existing type definitions without affecting other content
 * - Creates directories if they don't exist
 *
 * Error Handling:
 * - Validates CSS parsing
 * - Ensures file read/write operations
 * - Provides colored console output for status and errors
 */

/**
 * Extracts theme names from the CSS file
 * @returns {Promise<string[]>} Array of theme names
 */
async function extractThemeNames() {
  try {
    const cssContent = await readFile(inputFile, 'utf-8');
    const parsedCss = css.parse(cssContent);

    let rootThemeName = 'theme-light';
    const themeNames = parsedCss.stylesheet.rules
      .filter(rule =>
        rule.type === 'rule' &&
        (rule.selectors[0].startsWith('.theme-') || rule.selectors.includes(':root'))
      )
      .map(rule => {
        if (rule.selectors.includes(':root')) {
          // Try to extract the theme name from the :root selector
          const themeClass = rule.selectors.find(selector => selector.startsWith('.theme-'));
          if (themeClass) {
            rootThemeName = themeClass.slice(1); // Remove the leading dot
          }
          return rootThemeName;
        }
        return rule.selectors[0].slice(1); // Remove the leading dot
      });

    return themeNames;
  } catch (error) {
    console.error(chalk.red(`Error reading or parsing CSS file: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Generates TypeScript types and JavaScript constants files
 * @param {string[]} themeNames - Array of extracted theme names
 */
async function generateFiles(themeNames) {
  const typeContent = `// This type is auto-generated. Do not edit manually.
export type ThemeNames = ${themeNames.map(name => `'${name}'`).join(' | ')};
`;

  const namesContent = `// This file is auto-generated. Do not edit manually.
export const themeNames = [${themeNames.map(name => `'${name}'`).join(', ')}];
`;

  try {
    // Ensure directories exist
    await mkdir(path.dirname(outputTypeFile), { recursive: true });
    await mkdir(path.dirname(outputNamesFile), { recursive: true });

    // Update types file
    let existingTypes = await readFile(outputTypeFile, 'utf-8');
    const themeNamesTypeRegex = /\/\/ This type is auto-generated[\s\S]*?export type ThemeNames[^;]*;/;

    if (themeNamesTypeRegex.test(existingTypes)) {
      const newContent = existingTypes.replace(themeNamesTypeRegex, typeContent.trim());
      if (newContent !== existingTypes) {
        await writeFile(outputTypeFile, newContent, 'utf-8');
        console.log(chalk.green(`Successfully updated ${outputTypeFile}`));
      } else {
        console.log(chalk.yellow(`No changes needed in ${outputTypeFile}`));
      }
    } else {
      await writeFile(outputTypeFile, existingTypes + '\n\n' + typeContent, 'utf-8');
      console.log(chalk.green(`Successfully updated ${outputTypeFile}`));
    }

    // Update themeNames.js
    await writeFile(outputNamesFile, namesContent, 'utf-8');
    console.log(chalk.green(`Successfully updated ${outputNamesFile}`));

  } catch (error) {
    console.error(chalk.red(`Error writing files: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Main execution function
 * Coordinates the theme extraction and file generation process
 * Provides console feedback for build progress
 */
async function main() {
  console.log(chalk.blue('Starting theme names extraction...'));
  const themeNames = await extractThemeNames();
  console.log(chalk.cyan(`Found ${themeNames.length} themes: ${themeNames.join(', ')}`));
  console.log('');
  console.log(chalk.blue('Generating type definition and value files for themes...'));
  await generateFiles(themeNames);

  console.log(chalk.greenBright('Theme names extraction and file generation completed successfully! 🎉'));
  console.log('');
  console.log(chalk.magentaBright('Astro preparing for lift off! 🚁'));
  console.log('');
  console.log(chalk.bgYellow(' ~~ Note that the uncached build times can be somewhat slow...'));
  console.log('');
}

main().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1);
});
