import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const TRG_ALL_PAGES='2147479553';

try{
  const t = await gtmToken();
  const W = await defaultWorkspace(t);
  L('Workspace: '+W.name); L('');

  // ---------- 1. Consent tag: priority fix ----------
  L('=== 1. Consent Mode tag — priority fix ===');
  const tags = (await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const ct = tags.find(x=>x.name.includes('Consent Mode'));
  if(!ct){ L('  ❌ tag nerastas'); }
  else{
    L('  esamas priority: '+JSON.stringify(ct.priority||null));
    const upd = {
      name: ct.name,
      type: ct.type,
      firingTriggerId: ct.firingTriggerId,
      parameter: ct.parameter,
      priority: { type:'integer', value:'1000' },
      tagFiringOption: 'oncePerEvent'
    };
    const r = await gtm(t,'/'+W.path+'/tags/'+ct.tagId,'PUT',upd);
    L('  PUT -> HTTP '+r.status);
    if(r.status===200) L('  naujas priority: '+JSON.stringify(r.body.priority||null));
    else L('  '+JSON.stringify(r.body).slice(0,300));
  }
  L('');

  // ---------- 2. Conversion Linker: teisingas tipas ----------
  L('=== 2. Conversion Linker (type=gclidw) ===');
  const already = tags.find(x=>x.name.includes('Conversion Linker'));
  if(already){ L('  [skip] jau yra id='+already.tagId); }
  else{
    const r = await gtm(t,'/'+W.path+'/tags','POST',{
      name:'01 — Conversion Linker',
      type:'gclidw',
      firingTriggerId:[TRG_ALL_PAGES],
      priority:{ type:'integer', value:'900' },
      parameter:[
        {type:'boolean', key:'enableCrossDomain', value:'false'},
        {type:'boolean', key:'acceptIncoming', value:'true'}
      ]
    });
    L('  POST -> HTTP '+r.status);
    if(r.status===200) L('  ✅ sukurta id='+r.body.tagId+' type='+r.body.type+' priority='+JSON.stringify(r.body.priority||null));
    else L('  ❌ '+JSON.stringify(r.body).slice(0,400));
  }
  L('');

  // ---------- 3. Built-in variables — tikrinam teisingai ----------
  L('=== 3. Built-in variables (realus sarasas) ===');
  const bv = (await gtm(t,'/'+W.path+'/built_in_variables')).body.builtInVariable||[];
  bv.forEach(v=>L('  ✅ '+v.type+'  ('+v.name+')'));
  L('  is viso: '+bv.length);
  L('');

  // ---------- 4. Galutine verifikacija ----------
  L('=== 4. VERIFIKACIJA ===');
  const nv=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const nt=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const ntr=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('  variables='+nv.length+'  tags='+nt.length+'  triggers='+ntr.length);
  L('');
  for(const x of nt.sort((a,b)=>a.name.localeCompare(b.name))){
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name);
    L('        type='+x.type.padEnd(8)+' firing=['+((x.firingTriggerId||[]).join(','))+']  priority='+(x.priority?.value||'nenustatytas')+'  paused='+(x.paused?'YES':'no'));
    if(x.consentSettings) L('        consent='+JSON.stringify(x.consentSettings));
  }
  L('');
  L('  Trigger ID reiksmes:');
  L('    2147479573 = Consent Initialization — All Pages');
  L('    2147479553 = All Pages');
  L('');
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('  LIVE: #'+lv.body.containerVersionId+' "'+(lv.body.name||'-')+'" — PROD nepaliestas ✅');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('e1_fix.txt', out); console.log(out);
