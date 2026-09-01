process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY4YiBwcm9kIHZob3N0IHRlc3RhcyBwZXIgSVAgKyBIb3N0ICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNTY4YicpOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsKICB0cnl7CiAgICBmb3JlYWNoKGFycmF5KCc3OS45OC4yOS4yNCcsJzEyNy4wLjAuMScpIGFzICRpcCl7CiAgICAgIGZvcmVhY2goYXJyYXkoJ2pwZ193ZWJwJz0+YXJyYXkoJy93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wOC9yaW5rLWtvbXBvemljaWphLTM1MjkxLTE3ODgxNzMzNTcuanBnJywnaW1hZ2Uvd2VicCxpbWFnZS8qJyksJ2pwZ19wbGFpbic9PmFycmF5KCcvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDgvcmluay1rb21wb3ppY2lqYS0zNTI5MS0xNzg4MTczMzU3LmpwZycsJ2ltYWdlLyonKSwnaG9tZSc9PmFycmF5KCcvJywndGV4dC9odG1sJykpIGFzICRrPT4kdCl7CiAgICAgICAgJGc9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly8nLiRpcC4kdFswXSxhcnJheSgndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wLCdoZWFkZXJzJz0+YXJyYXkoJ0hvc3QnPT4ncGV0c2hvcC5sdCcsJ0FjY2VwdCc9PiR0WzFdKSkpOyBpZihpc193cF9lcnJvcigkZykpeyAkb1skaXBdWyRrXT0nRVJSICcuJGctPmdldF9lcnJvcl9tZXNzYWdlKCk7IGNvbnRpbnVlOyB9CiAgICAgICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOyAkb1skaXBdWyRrXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyksJGhbJ2NvbnRlbnQtdHlwZSddPz9udWxsLHN0cmxlbigkYiksJGs9PT0naG9tZSc/KHByZWdfbWF0Y2goJ348dGl0bGU+KFtePF17MCw2MH0pficsJGIsJG0pPyRtWzFdOnN1YnN0cigkYiwwLDgwKSk6KHN1YnN0cigkYiwwLDQpPT09J1JJRkYnPydSSUZGKHdlYnApJzpiaW4yaGV4KHN1YnN0cigkYiwwLDMpKSksJGhbJ3ZhcnknXT8/bnVsbCwkaFsnc2VydmVyJ10/P251bGwsJGhbJ2xvY2F0aW9uJ10/P251bGwpOyB9CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-144722';
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
