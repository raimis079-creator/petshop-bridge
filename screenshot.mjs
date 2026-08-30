process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIG5scmVjb24yIGltcG9ydG8gaXIgdmFyaWtsaXUgZGV0YWxlcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX24yJ10pPyRfR0VUWydwc19uMiddOicnKTsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidubHJlY29uMicpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtbGFpc2thaS1pbXBvcnRhcy5waHAnLCdwZXRzaG9wLW5hdWppZW5sYWlza2lhaS5waHAnLCdwZXRzaG9wLW5hdWppZW5sYWlza2lhaS1hZG1pbi5waHAnLCdwZXRzaG9wLXJlenVsdGF0YWkucGhwJywncGV0c2hvcC1rYW1wYW5panUtbGFuZ2FzLnBocCcpIGFzICRmbil7CiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nLycuJGZuKTsKICAgICAgJGg9c3Vic3RyKCRjLDAsOTAwKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhbYS16QS1aMC05X10rKVxzKlwoLycsJGMsJG0pOwogICAgICBwcmVnX21hdGNoX2FsbCgiL2FkZF9hY3Rpb25cKCcoW14nXSspJy8iLCRjLCRhKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoIi9yZWdpc3Rlcl9yZXN0X3JvdXRlXCgnKFteJ10rKScsXHMqJyhbXiddKyknLyIsJGMsJHJyKTsKICAgICAgJG9bJGZuXT1hcnJheSgnaGVhZGVyJz0+JGgsJ2Z1bmtjaWpvcyc9PiRtWzFdLCdrYWJsaWFpJz0+YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRhWzFdKSwwLDE1KSwKICAgICAgICAncmVzdCc9PiRyclsxXT9hcnJheV9tYXAobnVsbCwkcnJbMV0sJHJyWzJdKTphcnJheSgpKTsKICAgIH0KICAgICRvWydjb25zZW50X2xvZ19zdHVscCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHdwZGItPnByZWZpeH1wc19jb25zZW50X2xvZyIpOwogICAgJG9bJ2NvbnNlbnRfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2NvbnNlbnRfbG9nIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgICAkb1snZW1haWxfY29udGVudCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGZsb3dfY2xhc3MgRlJPTSB7JHdwZGItPnByZWZpeH1wc19lbWFpbF9jb250ZW50IixBUlJBWV9BKTsKICAgICRvWydlbWFpbF9qb2JzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdyxmbG93X2NsYXNzLHN0YXR1cyxDT1VOVCgqKSBuIEZST00geyR3cGRiLT5wcmVmaXh9cHNfZW1haWxfam9icyBHUk9VUCBCWSBmbG93LGZsb3dfY2xhc3Msc3RhdHVzIixBUlJBWV9BKTsKICAgIC8vIGltcG9ydG8gbGVudGVsZXM/CiAgICAkb1snaW1wb3J0X2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzXyVpbXBvcnQlJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-213216';
const GKEY='ps_n2';
const PHASES=["GO"];
const OUT='analize/nlrecon2.json';
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
