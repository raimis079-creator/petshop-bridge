process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSByZWNvbjgKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MTEnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkxLVI4J107CiAgICAkb1snY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cG14aV9pbXBvcnRzIik7CiAgICBmb3JlYWNoICgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBteGlfaW1wb3J0cyBXSEVSRSBpZCBJTiAoMSwyLDUsNykiLEFSUkFZX0EpIGFzICRyKSB7CiAgICAgICAgJG9wPW1heWJlX3Vuc2VyaWFsaXplKCRyWydvcHRpb25zJ10pOyB1bnNldCgkclsnb3B0aW9ucyddKTsKICAgICAgICBmb3JlYWNoIChbJ3hwYXRoJywncGF0aCcsJ3Jvb3RfZWxlbWVudCcsJ2ZlZWRfdHlwZScsJ3R5cGUnLCduYW1lJywnY291bnQnLCdmcmllbmRseV9uYW1lJ10gYXMgJGspICRvWydpbXAnXVskclsnaWQnXV1bJGtdPSRyWyRrXT8/bnVsbDsKICAgICAgICBmb3JlYWNoIChbJ3R5cGUnLCdmaWxlcGF0aCcsJ2ZlZWRfdHlwZScsJ2VuY29kaW5nJywnY2h1bmNraW5nJywncmVjb3Jkc19wZXJfcmVxdWVzdCcsJ2lzX2Zhc3RfbW9kZScsJ2RlbGltaXRlcicsJ3hwYXRoJywndW5pcXVlX2tleScsJ2N1c3RvbV90eXBlJywnaW1wb3J0X3Byb2Nlc3NpbmcnXSBhcyAkaykgJG9bJ2ltcCddWyRyWydpZCddXVsnb3B0XycuJGtdPSBpc3NldCgkb3BbJGtdKSA/IChpc19hcnJheSgkb3BbJGtdKT9qc29uX2VuY29kZSgkb3BbJGtdKTptYl9zdWJzdHIoKHN0cmluZykkb3BbJGtdLDAsMjAwKSkgOiBudWxsOwogICAgfQogICAgJG9bJ2ZpbGVzJ109YXJyYXlfbWFwKGZuKCRmKT0+W2Jhc2VuYW1lKCRmKSxmaWxlc2l6ZSgkZiksZGF0ZSgnYycsZmlsZW10aW1lKCRmKSldLGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3dwYWxsaW1wb3J0L2ZpbGVzLyonKT86W10pOwogICAgJG9bJ3VwbG9hZHMnXT1hcnJheV9tYXAoZm4oJGYpPT5bYmFzZW5hbWUoJGYpLGZpbGVzaXplKCRmKSxkYXRlKCdjJyxmaWxlbXRpbWUoJGYpKV0sZ2xvYihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd3BhbGxpbXBvcnQvdXBsb2Fkcy8qJyk/OltdKTsKICAgICRvWydjcm9uX3BteGlfb3B0J109YXJyYXlfaW50ZXJzZWN0X2tleShnZXRfb3B0aW9uKCdQTVhJX1BsdWdpbl9PcHRpb25zJyksYXJyYXlfZmxpcChbJ2NodW5rX3NpemUnLCdjcm9uX3Byb2Nlc3NpbmdfdGltZV9saW1pdCcsJ2xhcmdlX2ZlZWRfbGltaXQnLCdmb3JjZV9zdHJlYW1fcmVhZGVyJywncG14aV9maWxlX2Rvd25sb2FkX3RpbWVvdXQnLCdzZWN1cmUnXSkpOwogICAgJG9bJ3dwX2Nyb24nXT1hcnJheV9zbGljZShhcnJheV9rZXlzKGFycmF5X21lcmdlKC4uLmFycmF5X3ZhbHVlcyhfZ2V0X2Nyb25fYXJyYXkoKSkpKSwwLDEyMCk7CiAgICAkb1snbXUnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtKi5waHAnKSk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUnxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-082610';
const GKEY='ps_ex11';
const PHASES=["R"];
const OUT='analize/s1591_recon8.json';
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
