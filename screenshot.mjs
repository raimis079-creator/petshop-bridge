import { putFile, gtmToken, gtm, defaultWorkspace, CT } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

// Salygos DEV blokavimui: hostname turi dev.avesa.lt IR URL NEturi gtm_test=1
const DEV_FILTERS = [
  { type:'contains', parameter:[
      {type:'template', key:'arg0', value:'{{Page Hostname}}'},
      {type:'template', key:'arg1', value:'dev.avesa.lt'}
  ]},
  { type:'matchRegex', parameter:[
      {type:'template', key:'arg0', value:'{{Page URL}}'},
      {type:'template', key:'arg1', value:'gtm_test=1'},
      {type:'boolean',  key:'negate', value:'true'}
  ]}
];

const TRIGGERS = [
  // --- Blokavimo trigger'iai ---
  {
    name:'BLOCK — DEV (pageview)',
    type:'pageview',
    filter: DEV_FILTERS
  },
  {
    name:'BLOCK — DEV (visi custom events)',
    type:'customEvent',
    customEventFilter:[
      { type:'matchRegex', parameter:[
          {type:'template', key:'arg0', value:'{{_event}}'},
          {type:'template', key:'arg1', value:'.*'}
      ]}
    ],
    filter: DEV_FILTERS
  },
  // --- E-commerce custom event trigger'iai ---
  ...['view_item','add_to_cart','view_cart','begin_checkout','purchase'].map(ev=>({
    name:'CE — '+ev,
    type:'customEvent',
    customEventFilter:[
      { type:'equals', parameter:[
          {type:'template', key:'arg0', value:'{{_event}}'},
          {type:'template', key:'arg1', value:ev}
      ]}
    ]
  }))
];

try{
  const t = await gtmToken();
  const W = await defaultWorkspace(t);
  L('Workspace: '+W.name); L('');

  const ex = (await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('PRIES: triggers='+ex.length); L('');

  L('=== KURIAM TRIGGER\'IUS ===');
  for(const tr of TRIGGERS){
    const dup = ex.find(x=>x.name===tr.name);
    if(dup){ L('  [skip] '+tr.name+' (id '+dup.triggerId+')'); continue; }
    const r = await gtm(t,'/'+W.path+'/triggers','POST',tr);
    if(r.status===200) L('  [OK]   id='+String(r.body.triggerId).padStart(3)+'  '+tr.name+'  type='+r.body.type);
    else L('  [FAIL] '+tr.name+'  HTTP '+r.status+'  '+JSON.stringify(r.body).slice(0,300));
  }
  L('');

  L('=== VERIFIKACIJA ===');
  const nt = (await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  L('  triggers='+nt.length); L('');
  for(const x of nt.sort((a,b)=>a.name.localeCompare(b.name))){
    L('  ['+String(x.triggerId).padStart(3)+'] '+x.name+'   type='+x.type);
    for(const f of (x.customEventFilter||[])){
      const p=(f.parameter||[]).map(q=>q.key+'='+q.value).join(' ');
      L('        event: '+f.type+'  '+p);
    }
    for(const f of (x.filter||[])){
      const p=(f.parameter||[]).map(q=>q.key+'='+q.value).join(' ');
      L('        filter: '+f.type+'  '+p);
    }
  }
  L('');
  const nv=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  const ntg=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  L('BENDRA BUSENA: variables='+nv.length+'  tags='+ntg.length+'  triggers='+nt.length);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('LIVE: #'+lv.body.containerVersionId+' — PROD nepaliestas ✅');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('e2_result.txt', out); console.log(out);
