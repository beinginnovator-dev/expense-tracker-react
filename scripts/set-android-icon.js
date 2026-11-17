const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),src=path.join(root,'assets','wallet-privacy.svg');
const android=path.join(root,'android','app','src','main','res');
const sizes={mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192};
for(const [density,size] of Object.entries(sizes)){
 const dir=path.join(android,'mipmap-'+density);fs.mkdirSync(dir,{recursive:true});
 for(const name of ['ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png']){
  execFileSync('convert',[src,'-background','#38200e','-alpha','remove','-resize',size+'x'+size,path.join(dir,name)]);
 }
}
const values=path.join(android,'values');fs.mkdirSync(values,{recursive:true});
fs.writeFileSync(path.join(values,'ic_launcher_background.xml'),'<resources><color name="ic_launcher_background">#38200e</color></resources>');
const any=path.join(android,'mipmap-anydpi-v26');fs.mkdirSync(any,{recursive:true});
for(const name of ['ic_launcher.xml','ic_launcher_round.xml']){
 fs.writeFileSync(path.join(any,name),'<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/ic_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>');
}
console.log('Generated wallet/privacy icons and explicit dark-brown adaptive icon background.');
