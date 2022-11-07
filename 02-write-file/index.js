const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Please, enter some text:\n');
process.on('SIGINT', () => process.exit()); 
process.on('exit', () => stdout.write('Process ended!\n'));

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  output.write(data);
});