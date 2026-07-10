import { execSync } from "child_process";
import fs from "fs";
import { gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
try{
  // --- A. Bridge v1.1 update ---
  L('=== A. Bridge snippet v1.1 ===');
  const CODE=fs.readFileSync('petshop_consent_bridge.php','utf8');
  const SNIP_ID = 619;
  const chk = api('GET', API+'/'+SNIP_ID);
  if(chk.code!=='200'){ L('  ❌ snippet '+SNIP_ID+' HTTP '+chk.code); throw new Error('snippet nerastas'); }
  L('  rastas id='+SNIP_ID+' "'+JSON.parse(chk.body).name+'"');
  const r=api('POST',API+'/'+SNIP_ID,{ name:'Petshop Consent Bridge v1.1 (Complianz -> GTM)', code:CODE, active:true, scope:'front-end', priority:1 });
  L('  UPDATE id='+SNIP_ID+' -> HTTP '+r.code);
  if(r.code==='200'){ const j=JSON.parse(r.body); L('  active='+j.active+' code_error='+JSON.stringify(j.code_error||null)); }
  L('');

  // --- B. GTM: CE statistics granted ---
  L('=== B. GTM trigger CE — statistics granted ===');
  const t=await gtmToken(); const W=await defaultWorkspace(t);
  const trigs=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  let statTrig=trigs.find(x=>x.name==='CE — statistics granted');
  if(statTrig){ L('  [skip] jau yra id='+statTrig.triggerId); }
  else{
    const cr=await gtm(t,'/'+W.path+'/triggers','POST',{
      name:'CE — statistics granted', type:'customEvent',
      customEventFilter:[{type:'equals',parameter:[{type:'template',key:'arg0',value:'{{_event}}'},{type:'template',key:'arg1',value:'cmplz_consent_update'}]}],
      filter:[{type:'equals',parameter:[{type:'template',key:'arg0',value:'{{DLV — cmplz_statistics}}'},{type:'template',key:'arg1',value:'granted'}]}]
    });
    L('  POST HTTP '+cr.status);
    if(cr.status!==200){ L('  ❌ '+JSON.stringify(cr.body).slice(0,250)); throw new Error('trig fail'); }
    statTrig=cr.body; L('  ✅ id='+statTrig.triggerId);
  }
  const T_STAT=statTrig.triggerId;
  L('');

  // --- C. GA4 Config: firing tik CE statistics granted ---
  L('=== C. GA4 Config perkonfiguravimas ===');
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const g=tags.find(x=>x.name==='02 — GA4 Config');
  L('  pries: fire=['+((g.firingTriggerId||[]).join(','))+'] once='+(g.tagFiringOption||'-'));
  const up=await gtm(t,'/'+W.path+'/tags/'+g.tagId,'PUT',{
    name:g.name, type:g.type, parameter:g.parameter,
    firingTriggerId:[T_STAT], blockingTriggerId:['17','18'],
    priority:g.priority, consentSettings:g.consentSettings, tagFiringOption:'oncePerLoad',
    notes:'S167: firing tik CE statistics granted. All Pages pasalintas — su oncePerLoad blokuotas fire\'inimas uzskaitydavo limita.'
  });
  L('  po:    HTTP '+up.status+'  fire=['+((up.body.firingTriggerId||[]).join(','))+'] once='+(up.body.tagFiringOption||'-'));
  L('');

  // --- D. Publish v5 ---
  L('=== D. Publish v5 ===');
  const cv=await gtm(t,'/'+W.path+':create_version','POST',{
    name:'v5 — GA4 Config fire tik po statistics sutikimo',
    notes:'GA4 Config: All Pages pasalintas, firing = CE statistics granted. Bridge v1.1 prideda ecommerce replay. S167.' });
  if(cv.status!==200){ L('  ❌ '+JSON.stringify(cv.body).slice(0,250)); throw new Error('cv'); }
  const vid=cv.body.containerVersion.containerVersionId;
  const pub=await gtm(t,'/'+CT+'/versions/'+vid+':publish','POST');
  L('  publish HTTP '+pub.status);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('  LIVE #'+lv.body.containerVersionId+' "'+lv.body.name+'"');
  L('');
  L('=== E. Tag\'u firing suvestine ===');
  for(const x of (lv.body.tag||[]).sort((a,b)=>a.name.localeCompare(b.name))){
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name.padEnd(36)+' fire=['+((x.firingTriggerId||[]).join(','))+'] block=['+((x.blockingTriggerId||[]).join(','))+'] '+(x.paused?'PAUSED':''));
  }
  L('');
  L('  Trigger\'iai: 38=marketing granted, '+T_STAT+'=statistics granted, 37=consent_update, 39=marketing block, 17/18=DEV block');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('gtm_v5_'+Date.now()+'.txt', out); console.log(out);
