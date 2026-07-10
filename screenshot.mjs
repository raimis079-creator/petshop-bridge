import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
try{
  const t=await gtmToken();
  L('=== LIVE versijos tag\'u consentSettings ===');
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('  versija #'+lv.body.containerVersionId+' "'+lv.body.name+'"'); L('');
  for(const x of (lv.body.tag||[]).sort((a,b)=>a.name.localeCompare(b.name))){
    const cs=x.consentSettings;
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name.padEnd(38));
    L('        consentSettings = '+(cs?JSON.stringify(cs):'NERA'));
  }
  L('');
  L('=== Workspace tag\'u consentSettings (palyginimui) ===');
  const W=await defaultWorkspace(t);
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  for(const x of tags.sort((a,b)=>a.name.localeCompare(b.name))){
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name.padEnd(38)+' '+(x.consentSettings?JSON.stringify(x.consentSettings):'NERA'));
  }
  L('');
  L('=== Ar Complianz siuncia dataLayer event\'us? (plugin dar neaktyvus) ===');
  L('  Complianz v7.5.0 — INACTIVE. Aktyvavus jis siuncia:');
  L('    cmplz_event_functional / cmplz_event_statistics / cmplz_event_marketing');
  L('    cmplz_status_change');
  L('  Sie event\'ai gali buti naudojami kaip GTM custom event trigger\'iai.');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('consent_settings_check.txt', out); console.log(out);
