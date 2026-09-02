process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MiBhcHBseTogcHNfc291cmNlcyByZXN5bmMKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MTYnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkyLUExJ107ICRmPSRfR0VUWydwc19leDE2J107CiAgICAkaWRzPVsxODU5MywxODU5NiwxODU5OSwxODYwMiwxODYwNSwxODYwOCwxODYxMSwxODYxNCwzNTMxMiwzNTMxNCwzNTMxNiwzNTMyMiwzNTMyNiwzNTMyOCwzNTMzMCwzNTMzNCwzNTMzOCwzNTM0MCwzNTM0Ml07CiAgICAkb1snaW1wb3J0YXNfdnlrc3RhJ109UGV0c2hvcF9Tb3VyY2VzOjppbXBvcnRhc192eWtzdGEoKTsKICAgIGlmICgkZj09PSdBJykgewogICAgICAgIGZvcmVhY2ggKCRpZHMgYXMgJGlkKSB7IHRyeSB7ICRvWydzeW5jJ11bJGlkXT1QZXRzaG9wX1NvdXJjZXM6OnNpbmNocm9uaXp1b3RpKCRpZCxmYWxzZSk7IH0gY2F0Y2ggKFRocm93YWJsZSAkZSkgeyAkb1snc3luYyddWyRpZF09J0VSUiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfQogICAgICAgIGZvcmVhY2ggKFszNTMxMiwzNTMxNCwzNTMxNiwzNTMyMiwzNTMyNiwzNTMyOCwzNTMzMCwzNTMzNCwzNTMzOCwzNTM0MCwzNTM0Ml0gYXMgJGlkKSAkb1snZmlsbCddWyRpZF09UGV0c2hvcF9Tb3VyY2VzOjp1enBpbGR5dGlfc2FuZGVsaSgkaWQpID8gZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSkgOiAnbmUnOwogICAgICAgICRpbj1pbXBsb2RlKCcsJywkaWRzKTsgJG9bJ3BzX3NvdXJjZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkLHNvdXJjZSxzdXBwbGllcl9za3Usc3RvY2tfcXR5LGNvc3RfbmV0IEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZCBJTiAoJGluKSBPUkRFUiBCWSBwcm9kdWN0X2lkLHNvdXJjZSIsQVJSQVlfTik7CiAgICB9CiAgICBpZiAoJGY9PT0nTicpIHsKICAgICAgICAkdDA9bWljcm90aW1lKHRydWUpOyB0cnkgeyAkb1snbmFrdGluaXMnXT1QZXRzaG9wX1NvdXJjZXM6Om5ha3RpbmlzKCk7IH0gY2F0Y2ggKFRocm93YWJsZSAkZSkgeyAkb1snbmFrdGluaXMnXT0nRVJSICcuJGUtPmdldE1lc3NhZ2UoKTsgfSAkb1snc2VrJ109cm91bmQobWljcm90aW1lKHRydWUpLSR0MCwxKTsKICAgICAgICAkb1sndmZfYmUnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIG0ucG9zdF9pZCkgRlJPTSB7JHB9cG9zdG1ldGEgbSBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1tLnBvc3RfaWQgTEVGVCBKT0lOIHskcH1wc19zb3VyY2VzIHMgT04gcy5wcm9kdWN0X2lkPW0ucG9zdF9pZCBBTkQgcy5zb3VyY2U9J3ZmJyBXSEVSRSBtLm1ldGFfa2V5PSdfdmZfc3VwcGxpZXJfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgcy5pZCBJUyBOVUxMIik7CiAgICAgICAgJG9bJ3piX2JlJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBtLnBvc3RfaWQpIEZST00geyRwfXBvc3RtZXRhIG0gSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9bS5wb3N0X2lkIExFRlQgSk9JTiB7JHB9cHNfc291cmNlcyBzIE9OIHMucHJvZHVjdF9pZD1tLnBvc3RfaWQgQU5EIHMuc291cmNlPSd6YicgV0hFUkUgbS5tZXRhX2tleT0nX3piX3N1cHBsaWVyX3NrdScgQU5EIG0ubWV0YV92YWx1ZTw+JycgQU5EIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykgQU5EIHMuaWQgSVMgTlVMTCIpOwogICAgICAgICRvWydzdGF0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc291cmNlLCBDT1VOVCgqKSBuLCBNQVgoc3luY2VkX2F0KSBteCBGUk9NIHskcH1wc19zb3VyY2VzIEdST1VQIEJZIHNvdXJjZSIsQVJSQVlfQSk7CiAgICAgICAgJG9bJ3NhbmRlbGlzX3R1c2NpYXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIHBvIExFRlQgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cG8uSUQgQU5EIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAobS5tZXRhX3ZhbHVlIElTIE5VTEwgT1IgbS5tZXRhX3ZhbHVlPScnKSIpOwogICAgfQogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1J8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-084633';
const GKEY='ps_ex16';
const PHASES=["A", "N"];
const OUT='analize/s1592_apply.json';
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
