process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NjcnXSkpIHJldHVybjsKICAgICRvPVsnVkVSU0lKQSc9PidTMTYwMS1EMSddOyAkZj0kX0dFVFsncHNfZXg2NyddOyAkdGd0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgICBpZiAoJGY9PT0nRCcpIHsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlLzlhZGZmY2QwYjgzMWQxN2UwY2FhZDFkNzVlOWQ1ZDdhZTM1Y2ZmMjgvZGVwbG95L3BldHNob3Atcmlua2luaWFpLnBocC5iNjQnLFsndGltZW91dCc9PjYwXSkpOyAkbmV3PWJhc2U2NF9kZWNvZGUodHJpbSgkYikpOyAkb1snbWQ1J109bWQ1KCRuZXcpOyBpZiAobWQ1KCRuZXcpIT09J2I5MGM1MjA2NDEzMzZiOWRiNTNlODMxM2E4YmNkOGViJykgeyAkb1sna2xhaWRhJ109J21kNSc7IGdvdG8gb3V0OyB9ICRvWyd0b2tlbnMnXT1jb3VudCh0b2tlbl9nZXRfYWxsKCRuZXcpKTsgJG9bJ2JhY2t1cCddPWNvcHkoJHRndCxXUF9DT05URU5UX0RJUi4nL3BzLWJhY2t1cHMvcGV0c2hvcC1yaW5raW5pYWktdjE0My1CQUNLVVAtMjAyNi0wOS0wMi5waHAnKT8nb2snOidGQUlMJzsgJG9bJ3dyaXRlJ109ZmlsZV9wdXRfY29udGVudHMoJHRndCwkbmV3KTsgJG9bJ2Rpc2tfbWQ1J109bWQ1X2ZpbGUoJHRndCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkdGd0LHRydWUpOyB9CiAgICBpZiAoJGY9PT0nVicpIHsKICAgICAgICAkb1sndmVyc2lqYSddPVBldHNob3BfUmlua2luaWFpOjpWRVJTSUpBOwogICAgICAgIC8vIHVuaXQgdGVzdDogc2FyZ2FzIHN1IGZha2UgcGFja2FnZQogICAgICAgICRtaz1mdW5jdGlvbigkaWQsJGxibCl7ICRyPW5ldyBXQ19TaGlwcGluZ19SYXRlKCRpZCwkbGJsLDMuMyxbXSwkaWQpOyByZXR1cm4gJHI7IH07CiAgICAgICAgJHJhdGVzPVsndmVuaXBha19waWNrdXA6MSc9PiRtaygndmVuaXBha19waWNrdXA6MScsJ1ZFTklQQUsgcGHFoXRvbWF0YWkvYXRzacSXbWltbyBwdW5rdGFpJyksJ2xwZXhwcmVzc190ZXJtaW5hbDoyJz0+JG1rKCdscGV4cHJlc3NfdGVybWluYWw6MicsJ0xQIEVYUFJFU1MgdGVybWluYWxhcycpLCd2ZW5pcGFrX2NvdXJpZXI6Myc9PiRtaygndmVuaXBha19jb3VyaWVyOjMnLCdWRU5JUEFLIGt1cmplcmlzJyldOwogICAgICAgICRwa2c9ZnVuY3Rpb24oJGlkcykgeyAkYz1bXTsgZm9yZWFjaCAoJGlkcyBhcyAkaWQpICRjW109WydkYXRhJz0+d2NfZ2V0X3Byb2R1Y3QoJGlkKSwncXVhbnRpdHknPT4xXTsgcmV0dXJuIFsnY29udGVudHMnPT4kY107IH07CiAgICAgICAgJG9bJ3R1YWxldGFzXzE1OTI4J109YXJyYXlfa2V5cyhQZXRzaG9wX1JpbmtpbmlhaTo6cGFzdG9tYXRvX3NhcmdhcygkcmF0ZXMsJHBrZyhbMTU5MjhdKSkpOwogICAgICAgICRvWydrcmFpa2FzXzE2MTMyJ109YXJyYXlfa2V5cyhQZXRzaG9wX1JpbmtpbmlhaTo6cGFzdG9tYXRvX3NhcmdhcygkcmF0ZXMsJHBrZyhbMTYxMzJdKSkpOwogICAgICAgIC8vIHBhdmVsZGVqaW1hczogcGVyaXNzYXVnb3RpIDM1NDAwIGlyIDM1NDAyIHBlciBwYXZlbGRldGlfa3VyamVyaQogICAgICAgIGZvcmVhY2ggKFszNTQwMCwzNTQwMiwzNTM5Nl0gYXMgJGlkKSB7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkaz1qc29uX2RlY29kZShnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3Jpbmtfa2lla2lhaScsdHJ1ZSksdHJ1ZSkgPzogW107IGlmKCEkayl7ICRrPWpzb25fZGVjb2RlKGdldF9wb3N0X21ldGEoJGlkLFBldHNob3BfUmlua2luaWFpOjpNRVRBX0tJRUtJQUksdHJ1ZSksdHJ1ZSk/OltdOyB9ICR5PVBldHNob3BfUmlua2luaWFpOjpwYXZlbGRldGlfa3VyamVyaSgkcHIsYXJyYXlfa2V5cygkaykpOyAkcHItPnNhdmUoKTsgJG9bJ3BhdiddWyRpZF09WyR5LGdldF9wb3N0X21ldGEoJGlkLCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKSxhcnJheV9rZXlzKCRrKV07IH0KICAgICAgICAkb1sncmlua18zNTQwMCddPWFycmF5X2tleXMoUGV0c2hvcF9SaW5raW5pYWk6OnBhc3RvbWF0b19zYXJnYXMoJHJhdGVzLCRwa2coWzM1NDAwXSkpKTsKICAgIH0KICAgIG91dDoKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-140204';
const GKEY='ps_ex67';
const PHASES=["D", "V"];
const OUT='analize/s1601_deploy.json';
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
