process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJyZXZv4oaSU2VuZGVyIGFwcGx5MiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX2JydiddKT8kX0dFVFsncHNfYnJ2J106JycpOyBpZigkZiE9PSdBUFBMWTInJiYkZiE9PSdWRVIyJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nQlJWMycsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgaWYoJGY9PT0nQVBQTFkyJyl7CiAgICAgIGZvcmVhY2goYXJyYXkoMzQ1MjYpIGFzICRpZCl7CiAgICAgICAgJGM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgSUQ9JWQiLCRpZCkpOwogICAgICAgICRyPWFycmF5KCdpZCc9PiRpZCwnbWQ1X3ByaWVzJz0+bWQ1KCRjKSwnYnJldm9fcHJpZXMnPT5zdWJzdHJfY291bnQoc3RydG9sb3dlcigkYyksJ2JyZXZvJyksJ3NpYl9wcmllcyc9PnN1YnN0cl9jb3VudChzdHJ0b2xvd2VyKCRjKSwnZW5kaW5ibHVlJykpOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2Jha19icmV2b18nLiRpZCwkYyxmYWxzZSk7CiAgICAgICAgJG49JGM7CiAgICAgICAgLy8gMzQ1MjU6IOKAnkJyZXZvIiAoU2VuZGluYmx1ZSkg4oaSIOKAnlNlbmRlciIgKHNlbmRlci5uZXQpIOKAlCBrYWJ1dMSXcyBpxaFzYXVnb21vcyBrb2tpb3MgYnV2bwogICAgICAgICRuPXByZWdfcmVwbGFjZSgnL+KAnkJyZXZvKFvigJzigJ0iXSlccypcKFNlbmRpbmJsdWVcKS91Jywn4oCeU2VuZGVyJDEgKHNlbmRlci5uZXQpJywkbiwtMSwkazEpOwogICAgICAgIC8vIDM0NTI2OiBCcmV2byDigJMgZWwuIHBhxaF0byByaW5rb2Rhcm9zIGZ1bmtjaW9uYWx1bXVpIChqZWkgbmF1ZG9qYW1hKQogICAgICAgICRuPXByZWdfcmVwbGFjZSgnL0JyZXZvKFxzKlvigJMtXVxzKmVsXC5ccypwYcWhdG8gcmlua29kYXJvcyBmdW5rY2lvbmFsdW11aSlccypcKGplaSBuYXVkb2phbWFcKS91JywnU2VuZGVyJDEgKG5hdWppZW5sYWnFoWtpYW1zKScsJG4sLTEsJGsyKTsKICAgICAgICAkclsnazEnXT0kazE7ICRyWydrMiddPSRrMjsgaWYoISRrMil7ICRuPXN0cl9yZXBsYWNlKCdCcmV2bycsJ1NlbmRlcicsJG4pOyAkclsnazMnXT1zdWJzdHJfY291bnQoJGMsJ0JyZXZvJyk7IH0KICAgICAgICBpZigkbiE9PSRjKXsKICAgICAgICAgICR1PXdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRpZCwncG9zdF9jb250ZW50Jz0+JG4pLHRydWUpOwogICAgICAgICAgJHJbJ3VwZGF0ZSddPWlzX3dwX2Vycm9yKCR1KT8kdS0+Z2V0X2Vycm9yX21lc3NhZ2UoKTokdTsKICAgICAgICAgICRjMj0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfY29udGVudCBGUk9NIHskcH1wb3N0cyBXSEVSRSBJRD0lZCIsJGlkKSk7CiAgICAgICAgICAkclsnYnJldm9fcG8nXT1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkYzIpLCdicmV2bycpOyAkclsnc2liX3BvJ109c3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJGMyKSwnZW5kaW5ibHVlJyk7ICRyWydzZW5kZXJfcG8nXT1zdWJzdHJfY291bnQoJGMyLCdTZW5kZXInKTsKICAgICAgICAgICRpPXN0cnBvcygkYzIsJ1NlbmRlcicpOyAkclsnY3R4J109dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3Moc3Vic3RyKCRjMixtYXgoMCwkaS05MCksMjIwKSkpKTsKICAgICAgICB9IGVsc2UgJHJbJ3VwZGF0ZSddPSdORVBBS0lUTyc7CiAgICAgICAgJG9bJ3BhZ2VzJ11bXT0kcjsKICAgICAgfQogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2ZsdXNoJykpIHdwX2NhY2hlX2ZsdXNoKCk7CiAgICB9IGVsc2UgewogICAgICAkaD13cF9yZW1vdGVfZ2V0KCdodHRwczovL2Rldi5hdmVzYS5sdC9wcml2YXR1bW8tcG9saXRpa2EvP25jPScudGltZSgpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgICAkYj1pc193cF9lcnJvcigkaCk/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpOwogICAgICAkb1snaHR0cCddPWlzX3dwX2Vycm9yKCRoKT8kaC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaCk7CiAgICAgICRvWydodG1sX2JyZXZvJ109c3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJGIpLCdicmV2bycpOyAkb1snaHRtbF9zaWInXT1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkYiksJ2VuZGluYmx1ZScpOyAkb1snaHRtbF9zZW5kZXInXT1zdWJzdHJfY291bnQoJGIsJ1NlbmRlcicpOwogICAgICAkaT1zdHJwb3MoJGIsJ1NlbmRlcicpOyBpZigkaSE9PWZhbHNlKSAkb1snY3R4J109dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3Moc3Vic3RyKCRiLG1heCgwLCRpLTE1MCksMzAwKSkpKTsKICAgICAgJG9bJ2RiX2JyZXZvX3BhZ2VzJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBDT05DQVQoSUQsJzonLHBvc3Rfc3RhdHVzKSBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3BhZ2UnIEFORCAocG9zdF9jb250ZW50IExJS0UgJyVCcmV2byUnIE9SIHBvc3RfY29udGVudCBMSUtFICclZW5kaW5ibHVlJScpIik7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-071551';
const GKEY='ps_brv';
const PHASES=["APPLY2", "VER2"];
const OUT='analize/brevo_apply2.json';
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
