process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTMwIHByaXN0YXR5bW8gcmlib3MgcmVjb24gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19yYiddKXx8JF9HRVRbJ3BzX3JiJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTUzMCcpOwogIHRyeXsKICAgIC8vIFZpc29zIGZyZWVfc2hpcHBpbmcgbWluX2Ftb3VudCByZWlrc21lcwogICAgJHpvbmVzPVdDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZXMoKTsKICAgICR6b25lc1swXT1hcnJheSgnem9uZV9uYW1lJz0+J0tpdGEnLCdzaGlwcGluZ19tZXRob2RzJz0+V0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lKDApLT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpKTsKICAgIGZvcmVhY2goJHpvbmVzIGFzICR6KXsKICAgICAgJG1ldHM9aXNzZXQoJHpbJ3NoaXBwaW5nX21ldGhvZHMnXSk/JHpbJ3NoaXBwaW5nX21ldGhvZHMnXTphcnJheSgpOwogICAgICBmb3JlYWNoKCRtZXRzIGFzICRtKXsKICAgICAgICBpZigkbS0+aWQ9PT0nZnJlZV9zaGlwcGluZyd8fHN0cnBvcygkbS0+aWQsJ2ZyZWUnKSE9PWZhbHNlKQogICAgICAgICAgJG9bJ2ZyZWUnXVtdPWFycmF5KCd6b25hJz0+JHpbJ3pvbmVfbmFtZSddLCdwYXZhZCc9PiRtLT5nZXRfdGl0bGUoKSwnbWluJz0+JG0tPmdldF9vcHRpb24oJ21pbl9hbW91bnQnKSwnZW5hYmxlZCc9PiRtLT5pc19lbmFibGVkKCkpOwogICAgICAgIGVsc2UKICAgICAgICAgICRvWydraXRpJ11bXT1hcnJheSgnem9uYSc9PiR6Wyd6b25lX25hbWUnXSwnaWQnPT4kbS0+aWQsJ3BhdmFkJz0+JG0tPmdldF90aXRsZSgpLCdlbmFibGVkJz0+JG0tPmlzX2VuYWJsZWQoKSk7CiAgICAgIH0KICAgIH0KICAgIC8vIFZpcnN1dGluZXMganVvc3RvcyB0ZWtzdGFzIChGbGF0c29tZSB0b3BiYXIpCiAgICAkdGI9Z2V0X29wdGlvbigndGhlbWVfbW9kc19mbGF0c29tZS1jaGlsZCcpOwogICAgaWYoaXNfYXJyYXkoJHRiKSkgZm9yZWFjaCgkdGIgYXMgJGs9PiR2KSBpZihpc19zdHJpbmcoJHYpJiZzdHJwb3MoJHYsJ05lbW9rYW1hcycpIT09ZmFsc2UpICRvWyd0b3BiYXInXVska109c3Vic3RyKCR2LDAsMTIwKTsKICAgIC8vIFByb2dyZXNzIGJhciByaWJhIChmdW5jdGlvbnMucGhwIC8ga2FzZSkKICAgIGZvcmVhY2goYXJyYXkoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJykgYXMgJGZmKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGZmKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy9cYigzMHwzOSlccyooPzrigqx8ZXVyKXxtaW5fYW1vdW50fG5lbW9rYW0vaScsJGMsJG0pOwogICAgICBpZigkbVswXSkgJG9bJ2Z1bmN0aW9uc191enVvbWlub3MnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1bMF0pLDAsMTApOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-202758';
const GKEY='ps_rb';
const PHASES=["GO"];
const OUT='analize/s1530_riba.json';
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
