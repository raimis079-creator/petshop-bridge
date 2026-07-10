import { putFile, gtmToken, gtm, defaultWorkspace, CT, IDS } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

const TRG_ALL_PAGES = '2147479553';
const TRG_CONSENT_INIT = '2147479573';

const CONSENT_HTML = `<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'personalization_storage': 'granted',
  'security_storage': 'granted',
  'wait_for_update': 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
<\/script>`;

const VARIABLES = [
  { name:'Const — GA4 ID',            type:'c', parameter:[{type:'template',key:'value',value:IDS.ga4}] },
  { name:'Const — Ads Conversion ID', type:'c', parameter:[{type:'template',key:'value',value:'11117260149'}] },
  { name:'Const — Ads Label',         type:'c', parameter:[{type:'template',key:'value',value:'7JbYCNuThZIYEPXaj7Up'}] },
  { name:'Const — Meta Pixel ID',     type:'c', parameter:[{type:'template',key:'value',value:IDS.metaPixel}] },
  { name:'DLV — ecommerce',           type:'v', parameter:[{type:'template',key:'name',value:'ecommerce'},{type:'integer',key:'dataLayerVersion',value:'2'}] },
  { name:'DLV — transaction_id',      type:'v', parameter:[{type:'template',key:'name',value:'ecommerce.transaction_id'},{type:'integer',key:'dataLayerVersion',value:'2'}] },
  { name:'DLV — value',               type:'v', parameter:[{type:'template',key:'name',value:'ecommerce.value'},{type:'integer',key:'dataLayerVersion',value:'2'}] },
  { name:'DLV — currency',            type:'v', parameter:[{type:'template',key:'name',value:'ecommerce.currency'},{type:'integer',key:'dataLayerVersion',value:'2'}] },
  { name:'DLV — items',               type:'v', parameter:[{type:'template',key:'name',value:'ecommerce.items'},{type:'integer',key:'dataLayerVersion',value:'2'}] },
  { name:'DLV — user_email_hashed',   type:'v', parameter:[{type:'template',key:'name',value:'user_data.sha256_email_address'},{type:'integer',key:'dataLayerVersion',value:'2'}] },
];

const TAGS = [
  {
    name:'00 — Consent Mode v2 Default',
    type:'html',
    tagFiringOption:'oncePerEvent',
    tagFiringPriority:{type:'integer',value:'1000'},
    firingTriggerId:[TRG_CONSENT_INIT],
    parameter:[
      {type:'template',key:'html',value:CONSENT_HTML},
      {type:'boolean',key:'supportDocumentWrite',value:'false'}
    ]
  },
  {
    name:'01 — Conversion Linker',
    type:'sp',
    firingTriggerId:[TRG_ALL_PAGES],
    parameter:[
      {type:'boolean',key:'enableLinkerParameter',value:'false'},
      {type:'boolean',key:'enableCrossDomain',value:'false'}
    ]
  }
];

try{
  const t = await gtmToken();
  const W = await defaultWorkspace(t);
  L('Workspace: '+W.name+' (id '+W.workspaceId+')');
  L('');

  // --- Esama busena ---
  const exVars = (await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const exTags = (await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const exTrig = (await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('PRIES: variables='+exVars.length+' tags='+exTags.length+' triggers='+exTrig.length);
  L('');

  // --- Built-in variables ---
  const bv = (await gtm(t,'/'+W.path+'/built_in_variables')).body.builtInVariable||[];
  const have = bv.map(v=>v.type);
  L('=== BUILT-IN VARIABLES ===');
  L('  esami: '+have.join(', '));
  const wanted = ['PAGE_HOSTNAME','PAGE_URL','PAGE_PATH','EVENT','REFERRER'];
  const missing = wanted.filter(x=>!have.includes(x));
  L('  reikalingi: '+wanted.join(', '));
  L('  trukstami: '+(missing.length?missing.join(', '):'nera ✅'));
  if(missing.length){
    const r = await gtm(t,'/'+W.path+'/built_in_variables:create?type='+missing.join('&type='),'POST');
    L('  ijungimas -> HTTP '+r.status);
  }
  L('');

  // --- Variables ---
  L('=== VARIABLES ===');
  for(const v of VARIABLES){
    const exists = exVars.find(x=>x.name===v.name);
    if(exists){ L('  [skip] '+v.name+' (jau yra, id '+exists.variableId+')'); continue; }
    const r = await gtm(t,'/'+W.path+'/variables','POST',v);
    if(r.status===200) L('  [OK]   id='+String(r.body.variableId).padStart(3)+'  '+v.name);
    else L('  [FAIL] '+v.name+' HTTP '+r.status+' '+JSON.stringify(r.body).slice(0,200));
  }
  L('');

  // --- Tags ---
  L('=== TAGS ===');
  for(const tag of TAGS){
    const exists = exTags.find(x=>x.name===tag.name);
    if(exists){ L('  [skip] '+tag.name+' (jau yra, id '+exists.tagId+')'); continue; }
    const r = await gtm(t,'/'+W.path+'/tags','POST',tag);
    if(r.status===200) L('  [OK]   id='+String(r.body.tagId).padStart(3)+'  '+tag.name+'  type='+r.body.type);
    else L('  [FAIL] '+tag.name+' HTTP '+r.status+' '+JSON.stringify(r.body).slice(0,300));
  }
  L('');

  // --- Verifikacija ---
  L('=== VERIFIKACIJA (skaitom atgal) ===');
  const nv = (await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const nt = (await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  L('PO: variables='+nv.length+' tags='+nt.length);
  L('');
  L('  Variables:');
  for(const v of nv) L('    ['+String(v.variableId).padStart(3)+'] '+v.name.padEnd(30)+' type='+v.type);
  L('');
  L('  Tags:');
  for(const x of nt){
    L('    ['+String(x.tagId).padStart(3)+'] '+x.name);
    L('          type='+x.type+'  firing=['+((x.firingTriggerId||[]).join(','))+']  priority='+(x.tagFiringPriority?.value||'-')+'  paused='+(x.paused?'YES':'no'));
  }
  L('');
  const consentTag = nt.find(x=>x.name.includes('Consent Mode'));
  if(consentTag){
    const html = (consentTag.parameter||[]).find(p=>p.key==='html')?.value||'';
    L('  Consent tag HTML patikra:');
    for(const k of ['ad_storage','ad_user_data','ad_personalization','analytics_storage','wait_for_update','ads_data_redaction','url_passthrough']){
      L('    '+(html.includes(k)?'✅':'❌')+' '+k);
    }
    L('    denied kartu: '+((html.match(/denied/g)||[]).length)+' (laukiama 4)');
    L('    granted kartu: '+((html.match(/granted/g)||[]).length)+' (laukiama 3)');
  }
  L('');
  const lv = await gtm(t,'/'+CT+'/versions:live');
  L('LIVE version: #'+lv.body.containerVersionId+' "'+(lv.body.name||'-')+'" — nepublikuota, PROD nepaliestas');
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('e1_result.txt', out); console.log(out);
