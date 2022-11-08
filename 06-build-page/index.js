const path = require('node:path');
const fs = require('node:fs/promises');

const projectDistPath = path.resolve(__dirname, 'project-dist');

const main = async () => {
    createDirs();
    buildHtml();
    buildStyles();
    buildAssets();
};


const createDirs = async() => {
    await fs.mkdir(projectDistPath, { recursive: true });
};

const buildHtml = async () => {
    const templatePath = path.resolve(__dirname, 'template.html');
    const componentsPath = path.resolve(__dirname, 'components');
    const indexHtmlPath = path.resolve(projectDistPath, 'index.html');

    const templateContent = await fs.readFile(templatePath, { encoding: 'utf8' });

    const pattern = /{{(.*?)}}/g;

    let currentMatch;
    let nextContent = templateContent;

    while(currentMatch = pattern.exec(templateContent)) {
        const name = currentMatch[1];
        const filename = name + '.html';
        const templatePath = path.resolve(componentsPath, filename);
        const fileContent = await fs.readFile(templatePath, { encoding: 'utf8' });
        nextContent = nextContent.replace(currentMatch[0], fileContent);
    }

    await fs.writeFile(indexHtmlPath, nextContent, { encoding: 'utf8' });
}

const buildStyles = async () => {
    const stylesDirPath = path.resolve(__dirname, 'styles');
    const bundlePath = path.resolve(projectDistPath, 'style.css');

    await fs.rm(bundlePath, { recursive: true, force: true });

    const readObjects = await fs.readdir(stylesDirPath, { withFileTypes: true });

    for (const readObject of readObjects) {
        if (readObject.isFile()) {
            const filePath = path.resolve(stylesDirPath, readObject.name);
            const parsedPath = path.parse(filePath);

            if (parsedPath.ext === '.css') {
                const content = await fs.readFile(filePath, { encoding: 'utf8' });
                await fs.appendFile(bundlePath, content + '\n', { encoding: 'utf8' });
            }
        }
    }
}

const buildAssets = async () => {
    const srcDirPath = path.resolve(__dirname, 'assets');
    const destDirPath = path.resolve(projectDistPath, 'assets');

    await copyDirectory(srcDirPath, destDirPath);
};

const copyDirectory = async (from, to) => {
    await fs.rm(to, { recursive: true, force: true });
    await fs.mkdir(to, { recursive: true });
    const readObjects = await fs.readdir(from, { withFileTypes: true });

    for (const readObject of readObjects) {
        const srcPath = path.resolve(from, readObject.name);
        const destPath = path.resolve(to, readObject.name);

        if (readObject.isFile()) {
            await fs.copyFile(srcPath, destPath);
        } else if (readObject.isDirectory()) {
            copyDirectory(srcPath, destPath);
        }
    }
};


main();