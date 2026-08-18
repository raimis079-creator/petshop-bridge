process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5NTAnXSk/JF9HRVRbJ3BzX2c5NTAnXTonJykgIT09ICdHOTUwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5NTAnKTsKCiAvKiAxLiBLT0RBUyDigJQga29udGVrc3RhcyBhcGllIGVpbHV0ZXMgMzQzLDM0NCw1MTMsNTE1ICovCiAkZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJzsKICRMPWV4cGxvZGUoIlxuIiwgZmlsZV9nZXRfY29udGVudHMoJGYpKTsKIGZvcmVhY2goYXJyYXkoMzQzLDUxMykgYXMgJG5yKXsKICAgJGN0eD1hcnJheSgpOwogICBmb3IoJGo9bWF4KDAsJG5yLTE2KTsgJGo8PW1pbihjb3VudCgkTCktMSwkbnIrOCk7ICRqKyspICRjdHhbXT0oJGorMSkuJzogJy50cmltKHN1YnN0cigkTFskal0sMCwxNTApKTsKICAgJG9bJ2tvZGFzJ11bJG5yXT0kY3R4OwogfQoKIC8qIDIuIE1BU1RBUzoga2llayBwcmVraXUgdHVyaSDigJ5BcnJheSIgbGF1a3Vvc2UgKi8KICRvWydhcnJheV9tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksIENPVU5UKCopIG4gRlJPTSB7JFB9cG9zdG1ldGEKICAgV0hFUkUgbWV0YV92YWx1ZT0nQXJyYXknIEdST1VQIEJZIG1ldGFfa2V5IE9SREVSIEJZIG4gREVTQyBMSU1JVCAyMCIsIEFSUkFZX0EpOwogJG9bJ2FycmF5X3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV92YWx1ZT0nQXJyYXknIik7CiAkb1snYXJyYXlfdGVybWluYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0dC50YXhvbm9teSwgdC5uYW1lLCB0dC5jb3VudCBGUk9NIHskUH10ZXJtcyB0CiAgIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdC5uYW1lPSdBcnJheScgT1IgdC5zbHVnPSdhcnJheSciLCBBUlJBWV9BKTsKICRvWydhcnJheV9wYXZhZGluaW11b3NlJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJUFycmF5JSciKTsKICRvWydwdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLnBvc3RfaWQsIG0ubWV0YV9rZXksIExFRlQocC5wb3N0X3RpdGxlLDQ1KSBwYXYsIHAucG9zdF9zdGF0dXMKICAgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkIFdIRVJFIG0ubWV0YV92YWx1ZT0nQXJyYXknIExJTUlUIDE1IiwgQVJSQVlfQSk7CgogLyogMy4gU2FyZ28gaXJhc2FpICovCiAkdD0kUC4ncHNfc2FyZ2FzX2tsYWlkb3MnOwogaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpKXsKICAgJG9bJ3NhcmdhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHppbnV0ZSwgZmFpbGFzLCBlaWx1dGUsIFNVTShraWVrKSBrYXJ0dSwgTUlOKGxhaWthcykgcGlybWFzLCBNQVgobGFpa2FzKSBwYXNrdXRpbmlzCiAgICAgRlJPTSAkdCBXSEVSRSB6aW51dGUgTElLRSAnJUFycmF5IHRvIHN0cmluZyUnIEdST1VQIEJZIGZhaWxhcywgZWlsdXRlIE9SREVSIEJZIGthcnR1IERFU0MgTElNSVQgMTAiLCBBUlJBWV9BKTsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G950'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G950 Array defektas',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g950=G950')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g950.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g950');
