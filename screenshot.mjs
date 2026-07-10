import { execSync as __ex } from "child_process";
import __fs from "fs";
import { gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
function putFile(n, s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){
    try{
      const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
      let sha=''; try{ sha=JSON.parse(__ex('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
      const body={message:'ci '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};
      if(sha) body.sha=sha;
      __fs.writeFileSync('/tmp/pf.json',JSON.stringify(body));
      const r=__ex('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
      const c=(r.match(/HTTP:(\d+)/)||[])[1];
      if(c==='200'||c==='201') return true;
    }catch(e){}
    __ex('sleep 2');
  }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};

try{
  const t=await gtmToken(); const W=await defaultWorkspace(t);

  // ---------- 1. Nauji kintamieji ----------
  L('=== 1. dataLayer kintamieji ===');
  const vars=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  for(const nm of ['cmplz_marketing','cmplz_statistics']){
    const name='DLV — '+nm;
    if(vars.find(v=>v.name===name)){ L('  [skip] '+name); continue; }
    const r=await gtm(t,'/'+W.path+'/variables','POST',{
      name, type:'v',
      parameter:[{type:'template',key:'name',value:nm},{type:'integer',key:'dataLayerVersion',value:'2'}]
    });
    L('  '+(r.status===200?'[OK] id='+r.body.variableId:'[FAIL] '+r.status)+'  '+name);
  }
  L('');

  // ---------- 2. Nauji trigger'iai ----------
  L('=== 2. Trigger\'iai ===');
  const trigs=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  const NEW_TRIGGERS=[
    { name:'CE — cmplz_consent_update', type:'customEvent',
      customEventFilter:[{type:'equals',parameter:[{type:'template',key:'arg0',value:'{{_event}}'},{type:'template',key:'arg1',value:'cmplz_consent_update'}]}] },
    { name:'CE — marketing granted', type:'customEvent',
      customEventFilter:[{type:'equals',parameter:[{type:'template',key:'arg0',value:'{{_event}}'},{type:'template',key:'arg1',value:'cmplz_consent_update'}]}],
      filter:[{type:'equals',parameter:[{type:'template',key:'arg0',value:'{{DLV — cmplz_marketing}}'},{type:'template',key:'arg1',value:'granted'}]}] },
    { name:'BLOCK — marketing nesutikta (events)', type:'customEvent',
      customEventFilter:[{type:'matchRegex',parameter:[{type:'template',key:'arg0',value:'{{_event}}'},{type:'template',key:'arg1',value:'.*'}]}],
      filter:[{type:'equals',parameter:[{type:'template',key:'arg0',value:'{{DLV — cmplz_marketing}}'},{type:'template',key:'arg1',value:'granted'},{type:'boolean',key:'negate',value:'true'}]}] },
  ];
  const ids={};
  for(const tr of NEW_TRIGGERS){
    const dup=trigs.find(x=>x.name===tr.name);
    if(dup){ L('  [skip] '+tr.name+' (id '+dup.triggerId+')'); ids[tr.name]=dup.triggerId; continue; }
    const r=await gtm(t,'/'+W.path+'/triggers','POST',tr);
    if(r.status===200){ L('  [OK] id='+r.body.triggerId+'  '+tr.name); ids[tr.name]=r.body.triggerId; }
    else L('  [FAIL] '+tr.name+'  '+r.status+' '+JSON.stringify(r.body).slice(0,200));
  }
  L('');
  const T_CONSENT = ids['CE — cmplz_consent_update'];
  const T_MKT_OK  = ids['CE — marketing granted'];
  const T_MKT_BLK = ids['BLOCK — marketing nesutikta (events)'];
  L('  consent_update='+T_CONSENT+'  marketing_granted='+T_MKT_OK+'  marketing_block='+T_MKT_BLK);
  L('');

  // ---------- 3. Tag'u perkonfiguravimas ----------
  L('=== 3. Tag\'u atnaujinimas ===');
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const byName = n => tags.find(x=>x.name===n);

  async function upd(tag, changes, why){
    const base={ name:tag.name, type:tag.type, parameter:tag.parameter,
      firingTriggerId:tag.firingTriggerId, blockingTriggerId:tag.blockingTriggerId,
      priority:tag.priority, consentSettings:tag.consentSettings, paused:tag.paused,
      tagFiringOption:tag.tagFiringOption };
    const body=Object.assign(base, changes);
    const r=await gtm(t,'/'+W.path+'/tags/'+tag.tagId,'PUT',body);
    L('  ['+tag.tagId+'] '+tag.name);
    L('       '+why);
    L('       HTTP '+r.status+'  fire=['+((r.body.firingTriggerId||[]).join(','))+'] block=['+((r.body.blockingTriggerId||[]).join(','))+'] once='+(r.body.tagFiringOption||'-'));
    if(r.status!==200) L('       ❌ '+JSON.stringify(r.body).slice(0,200));
  }

  // GA4 Config: + CE consent_update, oncePerPage
  const ga4c=byName('02 — GA4 Config');
  if(ga4c) await upd(ga4c, { firingTriggerId:['2147479553', T_CONSENT], tagFiringOption:'oncePerLoad' },
    'prideta CE cmplz_consent_update -> fire\'ina po sutikimo. oncePerLoad kad nedubliuotu.');

  // Conversion Linker: fire tik po marketing sutikimo
  const cl=byName('01 — Conversion Linker');
  if(cl) await upd(cl, { firingTriggerId:[T_MKT_OK], blockingTriggerId:['17','18'], tagFiringOption:'oncePerLoad' },
    'All Pages -> CE marketing granted. _gcl_au tik po sutikimo.');

  // Meta Base: fire tik po marketing sutikimo
  const mb=byName('04 — Meta Pixel Base + PageView');
  if(mb) await upd(mb, { firingTriggerId:[T_MKT_OK], blockingTriggerId:['17','18'], tagFiringOption:'oncePerLoad' },
    'All Pages -> CE marketing granted. _fbp tik po sutikimo.');

  // Meta event tag'ai: + blocking marketing denied
  for(const nm of ['Meta — add_to_cart','Meta — begin_checkout','Meta — purchase']){
    const x=byName(nm);
    if(x) await upd(x, { blockingTriggerId:['17','18',T_MKT_BLK] },
      'prideta BLOCK marketing nesutikta.');
  }
  L('');

  // ---------- 4. Publish ----------
  L('=== 4. Publish v4 ===');
  const cv=await gtm(t,'/'+W.path+':create_version','POST',{
    name:'v4 — consent-based triggers',
    notes:'CE cmplz_consent_update + CE marketing granted + BLOCK marketing nesutikta. GA4 Config fire ir po sutikimo. Conversion Linker ir Meta Base fire TIK po marketing sutikimo. S167.' });
  L('  create_version HTTP '+cv.status);
  if(cv.status!==200){ L('  ❌ '+JSON.stringify(cv.body).slice(0,300)); throw new Error('cv'); }
  const vid=cv.body.containerVersion.containerVersionId;
  const pub=await gtm(t,'/'+CT+'/versions/'+vid+':publish','POST');
  L('  publish HTTP '+pub.status);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('  LIVE #'+lv.body.containerVersionId+' "'+lv.body.name+'"');
  L('');
  L('=== 5. Galutine tag\'u busena ===');
  for(const x of (lv.body.tag||[]).sort((a,b)=>a.name.localeCompare(b.name))){
    const cs=x.consentSettings;
    const cons=cs?.consentType?.list ? cs.consentType.list.map(v=>v.value).join('+') : (cs?.consentStatus||'-');
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name.padEnd(36)+' fire=['+((x.firingTriggerId||[]).join(','))+'] block=['+((x.blockingTriggerId||[]).join(','))+'] '+(x.paused?'PAUSED':'')+' '+cons);
  }
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('gtm_v4_'+Date.now()+'.txt', out);
console.log(out);
