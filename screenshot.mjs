process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ5ZiBRQSByZXp1bHRhdGFzICsgc2thbmVzdGFpIGdyYW5kaW7ElyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfc2VvJ10pPyRfR0VUWydwc19zZW8nXTonJzsgaWYoJGYhPT0nVkVSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NDlmJyk7CiAgdHJ5ewogICAgJHI9UGV0c2hvcF9TRU86OnBhc2t1dGluaXMoJ3JlZGlyZWN0Jyk7ICRvWydzYW50cmF1a2EnXT0kclsnc2FudHJhdWthJ107ICRvWydkYXRhJ109JHJbJ2RhdGFfYXQnXTsgJG9bJ2tsYWlkb3MnXT0kclsna2xhaWRvcyddOwogICAgJG1hcD1wZXRzaG9wX2xlZ2FjeV8zMDFfbWFwKCk7ICRvWydza190YXJnZXQnXT0kbWFwWydrYXRlbXMvc2thbmVzdGFpLWthdGVtcyddPz9udWxsOwogICAgaWYoaXNzZXQoJG1hcFsna2F0ZW1zL3NrYW5lc3RhaS1rYXRlbXMnXSkpeyAkdD0kbWFwWydrYXRlbXMvc2thbmVzdGFpLWthdGVtcyddOyBpZihzdHJwb3MoJHQsJ19fVEVSTV9fJyk9PT0wKXsgJHRlcm09Z2V0X3Rlcm0oKGludClzdWJzdHIoJHQsOCksJ3Byb2R1Y3RfY2F0Jyk7ICRvWydza190ZXJtJ109JHRlcm0/YXJyYXkoJ2lkJz0+JHRlcm0tPnRlcm1faWQsJ3NsdWcnPT4kdGVybS0+c2x1ZywnY291bnQnPT4kdGVybS0+Y291bnQsJ3BhcmVudCc9PiR0ZXJtLT5wYXJlbnQsJ2xpbmsnPT5nZXRfdGVybV9saW5rKCR0ZXJtKSk6J25lcmEnOyB9IH0KICAgICRvWyduNDA0X3RvZGF5J109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3Nlb180MDQgV0hFUkUgZGllbmE9Q1VSREFURSgpIik7CiAgICAvLyB0csWra3N0YW3FsyBwcmVracWzIHNsdWcnYWk6IGFyIGVnemlzdHVvamEga2FpcCBkcmFmdC90cmFzaD8KICAgICRzbD1hcnJheSgpOyBmb3JlYWNoKChhcnJheSkkclsna2xhaWRvcyddIGFzICRrKXsgaWYocHJlZ19tYXRjaCgnfjMwMeKGkjQwNCBwcm9kdWN0LyhbXiBdKyl+Jywka1sncCddLCRtKSkgJHNsW109JG1bMV07IH0KICAgIGZvcmVhY2goYXJyYXlfdW5pcXVlKCRzbCkgYXMgJHMpeyAkb1snc2x1ZyddWyRzXT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPTkNBVChJRCwnOicscG9zdF9zdGF0dXMpIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9uYW1lPSVzIEFORCBwb3N0X3R5cGU9J3Byb2R1Y3QnIExJTUlUIDEiLCRzKSk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-083151';
const GKEY='ps_seo';
const PHASES=["VER"];
const OUT='analize/s1549f.json';
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
