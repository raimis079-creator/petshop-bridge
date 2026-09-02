process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjQnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVI1J107CiAgICAkYz1maWxlKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnKTsKICAgICRvWydhZnRlcl9pbXBvcnQnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X21hcCgncnRyaW0nLGFycmF5X3NsaWNlKCRjLDY2Miw0NSkpLGZuKCR4KT0+dHJpbSgkeCkhPT0nJyYmIXByZWdfbWF0Y2goJy9eXHMqKFwvXC98XCp8XC9cKikvJywkeCkpKTsKICAgICRvWyd6Yl9zdG9ja19mbiddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKCdydHJpbScsYXJyYXlfc2xpY2UoJGMsODMwLDQ1KSksZm4oJHgpPT50cmltKCR4KSE9PScnJiYhcHJlZ19tYXRjaCgnL15ccyooXC9cL3xcKnxcL1wqKS8nLCR4KSkpOwogICAgJG9wPW1heWJlX3Vuc2VyaWFsaXplKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3B0aW9ucyBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MyIpKTsKICAgIGZvcmVhY2ggKCRvcCBhcyAkaz0+JHYpIGlmIChwcmVnX21hdGNoKCcvc3RvY2t8ZHVwbGljYXRlfG1hdGNoaW5nfHVwZGF0ZXx0ZW1wbGF0ZXx4cGF0aHxfcXR5fHByaWNlL2knLCRrKSAmJiAkdiE9PScnICYmICR2IT09bnVsbCAmJiAkdiE9PVtdICkgJG9bJ29wdDMnXVska109aXNfYXJyYXkoJHYpP2pzb25fZW5jb2RlKCR2KTptYl9zdWJzdHIoKHN0cmluZykkdiwwLDEyMCk7CiAgICAvLyAzMjQ2MyBzdG9jayBpc3RvcmlqYTogV0Mgb3JkZXI/IG5lLiBQYXRpa3JpbmFtIGFyIF9zdG9jayBrZWljaWFzaTogcGFpbWFtIHBvLnBvc3RfbW9kaWZpZWQKICAgICRvWydtMzI0NjNfbW9kJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBwb3N0X21vZGlmaWVkIEZST00geyRwfXBvc3RzIFdIRVJFIElEPTMyNDYzIixBUlJBWV9BKTsKICAgIC8vIHBteGkgIzMgcGFza3V0aW5pbyBydW4nbyBsb2dhcwogICAgJGxnPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3dwYWxsaW1wb3J0L2xvZ3MvKicpOyB1c29ydCgkbGcsZm4oJGEsJGIpPT5maWxlbXRpbWUoJGIpLWZpbGVtdGltZSgkYSkpOyAkb1snbG9ncyddPWFycmF5X21hcChmbigkZik9PltiYXNlbmFtZSgkZiksZGF0ZSgnYycsZmlsZW10aW1lKCRmKSksaXNfZGlyKCRmKT9jb3VudChnbG9iKCRmLicvKicpKTpmaWxlc2l6ZSgkZildLGFycmF5X3NsaWNlKCRsZywwLDQpKTsKICAgIGZvcmVhY2ggKGFycmF5X3NsaWNlKCRsZywwLDIpIGFzICRmKSB7ICRmcz1pc19kaXIoJGYpP2dsb2IoJGYuJy8qJyk6WyRmXTsgdXNvcnQoJGZzLGZuKCRhLCRiKT0+ZmlsZW10aW1lKCRiKS1maWxlbXRpbWUoJGEpKTsgaWYgKCRmcykgeyAkdD1maWxlX2dldF9jb250ZW50cygkZnNbMF0pOyBpZiAocHJlZ19tYXRjaF9hbGwoJy8wMU0yMjA4MDEuezAsNDAwfS9zJywkdCwkbW0pKSAkb1snbG9nX2hpdCddW2Jhc2VuYW1lKCRmc1swXSldPWFycmF5X21hcChmbigkeCk9Pm1iX3N1YnN0cihzdHJpcF90YWdzKCR4KSwwLDQwMCksYXJyYXlfc2xpY2UoJG1tWzBdLDAsMykpOyAkb1snbG9nX3RhaWwnXVtiYXNlbmFtZSgkZnNbMF0pXT1tYl9zdWJzdHIoc3RyaXBfdGFncyhzdWJzdHIoJHQsLTE1MDApKSwwLDE1MDApOyB9IH0KICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-092922';
const GKEY='ps_ex24';
const PHASES=["R"];
const OUT='analize/s1593_r5.json';
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
