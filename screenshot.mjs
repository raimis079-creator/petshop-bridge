import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const ALL_PAGES='2147479553';
const BLOCK=['17','18'];
const CE={ view_item:'19', add_to_cart:'20', view_cart:'21', begin_checkout:'22', purchase:'23' };

const CONSENT_ANALYTICS = {
  consentStatus:'needed',
  consentType:{ type:'list', list:[ {type:'template', value:'analytics_storage'} ] }
};

function ga4Event(ev, trg){
  return {
    name:'GA4 — '+ev,
    type:'gaawe',
    firingTriggerId:[trg],
    blockingTriggerId:BLOCK,
    consentSettings:CONSENT_ANALYTICS,
    parameter:[
      {type:'template', key:'eventName', value:ev},
      {type:'template', key:'measurementIdOverride', value:'{{Const — GA4 ID}}'},
      {type:'boolean',  key:'sendEcommerceData', value:'true'},
      {type:'template', key:'ecommerceMacroData', value:'dataLayer'}
    ]
  };
}

const TAGS = [
  {
    name:'02 — GA4 Config',
    type:'googtag',
    firingTriggerId:[ALL_PAGES],
    blockingTriggerId:BLOCK,
    priority:{type:'integer', value:'800'},
    consentSettings:CONSENT_ANALYTICS,
    parameter:[
      {type:'template', key:'tagId', value:'{{Const — GA4 ID}}'}
    ]
  },
  ga4Event('view_item',      CE.view_item),
  ga4Event('add_to_cart',    CE.add_to_cart),
  ga4Event('view_cart',      CE.view_cart),
  ga4Event('begin_checkout', CE.begin_checkout),
  ga4Event('purchase',       CE.purchase),
];

try{
  const t=await gtmToken(); const W=await defaultWorkspace(t);
  const ex=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  L('PRIES: tags='+ex.length); L('');
  L('=== KURIAM GA4 TAG\'US ===');
  for(const tag of TAGS){
    const dup=ex.find(x=>x.name===tag.name);
    if(dup){ L('  [skip] '+tag.name+' (id '+dup.tagId+')'); continue; }
    const r=await gtm(t,'/'+W.path+'/tags','POST',tag);
    if(r.status===200) L('  [OK]   id='+String(r.body.tagId).padStart(3)+'  '+tag.name);
    else L('  [FAIL] '+tag.name+'  HTTP '+r.status+'\n         '+JSON.stringify(r.body).slice(0,400));
  }
  L('');
  L('=== VERIFIKACIJA ===');
  const nt=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  L('  tags='+nt.length); L('');
  for(const x of nt.sort((a,b)=>a.name.localeCompare(b.name))){
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name);
    L('        type='+x.type.padEnd(8)+' fire=['+((x.firingTriggerId||[]).join(','))+'] block=['+((x.blockingTriggerId||[]).join(','))+'] prio='+(x.priority?.value||'-'));
    const cs=x.consentSettings;
    if(cs) L('        consent='+cs.consentStatus+(cs.consentType?.list?' -> '+cs.consentType.list.map(v=>v.value).join(','):''));
    const ps=(x.parameter||[]).filter(p=>['eventName','tagId','measurementIdOverride','sendEcommerceData','ecommerceMacroData'].includes(p.key));
    if(ps.length) L('        '+ps.map(p=>p.key+'='+p.value).join('  '));
  }
  L('');
  const nv=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const ntr=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('BENDRA: variables='+nv.length+'  tags='+nt.length+'  triggers='+ntr.length);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('LIVE: #'+lv.body.containerVersionId+' — PROD nepaliestas ✅');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('e3_result.txt', out); console.log(out);
