process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTYxIGZyb250LWVuZCByZWNvbjogaW5saW5lIGpRdWVyeSBIRUFEJ2UsIHNrcmlwdMWzIGVpbMSXLCDFoXJpZnRhaSwgR1RNICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NjEnKTsgQHNldF90aW1lX2xpbWl0KDI1MCk7CiAgdHJ5ewogICAgJHVybHM9YXJyYXkoJ3ByYWRpbmlzJz0+aG9tZV91cmwoJy8nKSwna2F0ZWdvcmlqYSc9PmhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvc2F1c2FzLW1haXN0YXMtc3VuaW1zLycpLCdwcmVrZSc9PmhvbWVfdXJsKCcvcHJvZHVjdC9yb3lhbC1jYW5pbi1jYXQtZnVzc3ktZXhpZ2VudC0xMC1rZy1zYXVzYXMtcGFzYXJhcy1pc3Jhbmtpb21zLWthdGVtcy8nKSk7CiAgICBmb3JlYWNoKCR1cmxzIGFzICRrPT4kdSl7CiAgICAgICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KHdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J3RleHQvaHRtbCcpKSkpOwogICAgICAkaGVhZD1zdWJzdHIoJGgsMCxzdHJwb3MoJGgsJzwvaGVhZD4nKSk7ICRib2R5PXN1YnN0cigkaCxzdHJwb3MoJGgsJzwvaGVhZD4nKSk7CiAgICAgICRqcXBvcz1zdHJwb3MoJGgsJ2pxdWVyeS5taW4uanMnKTsgJHI9YXJyYXkoJ2pxX2luX2hlYWQnPT4kanFwb3MhPT1mYWxzZSAmJiAkanFwb3M8c3RybGVuKCRoZWFkKSk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCd+PHNjcmlwdCg/IVtePl0qXGJzcmM9KVtePl0qPiguKj8pPC9zY3JpcHQ+fnMnLCRoZWFkLCRtKTsgJHJbJ2hlYWRfaW5saW5lX24nXT1jb3VudCgkbVsxXSk7ICRyWydoZWFkX2lubGluZV9qcSddPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJG1bMV0gYXMgJHMpeyBpZihwcmVnX21hdGNoKCd+XGJqUXVlcnlcYnxcJFwofFwkXC5+JywkcykpICRyWydoZWFkX2lubGluZV9qcSddW109c3Vic3RyKHByZWdfcmVwbGFjZSgnflxzK34nLCcgJyx0cmltKCRzKSksMCwxMTApOyB9CiAgICAgIHByZWdfbWF0Y2hfYWxsKCd+PHNjcmlwdCg/IVtePl0qXGJzcmM9KVtePl0qPiguKj8pPC9zY3JpcHQ+fnMnLCRib2R5LCRtMik7ICRyWydib2R5X2lubGluZV9uJ109Y291bnQoJG0yWzFdKTsgJHJbJ2JvZHlfaW5saW5lX2pxJ109YXJyYXkoKTsKICAgICAgZm9yZWFjaCgkbTJbMV0gYXMgJHMpeyBpZihwcmVnX21hdGNoKCd+XGJqUXVlcnlcYnxcJFwofFwkXC5+JywkcykpICRyWydib2R5X2lubGluZV9qcSddW109c3Vic3RyKHByZWdfcmVwbGFjZSgnflxzK34nLCcgJyx0cmltKCRzKSksMCwxMTApOyB9CiAgICAgIHByZWdfbWF0Y2hfYWxsKCd+PHNjcmlwdFtePl0rc3JjPVsiXCddKFteIlwnXSspWyJcJ10oW14+XSopPn4nLCRoZWFkLCRtcyk7ICRyWydoZWFkX3NyYyddPWFycmF5X21hcChmbigkeCwkYSk9PnN1YnN0cihwcmVnX3JlcGxhY2UoJ35eaHR0cHM/Oi8vW14vXSt+JywnJywkeCksMCw4MCkuKHByZWdfbWF0Y2goJ35cYmRlZmVyXGJ+JywkYSk/JyBbZGVmZXJdJzonJykuKHByZWdfbWF0Y2goJ35cYmFzeW5jXGJ+JywkYSk/JyBbYXN5bmNdJzonJyksJG1zWzFdLCRtc1syXSk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCd+PGxpbmtbXj5dK3JlbD1bIlwnXXN0eWxlc2hlZXRbIlwnXVtePl0raHJlZj1bIlwnXShbXiJcJ10rKX4nLCRoZWFkLCRtYyk7ICRyWydoZWFkX2NzcyddPWFycmF5X21hcChmbigkeCk9PnN1YnN0cihwcmVnX3JlcGxhY2UoJ35eaHR0cHM/Oi8vW14vXSt+JywnJyxwcmVnX3JlcGxhY2UoJ35cP3Zlcj0uKiR+JywnJywkeCkpLDAsODApLCRtY1sxXSk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCd+PHN0eWxlW14+XSo+KC4qPyk8L3N0eWxlPn5zJywkaCwkbXN0KTsgJHJbJ2lubGluZV9jc3Nfa2InXT1yb3VuZChhcnJheV9zdW0oYXJyYXlfbWFwKCdzdHJsZW4nLCRtc3RbMV0pKS8xMDI0KTsgJHJbJ2lubGluZV9jc3NfbiddPWNvdW50KCRtc3RbMV0pOwogICAgICBwcmVnX21hdGNoX2FsbCgnfnVybFwoKFteKV0qXC53b2ZmMj9bXildKilcKX4nLCRoLCRtZik7ICRyWydmb250X3VybHMnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21hcChmbigkeCk9PmJhc2VuYW1lKHRyaW0oJHgsJyJcJyAnKSksJG1mWzFdKSkpOwogICAgICAkclsnZ3RtX3BvcyddPSgkcD1zdHJwb3MoJGgsJ2dvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcycpKSE9PWZhbHNlPygkcDxzdHJsZW4oJGhlYWQpPydoZWFkJzonYm9keScpOiduZXJhJzsKICAgICAgJG9bJ3AnXVska109JHI7CiAgICB9CiAgICAvLyDFoXJpZnTFsyBmYWlsYWkKICAgICRvWydmb250cyddPWFycmF5X21hcChmbigkeCk9PmJhc2VuYW1lKCR4KS4nICcucm91bmQoZmlsZXNpemUoJHgpLzEwMjQpLidLQicsZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1mb250cy9mb250cy8qJykpOwogICAgJG9bJ2ZvbnRzX2NzcyddPXN1YnN0cigoc3RyaW5nKUBmaWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1mb250cy9wZXRzaG9wLWZvbnRzLnBocCcpLDAsMTUwMCk7CiAgICAkb1snZmxhdHNvbWVfbW9kcyddPWFycmF5X2ludGVyc2VjdF9rZXkoZ2V0X3RoZW1lX21vZHMoKSxhcnJheV9mbGlwKGFycmF5KCdqcXVlcnlfZm9vdGVyJywnbWluaWZ5X2NzcycsJ2xhenlfbG9hZF9pbWFnZXMnLCdmbGF0c29tZV9saWdodGJveCcsJ2Rpc2FibGVfZW1vamknLCdkaXNhYmxlX3djX2Jsb2Nrc19jc3MnLCdzd2F0Y2hlc19wb3NpdGlvbicsJ3R5cGVfaGVhZGluZ3MnLCd0eXBlX3RleHRzJywnZGlzYWJsZV9ndXRlbmJlcmcnKSkpOwogICAgLy8gR1RNIGt1ciBpxaF2ZWRhbWFzCiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgY29kZSBMSUtFICclR1RNLU1GM0daR1QlJyIsQVJSQVlfQSkgYXMgJHMpICRvWydndG1fc25pcCddW109JHM7CiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZmYpeyBpZihzdHJwb3MoZmlsZV9nZXRfY29udGVudHMoJGZmKSwnR1RNLU1GM0daR1QnKSE9PWZhbHNlKSAkb1snZ3RtX211J11bXT1iYXNlbmFtZSgkZmYpOyB9CiAgICAkb1snZ3RtX3BsdWdpbiddPWZpbGVfZXhpc3RzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWd0bScpPydwZXRzaG9wLWd0bSc6KGdsb2IoV1BfUExVR0lOX0RJUi4nLypndG0qJyk/YmFzZW5hbWUoZ2xvYihXUF9QTFVHSU5fRElSLicvKmd0bSonKVswXSk6bnVsbCk7CiAgICAvLyBrYXMgacWhdmVkYSBpbmxpbmUgalF1ZXJ5IEhFQUQnZTogZ3JlcCB3cF9oZWFkICsgalF1ZXJ5CiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZmYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZmYpOyBpZihwcmVnX21hdGNoKCd+d3BfaGVhZH4nLCRjKSAmJiBwcmVnX21hdGNoKCd+PHNjcmlwdFtePl0qPltePF17MCwyMDB9KGpRdWVyeXxcJFwoKX5zJywkYykpICRvWydoZWFkX2pxX211J11bXT1iYXNlbmFtZSgkZmYpOyB9CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBjb2RlIExJS0UgJyV3cF9oZWFkJScgQU5EIChjb2RlIExJS0UgJyVqUXVlcnklJyBPUiBjb2RlIExJS0UgJyVcJCglJykiLEFSUkFZX0EpIGFzICRzKSAkb1snaGVhZF9qcV9zbmlwJ11bXT0kc1snaWQnXS4nICcuJHNbJ25hbWUnXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-113738';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1561.json';
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
