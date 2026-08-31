process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE5MIGxhaXNrYXMgZGlhZyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX25sbSddKXx8JF9HRVRbJ3BzX25sbSddIT09J0QnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidOTE0xJywnbm93X3V0Yyc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKSk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJG9bJ2NvbnNlbnRfbGFzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGVtYWlsLGZyb21fdmFsdWUsdG9fdmFsdWUsc291cmNlLGNoYW5nZWRfYXQgRlJPTSB7JHB9cHNfY29uc2VudF9sb2cgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAgICRvWydqb2JzX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2VtYWlsX2pvYnMiLDApOwogICAgJG9bJ2pvYnNfbGFzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfZW1haWxfam9icyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDQiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkb1snam9ic19sYXN0J10gYXMgJiRqKXsgZm9yZWFjaCgkaiBhcyAkaz0+JiR2KXsgaWYoaXNfc3RyaW5nKCR2KSYmc3RybGVuKCR2KT40MDApICR2PXN1YnN0cigkdiwwLDQwMCkuJ+KApic7IH0gfSB1bnNldCgkaik7CiAgICAkb1snam9ic19ieV9zdGF0dXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsQ09VTlQoKikgbiBGUk9NIHskcH1wc19lbWFpbF9qb2JzIEdST1VQIEJZIHN0YXR1cyIsQVJSQVlfQSk7CiAgICAkb1snc3VwcHJlc3Npb24nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX2VtYWlsX3N1cHByZXNzaW9uIE9SREVSIEJZIDEgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAgICRvWydjcm9uX2Rpc3BhdGNoJ109d3BfbmV4dF9zY2hlZHVsZWQoJ3BzX2VtYWlsX2Rpc3BhdGNoX2Nyb24nKTsgJG9bJ2Nyb25fZGlzcGF0Y2hfaCddPSRvWydjcm9uX2Rpc3BhdGNoJ10/Z21kYXRlKCdZLW0tZCBIOmk6cycsJG9bJ2Nyb25fZGlzcGF0Y2gnXSk6bnVsbDsKICAgICRvWydjcm9uX3NjaGVkdWxlcyddPWFycmF5KCk7IGZvcmVhY2goKGFycmF5KV9nZXRfY3Jvbl9hcnJheSgpIGFzICR0cz0+JGhvb2tzKXsgZm9yZWFjaCgkaG9va3MgYXMgJGg9PiR4KXsgaWYoc3RyaXBvcygkaCwnZW1haWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRoLCdsYWlzaycpIT09ZmFsc2V8fHN0cmlwb3MoJGgsJ2Rpc3BhdGNoJykhPT1mYWxzZSkgJG9bJ2Nyb25fc2NoZWR1bGVzJ11bXT1nbWRhdGUoJ0g6aTpzJywkdHMpLicgJy4kaDsgfSB9CiAgICAkb1snZGlzYWJsZV9jcm9uJ109ZGVmaW5lZCgnRElTQUJMRV9XUF9DUk9OJyk/RElTQUJMRV9XUF9DUk9OOm51bGw7CiAgICAkb1snc2VuZGVyX2tleXMnXT1hcnJheSgnbWsnPT5zdHJsZW4oKHN0cmluZylnZXRfb3B0aW9uKCdwZXRzaG9wX2VzcF9zZW5kZXJfbWsnKSksJ3RrJz0+c3RybGVuKChzdHJpbmcpZ2V0X29wdGlvbigncGV0c2hvcF9lc3Bfc2VuZGVyX3RrJykpKTsKICAgICRvWydlc3Bfb3B0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDgwKSB2IEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF9lc3AlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwZXRzaG9wX2VtYWlsJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfZW1haWwlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19sYWlzayUnIixBUlJBWV9BKTsKICAgICRvWydjb250ZW50X2NvbnNlbnQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX2VtYWlsX2NvbnRlbnQgV0hFUkUgZmxvdyBMSUtFICclY29uc2VudCUnIE9SIGV2ZW50X3R5cGUgTElLRSAnJWNvbnNlbnQlJyBPUiB0ZW1wbGF0ZV9rZXkgTElLRSAnJWNvbnNlbnQlJyBMSU1JVCAzIixBUlJBWV9BKTsKICAgIGlmKCEkb1snY29udGVudF9jb25zZW50J10pICRvWydjb250ZW50X2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2VtYWlsX2NvbnRlbnQiLDApOwogICAgJG9bJ3dlYmhvb2tfbGFzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfd2ViaG9va19sb2cgT1JERVIgQlkgMSBERVNDIExJTUlUIDIiLEFSUkFZX0EpOwogICAgJG9bJ3NhcmdhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhaWthcyxseWdpcyx6aW51dGUsZmFpbGFzLGVpbHV0ZSBGUk9NIHskcH1wc19zYXJnYXNfa2xhaWRvcyBXSEVSRSBsYWlrYXM+VVRDX1RJTUVTVEFNUCgpLUlOVEVSVkFMIDMgSE9VUiBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICAgJG9bJ2Rpc3BhdGNoX21ldGhvZHMnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnKT9hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+bmFtZTt9LChuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoJykpLT5nZXRNZXRob2RzKCkpOm51bGw7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-073606';
const GKEY='ps_nlm';
const PHASES=["D"];
const OUT='analize/nlm_diag.json';
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
