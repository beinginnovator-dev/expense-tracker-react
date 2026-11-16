(function(){
  function initWelcomeAd(){
    var cfg=window.EXPENSE_TRACKER_AD_CONFIG||{};
    var banner=document.getElementById('welcomeAdBanner');
    if(!banner || !cfg.enabled || cfg.placement!=='welcome') return;
    var now=Date.now();
    if(cfg.campaignStartsAt && now < Date.parse(cfg.campaignStartsAt)) return;
    if(cfg.campaignEndsAt && now > Date.parse(cfg.campaignEndsAt)) return;
    var link=document.getElementById('welcomeAdLink');
    var title=document.getElementById('welcomeAdTitle');
    var message=document.getElementById('welcomeAdText');
    if(title) title.textContent=cfg.title||'A message from our partners';
    if(message) message.textContent=cfg.message||'';
    if(link){
      var safeUrl='';
      try{var u=new URL(cfg.destinationUrl,window.location.href);if(u.protocol==='https:'||u.protocol==='http:')safeUrl=u.href;}catch(e){}
      if(safeUrl){link.href=safeUrl;}else{link.removeAttribute('href');link.removeAttribute('target');}
    }
    banner.hidden=false;
    var close=document.getElementById('welcomeAdClose');
    if(close) close.addEventListener('click',function(){banner.hidden=true;});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initWelcomeAd,{once:true});
  else initWelcomeAd();
})();
