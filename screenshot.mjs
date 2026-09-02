process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MiByZWNvbjogcHNfc291cmNlcyBzcHJhZ2EgKyBJbXBvcnQgIzcKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MTUnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkyLVIxJ107CiAgICAkb1sncG14aTcnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHByb2Nlc3NpbmcsdHJpZ2dlcmVkLHF1ZXVlX2NodW5rX251bWJlcixpbXBvcnRlZCx1cGRhdGVkLHNraXBwZWQsY291bnQsbGFzdF9hY3Rpdml0eSBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9NyIsQVJSQVlfQSk7CiAgICAkb1snaGlzdDcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0eXBlLHRpbWVfcnVuLGRhdGUsc3VtbWFyeSBGUk9NIHskcH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAgICRvWyd2Zl9mZWVkJ109UGV0c2hvcF9WRl9GZWVkOjpidXNlbmEoKTsKICAgIC8vIFZGIHByZWtlcyAocHVibGlzaC9kcmFmdCkgc3UgX3ZmX3N1cHBsaWVyX3NrdSBiZSBwc19zb3VyY2VzIHZmIGVpbHV0ZXMKICAgICRvWyd2Zl92aXNvJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBtLnBvc3RfaWQpIEZST00geyRwfXBvc3RtZXRhIG0gSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9bS5wb3N0X2lkIFdIRVJFIG0ubWV0YV9rZXk9J192Zl9zdXBwbGllcl9za3UnIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwby5wb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIik7CiAgICAkYmU9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5wb3N0X2lkLCBwby5wb3N0X3N0YXR1cywgcG8ucG9zdF9kYXRlIEZST00geyRwfXBvc3RtZXRhIG0gSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9bS5wb3N0X2lkIExFRlQgSk9JTiB7JHB9cHNfc291cmNlcyBzIE9OIHMucHJvZHVjdF9pZD1tLnBvc3RfaWQgQU5EIHMuc291cmNlPSd2ZicgV0hFUkUgbS5tZXRhX2tleT0nX3ZmX3N1cHBsaWVyX3NrdScgQU5EIG0ubWV0YV92YWx1ZTw+JycgQU5EIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykgQU5EIHMuaWQgSVMgTlVMTCIsQVJSQVlfQSk7CiAgICAkb1sndmZfYmVfZWlsdXRlcyddPWNvdW50KCRiZSk7ICRvWyd2Zl9iZV9wYWdhbF9tZW4nXT1bXTsgZm9yZWFjaCAoJGJlIGFzICRyKSB7ICRrPXN1YnN0cigkclsncG9zdF9kYXRlJ10sMCw3KS4nfCcuJHJbJ3Bvc3Rfc3RhdHVzJ107ICRvWyd2Zl9iZV9wYWdhbF9tZW4nXVska109KCRvWyd2Zl9iZV9wYWdhbF9tZW4nXVska10/PzApKzE7IH0KICAgIC8vIHRhcyBwYXRzIFpCCiAgICAkb1snemJfdmlzbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgbS5wb3N0X2lkKSBGUk9NIHskcH1wb3N0bWV0YSBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfemJfc3VwcGxpZXJfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSIpOwogICAgJG9bJ3piX2JlX2VpbHV0ZXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIG0ucG9zdF9pZCkgRlJPTSB7JHB9cG9zdG1ldGEgbSBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1tLnBvc3RfaWQgTEVGVCBKT0lOIHskcH1wc19zb3VyY2VzIHMgT04gcy5wcm9kdWN0X2lkPW0ucG9zdF9pZCBBTkQgcy5zb3VyY2U9J3piJyBXSEVSRSBtLm1ldGFfa2V5PSdfemJfc3VwcGxpZXJfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgcy5pZCBJUyBOVUxMIik7CiAgICAkb1sncHNfc291cmNlc19zdGF0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc291cmNlLCBDT1VOVCgqKSBuLCBNQVgoY3JlYXRlZF9hdCkgbXhfY3JlYXRlZCwgTUFYKHN5bmNlZF9hdCkgbXhfc3luY2VkIEZST00geyRwfXBzX3NvdXJjZXMgR1JPVVAgQlkgc291cmNlIixBUlJBWV9BKTsKICAgIC8vIFNvdXJjZXMgdjIuMiBzbmlwcGV0OiBrYXMga3VyaWEgZWlsdXRlcyAoZnVua2NpanUgc2FyYXNhcyArIGhvb2snYWkpCiAgICAkc249JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkPTI1MTUiKTsKICAgIGZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkc24pIGFzICRpPT4kbCkgaWYgKHByZWdfbWF0Y2goJy9eXHMqKHB1YmxpYyB8cHJpdmF0ZSApPyhzdGF0aWMgKT9mdW5jdGlvbnxhZGRfYWN0aW9ufGFkZF9maWx0ZXJ8SU5TRVJUfFJFUExBQ0V8XCR3cGRiLT5pbnNlcnR8XCR3cGRiLT5yZXBsYWNlLycsJGwpKSAkb1snc24yNTE1J11bXT0oJGkrMSkuJzonLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7CiAgICAkcz1udWxsOyAkbG49ZXhwbG9kZSgiXG4iLCRzbik7IGZvcmVhY2ggKCRsbiBhcyAkaT0+JGwpIGlmIChzdHJwb3MoJGwsJ2Z1bmN0aW9uIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpJykhPT1mYWxzZSl7JHM9JGk7YnJlYWs7fQogICAgaWYgKCRzIT09bnVsbCkgJG9bJ3N5bmNfc2F1Z2lhaSddPWFycmF5X21hcCgndHJpbScsYXJyYXlfc2xpY2UoJGxuLCRzLDQwKSk7CiAgICAvLyBzZXNlbHkgc2VzZWxpYWkgbXUtcGx1Z2luOiBhciBhcGltYSB2Zj8KICAgICRzcz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXNlc2VsaWFpLnBocCcpOyAkb1snc2VzZWxpYWlfaGVhZCddPW1iX3N1YnN0cigkc3MsMCwxMjAwKTsgJG9bJ3Nlc2VsaWFpX3ZmJ109cHJlZ19tYXRjaF9hbGwoJy9fdmZfLycsJHNzKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-084420';
const GKEY='ps_ex15';
const PHASES=["R"];
const OUT='analize/s1592_recon.json';
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
