process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGxpa3VjaW8gc2x1b3RhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZjE5J10pPyRfR0VUWydwc19mMTknXTonJykhPT0nVFonKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTTFVPVEEtMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJHQ9UGV0c2hvcF9QcmVudW1lcmF0YTo6dCgpOyAkdGk9UGV0c2hvcF9QcmVudW1lcmF0YTo6dF9pdGVtcygpOyAkdGU9UGV0c2hvcF9QcmVudW1lcmF0YTo6dGUoKTsKICAgICRvWydrYXNfbGlrbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGVtYWlsLHN0YXR1cyxwcm9kdWN0X2lkLHF0eSxjcmVhdGVkX2F0IEZST00geyR0fSIsQVJSQVlfQSk7CiAgICAkb1snaXRlbXNfbGlrbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHRpfSIsQVJSQVlfQSk7CiAgICAkb1snaXZ5a2lhaV9saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3Vic2NyaXB0aW9uX2lkLGV2ZW50IEZST00geyR0ZX0iLEFSUkFZX0EpOwogICAgLy8gc2F1Z2lrbGlzOiB0cmludGkgVElLIEBneXZ1bmFpLmx0IHRlc3Rpbml1cwogICAgZm9yZWFjaCgkb1sna2FzX2xpa28nXSBhcyAkcil7CiAgICAgIGlmKHN1YnN0cigkclsnZW1haWwnXSwtMTIpPT09J0BneXZ1bmFpLmx0Jyl7CiAgICAgICAgJHdwZGItPmRlbGV0ZSgkdCxhcnJheSgnaWQnPT4oaW50KSRyWydpZCddKSk7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHRpfSBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLChpbnQpJHJbJ2lkJ10pKTsKICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskdGV9IFdIRVJFIHN1YnNjcmlwdGlvbl9pZD0lZCIsKGludCkkclsnaWQnXSkpOwogICAgICB9CiAgICB9CiAgICAvLyBuYXNsZXMgaXRlbXMvaXZ5a2lhaSBiZSB0ZXZvCiAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBpIEZST00geyR0aX0gaSBMRUZUIEpPSU4geyR0fSBzIE9OIHMuaWQ9aS5zdWJzY3JpcHRpb25faWQgV0hFUkUgcy5pZCBJUyBOVUxMIik7CiAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBlIEZST00geyR0ZX0gZSBMRUZUIEpPSU4geyR0fSBzIE9OIHMuaWQ9ZS5zdWJzY3JpcHRpb25faWQgV0hFUkUgcy5pZCBJUyBOVUxMIik7CiAgICAkb1sncG8nXT1hcnJheSgoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHR9IiksKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR0aX0iKSwoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHRlfSIpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='f19_sluota-124356';
const GKEY='ps_f19';
const PHASES=["TZ"];
const OUT='analize/f19_sluota_1788093836.json';
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
