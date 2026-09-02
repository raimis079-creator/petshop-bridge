process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgVmVuaXBhayB0cmFja2luZyByZWNvbiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc192dDEnXSkpIHJldHVybjsgJG89YXJyYXkoKTsgc2V0X3RpbWVfbGltaXQoMTIwKTsKICAvLyAxLiBrYWlwIHBsdWdpbmFzIHRpa3JpbmEgYnVzZW5hCiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy8qdmVuaXBhayonLEdMT0JfT05MWURJUikgYXMgJGRpcil7ICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOyBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHByZWdfbWF0Y2hfYWxsKCcvLnswLDQwMH0oZ2V0X3BhY2tfc3RhdHVzfHRyYWNraW5nfFwvd3NcL1thLXpfXSspLnswLDQwMH0vcycsJGMsJG0pKXsgZm9yZWFjaChhcnJheV9zbGljZSgkbVswXSwwLDMpIGFzICR4KXsgJG9bJ2tvZGFzJ11bYmFzZW5hbWUoJGYpXVtdPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCk7IH0gfSB9IH0KICAvLyAyLiByZWFsdXMga3ZpZXRpbWFzOiByYXN0aSBtZXRvZGEgcGVyIFJlZmxlY3Rpb24KICAkcz1nZXRfb3B0aW9uKCdzaG9wdXBfdmVuaXBha19zaGlwcGluZ19zZXR0aW5ncycpOyAkdT0kc1snc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfdXNlcm5hbWUnXT8/Jyc7ICRwPSRzWydzaG9wdXBfdmVuaXBha19zaGlwcGluZ19maWVsZF9wYXNzd29yZCddPz8nJzsKICAkcGFja3M9YXJyYXkoJ1YwNzI2N0UxMDAwMDMwJywnVjA3MjY3RTEwMDAwMzYnLCdWMDcyNjdFMTAwMDA0MScsJ1YwNzI2N0UxMDAwMDQ1Jyk7CiAgZm9yZWFjaChhcnJheSgnaHR0cHM6Ly9nby52ZW5pcGFrLmx0L3dzL3RyYWNraW5nJywnaHR0cHM6Ly9nby52ZW5pcGFrLmx0L3dzL2dldF9wYWNrX3N0YXR1cycpIGFzICR1cmwpewogICAgJHI9d3BfcmVtb3RlX3Bvc3QoJHVybCxhcnJheSgndGltZW91dCc9PjMwLCdib2R5Jz0+YXJyYXkoJ3VzZXInPT4kdSwncGFzcyc9PiRwLCdwYWNrX25vJz0+aW1wbG9kZSgnLCcsJHBhY2tzKSksJ2hlYWRlcnMnPT5hcnJheSgnUmVmZXJlcic9PidodHRwczovL3dvb2NvbW1lcmNlLmNvbS8nKSkpOwogICAgJG9bJ2FwaSddWyR1cmxdPWlzX3dwX2Vycm9yKCRyKT8kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTphcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksbWJfc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSwwLDE1MDApKTsKICB9CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9nby52ZW5pcGFrLmx0L3dzL3RyYWNraW5nP3VzZXI9Jy5yYXd1cmxlbmNvZGUoJHUpLicmcGFzcz0nLnJhd3VybGVuY29kZSgkcCkuJyZjb2RlPScuJHBhY2tzWzBdLGFycmF5KCd0aW1lb3V0Jz0+MzApKTsKICAkb1snYXBpJ11bJ3RyYWNraW5nIEdFVCBjb2RlJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOmFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSxtYl9zdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLDAsMTUwMCkpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-201303';
const GKEY='ps_vt1';
const PHASES=["R"];
const OUT='analize/vt.json';
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
