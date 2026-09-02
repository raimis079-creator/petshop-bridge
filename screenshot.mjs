process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSByZWNvbjYKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4OSddKSkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1bJ1ZFUlNJSkEnPT4nUzE1OTEtUjYnXTsKICAgICRvWydoaXN0NSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHR5cGUsdGltZV9ydW4sZGF0ZSxzdW1tYXJ5IEZST00geyRwfXBteGlfaGlzdG9yeSBXSEVSRSBpbXBvcnRfaWQ9NSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICAgJG9bJ2hpc3Q3J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdHlwZSx0aW1lX3J1bixkYXRlLHN1bW1hcnkgRlJPTSB7JHB9cG14aV9oaXN0b3J5IFdIRVJFIGltcG9ydF9pZD03IE9SREVSIEJZIGlkIERFU0MgTElNSVQgMyIsQVJSQVlfQSk7CiAgICAkb1snaGlzdDInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx0eXBlLHRpbWVfcnVuLGRhdGUgRlJPTSB7JHB9cG14aV9oaXN0b3J5IFdIRVJFIGltcG9ydF9pZD0yIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMiIsQVJSQVlfQSk7CiAgICAkc249JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkPTU2NSIpOyAkb1snc241NjVfaGVhZCddPW1iX3N1YnN0cigkc24sMCwyNTAwKTsKICAgIGZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgT1JERVIgQlkgaWQiLEFSUkFZX04pIGFzICRyKSAkb1snYWN0aXZlJ11bXT1pbXBsb2RlKCcgJywkcik7CiAgICAvLyBwcm9jZXNzaW5nIHJlc3BvbnNlIHBpbG5hcwogICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtbG9hZC5waHA/aW1wb3J0X2tleT12JmltcG9ydF9pZD01JmFjdGlvbj1wcm9jZXNzaW5nJyxbJ3RpbWVvdXQnPT43NSwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsKICAgICRvWydwcm9jJ109W3dwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwgbWJfc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSwwLDgwMCksIHdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRyKS0+Z2V0QWxsKCldOwogICAgJG9bJ3BteGk1J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBwcm9jZXNzaW5nLGV4ZWN1dGluZyx0cmlnZ2VyZWQscXVldWVfY2h1bmtfbnVtYmVyLGltcG9ydGVkLGNyZWF0ZWQsdXBkYXRlZCxza2lwcGVkLGxhc3RfYWN0aXZpdHkscmVnaXN0ZXJlZF9vbiBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9NSIsQVJSQVlfQSk7CiAgICAkb1snY3Jvbl9wbXhpJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9rZXlzKF9nZXRfY3Jvbl9hcnJheSgpID8gYXJyYXlfbWVyZ2UoLi4uYXJyYXlfdmFsdWVzKF9nZXRfY3Jvbl9hcnJheSgpKSkgOiBbXSksIGZuKCRoKT0+c3RyaXBvcygkaCwncG14aScpIT09ZmFsc2V8fHN0cmlwb3MoJGgsJ3ZmJykhPT1mYWxzZSkpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1J8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-082157';
const GKEY='ps_ex9';
const PHASES=["R"];
const OUT='analize/s1591_recon6.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
