process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGxhaXNrbyBsb2dvIDUgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19sZyddKXx8JF9HRVRbJ3BzX2xnJ10hPT0nVScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOCcpOwogICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZW1haWwtbGF5b3V0LnBocCcpOyBlY2hvICI9PT09PUxBWU9VVFxuIi5zdWJzdHIoJGMsc3RycG9zKCRjLCdwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIG11dGVkJykpOwogIGVjaG8gIlxuPT09PT1URU1QTEFURVNcbiI7ICRiZXN0PW51bGw7IGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL3RlbXBsYXRlcy9lbWFpbHMvKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJHU9c3RycG9zKCRzLCdQZXRzaG9wX0VtYWlsX0xheW91dCcpIT09ZmFsc2U7IGVjaG8gYmFzZW5hbWUoJGYpLicgJy5zdHJsZW4oJHMpLicgbGF5b3V0PScuKCR1PydZJzonTicpLiJcbiI7IGlmKCR1ICYmICghJGJlc3R8fHN0cmxlbigkcyk8c3RybGVuKGZpbGVfZ2V0X2NvbnRlbnRzKCRiZXN0KSkpKSAkYmVzdD0kZjsgfQogIGVjaG8gIlxuPT09PT1FWEFNUExFICIuYmFzZW5hbWUoJGJlc3QpLiJcbiIuZmlsZV9nZXRfY29udGVudHMoJGJlc3QpOwogIC8vIGthaXAgZGlzcGF0Y2ggaXNrdmllY2lhIHNhYmxvbmEKICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcpOyAkc3JjPWZpbGVfZ2V0X2NvbnRlbnRzKCRyYy0+Z2V0RmlsZU5hbWUoKSk7IGlmKHByZWdfbWF0Y2goJy8uezAsNjAwfXRlbXBsYXRlc1wvZW1haWxzLnswLDkwMH0vcycsJHNyYywkbSkpIGVjaG8gIlxuPT09PT1ESVNQQVRDSCBpbmNsdWRlXG4iLiRtWzBdOwogIGV4aXQ7Cn0pOwo=';
const VER='dep-074811';
const GKEY='ps_lg';
const PHASES=["U"];
const OUT='analize/lg_recon5.json';
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
