import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const BLOCK=['17','18'];
const CE_PURCHASE='23';

const TAG_ADS = {
  name:'03 — Google Ads Conversion (Purchase)',
  type:'awct',
  firingTriggerId:[CE_PURCHASE],
  blockingTriggerId:BLOCK,
  consentSettings:{
    consentStatus:'needed',
    consentType:{ type:'list', list:[
      {type:'template', value:'ad_storage'},
      {type:'template', value:'ad_user_data'}
    ]}
  },
  parameter:[
    {type:'template', key:'conversionId',    value:'{{Const — Ads Conversion ID}}'},
    {type:'template', key:'conversionLabel', value:'{{Const — Ads Label}}'},
    {type:'template', key:'conversionValue', value:'{{DLV — value}}'},
    {type:'template', key:'currencyCode',    value:'{{DLV — currency}}'},
    {type:'template', key:'orderId',         value:'{{DLV — transaction_id}}'},
    {type:'boolean',  key:'enableConversionLinker', value:'true'}
  ]
};

try{
  const t=await gtmToken(); const W=await defaultWorkspace(t);

  // --- A. gaawe pilnu parametru patikra ---
  L('=== A. GA4 purchase tag — PILNI parametrai ===');
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const gp = tags.find(x=>x.name==='GA4 — purchase');
  if(gp){
    for(const p of (gp.parameter||[])) L('    '+p.key+' ('+p.type+') = '+(p.value!==undefined?p.value:JSON.stringify(p.list||p.map||'')).toString().slice(0,80));
    const hasEcom = (gp.parameter||[]).some(p=>p.key==='ecommerceMacroData');
    L('  ecommerceMacroData issaugotas: '+(hasEcom?'✅ TAIP':'❌ NE — reikia taisyti'));
  } else L('  ❌ tag nerastas');
  L('');

  // --- B. Ads Conversion tag ---
  L('=== B. Google Ads Conversion tag ===');
  const dup=tags.find(x=>x.name===TAG_ADS.name);
  if(dup){ L('  [skip] jau yra id='+dup.tagId); }
  else{
    const r=await gtm(t,'/'+W.path+'/tags','POST',TAG_ADS);
    L('  POST -> HTTP '+r.status);
    if(r.status===200){
      L('  ✅ id='+r.body.tagId+'  type='+r.body.type);
      for(const p of (r.body.parameter||[])) L('      '+p.key+' = '+p.value);
    } else L('  ❌ '+JSON.stringify(r.body).slice(0,500));
  }
  L('');

  // --- C. Verifikacija ---
  L('=== C. VISI TAG\'AI ===');
  const nt=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  for(const x of nt.sort((a,b)=>a.name.localeCompare(b.name))){
    const cs=x.consentSettings;
    const cons = cs && cs.consentType?.list ? cs.consentType.list.map(v=>v.value).join('+') : (cs?.consentStatus||'-');
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name.padEnd(38)+' type='+x.type.padEnd(8)+' fire=['+((x.firingTriggerId||[]).join(','))+'] block=['+((x.blockingTriggerId||[]).join(','))+'] consent='+cons);
  }
  L('');
  const nv=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const ntr=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('BENDRA: variables='+nv.length+'  tags='+nt.length+'  triggers='+ntr.length);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('LIVE: #'+lv.body.containerVersionId+' — PROD nepaliestas ✅');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('e4_result.txt', out); console.log(out);
