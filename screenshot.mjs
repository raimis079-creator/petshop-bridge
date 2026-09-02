process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MyBmaXg6IEltcG9ydCAjMyAtPiBfemJfcXR5IG1hcHBpbmcKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjYnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLUYxJ107ICRmPSRfR0VUWydwc19leDI2J107CiAgICAkYmFzZT0naHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtbG9hZC5waHA/aW1wb3J0X2tleT12JmltcG9ydF9pZD0zJzsKICAgIGlmICgkZj09PSdEJykgewogICAgICAgICRyb3c9JHdwZGItPmdldF9yb3coIlNFTEVDVCBvcHRpb25zLHByb2Nlc3NpbmcsdHJpZ2dlcmVkLHF1ZXVlX2NodW5rX251bWJlciBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MyIsQVJSQVlfQSk7CiAgICAgICAgaWYgKChpbnQpJHJvd1sncHJvY2Vzc2luZyddPT09MSkgeyAkb1sna2xhaWRhJ109J2ltcG9ydCAzIGRhYmFyIHByb2Nlc3Npbmcg4oCUIGJhbmR5dGkgdmVsaWF1JzsgZ290byBvdXQ7IH0KICAgICAgICB1cGRhdGVfb3B0aW9uKCdwc19wbXhpM19iYWNrdXBfMjAyNjA5MDInLCRyb3dbJ29wdGlvbnMnXSxmYWxzZSk7ICRvWydiYWNrdXBfbGVuJ109c3RybGVuKCRyb3dbJ29wdGlvbnMnXSk7CiAgICAgICAgJG9wPW1heWJlX3Vuc2VyaWFsaXplKCRyb3dbJ29wdGlvbnMnXSk7CiAgICAgICAgJG9wWydpc191cGRhdGVfY3VzdG9tX2ZpZWxkcyddPScxJzsgJG9wWyd1cGRhdGVfY3VzdG9tX2ZpZWxkc19sb2dpYyddPSdvbmx5JzsgJG9wWydjdXN0b21fZmllbGRzX2xpc3QnXT1bJ196Yl9xdHknXTsgJG9wWydjdXN0b21fbmFtZSddPVsnX3piX3F0eSddOyAkb3BbJ2N1c3RvbV92YWx1ZSddPVsne3F0eVsxXX0nXTsKICAgICAgICAkb1sndXBkJ109JHdwZGItPnVwZGF0ZSgieyRwfXBteGlfaW1wb3J0cyIsWydvcHRpb25zJz0+c2VyaWFsaXplKCRvcCksJ3RyaWdnZXJlZCc9PjAsJ3Byb2Nlc3NpbmcnPT4wLCdxdWV1ZV9jaHVua19udW1iZXInPT4wXSxbJ2lkJz0+M10pOwogICAgICAgICRjaGs9bWF5YmVfdW5zZXJpYWxpemUoJHdwZGItPmdldF92YXIoIlNFTEVDVCBvcHRpb25zIEZST00geyRwfXBteGlfaW1wb3J0cyBXSEVSRSBpZD0zIikpOyAkb1snY2hrJ109WydjZic9PiRjaGtbJ2lzX3VwZGF0ZV9jdXN0b21fZmllbGRzJ10sJ2xvZ2ljJz0+JGNoa1sndXBkYXRlX2N1c3RvbV9maWVsZHNfbG9naWMnXSwnbmFtZSc9PiRjaGtbJ2N1c3RvbV9uYW1lJ10sJ3ZhbCc9PiRjaGtbJ2N1c3RvbV92YWx1ZSddLCdsaXN0Jz0+JGNoa1snY3VzdG9tX2ZpZWxkc19saXN0J11dOwogICAgICAgICRvWydwcmllcyddPVsnMzI0NjMnPT5nZXRfcG9zdF9tZXRhKDMyNDYzLCdfemJfcXR5Jyx0cnVlKSwnMjc5NTknPT5nZXRfcG9zdF9tZXRhKDI3OTU5LCdfemJfcXR5Jyx0cnVlKV07CiAgICAgICAgJHI9d3BfcmVtb3RlX2dldCgkYmFzZS4nJmFjdGlvbj10cmlnZ2VyJyxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJG9bJ3RyaWdnZXInXT1tYl9zdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLDAsMTIwKTsKICAgIH0KICAgIGlmICgkZj09PSdQJykgewogICAgICAgICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRyPXdwX3JlbW90ZV9nZXQoJGJhc2UuJyZhY3Rpb249cHJvY2Vzc2luZycsWyd0aW1lb3V0Jz0+OTUsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRvWydwcm9jJ109W21iX3N1YnN0cih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksMCwyMDApLHJvdW5kKG1pY3JvdGltZSh0cnVlKS0kdDAsMSldOwogICAgICAgICRvWydwbXhpMyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgcHJvY2Vzc2luZyx0cmlnZ2VyZWQscXVldWVfY2h1bmtfbnVtYmVyLGltcG9ydGVkLHVwZGF0ZWQsc2tpcHBlZCxjb3VudCBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MyIsQVJSQVlfQSk7CiAgICAgICAgJG9bJ3BvJ109WyczMjQ2Myc9PmdldF9wb3N0X21ldGEoMzI0NjMsJ196Yl9xdHknLHRydWUpLCcyNzk1OSc9PmdldF9wb3N0X21ldGEoMjc5NTksJ196Yl9xdHknLHRydWUpLCcxMjQ2OSc9PmdldF9wb3N0X21ldGEoMTI0NjksJ196Yl9xdHknLHRydWUpLCcxMjQ2OV9zdG9jayc9PmdldF9wb3N0X21ldGEoMTI0NjksJ19zdG9jaycsdHJ1ZSldOyAkb1snaGlzdDMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0eXBlLHRpbWVfcnVuLGRhdGUsc3VtbWFyeSBGUk9NIHskcH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAyIixBUlJBWV9BKTsKICAgIH0KICAgIG91dDoKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-093716';
const GKEY='ps_ex26';
const PHASES=["P", "P"];
const OUT='analize/s1593_fix2.json';
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
