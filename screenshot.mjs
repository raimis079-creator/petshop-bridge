process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY0IHZlaWRyb2RpcyB2cyBjYWNoZSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfc2VvJ10pPyRfR0VUWydwc19zZW8nXTonJzsgaWYoJGYhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgndic9PidTMTU2NCcpOwogIHRyeXsgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXYtdmVpZHJvZGlzLnBocCcpOyAkb1snQiddPXN0cmxlbigkYyk7IHByZWdfbWF0Y2hfYWxsKCd+KGFkZF9hY3Rpb258YWRkX2ZpbHRlcnxvYl9zdGFydHxIVFRQX0hPU1R8c3RyX3JlcGxhY2V8cHJlZ19yZXBsYWNlfGlzX2FkbWlufFJFUVVFU1RfVVJJfERPTk9UQ0FDSEV8d3BfY2FjaGUpW15cbl17MCwxNDB9ficsJGMsJG0pOyAkb1snY3R4J109YXJyYXlfc2xpY2UoJG1bMF0sMCwzMCk7CiAgICAkaG9tZT1XUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvZGV2LmF2ZXNhLmx0L2luZGV4LWh0dHBzLmh0bWwnOyBpZihmaWxlX2V4aXN0cygkaG9tZSkpeyAkaD1maWxlX2dldF9jb250ZW50cygkaG9tZSk7ICRvWydjYWNoZV9ob21lJ109YXJyYXkoJ210aW1lJz0+ZGF0ZSgnSDppOnMnLGZpbGVtdGltZSgkaG9tZSkpLCdkZXYnPT5zdWJzdHJfY291bnQoJGgsJ2Rldi5hdmVzYS5sdCcpLCdwcm9kJz0+c3Vic3RyX2NvdW50KCRoLCcvL3BldHNob3AubHQnKSk7IH0KICAgICRsaXZlPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4ndGV4dC9odG1sJywnQWNjZXB0LUVuY29kaW5nJz0+J2d6aXAnKSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCAoTGludXg7IEFuZHJvaWQgMTE7IFBpeGVsIDUpIENocm9tZS8xMjAgTW9iaWxlJykpKTsgJG9bJ2xpdmUnXT1hcnJheSgnZGV2Jz0+c3Vic3RyX2NvdW50KCRsaXZlLCdkZXYuYXZlc2EubHQnKSwncHJvZCc9PnN1YnN0cl9jb3VudCgkbGl2ZSwnLy9wZXRzaG9wLmx0JyksJ2NjJz0+bnVsbCk7CiAgICBwcmVnX21hdGNoX2FsbCgnfmh0dHBzPzovL3BldHNob3BcLmx0L1teIlwnKVxzXXswLDkwfX4nLCRsaXZlLCRtbSk7ICRvWydwcm9kX3VybHMnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1tWzBdKSwwLDEwKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-115258';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1564.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
