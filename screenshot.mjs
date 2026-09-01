process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU2IFN1cGVyIENhY2hlIOKGkiBFeHBlcnQgKG1vZF9yZXdyaXRlKSArIG1hdGF2aW1hcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfc2VvJ10pPyRfR0VUWydwc19zZW8nXTonJzsgaWYoIWluX2FycmF5KCRmLGFycmF5KCdFWFBFUlQnLCdWRVInKSx0cnVlKSkgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNTU2JywnZmF6ZSc9PiRmKTsgQHNldF90aW1lX2xpbWl0KDI1MCk7CiAgdHJ5ewogICAgaWYoIWZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfc2V0dGluZycpKSByZXF1aXJlX29uY2UgV1BfUExVR0lOX0RJUi4nL3dwLXN1cGVyLWNhY2hlL3dwLWNhY2hlLnBocCc7CiAgICBpZigkZj09PSdFWFBFUlQnKXsKICAgICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL21pc2MucGhwJzsgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL2ZpbGUucGhwJzsKICAgICAgJGh0PUFCU1BBVEguJy5odGFjY2Vzcyc7ICRvWydodF9tZDVfcHJpZXMnXT1tZDVfZmlsZSgkaHQpOyBjb3B5KCRodCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvaHRhY2Nlc3MuYmFrX1MxNTU2Jyk7CiAgICAgIHdwX2NhY2hlX3NldHRpbmcoJ3dwX2NhY2hlX21vZF9yZXdyaXRlJywxKTsKICAgICAgJHJ1bGVzPXdwc2NfZ2V0X2h0YWNjZXNzX2luZm8oKTsgJG9bJ3J1bGVzX2xlbiddPXN0cmxlbigkcnVsZXNbJ3J1bGVzJ10pOyAkb1sncnVsZXMnXT1zdWJzdHIoJHJ1bGVzWydydWxlcyddLDAsMTgwMCk7CiAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BzY19yZW1vdmVfbWFya2VyJykpIHdwc2NfcmVtb3ZlX21hcmtlcigkaHQsJ1dvcmRQcmVzcycpOyAvLyBwbHVnaW5hcyBwYXRzIGdyxIXFvmluYSBXUCB0YWlzeWtsZXMgcG8gc2F2byBibG9rbwogICAgICAkb2s9aW5zZXJ0X3dpdGhfbWFya2VycygkaHQsJ1dQU3VwZXJDYWNoZScsZXhwbG9kZSgiXG4iLCRydWxlc1sncnVsZXMnXSkpOyAkb1snaW5zZXJ0J109JG9rOwogICAgICBnbG9iYWwgJGNhY2hlX3BhdGg7ICRvWydneiddPWZpbGVfcHV0X2NvbnRlbnRzKCRjYWNoZV9wYXRoLicuaHRhY2Nlc3MnLCRydWxlc1snZ3ppcHJ1bGVzJ10pIT09ZmFsc2U7CiAgICAgIC8vIFdvcmRQcmVzcyBibG9rYXMgdHVyaSBsaWt0aSBQTyBXUFN1cGVyQ2FjaGUg4oCUIHBhdGlrcmEKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGh0KTsgJG9bJ3BvcyddPWFycmF5KCdXUFN1cGVyQ2FjaGUnPT5zdHJwb3MoJGMsJyMgQkVHSU4gV1BTdXBlckNhY2hlJyksJ1dvcmRQcmVzcyc9PnN0cnBvcygkYywnIyBCRUdJTiBXb3JkUHJlc3MnKSwnUGV0c2hvcENhY2hlJz0+c3RycG9zKCRjLCcjIEJFR0lOIFBldHNob3AgQ2FjaGUnKSk7CiAgICAgIGlmKCRvWydwb3MnXVsnV29yZFByZXNzJ109PT1mYWxzZSl7IGZsdXNoX3Jld3JpdGVfcnVsZXMoKTsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGh0KTsgJG9bJ3BvcyddWydXb3JkUHJlc3NfcG9fZmx1c2gnXT1zdHJwb3MoJGMsJyMgQkVHSU4gV29yZFByZXNzJyk7IH0KICAgICAgJG9bJ2h0X0InXT1zdHJsZW4oJGMpOyAkb1snaHRfbWQ1X3BvJ109bWQ1KCRjKTsgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsKICAgICAgJG9bJ2h0X3RhaWwnXT1zdWJzdHIoJGMsc3RycG9zKCRjLCcjIEJFR0lOIFdQU3VwZXJDYWNoZScpLDI2MDApOwogICAgfSBlbHNlIHsKICAgICAgJHVybHM9YXJyYXkoJ3ByYWRpbmlzJz0+aG9tZV91cmwoJy8nKSwna2F0ZWdvcmlqYSc9PmhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvc2F1c2FzLW1haXN0YXMtc3VuaW1zLycpLCdwcmVrZSc9PmdldF9wZXJtYWxpbmsoZ2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9PjEsJ2ZpZWxkcyc9PidpZHMnKSlbMF0pLCd0YWtzYXMnPT5ob21lX3VybCgnL3Rha3Nhcy8nKSk7CiAgICAgIGZvcmVhY2goJHVybHMgYXMgJGs9PiR1KXsgJHI9YXJyYXkoKTsgZm9yKCRpPTA7JGk8MzskaSsrKXsgJHQwPW1pY3JvdGltZSh0cnVlKTsgJGc9d3BfcmVtb3RlX2dldCgkdSxhcnJheSgndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCB2ZXIyJywnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQtRW5jb2RpbmcnPT4nZ3ppcCcpKSk7ICRyWydtcyddW109KGludClyb3VuZCgobWljcm90aW1lKHRydWUpLSR0MCkqMTAwMCk7IH0KICAgICAgICAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRnKS0+Z2V0QWxsKCk7ICRyWydjb2RlJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpOyAkclsnc2VydmVkX3N0YXRpYyddPWlzc2V0KCRoWydsYXN0LW1vZGlmaWVkJ10pJiYhaXNzZXQoJGhbJ3gtcG93ZXJlZC1ieSddKTsgJHJbJ2NjJ109JGhbJ2NhY2hlLWNvbnRyb2wnXT8/bnVsbDsgJHJbJ2xtJ109JGhbJ2xhc3QtbW9kaWZpZWQnXT8/bnVsbDsgJHJbJ2VuYyddPSRoWydjb250ZW50LWVuY29kaW5nJ10/P251bGw7ICRyWydrYiddPXJvdW5kKHN0cmxlbigkYikvMTAyNCk7ICRyWydva19odG1sJ109c3RycG9zKCRiLCc8L2h0bWw+JykhPT1mYWxzZTsgJG9bJ3QnXVska109JHI7IH0KICAgICAgZm9yZWFjaChhcnJheSgnY2FydCc9PndjX2dldF9jYXJ0X3VybCgpLCdjaGVja291dCc9PndjX2dldF9jaGVja291dF91cmwoKSwnYWNjb3VudCc9PndjX2dldF9wYWdlX3Blcm1hbGluaygnbXlhY2NvdW50JykpIGFzICRrPT4kdSl7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKTsgJG9bJ25lX2NhY2hlJ11bJGtdPWFycmF5KCdjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpLCdsbSc9Pmlzc2V0KCRoWydsYXN0LW1vZGlmaWVkJ10pLCdjYWNoZWRfY29tbWVudCc9PnByZWdfbWF0Y2goJ35DYWNoZWQgcGFnZSBnZW5lcmF0ZWR+Jyx3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZykpPzE6MCk7IH0KICAgICAgJGc9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz94PTEnKSxhcnJheSgndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkb1snbmVfY2FjaGUnXVsncXVlcnlfbG0nXT1pc3NldCh3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpWydsYXN0LW1vZGlmaWVkJ10pOwogICAgICAvLyBzdSBXQyBjb29raWUg4oCTIHR1cmkgYsWrdGkgZGluYW1pxaFrYXMKICAgICAgJGc9d3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdjb29raWVzJz0+YXJyYXkobmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+J3dvb2NvbW1lcmNlX2l0ZW1zX2luX2NhcnQnLCd2YWx1ZSc9PicxJykpKSkpOyAkb1snbmVfY2FjaGUnXVsnd2NfY29va2llX2xtJ109aXNzZXQod3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKVsnbGFzdC1tb2RpZmllZCddKTsKICAgICAgJG9bJ2FkbWluJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnL3dwLWFkbWluLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjApKSk7CiAgICAgICRvWydyZXN0J109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnL3dwLWpzb24vJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-100051';
const GKEY='ps_seo';
const PHASES=["EXPERT", "VER"];
const OUT='analize/s1556.json';
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
