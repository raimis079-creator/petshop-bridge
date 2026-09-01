process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTg2IGlzdCBzYXZhaXRlcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2l3J10pIHx8ICRfR0VUWydwc19pdyddIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE1ODYnKTsKICB0cnl7CiAgICAkb1snY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfaXN0X3V6c2FreW1haSIpOwogICAgJG9bJ3N0YXR1c2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzYXMsIENPVU5UKCopIG4gRlJPTSB7JHB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBkYXRhPj0nMjAyNi0wNi0wMScgR1JPVVAgQlkgc3RhdHVzYXMiLEFSUkFZX0EpOwogICAgJG9bJ3NhdmFpdGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgWUVBUldFRUsoZGF0YSwzKSBzYXYsIENPVU5UKCopIG4sIFJPVU5EKFNVTShzdW1hKSwwKSBzdW1hLCBST1VORChBVkcoc3VtYSksMSkgYW92IEZST00geyRwfXBzX2lzdF91enNha3ltYWkgV0hFUkUgZGF0YT49JzIwMjYtMDYtMDEnIEdST1VQIEJZIHNhdiBPUkRFUiBCWSBzYXYiLEFSUkFZX0EpOwogICAgJG9bJ2RpZW5vc18wOF8wMV8xMiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoZGF0YSkgZCwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHN1bWEpLDApIHN1bWEgRlJPTSB7JHB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBkYXRhIEJFVFdFRU4gJzIwMjYtMDgtMDEnIEFORCAnMjAyNi0wOC0xMiAyMzo1OTo1OScgR1JPVVAgQlkgZCBPUkRFUiBCWSBkIixBUlJBWV9BKTsKICAgICRvWydtZW5lc2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKGRhdGEsJyVZLSVtJykgbSwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHN1bWEpLDApIHN1bWEgRlJPTSB7JHB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBkYXRhPj0nMjAyNi0wMS0wMScgR1JPVVAgQlkgbSBPUkRFUiBCWSBtIixBUlJBWV9BKTsKICAgICRvWydpdnlrZHl0aV9tZW5lc2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKGRhdGEsJyVZLSVtJykgbSwgc3RhdHVzYXMsIENPVU5UKCopIG4sIFJPVU5EKFNVTShzdW1hKSwwKSBzdW1hIEZST00geyRwfXBzX2lzdF91enNha3ltYWkgV0hFUkUgZGF0YT49JzIwMjYtMDYtMDEnIEdST1VQIEJZIG0sc3RhdHVzYXMgT1JERVIgQlkgbSxuIERFU0MiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-182716';
const GKEY='ps_iw';
const PHASES=["GO"];
const OUT='analize/s1586_ist.json';
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
