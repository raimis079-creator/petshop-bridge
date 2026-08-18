process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAxNCddKT8kX0dFVFsncHNfaDAxNCddOicnKSE9PSdIMDE0JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMTQnKTsKICRkaXIgPSBXUF9QTFVHSU5fRElSLicvc2VvLWJ5LXJhbmstbWF0aCc7CgogLyogMS4gUmVnaXN0cmF0aW9uIGtsYXNlIOKAlCBrdXIgbnVzdGF0b21hcyAkaW52YWxpZCAqLwogJGY9JGRpci4nL2luY2x1ZGVzL2FkbWluL2NsYXNzLXJlZ2lzdHJhdGlvbi5waHAnOwogJG9bJ3JlZ19mYWlsYXMnXT1pc19yZWFkYWJsZSgkZik/MTowOwogaWYoaXNfcmVhZGFibGUoJGYpKXsKICAgJGxuPWZpbGUoJGYpOyAkaGl0cz1hcnJheSgpOwogICBmb3JlYWNoKCRsbiBhcyAkaT0+JGwpewogICAgIGlmKHByZWdfbWF0Y2goJy9pbnZhbGlkfGlzX2NvbmZpZ3VyZWR8Y29ubmVjdF9kYXRhfHJlZ2lzdHJhdGlvbl9za2lwfHNraXAvaScsJGwpKSAkaGl0c1tdPSgkaSsxKS4nOiAnLnRyaW0oJGwpOwogICB9CiAgICRvWydyZWdfZWlsdXRlcyddPWFycmF5X3NsaWNlKCRoaXRzLDAsNDApOwogfQogLyogMi4ga2FzIGlzc2F1Z29tYSBwYWJhaWd1cyB2ZWRsaSAqLwogZm9yZWFjaChhcnJheSgnL2luY2x1ZGVzL3Jlc3QvY2xhc3Mtc2V0dXAtd2l6YXJkLnBocCcsJy9pbmNsdWRlcy9hZG1pbi93aXphcmQvY2xhc3Mtd2l6YXJkLnBocCcpIGFzICRyZWwpewogICAkeD0kZGlyLiRyZWw7IGlmKCFpc19yZWFkYWJsZSgkeCkpIGNvbnRpbnVlOwogICAkbG49ZmlsZSgkeCk7ICRoPWFycmF5KCk7CiAgIGZvcmVhY2goJGxuIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9pc19jb25maWd1cmVkfHVwZGF0ZV9vcHRpb258cmFua19tYXRoXy9pJywkbCkpICRoW109KCRpKzEpLic6ICcudHJpbSgkbCk7IH0KICAgJG9bJ3ZlZGx5cycuJHJlbF09YXJyYXlfc2xpY2UoJGgsMCwzMCk7CiB9CiAvKiAzLiB2aXNvcyB2aWV0b3MsIGt1ciBrdmllc3RhIGlzX2NvbmZpZ3VyZWQoIHRydWUgKSAqLwogJGZvdW5kPWFycmF5KCk7CiAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIpKTsKICRuPTA7CiBmb3JlYWNoKCRpdCBhcyAkZmlsZSl7CiAgIGlmKCRuPjQwMDApIGJyZWFrOyAkbisrOwogICBpZighJGZpbGUtPmlzRmlsZSgpIHx8IHN1YnN0cigkZmlsZS0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAkcz1AZmlsZV9nZXRfY29udGVudHMoJGZpbGUtPmdldFBhdGhuYW1lKCkpOwogICBpZigkcz09PWZhbHNlKSBjb250aW51ZTsKICAgaWYoc3RycG9zKCRzLCdpc19jb25maWd1cmVkKCB0cnVlJykhPT1mYWxzZSB8fCBzdHJwb3MoJHMsJ2lzX2NvbmZpZ3VyZWQodHJ1ZScpIT09ZmFsc2UpewogICAgIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRzKSBhcyAkaT0+JGwpewogICAgICAgaWYoc3RycG9zKCRsLCdpc19jb25maWd1cmVkKCB0cnVlJykhPT1mYWxzZXx8c3RycG9zKCRsLCdpc19jb25maWd1cmVkKHRydWUnKSE9PWZhbHNlKQogICAgICAgICAkZm91bmRbXT1zdHJfcmVwbGFjZShXUF9QTFVHSU5fRElSLCcnLCRmaWxlLT5nZXRQYXRobmFtZSgpKS4nOicuKCRpKzEpLicgJy50cmltKCRsKTsKICAgICB9CiAgIH0KIH0KICRvWydpc19jb25maWd1cmVkX3RydWUnXT1hcnJheV9zbGljZSgkZm91bmQsMCwxNSk7CiAkb1snZmFpbHVfcGVyeml1cmV0YSddPSRuOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H014'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H014 RM registracija',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h014=H014'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,800); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h014.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h014 rm vartai');
