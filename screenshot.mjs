process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgzIHJlY29uIChwYW1lZ3RvcyBwcmVrZXMgdGFiYWkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfcjgzJ10pfHwkX0dFVFsncHNfcjgzJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU4MycpOwogICRvWydzbmlwcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLExFTkdUSChjb2RlKSBsZW4gRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVwYW3El2d0b3MlJyBPUiBjb2RlIExJS0UgJyVwYW1lZ3RvcyUnIixBUlJBWV9BKTsKICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkcCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYoc3RyaXBvcygkYywncGFtxJdndG9zJykhPT1mYWxzZXx8c3RyaXBvcygkYywncGFtZWd0b3MnKSE9PWZhbHNlKSAkb1snbXUnXVtdPWJhc2VuYW1lKCRwKS4nICcuc3RybGVuKCRjKS4nICcubWQ1KCRjKTsgfQogIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qLyoucGhwJykgYXMgJHApeyAkYz1maWxlX2dldF9jb250ZW50cygkcCk7IGlmKHN0cmlwb3MoJGMsJ3BhbcSXZ3RvcycpIT09ZmFsc2UpICRvWydwbCddW109c3RyX3JlcGxhY2UoV1BfUExVR0lOX0RJUiwnJywkcCkuJyAnLm1kNSgkYyk7IH0KICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi9pbmNsdWRlcy8qLnBocCcpIGFzICRwKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyBpZihzdHJpcG9zKCRjLCdwYW3El2d0b3MnKSE9PWZhbHNlKSAkb1sncGwnXVtdPXN0cl9yZXBsYWNlKFdQX1BMVUdJTl9ESVIsJycsJHApLicgJy5tZDUoJGMpOyB9CiAgJHRoPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOyBmb3JlYWNoKGdsb2IoJHRoLicvKi5waHAnKSBhcyAkcCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYoc3RyaXBvcygkYywncGFtxJdndG9zJykhPT1mYWxzZSkgJG9bJ3RoZW1lJ11bXT1iYXNlbmFtZSgkcCk7IH0KICAvLyBwaXJtYXMgcmFkaW55cyDigJQgacWhdHJhdWt0aSBDU1MvSFRNTCBmcmFnbWVudMSFIGFwbGluayB0YWJ1cwogICRzcmM9bnVsbDsgaWYoIWVtcHR5KCRvWydzbmlwcyddKSl7ICRzcmM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRvWydzbmlwcyddWzBdWydpZCddKSk7IH0KICBlbHNlaWYoIWVtcHR5KCRvWydtdSddKSl7ICRzcmM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy5zdHJ0b2soJG9bJ211J11bMF0sJyAnKSk7IH0KICBpZigkc3JjKXsgJG9bJ3NyY19sZW4nXT1zdHJsZW4oJHNyYyk7IHByZWdfbWF0Y2hfYWxsKCcvW2EtejAtOV8tXSoodGFifHNlZ3x0b2dnbGV8c3dpdGNofHBpbGx8Z3l2dW58ZmlsdHIpW2EtejAtOV8tXSovaScsJHNyYywkbSk7ICRvWydrbGFzZXMnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSksMCw0MCk7CiAgICAkaT1zdHJpcG9zKCRzcmMsJ3BhbcSXZ3RvcycpOyAkb1snaHRtbF9hcGllJ109c3Vic3RyKCRzcmMsbWF4KDAsJGktMTUwMCksMzUwMCk7IH0KICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-170437';
const GKEY='ps_r83';
const PHASES=["GO"];
const OUT='analize/s1583r.json';
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
