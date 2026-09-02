process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MzUnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTk1LVIxJ107CiAgICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOyAkYz1maWxlKCRmKTsgJG9bJ2VpbCddPWNvdW50KCRjKTsgJG9bJ21kNSddPW1kNV9maWxlKCRmKTsKICAgIHByZWdfbWF0Y2goJy92KFxkK1wuXGQrKS8nLCRjWzFdLiRjWzJdLiRjWzNdLCRtKTsgJG9bJ3ZlciddPSRtWzFdPz9udWxsOwogICAgZm9yZWFjaCAoJGMgYXMgJGk9PiRsKSBpZiAocHJlZ19tYXRjaCgnL0thdGVnb3JpamF8a2F0ZWdvcmlqfHByb2R1Y3RfY2F0fHZpc29zIHByZWvEl3N8U2thbsSXc3RhaXxrb25zZXJ2YWl8S0FURUdPUklKT1N8YWxsb3dlZF9jYXRzfGxlaXN0aW4vaXUnLCRsKSkgJG9bJ2dyZXAnXVtdPSgkaSsxKS4nOicudHJpbShtYl9zdWJzdHIoJGwsMCwxNzApKTsKICAgICRvWydvcHQnXT1bXTsgZm9yZWFjaCAoJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDQwMCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3JpbmslJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19kcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2JhYiUnIikgYXMgJHIpICRvWydvcHQnXVskci0+b3B0aW9uX25hbWVdPSRyLT52OwogICAgJG9bJ2thdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnRlcm1faWQsdC5zbHVnLHQubmFtZSx0dC5jb3VudCx0dC5wYXJlbnQgRlJPTSB7JHB9dGVybXMgdCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EICh0LnNsdWcgTElLRSAnJWtvbnNlcnYlJyBPUiB0LnNsdWcgTElLRSAnJXNrYW5lc3QlJykgT1JERVIgQlkgdC5zbHVnIixBUlJBWV9BKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-113418';
const GKEY='ps_ex35';
const PHASES=["R"];
const OUT='analize/s1595_r.json';
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
