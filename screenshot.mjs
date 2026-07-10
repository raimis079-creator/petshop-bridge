import { putFile, gtmToken, gtm, defaultWorkspace, CT, IDS } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const ALL_PAGES='2147479553';
const BLOCK=['17','18'];
const CE={ add_to_cart:'20', begin_checkout:'22', purchase:'23' };
const CT_END='<'+'/script>';

const CONSENT_MKT = {
  consentStatus:'needed',
  consentType:{ type:'list', list:[
    {type:'template', value:'ad_storage'},
    {type:'template', value:'ad_personalization'}
  ]}
};

const BASE_HTML =
'<script>\n'+
'!function(f,b,e,v,n,t,s)\n'+
'{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n'+
'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n'+
"if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n"+
'n.queue=[];t=b.createElement(e);t.async=!0;\n'+
't.src=v;s=b.getElementsByTagName(e)[0];\n'+
"s.parentNode.insertBefore(t,s)}(window,document,'script',\n"+
"'https://connect.facebook.net/en_US/fbevents.js');\n"+
"fbq('init', '"+IDS.metaPixel+"');\n"+
"fbq('track', 'PageView');\n"+
CT_END;

// Bendra funkcija: skaito paskutini ecommerce is dataLayer (be GTM interpoliacijos)
const READ_EC =
'  var dl = window.dataLayer || [];\n'+
'  var ec = null;\n'+
'  for (var i = dl.length - 1; i >= 0; i--) {\n'+
'    if (dl[i] && dl[i].ecommerce) { ec = dl[i].ecommerce; break; }\n'+
'  }\n'+
'  if (!ec) return;\n'+
'  var items = ec.items || [];\n'+
'  var ids = items.map(function(x){ return String(x.item_id); });\n'+
'  var contents = items.map(function(x){ return { id: String(x.item_id), quantity: x.quantity || 1 }; });\n';

function metaEvent(name, fbName, extra){
  return {
    name:'Meta — '+name,
    type:'html',
    firingTriggerId:[CE[name]],
    blockingTriggerId:BLOCK,
    consentSettings:CONSENT_MKT,
    parameter:[
      {type:'template', key:'html', value:
        '<script>\n(function(){\n'+
        '  if (typeof fbq !== "function") return;\n'+
        READ_EC +
        extra +
        '})();\n'+CT_END },
      {type:'boolean', key:'supportDocumentWrite', value:'false'}
    ]
  };
}

const TAGS = [
  {
    name:'04 — Meta Pixel Base + PageView',
    type:'html',
    firingTriggerId:[ALL_PAGES],
    blockingTriggerId:BLOCK,
    priority:{type:'integer', value:'700'},
    consentSettings:CONSENT_MKT,
    parameter:[
      {type:'template', key:'html', value:BASE_HTML},
      {type:'boolean', key:'supportDocumentWrite', value:'false'}
    ]
  },
  metaEvent('add_to_cart','AddToCart',
    "  fbq('track', 'AddToCart', {\n"+
    "    value: ec.value,\n"+
    "    currency: ec.currency,\n"+
    "    content_type: 'product',\n"+
    "    content_ids: ids,\n"+
    "    contents: contents\n"+
    "  });\n"),
  metaEvent('begin_checkout','InitiateCheckout',
    "  fbq('track', 'InitiateCheckout', {\n"+
    "    value: ec.value,\n"+
    "    currency: ec.currency,\n"+
    "    content_type: 'product',\n"+
    "    content_ids: ids,\n"+
    "    contents: contents,\n"+
    "    num_items: items.length\n"+
    "  });\n"),
  metaEvent('purchase','Purchase',
    "  fbq('track', 'Purchase', {\n"+
    "    value: ec.value,\n"+
    "    currency: ec.currency,\n"+
    "    content_type: 'product',\n"+
    "    content_ids: ids,\n"+
    "    contents: contents\n"+
    "  }, { eventID: 'purchase_' + ec.transaction_id });\n"),
];

try{
  const t=await gtmToken(); const W=await defaultWorkspace(t);
  const ex=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  L('PRIES: tags='+ex.length); L('');
  L('=== KURIAM META TAG\'US ===');
  for(const tag of TAGS){
    const dup=ex.find(x=>x.name===tag.name);
    if(dup){ L('  [skip] '+tag.name+' (id '+dup.tagId+')'); continue; }
    const r=await gtm(t,'/'+W.path+'/tags','POST',tag);
    if(r.status===200) L('  [OK]   id='+String(r.body.tagId).padStart(3)+'  '+tag.name);
    else L('  [FAIL] '+tag.name+'  HTTP '+r.status+'\n         '+JSON.stringify(r.body).slice(0,400));
  }
  L('');
  L('=== HTML TURINIO PATIKRA ===');
  const nt=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  for(const x of nt.filter(y=>y.name.startsWith('Meta') || y.name.includes('Meta Pixel'))){
    const html=(x.parameter||[]).find(p=>p.key==='html')?.value||'';
    L('  ['+x.tagId+'] '+x.name+'  ('+html.length+' simb.)');
    const checks = {
      'fbq init': html.includes("fbq('init'"),
      'PageView': html.includes("'PageView'"),
      'AddToCart': html.includes("'AddToCart'"),
      'InitiateCheckout': html.includes("'InitiateCheckout'"),
      'Purchase': html.includes("'Purchase'"),
      'dataLayer skaitymas': html.includes('window.dataLayer'),
      'eventID (dedupe)': html.includes('eventID'),
      'fbq guard': html.includes('typeof fbq'),
    };
    for(const [k,v] of Object.entries(checks)) if(v) L('        ✅ '+k);
  }
  L('');
  L('=== GALUTINE BUSENA ===');
  for(const x of nt.sort((a,b)=>a.name.localeCompare(b.name))){
    const cs=x.consentSettings;
    const cons = cs?.consentType?.list ? cs.consentType.list.map(v=>v.value).join('+') : (cs?.consentStatus||'-');
    L('  ['+String(x.tagId).padStart(3)+'] '+x.name.padEnd(38)+' '+x.type.padEnd(8)+' fire=['+((x.firingTriggerId||[]).join(','))+'] block=['+((x.blockingTriggerId||[]).join(','))+'] '+cons);
  }
  const nv=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const ntr=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('');
  L('BENDRA: variables='+nv.length+'  tags='+nt.length+'  triggers='+ntr.length);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('LIVE: #'+lv.body.containerVersionId+' — PROD nepaliestas ✅');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('e5_result.txt', out); console.log(out);
