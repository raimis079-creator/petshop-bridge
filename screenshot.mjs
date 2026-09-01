process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU2YiAuaHRhY2Nlc3MgYXRzdGF0eW1hcyArIFNpbXBsZSByZcW+aW1hcyArIHBoYXNlMSBncmVwICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdGSVgnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoJ3YnPT4nUzE1NTZiJyk7IEBzZXRfdGltZV9saW1pdCgyNTApOwogIHRyeXsKICAgIGlmKCFmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3NldHRpbmcnKSkgcmVxdWlyZV9vbmNlIFdQX1BMVUdJTl9ESVIuJy93cC1zdXBlci1jYWNoZS93cC1jYWNoZS5waHAnOwogICAgJGh0PUFCU1BBVEguJy5odGFjY2Vzcyc7ICRiYWs9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvaHRhY2Nlc3MuYmFrX1MxNTU2JzsKICAgIGlmKG1kNV9maWxlKCRiYWspIT09Jzg4Yjk1OWE1NGU0MTU3NGZiOGQ0ODhkMmEwOGQ3NzQ2JykgdGhyb3cgbmV3IEV4Y2VwdGlvbignYmFja3VwIG1kNSAnLm1kNV9maWxlKCRiYWspKTsKICAgIGNvcHkoJGJhaywkaHQpOyAkb1snaHRfbWQ1J109bWQ1X2ZpbGUoJGh0KTsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGh0KTsgJG9bJ2h0X2hhc193cCddPXN0cnBvcygkYywnIyBCRUdJTiBXb3JkUHJlc3MnKSE9PWZhbHNlOyAkb1snaHRfaGFzX3dwc2MnXT1zdHJwb3MoJGMsJ1dQU3VwZXJDYWNoZScpIT09ZmFsc2U7CiAgICB3cF9jYWNoZV9zZXR0aW5nKCd3cF9jYWNoZV9tb2RfcmV3cml0ZScsMCk7ICRvWydtb2RlJ109J3NpbXBsZSc7CiAgICAkb1snZG9jX3Jvb3QnXT0kX1NFUlZFUlsnRE9DVU1FTlRfUk9PVCddPz9udWxsOyAkb1snYWJzcGF0aCddPUFCU1BBVEg7ICRvWydzY3JpcHQnXT0kX1NFUlZFUlsnU0NSSVBUX0ZJTEVOQU1FJ10/P251bGw7CiAgICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nL3dwLXN1cGVyLWNhY2hlLyoucGhwJykgYXMgJHApeyAkYz1maWxlX2dldF9jb250ZW50cygkcCk7IGlmKHN0cnBvcygkYywnTXVzdCBnZW5lcmF0ZScpIT09ZmFsc2UpeyAkbD1leHBsb2RlKCJcbiIsJGMpOyBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyBpZihzdHJwb3MoJGxuLCdNdXN0IGdlbmVyYXRlJykhPT1mYWxzZSl7ICRvWydjdHhfZmlsZSddPWJhc2VuYW1lKCRwKTsgJG9bJ2N0eCddPWFycmF5X21hcChmbigkaik9PigkaisxKS4nOiAnLnJ0cmltKCRsWyRqXSkscmFuZ2UobWF4KDAsJGktNjApLCRpKzEpKTsgYnJlYWs7IH0gfSB9IH0KICAgICRvWyd0ZXN0J109YXJyYXkoKTsgZm9yZWFjaChhcnJheShob21lX3VybCgnLycpLGhvbWVfdXJsKCcvdGFrc2FzLycpKSBhcyAkdSl7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJG9bJ3Rlc3QnXVtdPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-100417';
const GKEY='ps_seo';
const PHASES=["FIX"];
const OUT='analize/s1556b.json';
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
