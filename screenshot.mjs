process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3NSddKT8kX0dFVFsncHNfaDA3NSddOicnKSE9PSdUSUtSSU5USScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDc1JywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICRSSUJBPTM0OTUyOyAgIC8qIHBhc2t1dGluaXMgdXpzYWt5bWFzIFBSSUVTIHRlc3RhICovCgogLyogMS4gTkFVSkkgVVpTQUtZTUFJICovCiAkbmF1amk9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsc3RhdHVzLHR5cGUsY3VycmVuY3ksdG90YWxfYW1vdW50LAogICAgIHBheW1lbnRfbWV0aG9kLHBheW1lbnRfbWV0aG9kX3RpdGxlLHRyYW5zYWN0aW9uX2lkLGN1c3RvbWVyX2lkLGJpbGxpbmdfZW1haWwsCiAgICAgZGF0ZV9jcmVhdGVkX2dtdCxkYXRlX3VwZGF0ZWRfZ210IEZST00geyRQfXdjX29yZGVycyBXSEVSRSBpZCA+ICVkIE9SREVSIEJZIGlkIiwgJFJJQkEpLCBBUlJBWV9BKTsKICRvWyduYXVqdSddPWNvdW50KCRuYXVqaSk7ICRvWyd1enNha3ltYWknXT0kbmF1amk7CgogZm9yZWFjaCgkbmF1amkgYXMgJHUpewogICAkaWQ9KGludCkkdVsnaWQnXTsKICAgLyogMi4gVVpTQUtZTU8gSVNUT1JJSkEgKGNhbGxiYWNrIHBhbGlla2EgcGVkc2FrYSkgKi8KICAgJG9bJ2lzdG9yaWphJ11bJGlkXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgICAgIlNFTEVDVCBjb21tZW50X2RhdGUsIGNvbW1lbnRfYXV0aG9yLCBMRUZUKGNvbW1lbnRfY29udGVudCwyMjApIHR1cmlueXMKICAgICAgRlJPTSB7JFB9Y29tbWVudHMgV0hFUkUgY29tbWVudF9wb3N0X0lEPSVkIEFORCBjb21tZW50X3R5cGU9J29yZGVyX25vdGUnIE9SREVSIEJZIGNvbW1lbnRfSUQiLCAkaWQpLCBBUlJBWV9BKTsKICAgLyogMy4gTUVUQTogc2Fza2FpdGEsIHNlcmlqYSwgcGF5c2VyYSAqLwogICAkbT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsODApIHYgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEKICAgICAgV0hFUkUgb3JkZXJfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJXBheXMlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVpbnZvaWNlJSUnCiAgICAgIE9SIG1ldGFfa2V5IExJS0UgJyUlYXZwbiUlJyBPUiBtZXRhX2tleSBMSUtFICclJWlhcHYlJScgT1IgbWV0YV9rZXkgTElLRSAnJSV3Y2RuJSUnCiAgICAgIE9SIG1ldGFfa2V5IExJS0UgJyUlc2Fza2FpdCUlJyBPUiBtZXRhX2tleSBMSUtFICclJXNlcmlqJSUnKSIsICRpZCksIEFSUkFZX0EpOwogICAkb1snbWV0YSddWyRpZF09JG07CiAgIC8qIDQuIGVpbHV0ZXMgKi8KICAgJG9bJ2VpbHV0ZXMnXVskaWRdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAiU0VMRUNUIG9yZGVyX2l0ZW1fbmFtZSwgb3JkZXJfaXRlbV90eXBlIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIFdIRVJFIG9yZGVyX2lkPSVkIiwgJGlkKSwgQVJSQVlfQSk7CiB9CgogLyogNS4gS0xBSURPUyBwbyB0ZXN0byAqLwogJG9bJ2tsYWlkb3NfbmF1am9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLGx5Z2lzLExFRlQoemludXRlLDE0MCkgeixMRUZUKGZhaWxhcyw2MCkgZixlaWx1dGUsa2llawogICBGUk9NIHskUH1wc19zYXJnYXNfa2xhaWRvcyBXSEVSRSBsYWlrYXMgPiBEQVRFX1NVQihOT1coKSwgSU5URVJWQUwgNDAgTUlOVVRFKSBPUkRFUiBCWSBsYWlrYXMgREVTQyBMSU1JVCAxMCIsIEFSUkFZX0EpOwogJG9bJ2tsYWlkdV92aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX3Nhcmdhc19rbGFpZG9zIik7CgogLyogNi4gUEFZU0VSQSBaVVJOQUxBUyAqLwogJHdsPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93Yy1sb2dzJzsKICRvWydwYXlzZXJhX3p1cm5hbGFzJ109YXJyYXkoKTsKIGlmKGlzX2Rpcigkd2wpKXsKICAgZm9yZWFjaChnbG9iKCR3bC4nLypwYXlzKi5sb2cnKSBhcyAkZil7CiAgICAgaWYoZmlsZW10aW1lKCRmKSA+IHRpbWUoKS0zNjAwKXsKICAgICAgICR0PUBmaWxlX2dldF9jb250ZW50cygkZik7CiAgICAgICAkb1sncGF5c2VyYV96dXJuYWxhcyddW109YXJyYXkoJ2YnPT5iYXNlbmFtZSgkZiksJ2tiJz0+cm91bmQoZmlsZXNpemUoJGYpLzEwMjQsMSksCiAgICAgICAgICdrZWlzdGFzJz0+ZGF0ZSgnSDppOnMnLGZpbGVtdGltZSgkZikpLCd1b2RlZ2EnPT5tYl9zdWJzdHIoJHQsLTE1MDApKTsKICAgICB9CiAgIH0KIH0KIC8qIDcuIGxhaXNrdSBlaWxlICovCiAkb1snbGFpc2t1X2VpbGUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9YWN0aW9uc2NoZWR1bGVyX2FjdGlvbnMKICAgV0hFUkUgc3RhdHVzPSdwZW5kaW5nJyBBTkQgaG9vayBMSUtFICclbWFpbCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H075'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H075 paysera patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h075=TIKRINTI'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h075.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h075 paysera patikra');
