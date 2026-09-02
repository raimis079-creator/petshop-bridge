process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NDUnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTk3LVIxJ107CiAgICAkc249JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkPTMyOSIpOyAkb1snc24zMjlfbGVuJ109c3RybGVuKCRzbik7ICRsbj1leHBsb2RlKCJcbiIsJHNuKTsKICAgIGZvcmVhY2ggKCRsbiBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvZ3l2W3XFq11ufHJpbmtpbml8Njc5fEFtxb5pdXN8YW16aXxwcmVzZXR8eWl0aHxQcmVrxJdzIMW+ZW5rbGFzfGthdGVnb3IvaXUnLCRsKSkgJG9bJ3NuMzI5J11bXT0oJGkrMSkuJzonLnRyaW0obWJfc3Vic3RyKCRsLDAsMTcwKSk7CiAgICAkb1snc24zMjlfaGVhZCddPW1iX3N1YnN0cigkc24sMCwxODAwKTsKICAgICRvWyd5aXRoX3ByZXNldHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0neWl0aF93Y2FuX3ByZXNldCciLEFSUkFZX0EpOwogICAgZm9yZWFjaCAoJG9bJ3lpdGhfcHJlc2V0cyddIGFzICRwcikgeyAkZj1nZXRfcG9zdF9tZXRhKCRwclsnSUQnXSwnX2ZpbHRlcnMnLHRydWUpOyAkb1sncHJlc2V0X2ZpbHRlcnMnXVskcHJbJ0lEJ11dPWlzX2FycmF5KCRmKT9hcnJheV9tYXAoZm4oJHgpPT5bJ3RpdGxlJz0+JHhbJ3RpdGxlJ10/PycnLCd0eXBlJz0+JHhbJ3R5cGUnXT8/JycsJ3RheCc9PiR4Wyd0YXhvbm9teSddPz8nJywndGVybXMnPT5pc3NldCgkeFsndGVybXMnXSk/Y291bnQoKGFycmF5KSR4Wyd0ZXJtcyddKTpudWxsXSwkZik6bWJfc3Vic3RyKChzdHJpbmcpJGYsMCwzMDApOyB9CiAgICAkb1snZ3l2dW5hc190YXgnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBESVNUSU5DVCB0dC50YXhvbm9teSwgQ09VTlQoKikgbiBGUk9NIHskcH10ZXJtX3RheG9ub215IHR0IFdIRVJFIHR0LnRheG9ub215IExJS0UgJ3BhX2d5diUnIE9SIHR0LnRheG9ub215IExJS0UgJ3BhX3J1cyUnIEdST1VQIEJZIHR0LnRheG9ub215IixBUlJBWV9BKTsKICAgICRvWydyaW5rX2thdF9jaGlsZHJlbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdHQuY291bnQgRlJPTSB7JHB9dGVybXMgdCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIFdIRVJFIHR0LnBhcmVudD02NzkiLEFSUkFZX0EpOwogICAgLy8gd2lkZ2V0cyBpbiBzaWRlYmFyCiAgICAkc2I9Z2V0X29wdGlvbignc2lkZWJhcnNfd2lkZ2V0cycpOyAkb1snc2lkZWJhcnMnXT1hcnJheV9tYXAoZm4oJHgpPT5pc19hcnJheSgkeCk/YXJyYXlfc2xpY2UoJHgsMCwxMCk6JHgsJHNiKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-121341';
const GKEY='ps_ex45';
const PHASES=["R"];
const OUT='analize/s1597_r.json';
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
