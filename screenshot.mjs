process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAxMyddKT8kX0dFVFsncHNfaDAxMyddOicnKSE9PSdIMDEzJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMTMnKTsKCiAkZGlyID0gV1BfUExVR0lOX0RJUi4nL3Nlby1ieS1yYW5rLW1hdGgnOwogJG9bJ2Rpcl95cmEnXT1pc19kaXIoJGRpcik/MTowOwoKIC8qIDEuIFZBUlRBSToga3VyIHBsdWdpbmFzIHRpa3JpbmEsIGFyIHN1a29uZmlndXJ1b3RhcyAqLwogJG9bJ2lzX2NvbmZpZ3VyZWRfc2FsdGluaXMnXT1udWxsOwogaWYoY2xhc3NfZXhpc3RzKCdSYW5rTWF0aFxcSGVscGVyJykgJiYgbWV0aG9kX2V4aXN0cygnUmFua01hdGhcXEhlbHBlcicsJ2lzX2NvbmZpZ3VyZWQnKSl7CiAgIHRyeXsKICAgICAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1JhbmtNYXRoXFxIZWxwZXInLCdpc19jb25maWd1cmVkJyk7CiAgICAgJGY9JHJtLT5nZXRGaWxlTmFtZSgpOyAkcz0kcm0tPmdldFN0YXJ0TGluZSgpOyAkZT0kcm0tPmdldEVuZExpbmUoKTsKICAgICAkbGluZXM9ZmlsZSgkZik7CiAgICAgJG9bJ2lzX2NvbmZpZ3VyZWRfc2FsdGluaXMnXT1hcnJheSgnZmFpbGFzJz0+c3RyX3JlcGxhY2UoV1BfUExVR0lOX0RJUiwnJywkZiksJ2VpbCc9PiRzLictJy4kZSwKICAgICAgICdrb2Rhcyc9PnRyaW0oaW1wbG9kZSgnJyxhcnJheV9zbGljZSgkbGluZXMsJHMtMSwkZS0kcysxKSkpKTsKICAgICAkb1snaXNfY29uZmlndXJlZF9kYWJhciddPVJhbmtNYXRoXEhlbHBlcjo6aXNfY29uZmlndXJlZCgpPzE6MDsKICAgfWNhdGNoKEV4Y2VwdGlvbiAkZXgpeyAkb1snaXNfY29uZmlndXJlZF9rbGFpZGEnXT0kZXgtPmdldE1lc3NhZ2UoKTsgfQogfQoKIC8qIDIuIGt1ciBpcyB2aXNvIG1pbmltYXMgJ2lzX2NvbmZpZ3VyZWQnIHBhZ3JpbmRpbmlhbWUgZmFpbGUgKi8KICRtYWluZj0kZGlyLicvcmFuay1tYXRoLnBocCc7CiBpZihpc19yZWFkYWJsZSgkbWFpbmYpKXsKICAgJHNyYz1maWxlX2dldF9jb250ZW50cygkbWFpbmYpOyAkaGl0cz1hcnJheSgpOwogICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkc3JjKSBhcyAkaT0+JGxuKXsKICAgICBpZihzdHJpcG9zKCRsbiwnaXNfY29uZmlndXJlZCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkbG4sJ3NldHVwX3dpemFyZCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkbG4sJ3JlZ2lzdHJhdGlvbicpIT09ZmFsc2UpewogICAgICAgJGhpdHNbXT0oJGkrMSkuJzogJy50cmltKCRsbik7CiAgICAgfQogICB9CiAgICRvWydyYW5rX21hdGhfcGhwX2VpbHV0ZXMnXT1hcnJheV9zbGljZSgkaGl0cywwLDI1KTsKIH0KCiAvKiAzLiBvcHRpb24gcmFrdGFzLCBrdXJpIHJhc28gdmVkbHlzICovCiAkb1snb3B0aW9uX2lzX2NvbmZpZ3VyZWQnXT1nZXRfb3B0aW9uKCdyYW5rX21hdGhfaXNfY29uZmlndXJlZCcpOwogJG9bJ3Zpc2lfcm1fb3B0aW9uYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyRQfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncmFuayVtYXRoJSciKTsKCiAvKiA0LiBWSVNJIGdhbGltaSBtb2R1bGlhaSAoa2F0YWxvZ3UgdmFyZGFpKSAqLwogJG1vZHM9YXJyYXkoKTsKIGZvcmVhY2goYXJyYXkoJGRpci4nL2luY2x1ZGVzL21vZHVsZXMnKSBhcyAkbWQpewogICBpZihpc19kaXIoJG1kKSkgZm9yZWFjaChzY2FuZGlyKCRtZCkgYXMgJHgpeyBpZigkeCE9PScuJyYmJHghPT0nLi4nJiZpc19kaXIoJG1kLicvJy4keCkpICRtb2RzW109JHg7IH0KIH0KICRvWydtb2R1bGlhaV9nYWxpbWknXT0kbW9kczsKICRvWydtb2R1bGlhaV9panVuZ3RpJ109Z2V0X29wdGlvbigncmFua19tYXRoX21vZHVsZXMnKTsKCiAvKiA1LiBQSUxOQVMgdGl0bGVzIG9wdGlvbiAoYmUgdHJ1bXBpbmltbywgZGFsaW1pcykgKi8KICR0PWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLXRpdGxlcycpOwogJG9bJ3RpdGxlc19yYWt0YWknXT1pc19hcnJheSgkdCk/YXJyYXlfa2V5cygkdCk6bnVsbDsKICRvWyd0aXRsZXNfcHJvZHVrdGFtcyddPWFycmF5KCk7CiBpZihpc19hcnJheSgkdCkpIGZvcmVhY2goJHQgYXMgJGs9PiR2KXsKICAgaWYoc3RycG9zKCRrLCdwcm9kdWN0JykhPT1mYWxzZSB8fCBzdHJwb3MoJGssJ3B0XycpPT09MCB8fCBzdHJwb3MoJGssJ3RheF8nKT09PTAgfHwgc3RycG9zKCRrLCdob21lcGFnZScpPT09MCkKICAgICAkb1sndGl0bGVzX3Byb2R1a3RhbXMnXVska109aXNfYXJyYXkoJHYpP2ltcGxvZGUoJywnLCR2KTooc3RyaW5nKSR2OwogfQoKIC8qIDYuIGFyIFJNIHByaXNpa2FiaW5vIHByaWUgd3BfaGVhZCAqLwogZ2xvYmFsICR3cF9maWx0ZXI7CiAkaGVhZD1hcnJheSgpOwogaWYoaXNzZXQoJHdwX2ZpbHRlclsnd3BfaGVhZCddKSkgZm9yZWFjaCgkd3BfZmlsdGVyWyd3cF9oZWFkJ10tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpewogICBmb3JlYWNoKCRjYnMgYXMgJGlkPT4kY2IpeyBpZihzdHJpcG9zKCRpZCwncmFuaycpIT09ZmFsc2V8fHN0cmlwb3MoJGlkLCdSYW5rTWF0aCcpIT09ZmFsc2UpICRoZWFkW109JHByLicgJy4kaWQ7IH0KIH0KICRvWyd3cF9oZWFkX3JtJ109JGhlYWQ7CgogLyogNy4gV29vQ29tbWVyY2Ugc2F2b3Mgc2NoZW1vcyBidXNlbmEgKi8KICRvWyd3Y19zY2hlbWFfaG9vayddPWhhc19hY3Rpb24oJ3dvb2NvbW1lcmNlX2JlZm9yZV9tYWluX2NvbnRlbnQnKT8xOjA7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H013'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H013 RM vartai',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h013=H013'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,800); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h013.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h013 rm vartai');
