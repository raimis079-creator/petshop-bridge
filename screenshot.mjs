import { execSync } from "child_process";
import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

try{
  const t=await gtmToken(); const W=await defaultWorkspace(t);

  // ---- 1. Backup: pilnas workspace eksportas ----
  L('=== 1. Workspace backup ===');
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const trig=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  const vars=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const bv=(await gtm(t,'/'+W.path+'/built_in_variables')).body.builtInVariable||[];
  const backup={ exported:new Date().toISOString(), container:CT,
    counts:{tags:tags.length,triggers:trig.length,variables:vars.length,builtIn:bv.length},
    tags, triggers:trig, variables:vars, builtInVariables:bv };
  putFile('gtm_workspace_backup.json', JSON.stringify(backup,null,1));
  L('  issaugota: screenshots/gtm_workspace_backup.json');
  L('  tags='+tags.length+' triggers='+trig.length+' variables='+vars.length);
  L('');

  // ---- 2. Pries publish: dabartine live ----
  L('=== 2. Dabartine LIVE versija ===');
  const before=await gtm(t,'/'+CT+'/versions:live');
  L('  #'+before.body.containerVersionId+' "'+(before.body.name||'-')+'"  tags='+((before.body.tag||[]).length));
  L('');

  // ---- 3. Sukuriam versija ----
  L('=== 3. Kuriam versija ===');
  const cv = await gtm(t,'/'+W.path+':create_version','POST',{
    name:'v1 — initial tracking setup',
    notes:'Consent Mode v2 default, Conversion Linker, GA4 Config + 5 event tags (G-FMTKEGGLMG), Google Ads Conversion (11117260149/7JbYCNuThZIYEPXaj7Up), Meta Pixel base + 3 events (1097111687955877). DEV blocking triggers: dev.avesa.lt be gtm_test=1. Sukurta per API, S166.'
  });
  L('  HTTP '+cv.status);
  if(cv.status!==200){ L('  ❌ '+JSON.stringify(cv.body).slice(0,500)); throw new Error('create_version fail'); }
  const ver = cv.body.containerVersion;
  if(cv.body.compilerError) L('  ⚠️ compilerError: '+JSON.stringify(cv.body.compilerError).slice(0,300));
  if(cv.body.syncStatus)   L('  syncStatus: '+JSON.stringify(cv.body.syncStatus));
  L('  versionId='+ver.containerVersionId+'  name="'+ver.name+'"');
  L('  turinys: tags='+((ver.tag||[]).length)+' triggers='+((ver.trigger||[]).length)+' variables='+((ver.variable||[]).length));
  L('');

  // ---- 4. Publish ----
  L('=== 4. Publish ===');
  const pub = await gtm(t,'/'+CT+'/versions/'+ver.containerVersionId+':publish','POST');
  L('  HTTP '+pub.status);
  if(pub.status!==200){ L('  ❌ '+JSON.stringify(pub.body).slice(0,500)); throw new Error('publish fail'); }
  L('  ✅ publikuota');
  L('');

  // ---- 5. Verifikacija: live versija ----
  L('=== 5. LIVE po publish ===');
  const after=await gtm(t,'/'+CT+'/versions:live');
  L('  #'+after.body.containerVersionId+' "'+(after.body.name||'-')+'"');
  L('  tags='+((after.body.tag||[]).length)+' triggers='+((after.body.trigger||[]).length)+' variables='+((after.body.variable||[]).length));
  L('');
  L('  Live tag\'ai:');
  for(const x of (after.body.tag||[]).sort((a,b)=>a.name.localeCompare(b.name))) L('    ['+x.tagId+'] '+x.name+'  ('+x.type+')');
  L('');

  // ---- 6. Viesas gtm.js — ar tikrai atsinaujino ----
  L('=== 6. Viesas gtm.js turinys ===');
  await new Promise(r=>setTimeout(r,5000));
  const js = execSync('curl -sk --max-time 40 "https://www.googletagmanager.com/gtm.js?id=GTM-MF3GZGT"',{encoding:'utf8',maxBuffer:60000000});
  L('  dydis: '+js.length+' B  (pries publish buvo ~323 KB tuscias)');
  const found={
    'G-FMTKEGGLMG':      js.includes('G-FMTKEGGLMG'),
    'AW-11117260149':    js.includes('11117260149'),
    'conversion label':  js.includes('7JbYCNuThZIYEPXaj7Up'),
    'Meta pixel ID':     js.includes('1097111687955877'),
    'connect.facebook':  js.includes('connect.facebook.net'),
    'consent default':   /gtag\(.consent.,\s*.default./.test(js) || js.includes('ads_data_redaction'),
    'dev.avesa.lt block':js.includes('dev.avesa.lt'),
    'gtm_test':          js.includes('gtm_test'),
  };
  for(const [k,v] of Object.entries(found)) L('  '+(v?'✅':'❌')+' '+k);
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('e7_publish.txt', out); console.log(out);
