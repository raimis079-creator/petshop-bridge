process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBUNSByZW5kZXJpcyB2MS4zICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnOwogIGlmKCR2IT09J1Q4JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRjE5VDUtMS4zJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkdD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjp0YWJsZSgpOwogICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHR9IFdIRVJFIHJlY2lwaWVudF9lbWFpbCBMSUtFICd0NSVAZ3l2dW5haS5sdCciKTsKICAgICRlbT0ndDVkJy50aW1lKCkuJ0BneXZ1bmFpLmx0JzsKICAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIElEIERFU0MgTElNSVQgMSIpOwogICAgJHNpZD1QZXRzaG9wX1ByZW51bWVyYXRhOjpzdWt1cnRpKGFycmF5KCdlbWFpbCc9PiRlbSwncHJvZHVjdF9pZCc9PiRwaWQsJ3F0eSc9PjIsJ2ludGVydmFsX2RheXMnPT40MiwKICAgICAgJ25leHRfY3ljbGVfZGF0ZSc9PmdtZGF0ZSgnWS1tLWQnLHRpbWUoKSs1Kjg2NDAwKSkpOwogICAgUGV0c2hvcF9QcmVudW1lcmF0YTo6Y2lrbGFzKGdtZGF0ZSgnWS1tLWQnKSk7CiAgICAkaj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHR9IFdIRVJFIHJlY2lwaWVudF9lbWFpbD0lcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLCRlbSksQVJSQVlfQSk7CiAgICAkcGw9anNvbl9kZWNvZGUoJGpbJ3BheWxvYWQnXSx0cnVlKTsKICAgICRoPVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OnJlbmRlcignc3Vic2NyaXB0aW9uX3Q1X25vdGljZScsJHBsLCRqKTsKICAgICRvWydyZW5kZXJfdGlwYXMnXT1nZXR0eXBlKCRoKTsKICAgIGlmKGlzX2FycmF5KCRoKSl7ICRvWydyZW5kZXJfcmFrdGFpJ109YXJyYXlfa2V5cygkaCk7ICRodG1sPWlzc2V0KCRoWydodG1sJ10pPyRoWydodG1sJ106Jyc7ICRvWyd0ZW1hJ109aXNzZXQoJGhbJ3N1YmplY3QnXSk/JGhbJ3N1YmplY3QnXTonJzsgfQogICAgZWxzZSAkaHRtbD0oc3RyaW5nKSRoOwogICAgJG9bJ1InXT1hcnJheSgnaWxnaXMnPT5zdHJsZW4oJGh0bWwpLAogICAgICAndmVpa3Ntb19udW9yb2RhJz0+c3Vic3RyX2NvdW50KCRodG1sLCdwcmVudW1lcmF0YS92ZWlrc21hcycpLAogICAgICAncHJla2VzX3Bhdic9PnN0cnBvcygkaHRtbCxnZXRfdGhlX3RpdGxlKCRwaWQpKSE9PWZhbHNlPydUJzonTicsCiAgICAgICdkYXRhJz0+c3RycG9zKCRodG1sLCRwbFsnZGVsaXZlcnlfZGF0ZSddKSE9PWZhbHNlPydUJzonTicsCiAgICAgICdwbGFjZWhvbGRlcic9PnByZWdfbWF0Y2goJy9ce1x7W2Etel9dK1x9XH0vJywkaHRtbCk/J0xJS08nOidORScsCiAgICAgICdhdHNpc2FreW1hcyc9PihzdHJpcG9zKCRodG1sLCdhdHNpc2FrJykhPT1mYWxzZXx8c3RyaXBvcygkaHRtbCwndW5zdWJzY3JpYmUnKSE9PWZhbHNlKT8nVCc6J04nKTsKICAgICRvWyd0ZWtzdGFzJ109bWJfc3Vic3RyKHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MoJGh0bWwpKSksMCw2NTApOwogICAgJGc9d3BfcmVtb3RlX2dldCgkcGxbJ2NvbmZpcm1fdXJsJ10sYXJyYXkoJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICRoYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7CiAgICAkb1snbnVvcm9kYSddPWFycmF5KCdrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKSwnZm9ybWEnPT5zdHJwb3MoJGhiLCdtZXRob2Q9InBvc3QiJykhPT1mYWxzZT8nVCc6J04nKTsKICAgICR3cGRiLT5kZWxldGUoUGV0c2hvcF9QcmVudW1lcmF0YTo6dCgpLGFycmF5KCdpZCc9PiRzaWQpKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gIi5QZXRzaG9wX1ByZW51bWVyYXRhOjp0ZSgpLiIgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwkc2lkKSk7CiAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskdH0gV0hFUkUgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1JUBneXZ1bmFpLmx0JyIpOwogICAgJG9bJ3ZhbHltYXMnXT1hcnJheSgoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAiLlBldHNob3BfUHJlbnVtZXJhdGE6OnQoKSksCiAgICAgIChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICIuUGV0c2hvcF9QcmVudW1lcmF0YTo6dGUoKSksCiAgICAgIChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdH0gV0hFUkUgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1JUBneXZ1bmFpLmx0JyIpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='f19_t5d-080133';
const GKEY='ps_f19';
const PHASES=["T8"];
const OUT='analize/f19_t5d.json';
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
