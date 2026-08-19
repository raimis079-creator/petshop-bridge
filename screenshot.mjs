process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3MyddKT8kX0dFVFsncHNfaDA3MyddOicnKSE9PSdIMDczJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNzMnKTsKCiAvKiBtb2tlamltbyBidWRhaSAqLwogaWYoY2xhc3NfZXhpc3RzKCdXQ19QYXltZW50X0dhdGV3YXlzJykpewogICAkZz1XQygpLT5wYXltZW50X2dhdGV3YXlzKCktPnBheW1lbnRfZ2F0ZXdheXMoKTsKICAgJG9bJ2JlbmRyYWknXT1hcnJheSgpOwogICBmb3JlYWNoKCRnIGFzICRpZD0+JHgpewogICAgICRvWydiZW5kcmFpJ11bXT1hcnJheSgnaWQnPT4kaWQsJ3Bhdic9PiR4LT5nZXRfdGl0bGUoKSwKICAgICAgICdpanVuZ3Rhcyc9PigkeC0+ZW5hYmxlZD09PSd5ZXMnKT8xOjAsJ2FwcmFzeW1hcyc9Pm1iX3N1YnN0cigoc3RyaW5nKSR4LT5kZXNjcmlwdGlvbiwwLDYwKSk7CiAgIH0KIH0KIC8qIHBheXNlcmEgbnVzdGF0eW1haSDigJQgYmUgc2xhcHR1IHJlaWtzbWl1ICovCiBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclcGF5c2VyYSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV3Y19nYXRld2F5X3BheXMlJyIpIGFzICRuKXsKICAgJHY9Z2V0X29wdGlvbigkbik7CiAgIGlmKGlzX2FycmF5KCR2KSl7CiAgICAgJHNhdWd1PWFycmF5KCk7CiAgICAgZm9yZWFjaCgkdiBhcyAkaz0+JHZhbCl7CiAgICAgICBpZihwcmVnX21hdGNoKCcvcGFzc3xzaWdufHNlY3JldHxrZXl8c2xhcHQvaScsJGspKSAkc2F1Z3VbJGtdPSR2YWw/KCdZUkEgKCcuc3RybGVuKChzdHJpbmcpJHZhbCkuJyBzaW1iLiknKTonVFVTQ0lBJzsKICAgICAgIGVsc2UgJHNhdWd1WyRrXT1pc19zY2FsYXIoJHZhbCk/bWJfc3Vic3RyKChzdHJpbmcpJHZhbCwwLDYwKTpnZXR0eXBlKCR2YWwpOwogICAgIH0KICAgICAkb1snbnVzdGF0eW1haSddWyRuXT0kc2F1Z3U7CiAgIH0gZWxzZSAkb1snbnVzdGF0eW1haSddWyRuXT1pc19zY2FsYXIoJHYpP21iX3N1YnN0cigoc3RyaW5nKSR2LDAsNjApOmdldHR5cGUoJHYpOwogfQogLyogcGx1Z2luYXMgKi8KICRvWydwbHVnaW5haSddPWFycmF5KCk7CiBmb3JlYWNoKChhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpIGFzICRwKSBpZihzdHJpcG9zKCRwLCdwYXlzJykhPT1mYWxzZSkgJG9bJ3BsdWdpbmFpJ11bXT0kcDsKIC8qIHV6c2FreW11IHN0YXRpc3Rpa2EgKi8KICRvWyd1enNha3ltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIENPVU5UKCopIG4gRlJPTSB7JFB9d2Nfb3JkZXJzIEdST1VQIEJZIHN0YXR1cyBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTAiLCBBUlJBWV9BKTsKICRvWydwYWdhbF9idWRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcGF5bWVudF9tZXRob2QsIHBheW1lbnRfbWV0aG9kX3RpdGxlLCBDT1VOVCgqKSBuCiAgIEZST00geyRQfXdjX29yZGVycyBHUk9VUCBCWSBwYXltZW50X21ldGhvZCwgcGF5bWVudF9tZXRob2RfdGl0bGUgT1JERVIgQlkgbiBERVNDIExJTUlUIDEwIiwgQVJSQVlfQSk7CiAkb1sndmFsaXV0YSddPWdldF93b29jb21tZXJjZV9jdXJyZW5jeSgpOwogJG9bJ2NhbGxiYWNrX3VybCddPWhvbWVfdXJsKCcvP3djLWFwaT1wYXlzZXJhX2NhbGxiYWNrJyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H073'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H073 paysera busena',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h073=H073'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h073.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h073 paysera busena');
