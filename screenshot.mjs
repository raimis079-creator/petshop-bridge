process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3NiddKT8kX0dFVFsncHNfaDA3NiddOicnKSE9PSdBVFNUQVRZVEknKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMzAwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nSDA3NicpOwogLyogMS4gdGVzdF9tb2RlIGlyIHp1cm5hbGFzIGF0Z2FsICovCiAkbT0oYXJyYXkpZ2V0X29wdGlvbigncGF5c2VyYV9wYXltZW50X21haW5fc2V0dGluZ3MnKTsKICRvWyd0ZXN0X21vZGVfYnV2byddPWlzc2V0KCRtWyd0ZXN0X21vZGUnXSk/JG1bJ3Rlc3RfbW9kZSddOm51bGw7CiAkbVsndGVzdF9tb2RlJ109J3llcyc7CiB1cGRhdGVfb3B0aW9uKCdwYXlzZXJhX3BheW1lbnRfbWFpbl9zZXR0aW5ncycsJG0pOwogJGU9KGFycmF5KWdldF9vcHRpb24oJ3BheXNlcmFfcGF5bWVudF9leHRyYV9zZXR0aW5ncycpOwogJG9bJ2xvZ19idXZvJ109aXNzZXQoJGVbJ2xvZ19sZXZlbCddKT8kZVsnbG9nX2xldmVsJ106bnVsbDsKICRlWydsb2dfbGV2ZWwnXT0nZXJyb3InOwogdXBkYXRlX29wdGlvbigncGF5c2VyYV9wYXltZW50X2V4dHJhX3NldHRpbmdzJywkZSk7CiAvKiAyLiB0ZXN0aW5lIHByZWtlIGkgc2l1a3NsaW5lICovCiAkaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfbmFtZT0ncHMtdGVzdGFzLTEtZXVyJyBBTkQgcG9zdF90eXBlPSdwcm9kdWN0JyBMSU1JVCAxIik7CiBpZigkaWQpeyB3cF90cmFzaF9wb3N0KCRpZCk7ICRvWydwcmVrZSddPWFycmF5KCdpZCc9PiRpZCwnYnVzZW5hJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRpZCkpOyB9CiBlbHNlICRvWydwcmVrZSddPSduZXJhc3RhJzsKIC8qIDMuIGFyIGxpa28gbmViYWlndHUgdXpzYWt5bXUgKi8KICRvWyduYXVqaV91enNha3ltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdGF0dXMsdG90YWxfYW1vdW50LHBheW1lbnRfbWV0aG9kX3RpdGxlCiAgIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBpZCA+IDM0OTUyIE9SREVSIEJZIGlkIiwgQVJSQVlfQSk7CiAvKiA0LiBwYXRpa3JhICovCiAkbTI9KGFycmF5KWdldF9vcHRpb24oJ3BheXNlcmFfcGF5bWVudF9tYWluX3NldHRpbmdzJyk7CiAkZTI9KGFycmF5KWdldF9vcHRpb24oJ3BheXNlcmFfcGF5bWVudF9leHRyYV9zZXR0aW5ncycpOwogJG9bJ2RhYmFyJ109YXJyYXkoJ3Rlc3RfbW9kZSc9PiRtMlsndGVzdF9tb2RlJ10sJ2xvZ19sZXZlbCc9PiRlMlsnbG9nX2xldmVsJ10pOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H076'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H076 atstatymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h076=ATSTATYTI'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h076.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h076 atstatymas');
