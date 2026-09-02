process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSByZWNvbjcKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MTAnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkxLVI3J107CiAgICAkdSA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcGF0aCBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9NSIpOwogICAgJG9bJ2RucyddPVsnZGV2LmF2ZXNhLmx0Jz0+Z2V0aG9zdGJ5bmFtZSgnZGV2LmF2ZXNhLmx0JyksJ3BldHNob3AubHQnPT5nZXRob3N0YnluYW1lKCdwZXRzaG9wLmx0JyksJ3NlcnZlcic9PiRfU0VSVkVSWydTRVJWRVJfQUREUiddPz9udWxsXTsKICAgICR0PW1pY3JvdGltZSh0cnVlKTsgJHI9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJG9bJ2dldCddPVtpc193cF9lcnJvcigkcik/JHItPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCBzdHJsZW4oKHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpLCByb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQsMSldOwogICAgJHQ9bWljcm90aW1lKHRydWUpOyAkcj13cF9zYWZlX3JlbW90ZV9nZXQoJHUsWyd0aW1lb3V0Jz0+NjAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRvWydzYWZlX2dldCddPVtpc193cF9lcnJvcigkcik/JHItPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCBzdHJsZW4oKHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpLCByb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQsMSldOwogICAgJGNmPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXZmLWNhY2hlLnhtbCc7ICRvWydjYWNoZV9tdGltZSddPWRhdGUoJ2MnLGZpbGVtdGltZSgkY2YpKTsgJG9bJ2NhY2hlX3NpemUnXT1maWxlc2l6ZSgkY2YpOwogICAgLy8gZmV0Y2hlcjoga3VyIHJhc28gY2FjaGUsIGthaXAgZmV0Y2gnaW5hCiAgICAkZmM9ZmlsZV9nZXRfY29udGVudHMoQUJTUEFUSC4nd3AtY29udGVudC9wZXRzaG9wLXhtbC12Zi1mZXRjaGVyLnBocCcpOyBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGZjKSBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvY29uc3QgfGN1cmxffGZpbGVfcHV0X2NvbnRlbnRzfENBQ0hFfGFwaVwufGh0dHBzPzpcL1wvLycsJGwpICYmICFwcmVnX21hdGNoKCcvUEFTU1dPUkQvJywkbCkpICRvWydmZXRjaGVyJ11bXT0oJGkrMSkuJzonLnRyaW0obWJfc3Vic3RyKCRsLDAsMTQwKSk7CiAgICAvLyBzbmlwcGV0IDU2NTogaXMga3VyIGltYSBmZWVkCiAgICAkc249JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkPTU2NSIpOyBmb3JlYWNoIChleHBsb2RlKCJcbiIsJHNuKSBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvY2FjaGV8ZmV0Y2hlcnx3cF9yZW1vdGV8ZmlsZV9nZXRfY29udGVudHN8c2ltcGxleG1sL2knLCRsKSkgJG9bJ3NuNTY1X2ZlZWQnXVtdPSgkaSsxKS4nOicudHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKTsKICAgIC8vIFZGIHF0eSBwb2t5Y2lhaToga2llayBfdmZfcXR5IGtlaXRlc2kgcG8gMDgtMjI/IHBzX3NvdXJjZXMgc3luY2VkX2F0IG1heAogICAgJG9bJ3BzX3NvdXJjZXNfdmZfc3luY2VkJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNQVgoc3luY2VkX2F0KSBteCwgTUlOKHN5bmNlZF9hdCkgbW4sIENPVU5UKCopIG4gRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBzb3VyY2U9J3ZmJyIsQVJSQVlfQSk7CiAgICAkb1sndmZfbGFzdF9zeW5jX2Rpc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBMRUZUKG1ldGFfdmFsdWUsMTApIGQsIENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J192Zl9sYXN0X3N5bmMnIEdST1VQIEJZIGQgT1JERVIgQlkgZCBERVNDIExJTUlUIDUiLEFSUkFZX04pOwogICAgJG9bJ3BteGlfbG9nJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd3BhbGxpbXBvcnQvbG9ncy8qJyk/OltdKTsKICAgICRsZz1nbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93cGFsbGltcG9ydC9sb2dzLzUudHh0Jyk7IGlmICgkbGcpICRvWydsb2c1X3RhaWwnXT1tYl9zdWJzdHIoc2hlbGxfZXhlYygndGFpbCAtYyAxNTAwICcuZXNjYXBlc2hlbGxhcmcoJGxnWzBdKSksMCwxNTAwKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-082400';
const GKEY='ps_ex10';
const PHASES=["R"];
const OUT='analize/s1591_recon7.json';
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
