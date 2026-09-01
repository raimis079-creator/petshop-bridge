process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTUzYiByaW5raW5pYWkgbm9jYWNoZSBrb250ZWtzdGFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NTNiJyk7CiAgdHJ5ewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yaW5raW5pYWkucGhwJyk7ICRvWydCJ109c3RybGVuKCRjKTsgJG9bJ21kNSddPW1kNSgkYyk7ICRvWydoZWFkJ109c3Vic3RyKCRjLDAsNjAwKTsKICAgICRsPWV4cGxvZGUoIlxuIiwkYyk7IGZvcmVhY2goJGwgYXMgJGk9PiRsbil7IGlmKHByZWdfbWF0Y2goJ35ub2NhY2hlX2hlYWRlcnN8Q2FjaGUtQ29udHJvbHxzZW5kX2hlYWRlcnN+JywkbG4pKXsgJG9bJ2N0eCddW109YXJyYXlfbWFwKGZuKCRqKT0+KCRqKzEpLic6ICcucnRyaW0oJGxbJGpdKSxyYW5nZShtYXgoMCwkaS0xMiksbWluKGNvdW50KCRsKS0xLCRpKzQpKSk7IH0gfQogICAgZm9yZWFjaChhcnJheSgyNDAzLDI1MTUpIGFzICRpZCl7ICRjb2RlPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkaWQpKTsgJGxsPWV4cGxvZGUoIlxuIiwkY29kZSk7IGZvcmVhY2goJGxsIGFzICRpPT4kbG4peyBpZihwcmVnX21hdGNoKCd+bm9jYWNoZV9oZWFkZXJzfENhY2hlLUNvbnRyb2x8bm8tc3RvcmV+JywkbG4pKSAkb1snc25pcCddWyRpZF1bXT1pbXBsb2RlKCJcbiIsYXJyYXlfc2xpY2UoJGxsLG1heCgwLCRpLTUpLDgpKTsgfSB9CiAgICAvLyBXQyBwYXRzOiBrYWRhIHdjX25vY2FjaGU/IGlzX3Byb2R1Y3Q/IHBhdGlrcmE6IGtva2llIGhlYWRlcidpYWkga2FpIFVBID0gR29vZ2xlYm90CiAgICAkcD1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ251bWJlcnBvc3RzJz0+MSwnZmllbGRzJz0+J2lkcycpKTsgJHU9Z2V0X3Blcm1hbGluaygkcFswXSk7CiAgICBmb3JlYWNoKGFycmF5KCdnYic9PidNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgR29vZ2xlYm90LzIuMSknLCdjaHJvbWUnPT4nTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMCkgQ2hyb21lLzEyMCcpIGFzICRrPT4kdWEpeyAkZz13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+JHVhKSk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRnKS0+Z2V0QWxsKCk7ICRvWydoZHInXVska109JGhbJ2NhY2hlLWNvbnRyb2wnXT8/bnVsbDsgfQogICAgJGNhdD1nZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PnRydWUsJ251bWJlcic9PjMsJ29yZGVyYnknPT4nY291bnQnLCdvcmRlcic9PidERVNDJykpOyAkb1snY2F0X2xpbmsnXT0oJGNhdCYmIWlzX3dwX2Vycm9yKCRjYXQpKT9nZXRfdGVybV9saW5rKCRjYXRbMF0pOiduZXJhJzsKICAgIGlmKGlzX3N0cmluZygkb1snY2F0X2xpbmsnXSkpeyAkZz13cF9yZW1vdGVfZ2V0KCRvWydjYXRfbGluayddLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWydoZHInXVsna2F0ZWdvcmlqYSddPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRnKS0+Z2V0QWxsKClbJ2NhY2hlLWNvbnRyb2wnXT8/bnVsbDsgfQogICAgJGc9d3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWydoZHInXVsncHJhZGluaXMnXT13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpWydjYWNoZS1jb250cm9sJ10/P251bGw7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-093829';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1553b.json';
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
