process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIHJldGVuY2lqYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2UzJ10pPyRfR0VUWydwc19lMyddOicnKSE9PSdSVCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0UzUlQnKTsKICB0cnl7CiAgICAkZmFpbGFpPWFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC0qLnBocCcpLAogICAgICBnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi5waHAnKSwKICAgICAgZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1lc3AvaW5jbHVkZXMvKi5waHAnKSwKICAgICAgYXJyYXkoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9wZXRzaG9wLWNvcmUucGhwJykpOwogICAgZm9yZWFjaCgkZmFpbGFpIGFzICRmKXsgaWYoIWZpbGVfZXhpc3RzKCRmKSkgY29udGludWU7CiAgICAgICRrPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgaWYocHJlZ19tYXRjaCgnLyhERUxFVEVccytGUk9NW147XXswLDgwfXBzX2VtYWlsX2pvYnN8cHNfZW1haWxfam9ic1teO117MCw2MH0oREVMRVRFfFRSVU5DQVRFKXxyZXRlbnRpb258cmV0ZW5jaWopL2knLCRrLCRtKSkKICAgICAgICAkb1sncmFkaW5pYWknXVtiYXNlbmFtZSgkZildPXRyaW0oc3Vic3RyKCRtWzBdLDAsMTIwKSk7CiAgICB9CiAgICAkb1snY3Jvbl92YWx5bWFpJ109YXJyYXkoKTsKICAgIGZvcmVhY2goX2dldF9jcm9uX2FycmF5KCkgYXMgJGxhaWthcz0+JGhvb2tzKSBmb3JlYWNoKCRob29rcyBhcyAkaD0+JHgpCiAgICAgIGlmKHByZWdfbWF0Y2goJy8oY2xlYW58dmFseW18cHVyZ2V8cHJ1bmV8cmV0ZW50aW9uKS9pJywkaCkpICRvWydjcm9uX3ZhbHltYWknXVtdPSRoOwogICAgJG9bJ2Nyb25fdmFseW1haSddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG9bJ2Nyb25fdmFseW1haSddKSk7CiAgICBpZihlbXB0eSgkb1sncmFkaW5pYWknXSkpICRvWydyYWRpbmlhaSddPSdORVJBIOKAlCBqb2JzIG5pZWthcyBuZXZhbG8nOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='e3_ret-204549';
const GKEY='ps_e3';
const PHASES=["RT"];
const OUT='analize/e3_ret.json';
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
