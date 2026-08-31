process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGxhaXNrbyBsb2dvIDIgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19sZyddKXx8JF9HRVRbJ3BzX2xnJ10hPT0nTCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0xHMicpOwogIHRyeXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZW1haWwtbGF5b3V0LnBocCcpOyAkb1snbWQ1J109bWQ1KCRjKTsgJG9bJ3NpemUnXT1zdHJsZW4oJGMpOwogICAgJG9bJ3ZlciddPXByZWdfbWF0Y2goJy92KFxkK1wuXGQrKFwuXGQrKT8pLycsJGMsJG0pPyRtWzBdOm51bGw7CiAgICAkaT1zdHJwb3MoJGMsJ2Z1bmN0aW9uIGxvZ29fdXJsJyk7ICRvWydsb2dvX2ZuJ109c3Vic3RyKCRjLCRpLTEwMCw3MDApOwogICAgJGk9c3RycG9zKCRjLCckbG9nbyA9IHNlbGY6OmxvZ29fdXJsKCk7Jyk7ICRvWydoZWFkZXJfdXNlJ109c3Vic3RyKCRjLCRpLTIwMCwxMjAwKTsKICAgIGZvcmVhY2goYXJyYXkoMzI1NywzMDgpIGFzICRpZCl7ICRwc3Q9Z2V0X3Bvc3QoJGlkKTsgJG9bJ2F0dCddWyRpZF09YXJyYXkoJ2V4aXN0cyc9Pihib29sKSRwc3QsJ3R5cGUnPT4kcHN0PyRwc3QtPnBvc3RfdHlwZTpudWxsLCdtaW1lJz0+JHBzdD8kcHN0LT5wb3N0X21pbWVfdHlwZTpudWxsLCd0aXRsZSc9PiRwc3Q/JHBzdC0+cG9zdF90aXRsZTpudWxsLCd1cmwnPT53cF9nZXRfYXR0YWNobWVudF9pbWFnZV91cmwoJGlkLCdmdWxsJyksJ2ZpbGUnPT5nZXRfYXR0YWNoZWRfZmlsZSgkaWQpLCdmaWxlX2V4aXN0cyc9PmdldF9hdHRhY2hlZF9maWxlKCRpZCk/ZmlsZV9leGlzdHMoZ2V0X2F0dGFjaGVkX2ZpbGUoJGlkKSk6bnVsbCwnbWV0YSc9PndwX2dldF9hdHRhY2htZW50X21ldGFkYXRhKCRpZCk/YXJyYXlfaW50ZXJzZWN0X2tleSh3cF9nZXRfYXR0YWNobWVudF9tZXRhZGF0YSgkaWQpLGFycmF5KCd3aWR0aCc9PjEsJ2hlaWdodCc9PjEsJ2ZpbGUnPT4xKSk6bnVsbCk7IH0KICAgICRvWyd3Y19oZHInXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbWFpbF9oZWFkZXJfaW1hZ2UnKTsgJGY9c3RyX3JlcGxhY2UoaG9tZV91cmwoJy8nKSxBQlNQQVRILCRvWyd3Y19oZHInXSk7ICRvWyd3Y19oZHJfZXhpc3RzJ109ZmlsZV9leGlzdHMoJGYpOwogICAgLy8gbG9nb3RpcGFpIHVwbG9hZHMKICAgICRvWydsb2dvX2F0dCddPWFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICRwLT5JRC4nOicuJHAtPnBvc3RfdGl0bGUuJzonLndwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkcC0+SUQsJ2Z1bGwnKTt9LGdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J2F0dGFjaG1lbnQnLCdwb3N0X3N0YXR1cyc9Pidpbmhlcml0JywncG9zdHNfcGVyX3BhZ2UnPT4xNSwncyc9Pidsb2dvJykpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-074318';
const GKEY='ps_lg';
const PHASES=["L"];
const OUT='analize/lg_recon2.json';
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
