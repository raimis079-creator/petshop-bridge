process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIElNUDEgSW1wb3J0dW90b2pvIGRpZWdpbWFzICsgRFJZIHYxLjAgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJHY9aXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106Jyc7CiAgaWYoIWluX2FycmF5KCR2LGFycmF5KCdJTVAxJywnSU1QMicpLHRydWUpKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidJTVAxLXYxLjAnLCdmYXplJz0+JHYpOwogIHRyeXsKICAgIGlmKCR2PT09J0lNUDEnKXsKICAgICAgJE1ENT0nZDZiYTg2ZmUyZDVmMjI2ZDExZjZjZTY2MGFiZWNlMjknOyAkZm49J3BldHNob3AtbGFpc2thaS1pbXBvcnRhcy5waHAnOwogICAgICAkZHN0PVdQTVVfUExVR0lOX0RJUi4nLycuJGZuOwogICAgICAkb1snYnV2byddPWZpbGVfZXhpc3RzKCRkc3QpP21kNV9maWxlKCRkc3QpOidORVJBJzsKICAgICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZGVwbG95LycuJGZuLicuYjY0P3Y9Jy4kTUQ1LictJy50aW1lKCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHIpKXsgJG9bJ1NUT1AnXT0nZmV0Y2gnOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgICAkaz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSk7CiAgICAgIGlmKG1kNSgkaykhPT0kTUQ1KXsgJG9bJ1NUT1AnXT0nTUQ1OiAnLm1kNSgkayk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAgIGlmKEB0b2tlbl9nZXRfYWxsKCRrLFRPS0VOX1BBUlNFKT09PWZhbHNlKXsgJG9bJ1NUT1AnXT0nU0lOVEFLU0UnOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgICBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRrKTsKICAgICAgJG9bJ2lyYXN5dGEnXT0obWQ1X2ZpbGUoJGRzdCk9PT0kTUQ1KT8nT0snOidNRDUgUE8nOwogICAgfQogICAgaWYoJHY9PT0nSU1QMicpewogICAgICBpZighY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0xhaXNrYWlfSW1wb3J0YXMnKSl7ICRvWydTVE9QJ109J2tsYXNlIG5ldXpzaWtyb3ZlJzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgJG9bJ2RyeSddPVBldHNob3BfTGFpc2thaV9JbXBvcnRhczo6dnlrZHl0aShmYWxzZSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='IMP1-IMP2-170936';
const GKEY='ps_bis';
const PHASES=["IMP1", "IMP2"];
const OUT='analize/imp1.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
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
