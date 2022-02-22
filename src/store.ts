import fs from 'fs';
import { Pattern } from '.';

export function exportPatterns(patterns: Array<Pattern>, fileName: string='patterns.json') {
    fs.writeFileSync(fileName, JSON.stringify(patterns));
}