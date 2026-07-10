import { execSync } from "child_process";
import { putFile, gtmToken, gtm, defaultWorkspace, CT, IDS } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

L('############ PRISIJUNGIMU PATIKRA ############');
L('laikas: '+new Date().toISOString());
L('');

// --- 1. GTM API ---
L('=== 1. GTM API ===');
try{
  const t = await gtmToken();
  L('  auth ............... OK ('+t.length+' chars)');
  const acc = await gtm(t,'/accounts');
  L('  GET /accounts ...... HTTP '+acc.status+'  ('+((acc.body.account||[]).length)+' account)');
  const W = await defaultWorkspace(t);
  L('  workspace .......... '+W.name+' (id '+W.workspaceId+')');
  const tags=(await gtm(t,'/'+W.path+'/tags')).body.tag||[];
  const trg=(await gtm(t,'/'+W.path+'/triggers')).body.trigger||[];
  const vrs=(await gtm(t,'/'+W.path+'/variables')).body.variable||[];
  L('  container turinys .. tags='+tags.length+' triggers='+trg.length+' variables='+vrs.length);
  const lv=await gtm(t,'/'+CT+'/versions:live');
  L('  live version ....... #'+lv.body.containerVersionId+' "'+(lv.body.name||'-')+'"');
  L('  RASYMO TESTAS:');
  const cr = await gtm(t,'/'+W.path+'/variables','POST',{name:'TEMP conn check',type:'c',parameter:[{type:'template',key:'value',value:'x'}]});
  if(cr.status===200){
    L('    CREATE ........... OK (variableId='+cr.body.variableId+')');
    const dl = await gtm(t,'/'+W.path+'/variables/'+cr.body.variableId,'DELETE');
    L('    DELETE ........... HTTP '+dl.status);
    const after=((await gtm(t,'/'+W.path+'/variables')).body.variable||[]).length;
    L('    svara ............ variables='+after+(after===vrs.length?' ✅':' ❌'));
  } else L('    CREATE ........... ❌ HTTP '+cr.status+' '+JSON.stringify(cr.body).slice(0,150));
}catch(e){ L('  ❌ GTM ERROR: '+e.message); }
L('');

// --- 2. WordPress REST ---
L('=== 2. WORDPRESS (dev.avesa.lt) ===');
try{
  const U=process.env.WP_USER||'';
  const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
  L('  WP_USER ............ '+(U?U:'❌ NERA'));
  L('  WP_APP_PASS ........ '+(P?'yra ('+P.length+' chars)':'❌ NERA'));
  const cmd = 'curl -s -o /tmp/wp.json -w "%{http_code}" -u "'+U+':'+P+'" "https://dev.avesa.lt/wp-json/wp/v2/users/me?context=edit"';
  const code = execSync(cmd,{encoding:'utf8',env:process.env}).trim();
  L('  /users/me .......... HTTP '+code);
  if(code==='200'){
    const j=JSON.parse(execSync('cat /tmp/wp.json',{encoding:'utf8'}));
    L('    user ............. '+j.name+' (id '+j.id+')');
    L('    roles ............ '+(j.roles||[]).join(','));
  }
  const c2 = execSync('curl -s -o /tmp/wp2.json -w "%{http_code}" -u "'+U+':'+P+'" "https://dev.avesa.lt/wp-json/wp/v2/plugins?search=complianz"',{encoding:'utf8',env:process.env}).trim();
  L('  /plugins ........... HTTP '+c2);
  if(c2==='200'){
    const pl=JSON.parse(execSync('cat /tmp/wp2.json',{encoding:'utf8'}));
    if(Array.isArray(pl)) pl.forEach(p=>L('    '+p.name+' v'+p.version+' — '+p.status));
  }
  const c3 = execSync('curl -s -o /tmp/wp3.json -w "%{http_code}" -u "'+U+':'+P+'" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?per_page=1"',{encoding:'utf8',env:process.env}).trim();
  L('  code-snippets API .. HTTP '+c3);
}catch(e){ L('  ❌ WP ERROR: '+(e.message||'').slice(0,200)); }
L('');

// --- 3. Svetainiu pasiekiamumas ---
L('=== 3. SVETAINES ===');
for(const u of ['https://dev.avesa.lt/','https://petshop.lt/']){
  try{
    const c=execSync('curl -sk -o /dev/null -w "%{http_code} %{time_total}s" --max-time 30 "'+u+'"',{encoding:'utf8'}).trim();
    L('  '+u.padEnd(26)+' '+c);
  }catch(e){ L('  '+u+' ❌'); }
}
L('');
L('=== ID (is gtm_lib) ===');
for(const [k,v] of Object.entries(IDS)) L('  '+k.padEnd(11)+'= '+v);
putFile('conn_check.txt', out); console.log(out);
