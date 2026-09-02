process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSByZWNvbjMKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MyddKSkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcCA9ICR3cGRiLT5wcmVmaXg7ICRvID0gWydWRVJTSUpBJyA9PiAnUzE1OTEtUjMnXTsKICAgICRpbmMgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvJzsKICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJGluYy4nY2xhc3MtaW1wb3J0LXJ1bGVzLXZmLnBocCcpOwogICAgJG9bJ3J1bGVzX2hlYWQnXSA9IG1iX3N1YnN0cigkYywgMCwgMzUwMCk7CiAgICBpZiAocHJlZ19tYXRjaCgnL2Z1bmN0aW9uIHZmX3Nob3VsZF9pbXBvcnQuKj9cbiAgICBcfVxuL3MnLCAkYywgJG0pKSAkb1sndmZfc2hvdWxkX2ltcG9ydCddID0gJG1bMF07CiAgICBmb3JlYWNoIChbJ2V4Y2x1ZGVkJywnc2tpcCcsJ2Jsb2NrJywnc2t1X2xpc3QnLCdibGFja2xpc3QnLCdIWVBPJywna29uc2VydiddIGFzICRrKSB7IGlmIChwcmVnX21hdGNoX2FsbCgnL14uKicuJGsuJy4qJC9taScsJGMsJG1tKSkgJG9bJ3J1bGVzX2dyZXAnXVska109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZuKCR4KT0+dHJpbShtYl9zdWJzdHIoJHgsMCwxNjApKSwkbW1bMF0pLDAsMjApOyB9CiAgICAvLyB2Zi1pbXBvcnQ6IGthaXAgcG9ydW9qYQogICAgJHYgPSBmaWxlX2dldF9jb250ZW50cygkaW5jLidjbGFzcy12Zi1pbXBvcnQucGhwJyk7ICRvWyd2Zl9pbXBvcnRfaGVhZCddID0gbWJfc3Vic3RyKCR2LDAsMzAwMCk7CiAgICBpZiAocHJlZ19tYXRjaF9hbGwoJy9eXHMqKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZCk/XHMqZnVuY3Rpb25ccytcdytccypcKFteKV0qXCkvbScsJHYsJG1tKSkgJG9bJ3ZmX2ltcG9ydF9mbnMnXT0kbW1bMF07CiAgICBpZiAocHJlZ19tYXRjaCgnL2Z1bmN0aW9uIGF0dGFjaF90b19leGlzdGluZy4qP1xuICAgIFx9XG4vcycsJHYsJG0pKSAkb1snYXR0YWNoJ109bWJfc3Vic3RyKCRtWzBdLDAsMzUwMCk7CiAgICBpZiAocHJlZ19tYXRjaF9hbGwoJy9hZGRfKGFjdGlvbnxmaWx0ZXIpXChbXjtdKjsvJywkdiwkbW0pKSAkb1sndmZfaW1wb3J0X2hvb2tzJ109JG1tWzBdOwogICAgLy8gc3RydWt0dXJ1b3RhcyBsb2dhcwogICAgJG9bJ2xvZ190YWJsZXMnXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICcleG1sJWxvZyUnIik7CiAgICAkbGYgPSBnbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy8qeG1sKmxvZyonKTsgJG9bJ2xvZ19maWxlcyddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRsZj86W10pOwogICAgaWYgKHByZWdfbWF0Y2goJy9mdW5jdGlvbiBwZXRzaG9wX3htbF9sb2dfc3RydWN0dXJlZC4qP1xuXH1cbi9zJywgZmlsZV9nZXRfY29udGVudHMoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCcpLCAkbSkpICRvWydsb2dfZm4nXT1tYl9zdWJzdHIoJG1bMF0sMCwxMjAwKTsKICAgIGZvcmVhY2ggKCRsZj86W10gYXMgJGYpIHsgJHQgPSBzaGVsbF9leGVjKCdncmVwIC1FICJBTTIwfFBNMzd8UE0yMHxRTTM3fFZNMzd8SE0zN3xETTM3fERNMjAiICcuZXNjYXBlc2hlbGxhcmcoJGYpLicgfCB0YWlsIC0yMCcpOyBpZiAoJHQpICRvWydsb2dfaGl0cyddW2Jhc2VuYW1lKCRmKV09bWJfc3Vic3RyKCR0LDAsNDAwMCk7IH0KICAgIC8vIGNhY2hlIHhtbAogICAgJGNmID0gV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BldHNob3AtdmYtY2FjaGUueG1sJzsgJG9bJ2NhY2hlJ109WydleGlzdHMnPT5maWxlX2V4aXN0cygkY2YpLCdzaXplJz0+ZmlsZV9leGlzdHMoJGNmKT9maWxlc2l6ZSgkY2YpOjAsJ210aW1lJz0+ZmlsZV9leGlzdHMoJGNmKT9kYXRlKCdjJyxmaWxlbXRpbWUoJGNmKSk6bnVsbF07CiAgICBpZiAoZmlsZV9leGlzdHMoJGNmKSkgewogICAgICAgICRiID0gZmlsZV9nZXRfY29udGVudHMoJGNmKTsKICAgICAgICAkb1snY2FjaGUnXVsnaGVhZCddPW1iX3N1YnN0cihwcmVnX3JlcGxhY2UoJy9bXlx4MDlceDBBXHgwRFx4MjAtXHg3RVx4QzItXHhGNFx4ODAtXHhCRl0vJywnJyxtYl9zdWJzdHIoJGIsMCwxNTAwKSksMCwxNTAwKTsKICAgICAgICBmb3JlYWNoIChbJ0FNMjAnLCdRTTM3JywnUE0zNycsJ1BNMjAnLCdWTTM3JywnSE0zNycsJ0RNMzcnLCdETTIwJywnSU5QTTExJywnTkdBTEE0MCddIGFzICRzaykgeyAkcG9zPXN0cnBvcygkYiwnPicuJHNrLic8Jyk7ICRvWydjYWNoZSddWydza3UnXVskc2tdPSAkcG9zPT09ZmFsc2U/bnVsbDpwcmVnX3JlcGxhY2UoJy9bXlx4MDlceDBBXHgwRFx4MjAtXHg3RVx4QzItXHhGNFx4ODAtXHhCRl0vJywnJyxzdWJzdHIoJGIsbWF4KDAsJHBvcy0xNTApLDkwMCkpOyB9CiAgICAgICAgLy8gdmlzaSBFWENMIEhZUE8ga29uc2VydmFpIHNyYXV0ZQogICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgnLzxyb3c+Lio/PFwvcm93Pi9zJywkYiwkcm93cykpIHsgJG9bJ2NhY2hlJ11bJ3Jvd3MnXT1jb3VudCgkcm93c1swXSk7ICRoeT1bXTsKICAgICAgICAgICAgZm9yZWFjaCAoJHJvd3NbMF0gYXMgJHJ3KSBpZiAoc3RyaXBvcygkcncsJ0VYQ0wgSFlQTycpIT09ZmFsc2UgJiYgcHJlZ19tYXRjaCgnL2tvbnNlcnYvaXUnLCRydykpIHsgcHJlZ19tYXRjaCgnLzxza3VfaWQ+KC4qPyk8XC9za3VfaWQ+LycsJHJ3LCRhKTsgcHJlZ19tYXRjaCgnLzxwcm9kdWN0X25hbWU+KC4qPyk8XC9wcm9kdWN0X25hbWU+LycsJHJ3LCRuKTsgcHJlZ19tYXRjaCgnLzxxdHk+KC4qPyk8XC9xdHk+LycsJHJ3LCRxKTsgcHJlZ19tYXRjaCgnLzxiYXJjb2RlPiguKj8pPFwvYmFyY29kZT4vJywkcncsJGJjKTsgJGh5W109WyRhWzFdPz8nJyxtYl9zdWJzdHIoJG5bMV0/PycnLDAsNzApLCRxWzFdPz8nJywkYmNbMV0/PycnXTsgfQogICAgICAgICAgICAkb1snY2FjaGUnXVsnZXhjbF9oeXBvX2tvbnNlcnYnXT0kaHk7IH0KICAgIH0KICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIGpzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1J8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-075920';
const GKEY='ps_ex3';
const PHASES=["R"];
const OUT='analize/s1591_recon3.json';
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
