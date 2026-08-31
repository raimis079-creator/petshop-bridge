process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGlzdG9yaWphIERSWSAoUzE1MzcpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfaXN0J10pfHwkX0dFVFsncHNfaXN0J10hPT0nRFJZJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG89YXJyYXkoJ3YnPT4nSVNUMScpOwogIHRyeXsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJGxvYWQ9ZnVuY3Rpb24oJGspeyAkaWQ9aXNzZXQoJF9HRVRbJGtdKT8oaW50KSRfR0VUWyRrXTowOyBpZighJGlkKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCduZXJhICcuJGspOyAkZj1nZXRfYXR0YWNoZWRfZmlsZSgkaWQpOyBpZighJGZ8fCFmaWxlX2V4aXN0cygkZikpIHRocm93IG5ldyBFeGNlcHRpb24oJ2ZhaWxvIG5lcmEgJy4kayk7ICRqPWpzb25fZGVjb2RlKGd6ZGVjb2RlKGJhc2U2NF9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpKSksdHJ1ZSk7IGlmKCFpc19hcnJheSgkaikpIHRocm93IG5ldyBFeGNlcHRpb24oJ2pzb24gJy4kayk7IHJldHVybiBhcnJheSgkaiwkZik7IH07CiAgICBsaXN0KCRVLCRmdSk9JGxvYWQoJ2RfaXN0X3V6c2FreW1haV90eHQnKTsgbGlzdCgkRSwkZmUpPSRsb2FkKCdkX2lzdF9laWx1dGVzX3R4dCcpOwogICAgJG9bJ2ZhaWxhaSddPWFycmF5KGJhc2VuYW1lKCRmdSk9PmZpbGVzaXplKCRmdSksYmFzZW5hbWUoJGZlKT0+ZmlsZXNpemUoJGZlKSk7CiAgICAkb1sndXpzYWt5bWFpJ109Y291bnQoJFUpOyAkb1snZWlsdXRlcyddPWNvdW50KCRFKTsKICAgICRpdj0wOyAkZW1haWxzPWFycmF5KCk7ICRtaW49JzknOyRtYXg9JzAnOyAkc3VtYT0wOwogICAgZm9yZWFjaCgkVSBhcyAkdSl7IGlmKCR1WydpdnlrZHl0YXMnXSl7ICRpdisrOyAkc3VtYSs9JHVbJ3N1bWEnXTsgfSAkZW1haWxzWyR1WydlbWFpbCddXT0xOyBpZigkdVsnZGF0YSddPCRtaW4pJG1pbj0kdVsnZGF0YSddOyBpZigkdVsnZGF0YSddPiRtYXgpJG1heD0kdVsnZGF0YSddOyB9CiAgICAkb1snaXZ5a2R5dGknXT0kaXY7ICRvWydzdW1hX2l2eWtkeXR1J109cm91bmQoJHN1bWEpOyAkb1snbGFpa290YXJwaXMnXT1hcnJheSgkbWluLCRtYXgpOyAkb1snZW1haWxhaSddPWNvdW50KCRlbWFpbHMpOwogICAgLy8gZXNhbWkgV1AgdmFydG90b2phaQogICAgJGV4PTA7ICRjaHVua3M9YXJyYXlfY2h1bmsoYXJyYXlfa2V5cygkZW1haWxzKSw1MDApOyBmb3JlYWNoKCRjaHVua3MgYXMgJGMpeyAkaW49aW1wbG9kZSgnLCcsYXJyYXlfbWFwKGZ1bmN0aW9uKCRlKXVzZSgkd3BkYil7cmV0dXJuICR3cGRiLT5wcmVwYXJlKCclcycsJGUpO30sJGMpKTsgJGV4Kz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9dXNlcnMgV0hFUkUgTE9XRVIodXNlcl9lbWFpbCkgSU4gKCRpbikiKTsgfQogICAgJG9bJ2VtYWlsYWlfamF1X3dwJ109JGV4OwogICAgLy8gU0tVIHplbWVsYXBpcwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG0ucG9zdF9pZCxwbS5tZXRhX3ZhbHVlIHNrdSxwLnBvc3RfdHlwZSxwLnBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RtZXRhIHBtIEpPSU4geyRwfXBvc3RzIHAgT04gcC5JRD1wbS5wb3N0X2lkIFdIRVJFIHBtLm1ldGFfa2V5PSdfc2t1JyBBTkQgcG0ubWV0YV92YWx1ZTw+JycgQU5EIHAucG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykiLEFSUkFZX0EpOwogICAgJHNrdT1hcnJheSgpOyBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHNrdVtzdHJ0b2xvd2VyKHRyaW0oJHJbJ3NrdSddKSldPWFycmF5KChpbnQpJHJbJ3Bvc3RfaWQnXSwkclsncG9zdF90eXBlJ10sJHJbJ3Bvc3Rfc3RhdHVzJ10pOyB9CiAgICAkb1snd2Nfc2t1X24nXT1jb3VudCgkc2t1KTsgJG9bJ3djX3NrdV9wdnonXT1hcnJheV9zbGljZShhcnJheV9rZXlzKCRza3UpLDAsOCk7CiAgICAkbW9kPWFycmF5KCk7IGZvcmVhY2goJEUgYXMgJGUpeyAkbT1zdHJ0b2xvd2VyKHRyaW0oKHN0cmluZykkZVsnbSddKSk7IGlmKCFpc3NldCgkbW9kWyRtXSkpICRtb2RbJG1dPWFycmF5KCduJz0+MCwnc3VtYSc9PjAsJ3AnPT4kZVsncCddKTsgJG1vZFskbV1bJ24nXSsrOyAkbW9kWyRtXVsnc3VtYSddKz0kZVsnc3VtYSddOyB9CiAgICAkb1snbW9kZWxpdSddPWNvdW50KCRtb2QpOyAkbW09MDskbWw9MDskbXM9MDskdGw9MDskdHM9MDsgJG5lbT1hcnJheSgpOyAkbXY9MDsKICAgIGZvcmVhY2goJG1vZCBhcyAkbT0+JHgpeyAkdGwrPSR4WyduJ107ICR0cys9JHhbJ3N1bWEnXTsgaWYoJG0hPT0nJyYmaXNzZXQoJHNrdVskbV0pKXsgJG1tKys7ICRtbCs9JHhbJ24nXTsgJG1zKz0keFsnc3VtYSddOyBpZigkc2t1WyRtXVsxXT09PSdwcm9kdWN0X3ZhcmlhdGlvbicpICRtdisrOyB9IGVsc2UgJG5lbVskbV09JHg7IH0KICAgICRvWydza3VfYXRpdGlrbyddPWFycmF5KCdtb2RlbGl1Jz0+JG1tLCdpxaEnPT5jb3VudCgkbW9kKSwnZWlsdWNpdV9wY3QnPT5yb3VuZCgxMDAqJG1sL21heCgxLCR0bCksMSksJ3N1bW9zX3BjdCc9PnJvdW5kKDEwMCokbXMvbWF4KDEsJHRzKSwxKSwndmFyaWFjaWpvcyc9PiRtdik7CiAgICB1YXNvcnQoJG5lbSxmdW5jdGlvbigkYSwkYil7cmV0dXJuICRiWydzdW1hJ108PT4kYVsnc3VtYSddO30pOyAkdG9wPWFycmF5KCk7IGZvcmVhY2goYXJyYXlfc2xpY2UoJG5lbSwwLDE1LHRydWUpIGFzICRtPT4keCkgJHRvcFtdPWFycmF5KCRtLCR4WydwJ10sJHhbJ24nXSxyb3VuZCgkeFsnc3VtYSddKSk7CiAgICAkb1snbmVhdGl0aWtvX3RvcDE1J109JHRvcDsKICAgIC8vIG1vZGVsaWFpIHN1IHByZWZpa3NhaXM/IHB2eiBIWVBTMDYtMiB2cyBXQyBIWVBTMDYKICAgICRwcmU9MDsgZm9yZWFjaCgkbmVtIGFzICRtPT4keCl7ICRiPXByZWdfcmVwbGFjZSgnLy1cZCskLycsJycsJG0pOyBpZigkYiE9PSRtJiZpc3NldCgkc2t1WyRiXSkpICRwcmUrKzsgfSAkb1snbmVhdGl0aWtvX2JldF9iZV9zdWZpa3NvX2F0aXRpa3R1J109JHByZTsKICAgICRvWydsZW50ZWxlc195cmEnXT1hcnJheSgoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEudGFibGVzIFdIRVJFIHRhYmxlX3NjaGVtYT1EQVRBQkFTRSgpIEFORCB0YWJsZV9uYW1lPSd7JHB9cHNfaXN0X3V6c2FreW1haSciKSwoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEudGFibGVzIFdIRVJFIHRhYmxlX3NjaGVtYT1EQVRBQkFTRSgpIEFORCB0YWJsZV9uYW1lPSd7JHB9cHNfaXN0X2VpbHV0ZXMnIikpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-145342';
const GKEY='ps_ist';
const PHASES=["DRY"];
const OUT='analize/ist_dry.json';
const DATA=["duomenys/ist_uzsakymai.txt", "duomenys/ist_eilutes.txt"];
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
