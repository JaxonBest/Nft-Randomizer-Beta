import fs from 'fs';
import { Pattern } from '.';

interface NftDirResult {
    created_new: boolean,
    did_empty: boolean | undefined,
    file_amount_empty: number | undefined
}

function createNftDirectory(emptyIfExists: boolean=true): NftDirResult {
    if (!fs.existsSync('./nft')) {
        fs.mkdirSync('./nft');
        
        return {
            created_new: true,
            did_empty: false,
            file_amount_empty: undefined
        }

    } else {
        const fileNames = fs.readdirSync('./nft');

        for (let fileName of fileNames) {
            fs.rmSync(fileName);
        }

        return {
            created_new: false,
            did_empty: true,
        
            file_amount_empty: fileNames.length
        } 
    }
}

function createSvgOrder(pattern: Pattern) {
    return `${pattern.head}\n${pattern.body}\n${pattern.foot}`;

}

function searchForPatternFile(fileName: string='patterns.json'): boolean {
    if (!fs.existsSync(fileName)) {
        return false;
    }
    return true; 
}

function getPatternData(fileName: string='patterns.json'): Array<Pattern> {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

if (!searchForPatternFile()) {
    console.log(`Could not find pattern JSON file. (patterns.json)`);
    process.exit(1);
}

if (!createNftDirectory().created_new) {
    console.log(`Overriding the previous folder.`);
} else {
    console.log('Created the NFT directory.');
}


const nfts = getPatternData();
console.log(`Creating ${nfts.length} NFT's.`);

let i = 0;
for (let nft of nfts) {
    ++i;
    console.log(`Creating NFT #${i}.`);
    const svg = createSvgOrder(nft);
    fs.writeFileSync(`./nft/nft-${i}.svg`, svg);
}

console.log(`Finished and created a total of ${i} NFT's.`)