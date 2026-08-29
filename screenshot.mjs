process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFBQIFJlY29uIHYxLjAgKDdkLzE0ZCBlbnF1ZXVlIHBhdGlrcmEpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykhPT0nWlY1JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUFAtUkVDT04tdjEuMCcpOwogIHRyeXsKICAgICRmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcG9zdC1wdXJjaGFzZS5waHAnOwogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgJG9bJzdkX2VucXVldWUnXT1zdWJzdHJfY291bnQoJGMsJ3Bvc3RfcHVyY2hhc2VfN2QnKTsKICAgICRvWycxNGRfZW5xdWV1ZSddPXN1YnN0cl9jb3VudCgkYywncG9zdF9wdXJjaGFzZV8xNGQnKTsKICAgICRvWycyZF9lbnF1ZXVlJ109c3Vic3RyX2NvdW50KCRjLCdwb3N0X3B1cmNoYXNlXzJkJyk7CiAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJG49PiRsKXsKICAgICAgaWYoc3RycG9zKCRsLCdwb3N0X3B1cmNoYXNlXycpIT09ZmFsc2UgJiYgc3RycG9zKCRsLCdlbnF1ZXVlJyk9PT1mYWxzZSkgY29udGludWU7CiAgICAgIGlmKHN0cnBvcygkbCwncG9zdF9wdXJjaGFzZV8nKSE9PWZhbHNlKSAkb1snZWlsdXRlcyddW109KCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxNDApKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo='; const VER='PP-RECON-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS PP Recon v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=ZV5',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/pp_recon.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
