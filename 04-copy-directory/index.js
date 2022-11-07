const { stdout } = require('process');
const fsPromises = require('fs/promises');

const path = require('path');
const sourceFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');


async function copyDir(sourceFolder, copyFolder) {
  try {
    const removeDir = await fsPromises.rm(copyFolder, { recursive: true, force: true });
    const createDir = await fsPromises.mkdir(copyFolder, { recursive: true });
    stdout.write(`created ${createDir}\n`);
    const sourceFiles = await fsPromises.readdir(sourceFolder, { withFileTypes: true })
    sourceFiles.forEach(async item => {
      sourceFile = path.join(sourceFolder, item.name);
      destinationFile = path.join(copyFolder, item.name);
      if (item.isFile()){
        await fsPromises.copyFile(sourceFile, destinationFile);
      }
    });
  } catch (error) {
    stdout.write(`Error!\n${error}\n`);
  }
}

copyDir(sourceFolder, copyFolder);
