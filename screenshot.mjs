process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ5IHJlY29uIChwcm9nbm96ZSArIHN1dmVzdGluZSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zOSddKXx8JF9HRVRbJ3BzX3M5J10hPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NDlyJyk7CiAgdHJ5ewogICAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmVudW1lcmF0dS1wcm9nbm96ZS5waHAnOwogICAgJG9bJ3Byb2dub3plJ109ZmlsZV9leGlzdHMoJGYpP2FycmF5KCdCJz0+ZmlsZXNpemUoJGYpLCdtZDUnPT5tZDVfZmlsZSgkZiksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpKSk6J25lcmEnOwogICAgJHM9JHdwZGItPnByZWZpeC4ncHNfa2xfc3V2ZXN0aW5lJzsKICAgICRvWydzdXZfY3JlYXRlJ109JHdwZGItPmdldF92YXIoIlNIT1cgQ1JFQVRFIFRBQkxFICRzIiwxKTsKICAgICRvWydzdXZfa2l0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENBU0UgV0hFTiBraXRhIElTIE5VTEwgVEhFTiAnbnVsbCcgV0hFTiBraXRhPENVUkRBVEUoKSBUSEVOICdwcmFlaXR5JyBXSEVOIGtpdGE8PUNVUkRBVEUoKStJTlRFUlZBTCA3IERBWSBUSEVOICc3ZCcgV0hFTiBraXRhPD1DVVJEQVRFKCkrSU5URVJWQUwgMzAgREFZIFRIRU4gJzMwZCcgRUxTRSAndmVsaWF1JyBFTkQgYiwgQ09VTlQoKikgbiBGUk9NICRzIEdST1VQIEJZIGIiLEFSUkFZX0EpOwogICAgJG9bJ3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHJha3RhcywgdG9wX3ByZWtlLCB0b3BfcGlkLCB0b3BfbiwgY2lrbGFzLCBraXRhLCBrb250cmlidWNpamEgRlJPTSAkcyBXSEVSRSBraXRhIElTIE5PVCBOVUxMIEFORCBraXRhIEJFVFdFRU4gQ1VSREFURSgpIEFORCBDVVJEQVRFKCkrSU5URVJWQUwgMzAgREFZIE9SREVSIEJZIGtpdGEgTElNSVQgNSIsQVJSQVlfQSk7CiAgICAvKiB2aWR1dGluaXMga2lla2lzIHBlciBwaXJraW1hIHRvcCBwcmVrZWkgLSBhciBzdXZlc3RpbmVqZSB5cmE/IGplaSBuZSAtIGlzIGVpbHVjaXUgKi8KICAgICRvWydzdXZfc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgQ09MVU1OX05BTUUgRlJPTSBJTkZPUk1BVElPTl9TQ0hFTUEuQ09MVU1OUyBXSEVSRSBUQUJMRV9OQU1FPSckcycgQU5EIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIik7CiAgICAvKiBhdHNhcmd1IHNuYXBzaG90IHN0dWxwZWxpYWkgamF1IHppbm9taSAobGlrdXRpc19hdiwgbGlrdXRpc190aWVrZWpvLCBwYXJkYXZpbWFpX3ZudF8zMGQpICovCiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-212837';
const GKEY='ps_s9';
const PHASES=["R"];
const OUT='analize/s1549_r.json';
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
