(function(){
  var localCfg=window.EXPENSE_TRACKER_AD_CONFIG||{};
  var endpoint=localCfg.remoteConfigUrl||'https://android-release.expense-tracker-react-db4.pages.dev/remote-config.json';

  function validAdConfig(value){
    if(!value || typeof value!=='object') return null;
    return {
      enabled:typeof value.enabled==='boolean'?value.enabled:false,
      placement:value.placement==='welcome'?'welcome':'disabled',
      title:typeof value.title==='string'?value.title.slice(0,100):'A message from our partners',
      message:typeof value.message==='string'?value.message.slice(0,240):'',
      destinationUrl:typeof value.destinationUrl==='string'?value.destinationUrl:'',
      campaignStartsAt:typeof value.campaignStartsAt==='string'?value.campaignStartsAt:'',
      campaignEndsAt:typeof value.campaignEndsAt==='string'?value.campaignEndsAt:''
    };
  }
  function showWelcomeAd(cfg){
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
      if(safeUrl) link.href=safeUrl;
      else {link.removeAttribute('href');link.removeAttribute('target');}
    }
    banner.hidden=false;
    var close=document.getElementById('welcomeAdClose');
    if(close) close.addEventListener('click',function(){banner.hidden=true;},{once:true});
  }
  async function loadRemoteConfig(){
    try{
      var controller=typeof AbortController!=='undefined'?new AbortController():null;
      var timeout=controller?setTimeout(function(){controller.abort();},3500):null;
      var response=await fetch(endpoint,{method:'GET',cache:'no-store',mode:'cors',signal:controller?controller.signal:undefined});
      if(timeout) clearTimeout(timeout);
      if(!response.ok) throw new Error('Remote config unavailable');
      var payload=await response.json();
      if(payload && payload.schemaVersion===1 && payload.ads){
        return Object.assign({},localCfg,validAdConfig(payload.ads)||{});
      }
    }catch(error){
      // Keep the app usable when offline or when Cloudflare is unavailable.
    }
    return localCfg;
  }
  async function init(){showWelcomeAd(await loadRemoteConfig());}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();