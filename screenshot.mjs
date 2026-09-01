process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTc1ICgzMDEgxb5lbcSXbGFwaW8gc2x1ZyBrb2xpemlqb3Mgc3UgYXR0YWNobWVudCdhaXMpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19yNzUnXSk/JF9HRVRbJ3BzX3I3NSddOicnOyBpZigkZiE9PSdEUlknJiYkZiE9PSdBUFBMWScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NzUnLCdmYXplJz0+JGYpOwogIHRyeXsKICAgICRtYXA9anNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJyksdHJ1ZSk7CiAgICAkb1snbWFwX24nXT1jb3VudCgkbWFwKTsKICAgICRzZWc9YXJyYXkoKTsgZm9yZWFjaCgkbWFwIGFzICRrPT4kdCl7ICRwYXJ0cz1leHBsb2RlKCcvJywkayk7ICRsYXN0PWVuZCgkcGFydHMpOyBpZigkbGFzdCE9PScnKSAkc2VnWyRsYXN0XVtdPSRrOyB9CiAgICAkb1sndW5pa2FsaXVfc2VnbWVudHUnXT1jb3VudCgkc2VnKTsKICAgICRpbj1pbXBsb2RlKCcsJyxhcnJheV9tYXAoZnVuY3Rpb24oJHMpIHVzZSgkd3BkYil7IHJldHVybiAkd3BkYi0+cHJlcGFyZSgnJXMnLCRzKTsgfSxhcnJheV9rZXlzKCRzZWcpKSk7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X25hbWUscG9zdF90eXBlLHBvc3Rfc3RhdHVzLHBvc3RfcGFyZW50IEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9uYW1lIElOICgkaW4pIEFORCBwb3N0X3R5cGUgTk9UIElOICgncmV2aXNpb24nLCduYXZfbWVudV9pdGVtJykgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2luaGVyaXQnLCdwcml2YXRlJywnZHJhZnQnLCdwZW5kaW5nJywnZnV0dXJlJykiLEFSUkFZX0EpOwogICAgJG9bJ2tvbGl6aWpvc192aXNvJ109Y291bnQoJHJvd3MpOwogICAgZm9yZWFjaCgkcm93cyBhcyAkcil7ICRrZXlzPSRzZWdbJHJbJ3Bvc3RfbmFtZSddXTsgJHJbJ21hcF9rZXlzJ109JGtleXM7ICRyWyd0YXJnZXRzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRrKSB1c2UoJG1hcCl7cmV0dXJuICRtYXBbJGtdO30sJGtleXMpOwogICAgICAvLyBwcm9kdWN0L3tzbHVnfSDihpIgdGlrc2xhcyBUQVMgUEFUUyBwcm9kdWt0YXMgKHRhaSBuZSBrb2xpemlqYSwgbyB0ZWlzaW5nYXMga2VsaWFzIGnFoSDFoWFrbmllcykKICAgICAgJHBhdHM9ZmFsc2U7IGZvcmVhY2goJGtleXMgYXMgJGspeyBpZigkbWFwWyRrXT09PScvcHJvZHVjdC8nLiRyWydwb3N0X25hbWUnXS4nLyd8fCRtYXBbJGtdPT09J3Byb2R1Y3QvJy4kclsncG9zdF9uYW1lJ118fHJ0cmltKCRtYXBbJGtdLCcvJyk9PT0nL3Byb2R1Y3QvJy4kclsncG9zdF9uYW1lJ10pICRwYXRzPXRydWU7IH0KICAgICAgaWYoJHJbJ3Bvc3RfdHlwZSddPT09J3Byb2R1Y3QnJiYkcGF0cyl7ICRvWydwcm9kdWN0X3NhdmknXVtdPSRyWydJRCddLic6Jy4kclsncG9zdF9uYW1lJ107IGNvbnRpbnVlOyB9CiAgICAgICRvWydrb2xpemlqb3MnXVskclsncG9zdF90eXBlJ11dW109JHI7IH0KICAgIGlmKCRmPT09J0FQUExZJyl7CiAgICAgIGZvcmVhY2goKGlzc2V0KCRvWydrb2xpemlqb3MnXVsnYXR0YWNobWVudCddKT8kb1sna29saXppam9zJ11bJ2F0dGFjaG1lbnQnXTphcnJheSgpKSBhcyAkcil7CiAgICAgICAgJG5hdWphcz13cF91bmlxdWVfcG9zdF9zbHVnKCRyWydwb3N0X25hbWUnXS4nLWltZycsJHJbJ0lEJ10sJ2luaGVyaXQnLCdhdHRhY2htZW50JywkclsncG9zdF9wYXJlbnQnXSk7CiAgICAgICAgJHdwZGItPnVwZGF0ZSgkd3BkYi0+cG9zdHMsYXJyYXkoJ3Bvc3RfbmFtZSc9PiRuYXVqYXMpLGFycmF5KCdJRCc9PiRyWydJRCddKSk7IGNsZWFuX3Bvc3RfY2FjaGUoJHJbJ0lEJ10pOwogICAgICAgICRvWydwZXJ2YWRpbnRhJ11bXT0kclsnSUQnXS4nOiAnLiRyWydwb3N0X25hbWUnXS4nIOKGkiAnLiRuYXVqYXM7CiAgICAgIH0KICAgICAgLy8gcGF0aWtyYSBsb29wYmFjawogICAgICAkaG9tZT1ob21lX3VybCgpOyBmb3JlYWNoKGFycmF5KCdza2FuZXN0YWkta2F0ZW1zJywna2F0ZW1zL3NrYW5lc3RhaS1rYXRlbXMnKSBhcyAkayl7ICRyPXdwX3JlbW90ZV9oZWFkKCRob21lLicvJy4kayxhcnJheSgncmVkaXJlY3QnPT4wLCd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+J1BldHNob3BTRU8tUUEtcnVubmVyJykpOyAkbG9jPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIsJ2xvY2F0aW9uJyk7ICRvWydwbyddWyRrXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJGxvYyx3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCd4LXJlZGlyZWN0LWJ5JykpOwogICAgICAgIGlmKCRsb2MpeyAkcjI9d3BfcmVtb3RlX2hlYWQoJGxvYyxhcnJheSgncmVkaXJlY3QnPT4wLCd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWydwb19ob3AyJ11bJGtdPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyMik7IH0gfQogICAgICAkb1snZmFpbGFzXzM1MDA1J109ZmlsZV9leGlzdHMoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzLycuZ2V0X3Bvc3RfbWV0YSgzNTAwNSwnX3dwX2F0dGFjaGVkX2ZpbGUnLHRydWUpKTsKICAgICAgJG9bJ3VybF8zNTAwNSddPXdwX2dldF9hdHRhY2htZW50X3VybCgzNTAwNSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0RmlsZSgpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-155218';
const GKEY='ps_r75';
const PHASES=["DRY", "APPLY"];
const OUT='analize/s1575.json';
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
