process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4MTUnXSk/JF9HRVRbJ3BzX2c4MTUnXTonJykgIT09ICdHODE1JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4MTUnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aScpKTsKCiAvKiAxLiBLVVIgTUlOSU1BUyBCQVJDT0RFIHBldHNob3AteG1sIHBsdWdpbtC1ICovCiAkYmFzZT1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwnOwogJGhpdHM9YXJyYXkoKTsgJGZpbGVzPWFycmF5KCk7CiAkcmlpPW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkYmFzZSkpOwogZm9yZWFjaCgkcmlpIGFzICRmKXsKICAgaWYoJGYtPmlzRGlyKCkgfHwgc3Vic3RyKCRmLT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJykgY29udGludWU7CiAgICRyZWw9c3RyX3JlcGxhY2UoJGJhc2UuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKTsgJGZpbGVzWyRyZWxdPSRmLT5nZXRTaXplKCk7CiAgICRzcmM9ZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICBpZihzdHJpcG9zKCRzcmMsJ2JhcmNvZGUnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJHNyYywnZWFuJykhPT1mYWxzZSl7CiAgICAgJGxpbmVzPWV4cGxvZGUoIlxuIiwkc3JjKTsKICAgICBmb3JlYWNoKCRsaW5lcyBhcyAkaT0+JEwpewogICAgICAgaWYoc3RyaXBvcygkTCwnYmFyY29kZScpIT09ZmFsc2UgfHwgcHJlZ19tYXRjaCgnL1teYS16X11lYW5bXmEtel0vaScsJEwpIHx8IHN0cmlwb3MoJEwsJ2dsb2JhbF91bmlxdWUnKSE9PWZhbHNlKXsKICAgICAgICAgJGhpdHNbXT1hcnJheSgnZic9PiRyZWwsJ25yJz0+JGkrMSwna29kYXMnPT50cmltKHN1YnN0cigkTCwwLDE5MCkpKTsKICAgICAgIH0KICAgICB9CiAgIH0KIH0KICRvWyd4bWxfZmFpbGFpJ109JGZpbGVzOyAkb1snYmFyY29kZV9laWx1dGVzJ109YXJyYXlfc2xpY2UoJGhpdHMsMCw4MCk7ICRvWydiYXJjb2RlX3Zpc28nXT1jb3VudCgkaGl0cyk7CgogLyogMi4gVkYgWE1MIHNhbHRpbmlvIGFkcmVzYXMgKi8KICRvWyd2Zl9vcGNpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDIyMCkgdiBGUk9NIHskUH1vcHRpb25zCiAgIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV2ZiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV2ZXRmYXJtJScgT1JERVIgQlkgb3B0aW9uX25hbWUgTElNSVQgNDAiLCBBUlJBWV9BKTsKIC8qIFdQIEFsbCBJbXBvcnQga29uZmlnYWkgKi8KICR0PSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICclcG14aV9pbXBvcnRzJSciKTsKIGlmKCR0KXsKICAgJG9bJ2ltcG9ydGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIG5hbWUsIExFRlQocGF0aCwxODApIHBhdGgsIHR5cGUsIHJlZ2lzdGVyZWRfb24gRlJPTSB7JHRbMF19IE9SREVSIEJZIGlkIiwgQVJSQVlfQSk7CiB9CgogLyogMy4gS29raWUgbWV0YSByYWt0YWkgYXRrZWxpYXVqYSBpcyBWRiAqLwogJG9bJ3ZmX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSwgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICdcXF92ZlxcXyUnIEdST1VQIEJZIG1ldGFfa2V5IE9SREVSIEJZIG4gREVTQyBMSU1JVCAyNSIsIEFSUkFZX0EpOwoKIC8qIDQuIE5lc3V0YXBpbXUgZ2lsZXNuaXMgcGp1dmlzOiBhciBfZWFuIHRva2lvbXMgcHJla2VtcyBpcyBsZWdhY3kgKi8KICRvWyduZXN1dGFwaW11X2tvbnRla3N0YXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBMRUZUKHAucG9zdF90aXRsZSw0MCkgcGF2LAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfZWFuJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGVhbiwKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3ZmX2JhcmNvZGUnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgdmYsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19za3UnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgc2t1LAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfdmZfc3VwcGxpZXJfc2t1JyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHZmc2t1LAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfbGVnYWN5X3NvdXJjZScgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBsZWcsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBzYW5kCiAgRlJPTSB7JFB9cG9zdHMgcCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklECiAgV0hFUkUgcC5JRCBJTiAoMTc5NDcsMTc5NTAsMTc5NjIsMTc5NjksMTgwMDAsMTgwMTgsMTgwMjIsMTgwNDYsMTgwNTQsMTc5NTksMTc5NjUpIEdST1VQIEJZIHAuSUQiLCBBUlJBWV9BKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G815'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }

/* GOOGLE SA — antras bandymas */
out.google={};
try{
  let raw=(process.env.GTM_SA_JSON||'').trim();
  out.google.ilgis=raw.length; out.google.pirmas=raw.slice(0,1); out.google.paskutinis=raw.slice(-1);
  let sa=null;
  try{ sa=JSON.parse(raw); out.google.formatas='json'; }
  catch(e){
    try{ sa=JSON.parse(Buffer.from(raw,'base64').toString('utf8')); out.google.formatas='base64'; }
    catch(e2){
      try{ sa=JSON.parse(raw.replace(/\n/g,'\\n')); out.google.formatas='escaped'; }
      catch(e3){ out.google.formatas='neatpazintas'; out.google.klaida1=String(e).slice(0,120); }
    }
  }
  if(sa && sa.client_email){
    out.google.client_email=sa.client_email; out.google.project=sa.project_id;
    const now=Math.floor(Date.now()/1000);
    const hdr=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
    const cl=Buffer.from(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/content',aud:'https://oauth2.googleapis.com/token',exp:now+3600,iat:now})).toString('base64url');
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+cl).sign(sa.private_key).toString('base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+hdr+'.'+cl+'.'+sig});
    const tj=await tr.json(); out.google.token_status=tr.status;
    if(tj.access_token){
      const ai=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/accounts/authinfo',{headers:{Authorization:'Bearer '+tj.access_token}});
      out.google.authinfo_status=ai.status; out.google.authinfo=(await ai.text()).slice(0,800);
    } else out.google.token_klaida=JSON.stringify(tj).slice(0,300);
  }
}catch(e){ out.google.klaida=String(e).slice(0,250); }

try{
  const s=await snip('TEMP G815 VF saltinis',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g815=G815')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,600); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g815.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g815 vf saltinis');
