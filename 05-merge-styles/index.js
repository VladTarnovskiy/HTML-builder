const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');

const bundleCSS = function fn(pathToDir, dest) {
  fsPromises
    .readdir(pathToDir, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.isDirectory()) {
          fn(path.join(pathToDir, file.name), dest);
        } else if (file.isFile() && path.extname(file.name) === '.css') {
          fsPromises
            .readFile(path.join(pathToDir, file.name), { encoding: 'utf8' })
            .then((data) => {
              fs.appendFile(dest, data, (err) => {
                if (err) console.log(err);
              });
            })
            .catch((err) => console.log(err));
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

fsPromises
  .rm(path.join(__dirname, 'project-dist/bundle.css'), { force: true })
  .then(() => {
    bundleCSS(
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'project-dist/bundle.css')
    );
  })
  .catch((err) => console.log(err));

module.exports = bundleCSS;