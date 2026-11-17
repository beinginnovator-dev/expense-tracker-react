const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');const src=path.join(root,'assets','wallet-privacy.svg');
const android=path.join(root,'android','app','src','main','res');
const sizes={mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192};
for(const [density,size] of Object.entries(sizes)){
 const dir=path.join(android,'mipmap-'+density);fs.mkdirSync(dir,{recursive:true});
 for(const name of ['ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png']){
  execFileSync('convert',[src,'-background','#24150d','-alpha','remove','-resize',size+'x'+size,path.join(dir,name)]);
 }
}
console.log('Wallet + privacy shield launcher icons generated for all Android densities.');