import fs from 'fs';

const folders: Array<string> = ['upper', 'mid', 'lower'];

for (let folder of folders) {
    if (fs.existsSync(`./${folder}`)) {
        fs.rmdirSync(`./${folder}`, { recursive: true });
    }
    fs.mkdirSync(`./${folder}`);
}

console.log('Created folders successfully.');