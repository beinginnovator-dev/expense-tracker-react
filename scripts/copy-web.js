const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');const out=path.join(root,'www');
fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','ads.js','ads-config.js']){const src=path.join(root,name);if(fs.existsSync(src))fs.copyFileSync(src,path.join(out,name));}
console.log('Copied web app into www/');
