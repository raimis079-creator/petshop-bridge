process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY4YyBwcm9kIHZob3N0IHRlc3RhcyBwZXIgSVAgKyBIb3N0ICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNTY4YycpOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsKICB0cnl7CiAgICBmb3JlYWNoKGFycmF5KCc3OS45OC4yOS4yNCcsJzEyNy4wLjAuMScpIGFzICRpcCl7CiAgICAgIGZvcmVhY2goYXJyYXkoJ2pwZ193ZWJwJz0+YXJyYXkoJy93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wOC9yaW5rLWtvbXBvemljaWphLTM1MjkxLTE3ODgxNzMzNTcuanBnJywnaW1hZ2Uvd2VicCxpbWFnZS8qJyksJ2pwZ19wbGFpbic9PmFycmF5KCcvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDgvcmluay1rb21wb3ppY2lqYS0zNTI5MS0xNzg4MTczMzU3LmpwZycsJ2ltYWdlLyonKSwnaG9tZSc9PmFycmF5KCcvJywndGV4dC9odG1sJykpIGFzICRrPT4kdCl7CiAgICAgICAgJGc9d3BfcmVtb3RlX2dldCgnaHR0cDovLycuJGlwLiR0WzBdLGFycmF5KCd0aW1lb3V0Jz0+MTUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjAsJ2hlYWRlcnMnPT5hcnJheSgnSG9zdCc9PidwZXRzaG9wLmx0JywnQWNjZXB0Jz0+JHRbMV0pKSk7IGlmKGlzX3dwX2Vycm9yKCRnKSl7ICRvWyRpcF1bJGtdPSdFUlIgJy4kZy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgY29udGludWU7IH0KICAgICAgICAkaD13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7ICRvWyRpcF1bJGtdPWFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKSwkaFsnY29udGVudC10eXBlJ10/P251bGwsc3RybGVuKCRiKSwkaz09PSdob21lJz8ocHJlZ19tYXRjaCgnfjx0aXRsZT4oW148XXswLDYwfSl+JywkYiwkbSk/JG1bMV06c3Vic3RyKCRiLDAsODApKTooc3Vic3RyKCRiLDAsNCk9PT0nUklGRic/J1JJRkYod2VicCknOmJpbjJoZXgoc3Vic3RyKCRiLDAsMykpKSwkaFsndmFyeSddPz9udWxsLCRoWydzZXJ2ZXInXT8/bnVsbCwkaFsnbG9jYXRpb24nXT8/bnVsbCk7IH0KICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-144932';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1568c.json';
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
