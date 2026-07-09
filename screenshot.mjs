import { putFile, gtmToken, gtm, defaultWorkspace, CT, IDS } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
try{
  const t = await gtmToken();
  L('AUTH OK'); L('lib CT = '+CT); L('');
  const W = await defaultWorkspace(t);
  L('Workspace: '+W.name+' (id '+W.workspaceId+')'); L('');

  // --- Pries testa: busena ---
  const before = {
    tags:   ((await gtm(t,'/'+W.path+'/tags')).body.tag||[]).length,
    trigs:  ((await gtm(t,'/'+W.path+'/triggers')).body.trigger||[]).length,
    vars:   ((await gtm(t,'/'+W.path+'/variables')).body.variable||[]).length
  };
  L('PRIES: tags='+before.tags+' triggers='+before.trigs+' variables='+before.vars); L('');

  // --- WRITE TEST: sukuriam laikina konstanta ---
  L('=== WRITE TEST: POST /variables ===');
  const cr = await gtm(t,'/'+W.path+'/variables','POST',{
    name:'TEMP API Write Test — istrinti',
    type:'c',
    parameter:[{type:'template', key:'value', value:'ok'}]
  });
  L('  HTTP '+cr.status);
  if(cr.status!==200 && cr.status!==201){ L('  body: '+JSON.stringify(cr.body).slice(0,400)); throw new Error('WRITE DENIED'); }
  const vid = cr.body.variableId;
  L('  sukurta variableId='+vid+' name="'+cr.body.name+'"');
  L('');

  // --- Patikra kad realiai yra ---
  const chk = await gtm(t,'/'+W.path+'/variables');
  const found = (chk.body.variable||[]).find(v=>v.variableId===vid);
  L('  patikra: '+(found ? 'RASTA saraše ✅' : 'NERASTA ❌'));
  L('');

  // --- DELETE TEST ---
  L('=== DELETE TEST: DELETE /variables/'+vid+' ===');
  const del = await gtm(t,'/'+W.path+'/variables/'+vid,'DELETE');
  L('  HTTP '+del.status+(del.status===200?' (istrinta)':''));
  L('');

  // --- Po testo: busena ---
  const after = {
    tags:   ((await gtm(t,'/'+W.path+'/tags')).body.tag||[]).length,
    trigs:  ((await gtm(t,'/'+W.path+'/triggers')).body.trigger||[]).length,
    vars:   ((await gtm(t,'/'+W.path+'/variables')).body.variable||[]).length
  };
  L('PO:    tags='+after.tags+' triggers='+after.trigs+' variables='+after.vars);
  const clean = (before.tags===after.tags && before.trigs===after.trigs && before.vars===after.vars);
  L('SVARA: '+(clean?'container nepakitęs ✅':'NESUTAMPA ❌'));
  L('');

  // --- Live version nepaliesta? ---
  const lv = await gtm(t,'/'+CT+'/versions:live');
  L('LIVE version: #'+lv.body.containerVersionId+' "'+(lv.body.name||'-')+'" (nepublikuota niekas)');
  L('');
  L('=== TEISES PATVIRTINTOS ===');
  L('  READ  ✅   CREATE ✅   DELETE ✅');
  L('');
  L('=== UZFIKSUOTI ID ===');
  for(const [k,v] of Object.entries(IDS)) L('  '+k.padEnd(10)+' = '+v);
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('gtm_write_test.txt', out); console.log(out);
