process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAyOSddKT8kX0dFVFsncHNfaDAyOSddOicnKSE9PSdIMDI5JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMjknKTsKICRmcmFnPSdWaXNrYXMgasWrc8WzIMWhdW5pdWkgdmllbm9qZSB2aWV0b2plJzsKICRsaWtlPSclJy4kd3BkYi0+ZXNjX2xpa2UoJGZyYWcpLiclJzsKCiAvKiAxLiBLVVIgZ3l2ZW5hIGh1YiBpdmFkYXMgKi8KICRvWydwYWllc2thJ109YXJyYXkoKTsKICRvWydwYWllc2thJ11bJ29wdGlvbnMnXT0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgKICAgIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICVzIExJTUlUIDEwIiwkbGlrZSkpOwogJG9bJ3BhaWVza2EnXVsncG9zdG1ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgICJTRUxFQ1QgcG9zdF9pZCxtZXRhX2tleSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX3ZhbHVlIExJS0UgJXMgTElNSVQgMTAiLCRsaWtlKSxBUlJBWV9BKTsKICRvWydwYWllc2thJ11bJ3Rlcm1tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAiU0VMRUNUIHRlcm1faWQsbWV0YV9rZXkgRlJPTSB7JFB9dGVybW1ldGEgV0hFUkUgbWV0YV92YWx1ZSBMSUtFICVzIExJTUlUIDEwIiwkbGlrZSksQVJSQVlfQSk7CiAkb1sncGFpZXNrYSddWydwb3N0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgIlNFTEVDVCBJRCxwb3N0X3R5cGUscG9zdF9zdGF0dXMsTEVGVChwb3N0X3RpdGxlLDUwKSB0IEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfY29udGVudCBMSUtFICVzIExJTUlUIDEwIiwkbGlrZSksQVJSQVlfQSk7CiAkb1sncGFpZXNrYSddWydzbmlwcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJXMgTElNSVQgMTAiLCRsaWtlKSxBUlJBWV9BKTsKCiAvKiAyLiB0ZW1vcyBpciBtdS1wbHVnaW4gZmFpbGFpICovCiAkcmFkbz1hcnJheSgpOwogZm9yZWFjaChhcnJheShnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwgZ2V0X3RlbXBsYXRlX2RpcmVjdG9yeSgpLicvaW5jJywgV1BNVV9QTFVHSU5fRElSKSBhcyAkZGlyKXsKICAgaWYoIWlzX2RpcigkZGlyKSkgY29udGludWU7CiAgIHRyeXsKICAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIpKTsKICAgICAkbj0wOwogICAgIGZvcmVhY2goJGl0IGFzICRmKXsKICAgICAgIGlmKCRuKys+MzAwMCkgYnJlYWs7CiAgICAgICBpZighJGYtPmlzRmlsZSgpKSBjb250aW51ZTsKICAgICAgICRleHQ9c3RydG9sb3dlcihwYXRoaW5mbygkZi0+Z2V0RmlsZW5hbWUoKSxQQVRISU5GT19FWFRFTlNJT04pKTsKICAgICAgIGlmKCFpbl9hcnJheSgkZXh0LGFycmF5KCdwaHAnLCdqcycsJ2h0bWwnKSkpIGNvbnRpbnVlOwogICAgICAgJHM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgIGlmKCRzIT09ZmFsc2UgJiYgc3RycG9zKCRzLCRmcmFnKSE9PWZhbHNlKXsKICAgICAgICAgJGVpbD0wOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkcykgYXMgJGk9PiRsKXsgaWYoc3RycG9zKCRsLCRmcmFnKSE9PWZhbHNlKXsgJGVpbD0kaSsxOyBicmVhazsgfSB9CiAgICAgICAgICRyYWRvW109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZi0+Z2V0UGF0aG5hbWUoKSkuJzonLiRlaWw7CiAgICAgICB9CiAgICAgfQogICB9Y2F0Y2goRXhjZXB0aW9uICRlKXt9CiB9CiAkb1snZmFpbHVvc2UnXT0kcmFkbzsKCiAvKiAzLiBhciB5cmEga2FibGl1a3UsIHR2YXJrYW5jaXUga2F0ZWdvcmlqb3MgYXByYXN5bWEgKi8KICRjaGY9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJzsKIGlmKGlzX3JlYWRhYmxlKCRjaGYpKXsKICAgJGg9YXJyYXkoKTsKICAgZm9yZWFjaChmaWxlKCRjaGYpIGFzICRpPT4kbCl7CiAgICAgaWYocHJlZ19tYXRjaCgnL3Rlcm1fZGVzY3JpcHRpb258cHJvZHVjdF9jYXR8YXJjaGl2ZV9kZXNjcmlwdGlvbnx0YXhvbm9teV9hcmNoaXZlfGNhdGVnb3J5X2Rlc2MvaScsJGwpKQogICAgICAgJGhbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE1MCkpOwogICB9CiAgICRvWydjaGlsZF9mdW5jdGlvbnNfa2FibGl1a2FpJ109YXJyYXlfc2xpY2UoJGgsMCwyNSk7CiAgICRvWydjaGlsZF9mdW5jdGlvbnNfZHlkaXMnXT1maWxlc2l6ZSgkY2hmKTsKIH0KCiAvKiA0LiBNRVRBIFNBQkxPTk8gUEFUQUlTQSAqLwogJHRpdD0oYXJyYXkpZ2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtdGl0bGVzJyk7CiAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZD0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRkKSkgQG1rZGlyKCRkLDA3NTUsdHJ1ZSk7CiBAZmlsZV9wdXRfY29udGVudHMoJGQuJy9yYW5rbWF0aF90aXRsZXNfcHJpZXNfJy5kYXRlKCdZbWRfSGlzJykuJy5qc29uJywgd3BfanNvbl9lbmNvZGUoJHRpdCkpOwogJGtlaXN0aT1hcnJheSgndGF4X3Byb2R1Y3RfY2F0X2Rlc2NyaXB0aW9uJywndGF4X3Byb2R1Y3RfYnJhbmRfZGVzY3JpcHRpb24nLCd0YXhfcHJvZHVjdF90YWdfZGVzY3JpcHRpb24nKTsKICRvWydtZXRhX3BhdGFpc2EnXT1hcnJheSgpOwogZm9yZWFjaCgka2Vpc3RpIGFzICRrKXsKICAgJG9bJ21ldGFfcGF0YWlzYSddWyRrXT1hcnJheSgnYnV2byc9Pmlzc2V0KCR0aXRbJGtdKT8kdGl0WyRrXTpudWxsLCd0YXBvJz0+JycpOwogICAkdGl0WyRrXT0nJzsKIH0KIHVwZGF0ZV9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLXRpdGxlcycsJHRpdCk7CiAkdDI9KGFycmF5KWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLXRpdGxlcycpOwogJG9bJ3BhdGlrcmFfcG8nXT1hcnJheV9pbnRlcnNlY3Rfa2V5KCR0MixhcnJheV9mbGlwKCRrZWlzdGkpKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H029'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H029 hub ivadas + meta',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h029=H029'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  /* patikra: ar kategorijos meta liko tuscias (aprasymu vis tiek nera) */
  await new Promise(r=>setTimeout(r,3000));
  const x=await fetch('https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/');
  const h=await x.text();
  const m=h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  out.kategorijos_meta={http:x.status, ilgis:m?m[1].length:0, tekstas:m?m[1].slice(0,120):''};
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h029.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h029 hub ivadas + meta sablonas');
