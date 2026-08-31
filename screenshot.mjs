process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3IGRpZWdpbWFzIChhZGFwdGVyaXMgKyAzIGxhbmdhaSArIGRpbSB2MS4xKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX2RwJ10pPyRfR0VUWydwc19kcCddOicnKTsgaWYoJGYhPT0nRElFR1RJJyYmJGYhPT0nRFJZJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE1NDdkcCcsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgaWYoJGY9PT0nRElFR1RJJyl7CiAgICAgICRmYWlsYWk9YXJyYXkoCiAgICAgICAgJ2RfYWRhcHRlcmlzX3R4dCc9PmFycmF5KCdwZXRzaG9wLWlzdG9yaWpvcy1hZGFwdGVyaXMucGhwJyxudWxsKSwKICAgICAgICAnZF9kaW1fdHh0Jz0+YXJyYXkoJ3BldHNob3AtZGltLWtsaWVudGFpLnBocCcsJ2NmNDgzNmVkZjI1ZTIxMTdiY2FlMWE5ZDQ1OWZhNWFmJyksCiAgICAgICAgJ2Rfa2xfdHh0Jz0+YXJyYXkoJ3BldHNob3AtYXRhc2thaXRhLWtsaWVudGFpLnBocCcsJzk3NGE2MGMyNThkOGM1M2EwOWZjNjkwN2I5N2YxMjNiJyksCiAgICAgICAgJ2RfcHJfdHh0Jz0+YXJyYXkoJ3BldHNob3AtYXRhc2thaXRhLXByZWtlcy5waHAnLCczZDA4MDJmYWQyYWU4NjM3OGUwMjg2NDk3NDViNWViNCcpLAogICAgICAgICdkX2F0X3R4dCc9PmFycmF5KCdwZXRzaG9wLWF0YXNrYWl0YS1hdHNhcmdvcy5waHAnLCczOGRmY2ViODYxYWU5NjEzMmNkZGE5ZDkzNTY3NjBhNycpLAogICAgICApOwogICAgICAkYmRpcj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGJkaXIpKSB3cF9ta2Rpcl9wKCRiZGlyKTsKICAgICAgZm9yZWFjaCgkZmFpbGFpIGFzICRnaz0+JHgpewogICAgICAgIGxpc3QoJGZuLCRtZDUpPSR4OyAka2VsaWFzPVdQTVVfUExVR0lOX0RJUi4nLycuJGZuOwogICAgICAgICRhaWQ9aXNzZXQoJF9HRVRbJGdrXSk/KGludCkkX0dFVFskZ2tdOjA7CiAgICAgICAgaWYoISRhaWQpeyAkb1snU1RPUCddWyRmbl09J25lcmEgbWVkaWEgaWQgJy4kZ2s7IGNvbnRpbnVlOyB9CiAgICAgICAgJG1mPWdldF9hdHRhY2hlZF9maWxlKCRhaWQpOyBpZighJG1mfHwhZmlsZV9leGlzdHMoJG1mKSl7ICRvWydTVE9QJ11bJGZuXT0nbWVkaWEgZmFpbG8gbmVyYSc7IGNvbnRpbnVlOyB9CiAgICAgICAgJGtvZGFzPWJhc2U2NF9kZWNvZGUodHJpbShmaWxlX2dldF9jb250ZW50cygkbWYpKSx0cnVlKTsKICAgICAgICBpZighJGtvZGFzfHxzdHJwb3MoJGtvZGFzLCc8P3BocCcpIT09MCl7ICRvWydTVE9QJ11bJGZuXT0nYmxvZ2FzIGI2NC9uZSBwaHAnOyBjb250aW51ZTsgfQogICAgICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgka29kYXMsIFRPS0VOX1BBUlNFKTsgfWNhdGNoKFRocm93YWJsZSAkdGUpeyAkb1snU1RPUCddWyRmbl09J1RPS0VOOiAnLiR0ZS0+Z2V0TWVzc2FnZSgpOyBjb250aW51ZTsgfQogICAgICAgIGlmKCRtZDU9PT1udWxsKXsKICAgICAgICAgIGlmKGZpbGVfZXhpc3RzKCRrZWxpYXMpKXsgJG9bJ1NUT1AnXVskZm5dPSduYXVqYXMgZmFpbGFzIGphdSBlZ3ppc3R1b2phJzsgY29udGludWU7IH0KICAgICAgICB9ZWxzZXsKICAgICAgICAgICRneXZhcz1tZDUoZmlsZV9nZXRfY29udGVudHMoJGtlbGlhcykpOwogICAgICAgICAgaWYoJGd5dmFzIT09JG1kNSl7ICRvWydTVE9QJ11bJGZuXT0nTUQ1IG5lc3V0YW1wYTogJy4kZ3l2YXM7IGNvbnRpbnVlOyB9CiAgICAgICAgICBjb3B5KCRrZWxpYXMsJGJkaXIuJy8nLiRmbi4nLmJha19TMTU0NycpOwogICAgICAgIH0KICAgICAgICBmaWxlX3B1dF9jb250ZW50cygka2VsaWFzLCRrb2Rhcyk7CiAgICAgICAgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRrZWxpYXMsdHJ1ZSk7CiAgICAgICAgJG9bJ2lyYXN5dGEnXVskZm5dPWFycmF5KCdkeWRpcyc9PnN0cmxlbigka29kYXMpLCdtZDUnPT5tZDUoJGtvZGFzKSk7CiAgICAgICAgd3BfZGVsZXRlX2F0dGFjaG1lbnQoJGFpZCx0cnVlKTsKICAgICAgfQogICAgfSBlbHNlIHsgLy8gRFJZCiAgICAgICRvWydrbGFzZXMnXT1hcnJheSgKICAgICAgICAnYWRhcHRlcmlzJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0lzdF9BZGFwdGVyaXMnKT9QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OlZFUlNJSkE6J05FUkEnLAogICAgICAgICdkaW0nPT5jbGFzc19leGlzdHMoJ1BldHNob3BfRGltX0tsaWVudGFpJyk/UGV0c2hvcF9EaW1fS2xpZW50YWk6OlZFUlNJSkE6J05FUkEnLAogICAgICAgICdrbCc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9BdGFza2FpdGFfS2xpZW50YWknKT9QZXRzaG9wX0F0YXNrYWl0YV9LbGllbnRhaTo6VkVSU0lKQTonTkVSQScsCiAgICAgICAgJ3ByJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0F0YXNrYWl0YV9QcmVrZXMnKT9QZXRzaG9wX0F0YXNrYWl0YV9QcmVrZXM6OlZFUlNJSkE6J05FUkEnLAogICAgICAgICdhdCc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9BdGFza2FpdGFfQXRzYXJnb3MnKT9QZXRzaG9wX0F0YXNrYWl0YV9BdHNhcmdvczo6VkVSU0lKQTonTkVSQScsCiAgICAgICk7CiAgICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9Jc3RfQWRhcHRlcmlzJykpICRvWydkcnknXT1QZXRzaG9wX0lzdF9BZGFwdGVyaXM6OnBlcnN0YXR5dGkodHJ1ZSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0RmlsZSgpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-192532';
const GKEY='ps_dp';
const PHASES=["DIEGTI", "DRY"];
const OUT='analize/s1547_deploy.json';
const DATA=["duomenys/adapteris.txt", "duomenys/dim.txt", "duomenys/kl.txt", "duomenys/pr.txt", "duomenys/at.txt"];
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
