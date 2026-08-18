process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDE4J10pPyRfR0VUWydwc19oMDE4J106Jyc7IGlmKCRhIT09J0RSWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg5MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDE4JywncmV6aW1hcyc9PiRhKTsKICRkaXI9V1BfUExVR0lOX0RJUi4nL3Nlby1ieS1yYW5rLW1hdGgnOwoKIC8qIDEuICVleGNlcnB0JSBlbGdzZW5hIOKAlCBpcyBzYWx0aW5pbyAqLwogJGhpdHM9YXJyYXkoKTsKIGZvcmVhY2goYXJyYXkoJy9pbmNsdWRlcy9yZXBsYWNlLXZhcmlhYmxlcy9jbGFzcy1wb3N0LXZhcmlhYmxlcy5waHAnKSBhcyAkcmVsKXsKICAgJHg9JGRpci4kcmVsOyBpZighaXNfcmVhZGFibGUoJHgpKSBjb250aW51ZTsKICAgJGxuPWZpbGUoJHgpOwogICBmb3JlYWNoKCRsbiBhcyAkaT0+JGwpewogICAgIGlmKHByZWdfbWF0Y2goJy9leGNlcnB0L2knLCRsKSkgJGhpdHNbXT0oJGkrMSkuJzogJy50cmltKCRsKTsKICAgfQogfQogJG9bJ2V4Y2VycHRfc2FsdGluaXMnXT1hcnJheV9zbGljZSgkaGl0cywwLDQ1KTsKCiAvKiAyLiBneXZhcyB0ZXN0YXM6IHByZWtlcyBiZSBleGNlcnB0IOKAlCBrYSBkdW90dSBzYWJsb25hcyAqLwogJGJlX2V4Yz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgIEFORCBUUklNKENPQUxFU0NFKHBvc3RfZXhjZXJwdCwnJykpPScnIik7CiAkYmVfYWJpZWp1PShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgQU5EIFRSSU0oQ09BTEVTQ0UocG9zdF9leGNlcnB0LCcnKSk9JycgQU5EIFRSSU0oQ09BTEVTQ0UocG9zdF9jb250ZW50LCcnKSk9JyciKTsKICRvWydwdWJsaXNoX2JlX2V4Y2VycHQnXT0kYmVfZXhjOyAkb1sncHVibGlzaF9iZV9leGNlcnB0X2lyX2NvbnRlbnQnXT0kYmVfYWJpZWp1OwogJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgIEFORCBUUklNKENPQUxFU0NFKHBvc3RfZXhjZXJwdCwnJykpPScnIEFORCBUUklNKENPQUxFU0NFKHBvc3RfY29udGVudCwnJykpPD4nJyBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDEiKTsKICRvWyd0ZXN0aW5lX3ByZWtlJ109JHBpZDsgJG9bJ3Rlc3RpbmVfdXJsJ109JHBpZD9nZXRfcGVybWFsaW5rKCRwaWQpOicnOwoKIC8qIDMuIEtBIHRyaW50dW1lIOKAlCBhcGltdGlzIHBhZ2FsIHRpcGEgaXIgYnVzZW5hICovCiAkZWlsPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAucG9zdF90eXBlLHAucG9zdF9zdGF0dXMsQ09VTlQoKikgbgogICBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0ncmFua19tYXRoX3RpdGxlJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJwogICBHUk9VUCBCWSBwLnBvc3RfdHlwZSxwLnBvc3Rfc3RhdHVzIE9SREVSIEJZIG4gREVTQyIsIEFSUkFZX0EpOwogJG9bJ2FwaW10aXMnXT0kZWlsOwoKIC8qIDQuIE5FIHByZWtpdSBpcmFzYWkg4oCUIHZhcmRpbmlzIHNhcmFzYXMgKGJsb2dhcyBuZWxpZWNpYW0pICovCiAkb1snbmVfcHJla2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3RfdHlwZSxwLnBvc3Rfc3RhdHVzLExFRlQocC5wb3N0X3RpdGxlLDYwKSBwYXYsCiAgICAgTEVGVChtLm1ldGFfdmFsdWUsOTApIHRpdGxlCiAgIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZAogICBXSEVSRSBtLm1ldGFfa2V5PSdyYW5rX21hdGhfdGl0bGUnIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwLnBvc3RfdHlwZTw+J3Byb2R1Y3QnIiwgQVJSQVlfQSk7CgogLyogNS4gUElMTkEgS09QSUpBIHByaWVzIHRyeW5pbWEgKi8KICR2aXNpPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ucG9zdF9pZCxtLm1ldGFfa2V5LG0ubWV0YV92YWx1ZQogICBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleSBJTiAoJ3JhbmtfbWF0aF90aXRsZScsJ195b2FzdF93cHNlb190aXRsZScpIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCciLCBBUlJBWV9BKTsKICR1cD13cF91cGxvYWRfZGlyKCk7ICRkMj0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRkMikpIEBta2RpcigkZDIsMDc1NSx0cnVlKTsKICRmPSRkMi4nL3JhbmttYXRoX3RpdGxlX2tvcGlqYV8nLmRhdGUoJ1ltZF9IaXMnKS4nLmpzb24nOwogQGZpbGVfcHV0X2NvbnRlbnRzKCRmLCB3cF9qc29uX2VuY29kZSgkdmlzaSkpOwogJG9bJ2tvcGlqYSddPUBmaWxlX2V4aXN0cygkZik/YmFzZW5hbWUoJGYpOidORVBBVllLTyc7CiAkb1sna29waWpvamVfaXJhc3UnXT1jb3VudCgkdmlzaSk7CiAkb1sna29waWpvc19keWRpcyddPUBmaWxlX2V4aXN0cygkZik/ZmlsZXNpemUoJGYpOjA7CgogLyogNi4gYXByYXN5bXUgZGFuZ2EgcG8gdHJ5bmltbyAqLwogJG9bJ2RhbmdhJ109YXJyYXkoCiAgICdwdWJsaXNoX3ByZWtpdSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciKSwKICAgJ3N1X3JtX2Rlc2NyaXB0aW9uJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRAogICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIG0ubWV0YV9rZXk9J3JhbmtfbWF0aF9kZXNjcmlwdGlvbicgQU5EIG0ubWV0YV92YWx1ZTw+JyciKSwKICAgJ3N1X2V4Y2VycHQnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgQU5EIFRSSU0oQ09BTEVTQ0UocG9zdF9leGNlcnB0LCcnKSk8PicnIiksCiApOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H018'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H018 RM title dry',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h018=DRY'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  try{
    const u=(out.d&&out.d.testine_url)?out.d.testine_url:'';
    if(u){
      const x=await fetch(u); const h=await x.text();
      const g=(re)=>{const m=h.match(re);return m?m[1]:''};
      out.testine_galva={
        http:x.status,
        title:g(/<title>([\s\S]*?)<\/title>/i).slice(0,160),
        description:g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i).slice(0,240)
      };
    }
  }catch(e){ out.testine_klaida=String(e).slice(0,120); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h018.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h018 rm title dry');
