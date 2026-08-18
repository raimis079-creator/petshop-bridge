process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAyOCddKT8kX0dFVFsncHNfaDAyOCddOicnKSE9PSdWQUxZVEknKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMzAwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nSDAyOCcpOwogJGtvcGlqYT1nZXRfb3B0aW9uKCdwc19oMDI3X2tvcGlqYScsYXJyYXkoKSk7CiAkb1sna29waWphX3Jhc3RhJ109aXNfYXJyYXkoJGtvcGlqYSk/YXJyYXlfbWFwKCdzdHJsZW4nLCRrb3BpamEpOm51bGw7CiBmb3JlYWNoKGFycmF5KDcwLDcyKSBhcyAkaWQpewogICAkdD1nZXRfdGVybSgkaWQsJ3Byb2R1Y3RfY2F0Jyk7CiAgICRwcmllcz0oJHQmJiFpc193cF9lcnJvcigkdCkpP3N0cmxlbigkdC0+ZGVzY3JpcHRpb24pOm51bGw7CiAgICRzZW5hPWlzc2V0KCRrb3BpamFbJGlkXSk/JGtvcGlqYVskaWRdOicnOwogICAkcj13cF91cGRhdGVfdGVybSgkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZGVzY3JpcHRpb24nPT4kc2VuYSkpOwogICAkdDI9Z2V0X3Rlcm0oJGlkLCdwcm9kdWN0X2NhdCcpOwogICAkb1sncmV6dWx0YXRhcyddWyRpZF09YXJyYXkoJ3ZhcmRhcyc9PiR0Mi0+bmFtZSwnYnV2byc9PiRwcmllcywKICAgICAndGFwbyc9PnN0cmxlbigkdDItPmRlc2NyaXB0aW9uKSwna2xhaWRhJz0+aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOm51bGwpOwogfQogZGVsZXRlX29wdGlvbigncHNfaDAyN19rb3BpamEnKTsKIC8qIGtvbnRyb2xlOiBhciBhcHNrcml0YWkgbGlrbyBrYXRlZ29yaWp1IHN1IGFwcmFzeW11ICovCiAkb1sna2F0ZWdvcmlqdV9zdV9hcHJhc3ltdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH10ZXJtX3RheG9ub215CiAgIFdIRVJFIHRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EIFRSSU0oQ09BTEVTQ0UoZGVzY3JpcHRpb24sJycpKTw+JyciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H028'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H028 valymas',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h028=VALYTI'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,300); }
  /* nepriklausoma patikra per REST, ne per ta pati snippeta */
  for(const id of [70,72]){
    const q=await api('/wp-json/wc/v3/products/categories/'+id);
    try{ const jj=JSON.parse(q.t); out['patikra_'+id]={vardas:jj.name,aprasymo_ilgis:(jj.description||'').length}; }
    catch(e){ out['patikra_'+id]='ne'; }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h028.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h028 valymas');
