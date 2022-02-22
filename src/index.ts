import { exportPatterns } from './store';
import fs from 'fs';

const used: Array<Pattern> = [];

interface GetPartsResponse {
    heads: Array<string> | undefined,
    bodies: Array<string> | undefined,
    feet: Array<string> | undefined,
    success: boolean,
    error_message: string | undefined
}

function getParts(): GetPartsResponse {
    const requiredFolders = ['upper', 'mid', 'lower'];
    
    let _heads: Array<string> = [];
    let _bodies: Array<string> = [];
    let _feet: Array<string> = [];

    for (let folder of requiredFolders) {
        if (!fs.existsSync(`./${folder}`)) {
            return {
                heads: undefined,
                bodies: undefined,
                feet: undefined,
                success: false,
                error_message: `Required folder ${folder} does not exist`
            }
        } else {
            const folderFiles = fs.readdirSync(`./${folder}`);
            if (folderFiles.length <= 0) {
                return {
                    heads: undefined,
                    bodies: undefined,
                    feet: undefined,
                    success: false,
                    error_message: `Required folder ${folder} is empty`
                }
            } else {
                const items: Array<string> = [];
                for (let file of folderFiles) {
                    const content = fs.readFileSync(`./${folder}/${file}`, 'utf8');
                    items.push(content);
                }
                if (folder === 'upper') {
                    _heads = items;
                } else if (folder === 'mid') {
                    _bodies = items;
                } else if (folder === 'lower') {
                    _feet = items;
                }
            }
        }
    }

    return {
        success: true,
        heads: _heads,
        bodies: _bodies,
        feet: _feet,
        error_message: undefined
    }
}

export interface Pattern {
    head: String,
    body: String,
    foot: String
}

function getRandom(elements: Array<any>) {
    return elements[Math.floor(Math.random() * elements.length)];
}

function generateRandom(_heads: Array<String>, _bodies: Array<String>, _feet: Array<String>): Pattern {
    return {
        head: getRandom(_heads),
        body: getRandom(_bodies),
        foot: getRandom(_feet)
    }
}

const parts = getParts();
if (!parts.success) {
    console.log(parts.error_message);
    process.exit(1);
}

const heads = parts.heads;
const bodies = parts.bodies;
const feet = parts.feet;

if (heads === undefined || bodies === undefined || feet === undefined) {
    console.log('Error: Could not get parts');
    process.exit(1);
}

function canFindPattern(pattern: Pattern, patterns: Array<Pattern>) {
    return patterns.find(p => pattern === p) !== undefined
}

const loops = (heads.length**2) * (bodies.length**2) * (feet.length**2);

console.log(`Looping ${loops} maximum times.`);

for (let i = 0; i < loops; ++i) {
    if (used.length >= loops) break; // This will stop when reached the maximum number of patterns.

    const pat = generateRandom(heads, bodies, feet);
    if (canFindPattern(pat, used)) {
        console.log(`Pattern ${pat.head} ${pat.body} ${pat.foot} already exists`);
        continue;
    }

    used.push(pat);
}

exportPatterns(used);
