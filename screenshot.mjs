process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFBCMCBQcmVraXUgY2lrbHUgenZhbGd5YmEgdjEuMCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J1BCMCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1BCMC12MS4wJyk7CiAgdHJ5ewogICAgJGRpcj1QRVRTSE9QX0NPUkVfRElSLid0ZW1wbGF0ZXMvZW1haWxzLyc7CiAgICBmb3JlYWNoKGFycmF5KCdjYXJ0X2FiYW5kb25lZCc9PidjYXJ0LWFiYW5kb25lZC0xJywnY2FydF9hYmFuZG9uZWRfMic9PidjYXJ0LWFiYW5kb25lZC0yJywncG9zdF9wdXJjaGFzZV8yZCc9Pidwb3N0LXB1cmNoYXNlLTJkJywnYnJvd3NlX2FiYW5kb25lZCc9Pidicm93c2UtYWJhbmRvbmVkJykgYXMgJGY9PiRzKXsKICAgICAgJHQ9ZmlsZV9nZXRfY29udGVudHMoJGRpci4kcy4nLnBocCcpOwogICAgICAvKiBjaWtsbyBzcml0aXM6IG51byBmb3JlYWNoIGlraSBlbmRmb3JlYWNoL30gKi8KICAgICAgJGU9YXJyYXkoJ2ZhaWxhcyc9PiRzLicucGhwJywnYmFpdGFpJz0+c3RybGVuKCR0KSk7CiAgICAgICRpPXN0cnBvcygkdCwnZm9yZWFjaCcpOwogICAgICBpZigkaSE9PWZhbHNlKXsgJGVbJ2Npa2xhcyddPW1iX3N1YnN0cigkdCxtYXgoMCwkaS01MDApLDE0MDApOyB9CiAgICAgICRvWyRmXT0kZTsKICAgIH0KICAgIC8qIHBheWxvYWQgc2NoZW1vcyAqLwogICAgJHNkPVBFVFNIT1BfQ09SRV9ESVIuJ3NjaGVtYXMvZXZlbnRzLyc7CiAgICAkb1snc2NoZW1vc19rYXRhbG9nYXMnXT1pc19kaXIoJHNkKT8neXJhJzonTkVSQSc7CiAgICBpZihpc19kaXIoJHNkKSl7CiAgICAgICRvWydzY2hlbXVfZmFpbGFpJ109YXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoc2NhbmRpcigkc2QpLGFycmF5KCcuJywnLi4nKSkpOwogICAgICBmb3JlYWNoKGFycmF5KCdjYXJ0X2FiYW5kb25lZCcsJ2Jyb3dzZV9hYmFuZG9uZWQnLCdwb3N0X3B1cmNoYXNlXzJkJykgYXMgJG4pewogICAgICAgIGZvcmVhY2goYXJyYXkoJG4uJy5qc29uJywncHNfJy4kbi4nLmpzb24nKSBhcyAkYyl7CiAgICAgICAgICBpZihmaWxlX2V4aXN0cygkc2QuJGMpKXsgJG9bJ3NjaGVtYV8nLiRuXT1tYl9zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoJHNkLiRjKSwwLDEyMDApOyBicmVhazsgfQogICAgICAgIH0KICAgICAgfQogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='PB0-180837';
const GKEY='ps_bis';
const PHASES=["PB0"];
const OUT='analize/pb0.json';
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
