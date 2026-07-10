import { execSync } from "child_process";
import fs from "fs";
import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(method,url,body){
  let cmd='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+method+' ';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  cmd+='"'+url+'" 2>/dev/null || echo ERR';
  const code=execSync(cmd,{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}
const CODE=fs.readFileSync('petshop_consent_bridge.php','utf8');

try{
  // ---------- A. GTM: pauzuojam consent default tag'a ----------
  L('=== A. GTM tag [15] pauzavimas ===');
  const t=await gtmToken(); const W=await defaultWorkspace(t);
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const ct=tags.find(x=>x.name.includes('Consent Mode v2 Default'));
  if(!ct){ L('  ❌ tag nerastas'); }
  else{
    L('  esamas: id='+ct.tagId+' paused='+(ct.paused?'YES':'no'));
    const upd={ name:ct.name, type:ct.type, firingTriggerId:ct.firingTriggerId, parameter:ct.parameter, priority:ct.priority, paused:true,
      notes:'PAUZUOTA S167: consent default perkeltas i snippet "Petshop Consent Bridge v1.0" (wp_head prio 0), nes default privalo buti pries update.' };
    const r=await gtm(t,'/'+W.path+'/tags/'+ct.tagId,'PUT',upd);
    L('  PUT -> HTTP '+r.status+'  paused='+(r.body.paused?'YES ✅':'no ❌'));
  }
  L('');

  // ---------- B. Snippet deploy ----------
  L('=== B. Consent Bridge snippet ===');
  const list=api('GET',API+'?per_page=100'); const arr=JSON.parse(list.body);
  const ex=arr.find(s=>s.name&&s.name.includes('Consent Bridge'));
  const payload={ name:'Petshop Consent Bridge v1.0 (Complianz -> GTM)',
    desc:'Consent Mode v2 default + update is Complianz. wp_head prio 0, pries GTM snippet. GTM tag [15] pauzuotas.',
    code:CODE, scope:'front-end', active:false, priority:1, tags:['tracking','consent','gtm'] };
  let id;
  if(ex){ const r=api('POST',API+'/'+ex.id,payload); L('  UPDATE HTTP '+r.code); id=ex.id; }
  else{ const r=api('POST',API,payload); L('  CREATE HTTP '+r.code); if(r.code!=='200'&&r.code!=='201'){L('  '+r.body.slice(0,300)); throw new Error('fail');} id=JSON.parse(r.body).id; }
  L('  id='+id);
  const act=api('POST',API+'/'+id,{active:true});
  L('  ACTIVATE HTTP '+act.code);
  if(act.code!=='200'){ L('  ❌ '+act.body.slice(0,400)); throw new Error('activate fail'); }
  const j=JSON.parse(act.body);
  L('  active='+j.active+'  code_error='+JSON.stringify(j.code_error||null));
  L('');
  await new Promise(r=>setTimeout(r,4000));

  // ---------- C. Publish GTM ----------
  L('=== C. GTM publish v3 ===');
  const cv=await gtm(t,'/'+W.path+':create_version','POST',{
    name:'v3 — consent default perkeltas i snippet',
    notes:'Tag [15] pauzuotas. Consent default + update valdomas snippet "Petshop Consent Bridge v1.0". S167.' });
  L('  create_version HTTP '+cv.status);
  if(cv.status!==200){ L('  ❌ '+JSON.stringify(cv.body).slice(0,300)); throw new Error('cv fail'); }
  const vid=cv.body.containerVersion.containerVersionId;
  const pub=await gtm(t,'/'+CT+'/versions/'+vid+':publish','POST');
  L('  publish HTTP '+pub.status+'  versionId='+vid);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('  LIVE: #'+lv.body.containerVersionId+' "'+lv.body.name+'"');
  const ctLive=(lv.body.tag||[]).find(x=>x.name.includes('Consent Mode v2 Default'));
  L('  tag [15] live paused: '+(ctLive?.paused?'YES ✅':'no ❌'));
  L('');
  await new Promise(r=>setTimeout(r,5000));

  // ---------- D. Sveikata + HTML ----------
  L('=== D. Svetaines sveikata ===');
  for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'],['Krepselis','https://dev.avesa.lt/cart/']]){
    const r=page(u); const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
    L('  '+nm.padEnd(12)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅'));
  }
  L('');
  L('=== E. HTML eiliskumas ===');
  const h=page('https://dev.avesa.lt/');
  const pBridge=h.html.indexOf('data-petshop-consent-bridge');
  const pGtm=h.html.indexOf('googletagmanager.com/gtm.js');
  const pDefault=h.html.indexOf("'consent', 'default'");
  const pBody=h.html.indexOf('<body');
  L('  consent bridge @ '+pBridge);
  L('  consent default @ '+pDefault);
  L('  gtm.js @ '+pGtm);
  L('  <body> @ '+pBody);
  L('  bridge PRIES gtm.js: '+(pBridge>0 && pBridge<pGtm ? '✅' : '❌'));
  L('  viskas <head> viduje: '+(pGtm<pBody ? '✅' : '❌'));
  L('');
  const checks={
    'consent default inline':   /'consent',\s*'default'/.test(h.html),
    'consent update funkcija':  /sendConsentUpdate/.test(h.html),
    'cmplz_status_change':      /cmplz_status_change/.test(h.html),
    'cmplz_fire_categories':    /cmplz_fire_categories/.test(h.html),
    'dataLayer cmplz event':    /cmplz_consent_update/.test(h.html),
    'GTM loader islikes':       /googletagmanager\.com\/gtm\.js/.test(h.html),
    'dataLayer snippet (614)':  /data-petshop-gtm="1"/.test(h.html),
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
  L('');
  L('=== SNIPPET ID: '+id+' ===');
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('bridge_deploy.txt', out); console.log(out);
