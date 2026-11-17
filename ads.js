(function(){
  'use strict';
  var API='./api/promotion';
  var config=null, modal=null, lastEvent='';
  function makeModal(){
    if(modal)return modal;
    var style=document.createElement('style');
    style.textContent='.et-promo-overlay{position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.72);display:none;align-items:center;justify-content:center;padding:18px}.et-promo-card{width:min(100%,440px);max-height:88vh;overflow:auto;background:#fff;color:#30221d;border-radius:18px;box-shadow:0 18px 55px rgba(0,0,0,.35);position:relative;padding:18px}.et-promo-card h2{font-size:21px;margin:4px 34px 10px 0}.et-promo-card p{font-size:15px;line-height:1.5;white-space:pre-wrap}.et-promo-card img{width:100%;max-height:250px;object-fit:contain;border-radius:12px;margin:6px 0 10px}.et-promo-tag{font-size:10px;font-weight:900;letter-spacing:1px;color:#8d6e63}.et-promo-close{position:absolute;right:12px;top:12px;width:34px;height:34px;border:0;border-radius:50%;background:#f2ece7;color:#38251f;font-size:22px;cursor:pointer}.et-promo-action{display:block;text-align:center;padding:12px;border-radius:10px;background:#6d4c41;color:white;text-decoration:none;font-weight:800;margin-top:12px}.et-promo-dismiss{width:100%;padding:10px;border:1px solid #ddd;background:#f8f5f2;color:#49352d;border-radius:10px;margin-top:8px}';
    document.head.appendChild(style);
    modal=document.createElement('div');modal.className='et-promo-overlay';modal.innerHTML='<section class="et-promo-card" role="dialog" aria-modal="true" aria-label="Advertisement"><button class="et-promo-close" type="button" aria-label="Close">×</button><div class="et-promo-tag">ADVERTISEMENT</div><h2></h2><img hidden alt="Promotion"><p></p><a class="et-promo-action" hidden target="_blank" rel="noopener noreferrer">Learn more</a><button class="et-promo-dismiss" type="button">Close</button></section>';
    document.body.appendChild(modal);
    function close(){modal.style.display='none';}
    modal.querySelector('.et-promo-close').addEventListener('click',close);
    modal.querySelector('.et-promo-dismiss').addEventListener('click',close);
    modal.addEventListener('click',function(e){if(e.target===modal)close();});
    return modal;
  }
  async function load(){
    try{var r=await fetch(API,{cache:'no-store',credentials:'same-origin'});if(!r.ok)throw Error('promo api');config=await r.json();}
    catch(e){config={trigger:'disabled'};}
    return config;
  }
  function permitted(p,event){
    if(!p||!['app_open','tab_open','both'].includes(p.trigger))return false;
    if(!(p.trigger==='both'||p.trigger===event))return false;
    var key='expense_promo_seen_'+(p.frequency||'once_session');
    if(p.frequency==='every_event')return true;
    var store=p.frequency==='daily'?localStorage:sessionStorage;
    var value=store.getItem(key);
    var today=new Date().toISOString().slice(0,10);
    return p.frequency==='daily'?value!==today:!value;
  }
  function markSeen(p){
    var key='expense_promo_seen_'+(p.frequency||'once_session');
    if(p.frequency==='daily')localStorage.setItem(key,new Date().toISOString().slice(0,10));
    else if(p.frequency!=='every_event')sessionStorage.setItem(key,'1');
  }
  function safeHttps(value){try{var u=new URL(value);return u.protocol==='https:'?u.href:'';}catch(e){return '';}}
  function show(p){
    var el=makeModal(),title=el.querySelector('h2'),msg=el.querySelector('p'),img=el.querySelector('img'),link=el.querySelector('.et-promo-action');
    title.textContent=p.title||'A message from our partners';msg.textContent=p.message||'';
    var image=safeHttps(p.image_url||'');img.hidden=!image;if(image){img.src=image;img.onerror=function(){img.hidden=true;};}else img.removeAttribute('src');
    var url=safeHttps(p.url||'');link.hidden=!url;if(url)link.href=url;else link.removeAttribute('href');
    el.style.display='flex';markSeen(p);
  }
  window.maybeShowExpensePromo=async function(event){
    if(lastEvent===event&&event==='app_open')return;
    lastEvent=event;
    var p=config||await load();
    if(permitted(p,event))show(p);
  };
  load();
})();