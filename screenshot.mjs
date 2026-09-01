process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU0IHJpbmtpbmlhaSB2MS40MyAoYmUgbm9jYWNoZSBwcmVrxJdzZSkgKyBzZXRjb29raWUgcmVjb24gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnRklYJywnVkVSJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTU0JywnZmF6ZSc9PiRmKTsKICB0cnl7CiAgICAkcD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwogICAgaWYoJGY9PT0nRklYJyl7CiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYobWQ1KCRjKSE9PScxMWU5N2I4ZTgwNmIwYzc2ZTU3ZTlhMzA5MGEwOWNlYScpIHRocm93IG5ldyBFeGNlcHRpb24oJ1NUT1AgbWQ1ICcubWQ1KCRjKSk7CiAgICAgICRhPSJcdFx0YWRkX2FjdGlvbiggJ3NlbmRfaGVhZGVycycsIGFycmF5KCBfX0NMQVNTX18sICdiZV9rZXNvJyApICk7IC8qIHYxLjQwICovXG4iOwogICAgICBpZihzdWJzdHJfY291bnQoJGMsJGEpIT09MSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignaW5rYXJhcyAnLnN1YnN0cl9jb3VudCgkYywkYSkpOwogICAgICAkYz1zdHJfcmVwbGFjZSgkYSwiXHRcdC8qIHYxLjQzIChTMTU1NCk6IHNlbmRfaGVhZGVycy9iZV9rZXNvIE5VSU1UQSDigJQgbm9jYWNoZV9oZWFkZXJzKCkgcHJla8SXc2UgYmxva2F2byBwdXNsYXBpxbMgY2FjaGUgKFdQIFN1cGVyIENhY2hlKTsgbmFyxaF5a2zEl3Mga2VzbyB2YWxkeW1hcyBkYWJhciBwZXIgY2FjaGUgc2x1b2tzbsSvLiAqL1xuIiwkYyk7CiAgICAgICRiPSI8P3BocFxuLyoqXG4gKiBQZXRzaG9wIFJpbmtpbmlhaSB2MS40MiAoSDMwMSkiOyBpZihzdWJzdHJfY291bnQoJGMsJGIpIT09MSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignYW50cmHFoXTEl3MgaW5rYXJhcycpOwogICAgICAkYz1zdHJfcmVwbGFjZSgkYiwiPD9waHBcbi8qKlxuICogUGV0c2hvcCBSaW5raW5pYWkgdjEuNDMgKFMxNTU0KSDigJQgcHJla2VzIHB1c2xhcGlhbXMgTkVCRXNpdW5jaWFtYXMgbm9jYWNoZV9oZWFkZXJzKCkgKHYxLjQwIGJlX2tlc28pOlxuICogamlzIGJsb2thdm8gcHVzbGFwaXUgY2FjaGUgKENhY2hlLUNvbnRyb2w6IG5vLXN0b3JlIHZpc29zZSBwcmVrZXNlLCBTMTU1MiByZWNvbikuIE1ldG9kYXMgYmVfa2VzbygpXG4gKiBwYWxpa3RhcywgYmV0IG5lYmVrYWJpbmFtYXMuIE5hcnN5a2xlcyBrZXNvIHByb2JsZW1hIChIMjk4KSBzcHJlbmR6aWFtYSBjYWNoZSBzbHVva3NuaW8gaGVhZGVyJ2lhaXMuXG4gKlxuICogUGV0c2hvcCBSaW5raW5pYWkgdjEuNDIgKEgzMDEpIiwkYyk7CiAgICAgIHRva2VuX2dldF9hbGwoJGMsIFRPS0VOX1BBUlNFKTsKICAgICAgY29weSgkcCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1yaW5raW5pYWkucGhwLmJha19TMTU1NCcpOyBmaWxlX3B1dF9jb250ZW50cygkcCwkYyk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkcCx0cnVlKTsKICAgICAgJG9bJ0InXT1maWxlc2l6ZSgkcCk7ICRvWydtZDUnXT1tZDVfZmlsZSgkcCk7ICRvWydncmVwX3NlbmRfaGVhZGVycyddPXN1YnN0cl9jb3VudChmaWxlX2dldF9jb250ZW50cygkcCksImFkZF9hY3Rpb24oICdzZW5kX2hlYWRlcnMnIik7CiAgICAgIC8vIHNldGNvb2tpZSByZWNvbjogYW5vbmltaW5pYW1zIGxhbmt5dG9qYW1zCiAgICAgICRwYXQ9J35zZXRjb29raWVccypcKFxzKltcJyJdKFteXCciXSspfic7CiAgICAgIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL2luY2x1ZGVzLyoucGhwJyksZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nLyoucGhwJykpIGFzICRmZil7IGlmKHByZWdfbWF0Y2hfYWxsKCRwYXQsZmlsZV9nZXRfY29udGVudHMoJGZmKSwkbSkpICRvWydjb29raWVzX3BocCddW2Jhc2VuYW1lKCRmZildPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsgfQogICAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBjb2RlIExJS0UgJyVzZXRjb29raWUlJyIsQVJSQVlfQSkgYXMgJHMpeyBpZihwcmVnX21hdGNoX2FsbCgkcGF0LCRzWydjb2RlJ10sJG0pKSAkb1snY29va2llc19zbmlwJ11bJHNbJ2lkJ10uJyAnLiRzWyduYW1lJ11dPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsgfQogICAgICAvLyBKUyBjb29raWVzIChkb2N1bWVudC5jb29raWUpIG11L2NvcmUgYXNzZXRzCiAgICAgIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvYXNzZXRzLyouanMnKSBhcyAkZmYpeyBpZihwcmVnX21hdGNoX2FsbCgnfmRvY3VtZW50XC5jb29raWVccyo9XHMqW1wnImBdKFthLXpBLVowLTlfXC1dKyk9ficsZmlsZV9nZXRfY29udGVudHMoJGZmKSwkbSkpICRvWydjb29raWVzX2pzJ11bYmFzZW5hbWUoJGZmKV09YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVsxXSkpOyB9CiAgICAgICRvWyd3cF9jb25maWdfd3JpdGFibGUnXT1pc193cml0YWJsZShBQlNQQVRILid3cC1jb25maWcucGhwJyk7ICRvWyd3cF9jb250ZW50X3dyaXRhYmxlJ109aXNfd3JpdGFibGUoV1BfQ09OVEVOVF9ESVIpOyAkb1snaHRhY2Nlc3Nfd3JpdGFibGUnXT1pc193cml0YWJsZShBQlNQQVRILicuaHRhY2Nlc3MnKTsKICAgICAgJG9bJ3BsdWdpbnNfZGlyX3dyaXRhYmxlJ109aXNfd3JpdGFibGUoV1BfUExVR0lOX0RJUik7ICRvWydzdXBlcl9jYWNoZV9pbnN0YWxsZWQnXT1maWxlX2V4aXN0cyhXUF9QTFVHSU5fRElSLicvd3Atc3VwZXItY2FjaGUnKTsKICAgIH0gZWxzZSB7CiAgICAgICRwaWQ9Z2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9PjEsJ2ZpZWxkcyc9PidpZHMnKSlbMF07CiAgICAgICRnPXdwX3JlbW90ZV9nZXQoZ2V0X3Blcm1hbGluaygkcGlkKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpOyAkb1sncHJla2VfY2MnXT0kaFsnY2FjaGUtY29udHJvbCddPz8nKG7El3JhKSc7ICRvWydwcmVrZV9jb2RlJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpOwogICAgICAkb1sna2xhc2UnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaWFpJyk7ICRvWydoYXNfc2VuZF9oZWFkZXJzJ109aGFzX2FjdGlvbignc2VuZF9oZWFkZXJzJyxhcnJheSgnUGV0c2hvcF9SaW5raW5pYWknLCdiZV9rZXNvJykpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-094151';
const GKEY='ps_seo';
const PHASES=["FIX", "VER"];
const OUT='analize/s1554.json';
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
