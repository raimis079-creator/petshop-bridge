process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBUNSByZW5kZXJpcyB2MS4yICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnOwogIGlmKCR2IT09J1Q3JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRjE5VDUtMS4yJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkdD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjp0YWJsZSgpOwogICAgLy8gMC4gYW5rc3Rlc25pdSBiYW5keW11IGxpa3VjaWFpCiAgICAkb1snbGlrdWNpYWlfcHJpZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHR9IFdIRVJFIHJlY2lwaWVudF9lbWFpbCBMSUtFICd0NWIlQGd5dnVuYWkubHQnIE9SIHJlY2lwaWVudF9lbWFpbCBMSUtFICd0NXRlc3QlQGd5dnVuYWkubHQnIik7CiAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskdH0gV0hFUkUgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1YiVAZ3l2dW5haS5sdCcgT1IgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1dGVzdCVAZ3l2dW5haS5sdCciKTsKICAgICRvWydsaWt1Y2lhaV9wbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdH0gV0hFUkUgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1YiVAZ3l2dW5haS5sdCcgT1IgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1dGVzdCVAZ3l2dW5haS5sdCciKTsKICAgIC8vIDEuIGNpa2xhcwogICAgJGVtPSd0NWMnLnRpbWUoKS4nQGd5dnVuYWkubHQnOwogICAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAxIik7CiAgICAkc2lkPVBldHNob3BfUHJlbnVtZXJhdGE6OnN1a3VydGkoYXJyYXkoJ2VtYWlsJz0+JGVtLCdwcm9kdWN0X2lkJz0+JHBpZCwncXR5Jz0+MiwnaW50ZXJ2YWxfZGF5cyc9PjQyLAogICAgICAnbmV4dF9jeWNsZV9kYXRlJz0+Z21kYXRlKCdZLW0tZCcsdGltZSgpKzUqODY0MDApKSk7CiAgICAkb1snY2lrbGFzJ109UGV0c2hvcF9QcmVudW1lcmF0YTo6Y2lrbGFzKGdtZGF0ZSgnWS1tLWQnKSk7CiAgICAkaj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHR9IFdIRVJFIHJlY2lwaWVudF9lbWFpbD0lcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLCRlbSksQVJSQVlfQSk7CiAgICBpZigkail7CiAgICAgICRwbD1qc29uX2RlY29kZSgkalsncGF5bG9hZCddLHRydWUpOwogICAgICAkb1snZWlsZWplJ109YXJyYXkoJ2Zsb3cnPT4kalsnZmxvdyddLCdrbGFzZSc9PiRqWydmbG93X2NsYXNzJ10sJ3N0YXR1cyc9PiRqWydzdGF0dXMnXSwKICAgICAgICAnam9iX2tleSc9PiRqWydqb2Jfa2V5J10sJ3RlbWEnPT4kalsnc3ViamVjdCddLCdibG9rYXMnPT4kalsnYmxvY2tfcmVhc29uJ10pOwogICAgICAkb1sncGF5bG9hZF9yYWt0YWknXT1pc19hcnJheSgkcGwpP2FycmF5X2tleXMoJHBsKTonTkUnOwogICAgICAkbnVvcj1hcnJheSgpOyBmb3JlYWNoKChhcnJheSkkcGwgYXMgJGs9PiR2dil7IGlmKGlzX3N0cmluZygkdnYpJiZzdHJwb3MoJHZ2LCdodHRwJyk9PT0wKSAkbnVvclska109JHZ2OyB9CiAgICAgICRvWydudW9yb2RvcyddPSRudW9yOwogICAgICAkaHRtbD0oc3RyaW5nKVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OnJlbmRlcignc3Vic2NyaXB0aW9uX3Q1X25vdGljZScsJHBsLCRqKTsKICAgICAgJG9bJ3JlbmRlcmlzJ109YXJyYXkoJ2lsZ2lzJz0+c3RybGVuKCRodG1sKSwKICAgICAgICAndmVpa3Ntb19udW9yb2RhJz0+c3RycG9zKCRodG1sLCdwcmVudW1lcmF0YS92ZWlrc21hcycpIT09ZmFsc2U/J1RBSVAnOidORScsCiAgICAgICAgJ3ByZWtlc19wYXYnPT5zdHJwb3MoJGh0bWwsZ2V0X3RoZV90aXRsZSgkcGlkKSkhPT1mYWxzZT8nVEFJUCc6J05FJywKICAgICAgICAnbGlrb19wbGFjZWhvbGRlcic9PnByZWdfbWF0Y2goJy9ce1x7W2Etel9dK1x9XH0vJywkaHRtbCk/J1RBSVAnOidORScsCiAgICAgICAgJ2F0c2lzYWt5bWFzJz0+KHN0cmlwb3MoJGh0bWwsJ2F0c2lzYWsnKSE9PWZhbHNlfHxzdHJpcG9zKCRodG1sLCd1bnN1YnNjcmliZScpIT09ZmFsc2UpPydUQUlQJzonTkUnKTsKICAgICAgJG9bJ3Rla3N0YXMnXT1tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3RyaXBfdGFncygkaHRtbCkpKSwwLDEwMDApOwogICAgICAvLyBhciB2ZWlrc21vIG51b3JvZGEgcmVhbGlhaSB2ZWlraWEKICAgICAgaWYoIWVtcHR5KCRudW9yKSl7CiAgICAgICAgJHU9cmVzZXQoJG51b3IpOwogICAgICAgICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICAgICAkaGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOwogICAgICAgICRvWydudW9yb2RhX2d5dmEnXT1hcnJheSgna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyksCiAgICAgICAgICAnZm9ybWEnPT5zdHJwb3MoJGhiLCdtZXRob2Q9InBvc3QiJykhPT1mYWxzZT8nVEFJUCc6J05FJyk7CiAgICAgIH0KICAgIH0gZWxzZSAkb1snZWlsZWplJ109J05FUkFTVEEnOwogICAgLy8gVkFMWU1BUwogICAgJHdwZGItPmRlbGV0ZShQZXRzaG9wX1ByZW51bWVyYXRhOjp0KCksYXJyYXkoJ2lkJz0+JHNpZCkpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAiLlBldHNob3BfUHJlbnVtZXJhdGE6OnRlKCkuIiBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCRzaWQpKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR0fSBXSEVSRSByZWNpcGllbnRfZW1haWw9JXMiLCRlbSkpOwogICAgJG9bJ3ZhbHltYXMnXT1hcnJheSgnc3Vicyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICIuUGV0c2hvcF9QcmVudW1lcmF0YTo6dCgpKSwKICAgICAgJ2l2eWtpYWknPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAiLlBldHNob3BfUHJlbnVtZXJhdGE6OnRlKCkpLAogICAgICAnZWlsZSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdH0gV0hFUkUgcmVjaXBpZW50X2VtYWlsIExJS0UgJ3Q1JUBneXZ1bmFpLmx0JyIpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0RmlsZSgpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='f19_t5c-075950';
const GKEY='ps_f19';
const PHASES=["T7"];
const OUT='analize/f19_t5c.json';
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
