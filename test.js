const glob = require('glob');

glob('test/fail/*.md', (err, files) => {
  console.log(err);
  console.log(files);
});