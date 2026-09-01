process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY4YiBwcm9kIHZob3N0IHRlc3RhcyBwZXIgSVAgKyBIb3N0IChXZWJQLCBjYWNoZSBoZWFkZXInaWFpKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfc2VvJ10pPyRfR0VUWydwc19zZW8nXTonJzsgaWYoJGYhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgndic9PidTMTU2OGInKTsgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgdHJ5ewogICAgJGlwPSc3OS45OC4yOS4yNCc7ICRoaD1hcnJheSgnSG9zdCc9PidwZXRzaG9wLmx0Jyk7CiAgICAkZ2V0PWZ1bmN0aW9uKCRwYXRoLCRhY2MsJG1ldGhvZD0nR0VUJykgdXNlKCRpcCwkaGgpeyAkZz13cF9yZW1vdGVfcmVxdWVzdCgnaHR0cHM6Ly8nLiRpcC4kcGF0aCxhcnJheSgnbWV0aG9kJz0+JG1ldGhvZCwndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wLCdoZWFkZXJzJz0+JGhoK2FycmF5KCdBY2NlcHQnPT4kYWNjKSkpOyBpZihpc193cF9lcnJvcigkZykpIHJldHVybiAnRVJSICcuJGctPmdldF9lcnJvcl9tZXNzYWdlKCk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRnKS0+Z2V0QWxsKCk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnKTsgcmV0dXJuIGFycmF5KCdjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpLCdjdCc9PiRoWydjb250ZW50LXR5cGUnXT8/bnVsbCwnY2MnPT4kaFsnY2FjaGUtY29udHJvbCddPz9udWxsLCd2YXJ5Jz0+JGhbJ3ZhcnknXT8/bnVsbCwnbG9jJz0+JGhbJ2xvY2F0aW9uJ10/P251bGwsJ21hZ2ljJz0+c3Vic3RyKCRiLDAsNCk9PT0nUklGRic/J1dFQlAnOihzdWJzdHIoJGIsMCwzKT09PWNocigweGZmKS5jaHIoMHhkOCkuY2hyKDB4ZmYpPydKUEcnOnN1YnN0cihzdHJpcF90YWdzKCRiKSwwLDYwKSksJ2xlbic9PnN0cmxlbigkYikpOyB9OwogICAgJG9bJ2hvbWVfaGVhZCddPSRnZXQoJy8nLCd0ZXh0L2h0bWwnLCdIRUFEJyk7ICRvWydqcGdfd2VicCddPSRnZXQoJy93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wOC9yaW5rLWtvbXBvemljaWphLTM1MjkxLTE3ODgxNzMzNTcuanBnJywnaW1hZ2Uvd2VicCxpbWFnZS8qJyk7ICRvWydqcGdfcGxhaW4nXT0kZ2V0KCcvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDgvcmluay1rb21wb3ppY2lqYS0zNTI5MS0xNzg4MTczMzU3LmpwZycsJ2ltYWdlLyonKTsgJG9bJ2NzcyddPSRnZXQoJy93cC1jb250ZW50L3RoZW1lcy9mbGF0c29tZS1jaGlsZC9zdHlsZS5jc3MnLCd0ZXh0L2NzcycsJ0hFQUQnKTsgJG9bJ3Rha3NhcyddPSRnZXQoJy90YWtzYXMvJywndGV4dC9odG1sJywnSEVBRCcpOwogICAgLy8gZGV2OiBrYWlwIHZlaWtpYSBkZXYg4oCUIHJvdXRlcj8KICAgICRvWydkZXZfZG9jcm9vdF9maWxlcyddPWFycmF5X3NsaWNlKGFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvYXZlc2EubHQvcHVibGljX2h0bWwvZGV2LyonKSksMCwxNSk7ICRvWydkZXZfaW5kZXgnXT1zdWJzdHIoKHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvYXZlc2EubHQvcHVibGljX2h0bWwvZGV2L2luZGV4LnBocCcpLDAsNjAwKTsgJG9bJ2Rldl9odGFjY2VzcyddPXN1YnN0cigoc3RyaW5nKUBmaWxlX2dldF9jb250ZW50cygnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9hdmVzYS5sdC9wdWJsaWNfaHRtbC9kZXYvLmh0YWNjZXNzJyksMCw4MDApOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-131440';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1568b.json';
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
