process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBUNSBncmFuZGluZSB2MS4xICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnOwogIGlmKCR2IT09J1Q2JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRjE5VDUtMS4xJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgZm9yZWFjaChhcnJheSgncmVuZGVyJywnZW5xdWV1ZScsJ3Byb2Nlc3Nfb25lJykgYXMgJG0pewogICAgICAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnLCRtKTsKICAgICAgJHBzPWFycmF5KCk7IGZvcmVhY2goJHJtLT5nZXRQYXJhbWV0ZXJzKCkgYXMgJHApeyAkcHNbXT0oJHAtPmlzT3B0aW9uYWwoKT8nPyc6JycpLiRwLT5nZXROYW1lKCk7IH0KICAgICAgJG9bJ3BhcmFzYWknXVskbV09KCRybS0+aXNQdWJsaWMoKT8ncHViJzoncHJvdCcpLicgKCcuaW1wbG9kZSgnLCAnLCRwcykuJyknOwogICAgfQogICAgJGVtPSd0NWInLnRpbWUoKS4nQGd5dnVuYWkubHQnOwogICAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAxIik7CiAgICAkc2lkPVBldHNob3BfUHJlbnVtZXJhdGE6OnN1a3VydGkoYXJyYXkoJ2VtYWlsJz0+JGVtLCdwcm9kdWN0X2lkJz0+JHBpZCwncXR5Jz0+MiwnaW50ZXJ2YWxfZGF5cyc9PjQyLAogICAgICAnbmV4dF9jeWNsZV9kYXRlJz0+Z21kYXRlKCdZLW0tZCcsdGltZSgpKzUqODY0MDApKSk7CiAgICAkb1snY2lrbGFzJ109UGV0c2hvcF9QcmVudW1lcmF0YTo6Y2lrbGFzKGdtZGF0ZSgnWS1tLWQnKSk7CiAgICAkb1snaXZ5a2lhaSddPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZXZlbnQgRlJPTSAiLlBldHNob3BfUHJlbnVtZXJhdGE6OnRlKCkuIiBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCRzaWQpKTsKICAgIC8vIGVpbGUKICAgICR0PVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OnRhYmxlKCk7CiAgICAkb1snbGVudGVsZSddPSR0OwogICAgJGo9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyR0fSBXSEVSRSBlbWFpbD0lcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLCRlbSksQVJSQVlfQSk7CiAgICBpZighJGopICRqPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskdH0gV0hFUkUgcmVjaXBpZW50PSVzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsJGVtKSxBUlJBWV9BKTsKICAgIGlmKCRqKXsKICAgICAgJG9bJ2VpbGVqZSddPWFycmF5KCdmbG93Jz0+aXNzZXQoJGpbJ2Zsb3cnXSk/JGpbJ2Zsb3cnXTooaXNzZXQoJGpbJ2Zsb3dfa2V5J10pPyRqWydmbG93X2tleSddOic/JyksCiAgICAgICAgJ3N0YXR1cyc9Pmlzc2V0KCRqWydzdGF0dXMnXSk/JGpbJ3N0YXR1cyddOic/Jywnam9iX2tleSc9Pmlzc2V0KCRqWydqb2Jfa2V5J10pPyRqWydqb2Jfa2V5J106Jy0nKTsKICAgICAgJHBsPWpzb25fZGVjb2RlKGlzc2V0KCRqWydwYXlsb2FkJ10pPyRqWydwYXlsb2FkJ106J3t9Jyx0cnVlKTsKICAgICAgJG9bJ3BheWxvYWRfcmFrdGFpJ109aXNfYXJyYXkoJHBsKT9hcnJheV9rZXlzKCRwbCk6J05FJzsKICAgICAgJG51b3I9YXJyYXkoKTsgZm9yZWFjaCgoYXJyYXkpJHBsIGFzICRrPT4kdnYpeyBpZihpc19zdHJpbmcoJHZ2KSYmc3RycG9zKCR2diwnaHR0cCcpPT09MCkgJG51b3JbJGtdPXN1YnN0cigkdnYsMCwxMjApOyB9CiAgICAgICRvWydwYXlsb2FkX251b3JvZG9zJ109JG51b3I7CiAgICAgIC8vIHJlbmRlcmlzIHBlciBwYWNpYSBzaXN0ZW1hCiAgICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcsJ3JlbmRlcicpOyAkcm0tPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgICAgICRucD0kcm0tPmdldE51bWJlck9mUGFyYW1ldGVycygpOwogICAgICAkYXJncz0oJG5wPj0zKT9hcnJheSgnc3Vic2NyaXB0aW9uX3Q1X25vdGljZScsJHBsLCRlbSk6KCgkbnA9PTIpP2FycmF5KCdzdWJzY3JpcHRpb25fdDVfbm90aWNlJywkcGwpOmFycmF5KCRqKSk7CiAgICAgICRoPSRybS0+aW52b2tlQXJncyhudWxsLCRhcmdzKTsKICAgICAgJGh0bWw9aXNfYXJyYXkoJGgpPyhpc3NldCgkaFsnaHRtbCddKT8kaFsnaHRtbCddOmpzb25fZW5jb2RlKGFycmF5X2tleXMoJGgpKSk6KHN0cmluZykkaDsKICAgICAgJG9bJ3JlbmRlcmlzJ109YXJyYXkoJ2lsZ2lzJz0+c3RybGVuKCRodG1sKSwKICAgICAgICAneXJhX3ZlaWtzbW9fbnVvcm9kYSc9PnN0cnBvcygkaHRtbCwncHJlbnVtZXJhdGEvdmVpa3NtYXMnKSE9PWZhbHNlPydUQUlQJzonTkUnLAogICAgICAgICd5cmFfcHJla2VzX3Bhdic9PnN0cnBvcygkaHRtbCxnZXRfdGhlX3RpdGxlKCRwaWQpKSE9PWZhbHNlPydUQUlQJzonTkUnLAogICAgICAgICdsaWtvX3BsYWNlaG9sZGVyJz0+cHJlZ19tYXRjaCgnL1x7XHtbYS16X10rXH1cfS8nLCRodG1sKT8nVEFJUCc6J05FJywKICAgICAgICAneXJhX2F0c2lzYWt5bWFzJz0+KHN0cmlwb3MoJGh0bWwsJ2F0c2lzYWsnKSE9PWZhbHNlfHxzdHJpcG9zKCRodG1sLCd1bnN1YnNjcmliZScpIT09ZmFsc2UpPydUQUlQJzonTkUnKTsKICAgICAgJG9bJ3Rla3N0YXMnXT1tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3RyaXBfdGFncygkaHRtbCkpKSwwLDkwMCk7CiAgICB9IGVsc2UgeyAkb1snZWlsZWplJ109J05FUkFTVEEnOyAkb1snc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJERVNDIHskdH0iKTsgfQogICAgLy8gVkFMWU1BUwogICAgJHdwZGItPmRlbGV0ZShQZXRzaG9wX1ByZW51bWVyYXRhOjp0KCksYXJyYXkoJ2lkJz0+JHNpZCkpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAiLlBldHNob3BfUHJlbnVtZXJhdGE6OnRlKCkuIiBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCRzaWQpKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR0fSBXSEVSRSBlbWFpbD0lcyIsJGVtKSk7CiAgICAkb1sndmFseW1hcyddPWFycmF5KCdzdWJzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gIi5QZXRzaG9wX1ByZW51bWVyYXRhOjp0KCkpLAogICAgICAnaXZ5a2lhaSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICIuUGV0c2hvcF9QcmVudW1lcmF0YTo6dGUoKSksCiAgICAgICdlaWxlJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR0fSBXSEVSRSBlbWFpbD0lcyIsJGVtKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRGaWxlKCkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='f19_t5b-075806';
const GKEY='ps_f19';
const PHASES=["T6"];
const OUT='analize/f19_t5b.json';
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
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
