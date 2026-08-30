process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI1IHZhbHltYXMgcG8gcGFraWJpbW8gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc192YWwnXSk/JF9HRVRbJ3BzX3ZhbCddOicnKTsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTUyNS1WQUwnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAvLyAxLiBTaW50ZXRpbmlzIEtMSUsgdmFydG90b2phcyBpciBqbyBwcmVudW1lcmF0b3MKICAgICRFTT0ncHNuM2tsaWtAZ3l2dW5haS5sdCc7CiAgICAkdWlkPWVtYWlsX2V4aXN0cygkRU0pOwogICAgJG9bJ3VpZCddPSR1aWQ/OjA7CiAgICBpZigkdWlkKXsKICAgICAgJHNpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMgV0hFUkUgZW1haWw9JXMiLCRFTSkpOwogICAgICAkb1snc2lkcyddPSRzaWRzOwogICAgICBmb3JlYWNoKCRzaWRzIGFzICRzaWQpewogICAgICAgIGZvcmVhY2goYXJyYXkoJ3BzX3N1YnNjcmlwdGlvbl9pdGVtcyc9PidzdWJzY3JpcHRpb25faWQnLCdwc19zdWJzY3JpcHRpb25fZXZlbnRzJz0+J3N1YnNjcmlwdGlvbl9pZCcpIGFzICR0PT4kaykKICAgICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9JHQgV0hFUkUgJGs9JWQiLCRzaWQpKTsKICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMgV0hFUkUgaWQ9JWQiLCRzaWQpKTsKICAgICAgfQogICAgICByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOwogICAgICB3cF9kZWxldGVfdXNlcigkdWlkKTsKICAgICAgJG9bJ3ZhcnRvdG9qYXNfaXN0cmludGFzJ109dHJ1ZTsKICAgIH0KICAgICRvWydsaWt1dGlzX2tsaWsnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIFdIRVJFIGVtYWlsPSVzIiwkRU0pKTsKICAgIC8vIDIuIEUyRSB2YXJ0b3RvamFzIChkZXAtMTg0MzQ2IHR1cmVqbyBpc3NpdmFseXRpIOKAlCBwYXRpa3JhKQogICAgJG9bJ2xpa3V0aXNfbnVvbCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMgV0hFUkUgZW1haWw9J3BzbjNudW9sQGd5dnVuYWkubHQnIik7CiAgICAkb1snbnVvbF91aWQnXT1lbWFpbF9leGlzdHMoJ3BzbjNudW9sQGd5dnVuYWkubHQnKT86MDsKICAgIC8vIDMuIEFrdHl2dXMgVEVNUCBzbmlwcGV0YWkKICAgICRvWydha3R5dnVzX3RlbXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG5hbWUgTElLRSAnVEVNUCUnIixBUlJBWV9BKTsKICAgIC8vIDQuIFZhcmlrbGl1IHZlcnNpam9zIOKAlCBwYXR2aXJ0aW5pbWFzIGthZCBTMTUyNCBkaWVnaW1hcyBneXZhcwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1ByZW51bWVyYXRhJykpICRvWyd2YXJpa2xpcyddPVBldHNob3BfUHJlbnVtZXJhdGE6OlZFUlNJSkE7CiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUHJlbnVtZXJhdG9zX0xhbmdhcycpKSAkb1snbGFuZ2FzJ109UGV0c2hvcF9QcmVudW1lcmF0b3NfTGFuZ2FzOjpWRVJTSUpBOwogICAgLy8gNS4gTmFzZmxhaWNpYWkgdXpzYWt5bWFpIGlzIEUyRSAoMzUyODAgdHVyZWpvIGJ1dCBpc3RyaW50YXMpCiAgICAkb3JkPXdjX2dldF9vcmRlcigzNTI4MCk7CiAgICAkb1sndXpzYWt5bWFzXzM1MjgwJ109JG9yZD8nREFSX1lSQSc6J2lzdHJpbnRhcyc7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0RmlsZSgpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-184947';
const GKEY='ps_val';
const PHASES=["GO"];
const OUT='analize/s1525_valymas.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
