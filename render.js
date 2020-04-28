const fs = require('fs');
const url = require('url');
const markdown = require('markdown-it')({linkify: true, html: true});
const open = require('open');
const rtd = require('rich-text-diff');

const colour = process.env.NODE_DISABLE_COLORS ?
    { red: '', yellow: '', green: '', normal: '' } :
    { red: '\x1b[31m', yellow: '\x1b[33;1m', green: '\x1b[32m', normal: '\x1b[0m' };

function processConflicts(md) {
  let lines = md.split('\r').join('').split('\n');
  for (let i=0;i<lines.length;i++) {
    if (lines[i].startsWith('<<<<<<')) {
      i++;
      let start = i;
      let before = '';
      let after = '';
      while (!lines[i].startsWith('======')) {
        before = before + lines[i]+'\n';
        i++;
      }
      i++;
      while (!lines[i].startsWith('>>>>>>')) {
        after = after + lines[i]+'\n';
        i++;
      }
      let diff = rtd(before,after);

      diff = diff.split('<ins>').join(colour.green);
      diff = diff.split('</ins>').join(colour.normal);
      diff = diff.split('<del>').join(colour.red);
      diff = diff.split('</del>').join(colour.normal+' ');

      const diffLines = diff.split('\n');
      lines.splice(start,i-start,...diffLines);
      console.log(diff);
      i = start;
    }
  }
  return lines.join('\n');
}

if (process.argv.length > 2) {
  const outfile = process.argv.length > 3 ? process.argv[3] : './markdown.html';
  let md = fs.readFileSync(process.argv[2],'utf8');
  let output;
  if (md.indexOf('<<<<<<') >= 0) {
    output = processConflicts(md);
  }
  output = markdown.render(md);
  fs.writeFileSync(outfile,output,'utf8');
  open(url.pathToFileURL(outfile).toString())
  .catch(function(ex){
    console.warn(ex.message);
  });
}
