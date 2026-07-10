import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
try{
  const t=await gtmToken(); const W=await defaultWorkspace(t);
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const cl = tags.find(x=>x.name.includes('Conversion Linker'));
  if(!cl) throw new Error('Conversion Linker nerastas');

  L('=== Conversion Linker taisymas ===');
  L('  pries: block=['+((cl.blockingTriggerId||[]).join(','))+']  consent='+JSON.stringify(cl.consentSettings));
  const upd = {
    name: cl.name,
    type: cl.type,
    firingTriggerId: cl.firingTriggerId,
    blockingTriggerId: ['17','18'],
    priority: cl.priority,
    parameter: cl.parameter,
    consentSettings: {
      consentStatus:'needed',
      consentType:{ type:'list', list:[ {type:'template', value:'ad_storage'} ] }
    }
  };
  const r = await gtm(t,'/'+W.path+'/tags/'+cl.tagId,'PUT',upd);
  L('  PUT -> HTTP '+r.status);
  if(r.status!==200){ L('  ❌ '+JSON.stringify(r.body).slice(0,300)); throw new Error('update fail'); }
  L('  po:    block=['+((r.body.blockingTriggerId||[]).join(','))+']  consent='+JSON.stringify(r.body.consentSettings));
  L('');

  L('=== Versija v2 + publish ===');
  const cv = await gtm(t,'/'+W.path+':create_version','POST',{
    name:'v2 — Conversion Linker consent + DEV blocking',
    notes:'Conversion Linker gavo blocking trigger (17,18) ir consentSettings ad_storage. Sprendziama _gcl_au cookie be sutikimo. S166.'
  });
  L('  create_version -> HTTP '+cv.status);
  if(cv.status!==200){ L('  ❌ '+JSON.stringify(cv.body).slice(0,300)); throw new Error('cv fail'); }
  const vid = cv.body.containerVersion.containerVersionId;
  L('  versionId='+vid);
  const pub = await gtm(t,'/'+CT+'/versions/'+vid+':publish','POST');
  L('  publish -> HTTP '+pub.status);
  L('');
  const lv = await gtm(t,'/'+CT+'/versions:live');
  L('  LIVE: #'+lv.body.containerVersionId+' "'+lv.body.name+'"  tags='+((lv.body.tag||[]).length));
  const clLive = (lv.body.tag||[]).find(x=>x.name.includes('Conversion Linker'));
  L('  Conversion Linker live: block=['+((clLive.blockingTriggerId||[]).join(','))+']  consent='+JSON.stringify(clLive.consentSettings));
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('cl_fix.txt', out); console.log(out);
