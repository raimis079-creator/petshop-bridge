process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAyMSddKT8kX0dFVFsncHNfaDAyMSddOicnKSE9PSdIMDIxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMjEnKTsKCiAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF90aXRsZSxwLnBvc3RfZXhjZXJwdCxwLnBvc3RfY29udGVudCwKICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0ncmFua19tYXRoX2Rlc2NyaXB0aW9uJyBMSU1JVCAxKSBybWQKICAgRlJPTSB7JFB9cG9zdHMgcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIiwgQVJSQVlfQSk7CiAkb1sncHJla2l1J109Y291bnQoJHJvd3MpOwoKIC8qIHZpcnN1dGluZXMga2F0ZWdvcmlqb3Mga2lla3ZpZW5haSBwcmVrZWkgKi8KICR2aXI9YXJyYXkoKTsKICR0dD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0ci5vYmplY3RfaWQgb2lkLCB0Lm5hbWUsIHR0LnBhcmVudCwgdHQudGVybV9pZAogICBGUk9NIHskUH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIKICAgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcKICAgSk9JTiB7JFB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCIsIEFSUkFZX0EpOwogJHRldmFzPWFycmF5KCk7ICR2YXJkYXM9YXJyYXkoKTsKIGZvcmVhY2goJHR0IGFzICRyKXsgJHRldmFzWyhpbnQpJHJbJ3Rlcm1faWQnXV09KGludCkkclsncGFyZW50J107ICR2YXJkYXNbKGludCkkclsndGVybV9pZCddXT0kclsnbmFtZSddOyB9CiAkc2FyYXNhcz1hcnJheSgpOwogZm9yZWFjaCgkdHQgYXMgJHIpeyAkc2FyYXNhc1soaW50KSRyWydvaWQnXV1bXT0oaW50KSRyWyd0ZXJtX2lkJ107IH0KICRzYWtuaXM9ZnVuY3Rpb24oJGlkKSB1c2UgKCR0ZXZhcyl7ICRnPTA7IHdoaWxlKGlzc2V0KCR0ZXZhc1skaWRdKSAmJiAkdGV2YXNbJGlkXT4wICYmICRnPDEwKXsgJGlkPSR0ZXZhc1skaWRdOyAkZysrOyB9IHJldHVybiAkaWQ7IH07CgogJGlsZz1mdW5jdGlvbigkcyl7IHJldHVybiBtYl9zdHJsZW4odHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLHdwX3N0cmlwX2FsbF90YWdzKGh0bWxfZW50aXR5X2RlY29kZSgoc3RyaW5nKSRzLEVOVF9RVU9URVMsJ1VURi04JykpKSkpOyB9OwoKICRCPWFycmF5KCk7ICRzYWx0aW5pYWk9YXJyYXkoJ3NhdmFfbWV0YSc9PjAsJ2V4Y2VycHQnPT4wLCdjb250ZW50Jz0+MCwnbmlla28nPT4wKTsKICRrYXQ9YXJyYXkoKTsKICRzaWxwbm9zPWFycmF5KCk7CgogZm9yZWFjaCgkcm93cyBhcyAkcil7CiAgICRzcmM9Jyc7ICR0eHQ9Jyc7CiAgIGlmKHRyaW0oKHN0cmluZykkclsncm1kJ10pIT09JycpeyAkc3JjPSdzYXZhX21ldGEnOyAkdHh0PSRyWydybWQnXTsgfQogICBlbHNlaWYodHJpbSgoc3RyaW5nKSRyWydwb3N0X2V4Y2VycHQnXSkhPT0nJyl7ICRzcmM9J2V4Y2VycHQnOyAkdHh0PSRyWydwb3N0X2V4Y2VycHQnXTsgfQogICBlbHNlaWYodHJpbSgoc3RyaW5nKSRyWydwb3N0X2NvbnRlbnQnXSkhPT0nJyl7ICRzcmM9J2NvbnRlbnQnOyAkdHh0PSRyWydwb3N0X2NvbnRlbnQnXTsgfQogICBlbHNlIHsgJHNyYz0nbmlla28nOyB9CiAgICRzYWx0aW5pYWlbJHNyY10rKzsKICAgJEw9JGlsZygkdHh0KTsKICAgJGIgPSAkTDw3MCA/ICdzaWxwbmFfcG9fNzAnIDogKCRMPD0xNjAgPyAnZ2VyYV83MF8xNjAnIDogJ2lsZ2Ffdmlyc18xNjAnKTsKICAgaWYoJHNyYz09PSduaWVrbycpICRiPSdzaWxwbmFfcG9fNzAnOwogICAkQlskYl09KGlzc2V0KCRCWyRiXSk/JEJbJGJdOjApKzE7CgogICAkaz0nKGJlIGthdGVnb3Jpam9zKSc7CiAgIGlmKCFlbXB0eSgkc2FyYXNhc1soaW50KSRyWydJRCddXSkpewogICAgICRzPSRzYWtuaXMoJHNhcmFzYXNbKGludCkkclsnSUQnXV1bMF0pOwogICAgICRrPWlzc2V0KCR2YXJkYXNbJHNdKT8kdmFyZGFzWyRzXTonKD8pJzsKICAgfQogICBpZighaXNzZXQoJGthdFska10pKSAka2F0WyRrXT1hcnJheSgndmlzbyc9PjAsJ3NpbHBuYSc9PjApOwogICAka2F0WyRrXVsndmlzbyddKys7CiAgIGlmKCRiPT09J3NpbHBuYV9wb183MCcpewogICAgICRrYXRbJGtdWydzaWxwbmEnXSsrOwogICAgIGlmKGNvdW50KCRzaWxwbm9zKTwxMCkgJHNpbHBub3NbXT1hcnJheSgnaWQnPT4oaW50KSRyWydJRCddLCdrYXQnPT4kaywnc3JjJz0+JHNyYywnaWxnJz0+JEwsCiAgICAgICAncGF2Jz0+bWJfc3Vic3RyKChzdHJpbmcpJHJbJ3Bvc3RfdGl0bGUnXSwwLDU1KSwndHh0Jz0+bWJfc3Vic3RyKHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyx3cF9zdHJpcF9hbGxfdGFncygoc3RyaW5nKSR0eHQpKSksMCw5MCkpOwogICB9CiB9CiBhcnNvcnQoJEIpOwogdWFzb3J0KCRrYXQsZnVuY3Rpb24oJGEsJGIpeyByZXR1cm4gJGJbJ3NpbHBuYSddLSRhWydzaWxwbmEnXTsgfSk7CiAkb1snaWxnaW9fZ3J1cGVzJ109JEI7ICRvWydzYWx0aW5pYWknXT0kc2FsdGluaWFpOwogJG9bJ3BhZ2FsX2thdGVnb3JpamEnXT1hcnJheV9zbGljZSgka2F0LDAsMTQsdHJ1ZSk7CiAkb1snc2lscG51X3Bhdnl6ZHppYWknXT0kc2lscG5vczsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H021'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H021 desc danga',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h021=H021'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h021.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h021 desc danga');
