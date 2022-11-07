const { stdout } = require('process');
const fsPromises = require('fs/promises');

const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fsPromises
  .readdir(secretFolder, { withFileTypes: true })
  .then(result => {
    result.forEach(item => {
      if (item.isFile()) {
        let filePath = path.join(secretFolder, item.name);
        let fileParse = path.parse(filePath);
        fsPromises.stat(filePath).then(result => {
          stdout.write(`${fileParse.name} - ${fileParse.ext.slice(1)} - ${Number(result.size / 1024).toFixed(3)}kb\n`);
        });
      }
    })
  })
  .catch((err) => console.log(err));