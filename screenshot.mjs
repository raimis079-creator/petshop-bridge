process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAyMCddKT8kX0dFVFsncHNfaDAyMCddOicnKSE9PSdIMDIwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMjAnKTsKCiAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF90aXRsZSxwLnBvc3RfZXhjZXJwdCxwLnBvc3RfY29udGVudCxwLnBvc3Rfc3RhdHVzLG0ubWV0YV92YWx1ZSBkCiAgIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZAogICBXSEVSRSBtLm1ldGFfa2V5PSdyYW5rX21hdGhfZGVzY3JpcHRpb24nIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCciLCBBUlJBWV9BKTsKICRvWydpcmFzdSddPWNvdW50KCRyb3dzKTsKCiAkbm9ybT1mdW5jdGlvbigkcyl7CiAgICRzPXdwX3N0cmlwX2FsbF90YWdzKGh0bWxfZW50aXR5X2RlY29kZSgoc3RyaW5nKSRzLEVOVF9RVU9URVMsJ1VURi04JykpOwogICAkcz1tYl9zdHJ0b2xvd2VyKCRzLCdVVEYtOCcpOwogICAkcz1wcmVnX3JlcGxhY2UoJy9bXlxwe0x9XHB7Tn1dKy91JywnICcsJHMpOwogICByZXR1cm4gdHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLCRzKSk7CiB9OwogJHpvZD1mdW5jdGlvbigkcykgdXNlICgkbm9ybSl7CiAgICRhPWV4cGxvZGUoJyAnLCRub3JtKCRzKSk7CiAgICRhPWFycmF5X2ZpbHRlcigkYSxmdW5jdGlvbigkeCl7IHJldHVybiBtYl9zdHJsZW4oJHgpPjI7IH0pOwogICByZXR1cm4gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkYSkpOwogfTsKCiAkQj1hcnJheSgnYXRrYXJ0b2ppbWFzJz0+MCwncmliaW5pcyc9PjAsJ3Rpa3Jhcyc9PjApOwogJHB2PWFycmF5KCdhdGthcnRvamltYXMnPT5hcnJheSgpLCdyaWJpbmlzJz0+YXJyYXkoKSwndGlrcmFzJz0+YXJyYXkoKSk7CiAkcHVibGlzaD1hcnJheSgnYXRrYXJ0b2ppbWFzJz0+MCwncmliaW5pcyc9PjAsJ3Rpa3Jhcyc9PjApOwogJGJlX3Bha2FpdGFsbz0wOwoKIGZvcmVhY2goJHJvd3MgYXMgJHIpewogICAkZD0oc3RyaW5nKSRyWydkJ107ICR0PShzdHJpbmcpJHJbJ3Bvc3RfdGl0bGUnXTsKICAgJHpkPSR6b2QoJGQpOyAkenQ9JHpvZCgkdCk7CiAgICRiZW5kcmk9MDsgZm9yZWFjaCgkemQgYXMgJHcpeyBpZihpbl9hcnJheSgkdywkenQsdHJ1ZSkpICRiZW5kcmkrKzsgfQogICAkZGVuZ2ltYXMgPSBjb3VudCgkemQpPjAgPyAkYmVuZHJpL2NvdW50KCR6ZCkgOiAxOwogICAkc2FraW5pYWkgPSBwcmVnX21hdGNoX2FsbCgnL1suIT9dKFxzfCQpL3UnLCRkKTsKICAgJHRhcGF0dXMgPSAoJG5vcm0oJGQpPT09JG5vcm0oJHQpKTsKCiAgIGlmKCR0YXBhdHVzIHx8ICgkZGVuZ2ltYXM+PTAuODUgJiYgJHNha2luaWFpPD0xKSkgJGI9J2F0a2FydG9qaW1hcyc7CiAgIGVsc2VpZigkZGVuZ2ltYXM+PTAuNjAgJiYgJHNha2luaWFpPD0xKSAkYj0ncmliaW5pcyc7CiAgIGVsc2UgJGI9J3Rpa3Jhcyc7CgogICAkQlskYl0rKzsKICAgaWYoJHJbJ3Bvc3Rfc3RhdHVzJ109PT0ncHVibGlzaCcpICRwdWJsaXNoWyRiXSsrOwoKICAgLyogYXIgYnV0dSBrdW8gcGFrZWlzdGkgKi8KICAgaWYoJGIhPT0ndGlrcmFzJyl7CiAgICAgJHBhaz10cmltKHdwX3N0cmlwX2FsbF90YWdzKCRyWydwb3N0X2V4Y2VycHQnXSkpOwogICAgIGlmKCRwYWs9PT0nJykgJHBhaz10cmltKHdwX3N0cmlwX2FsbF90YWdzKCRyWydwb3N0X2NvbnRlbnQnXSkpOwogICAgIGlmKG1iX3N0cmxlbigkcGFrKTw0MCkgJGJlX3Bha2FpdGFsbysrOwogICB9CiAgIGlmKGNvdW50KCRwdlskYl0pPDgpewogICAgICRwYWs9dHJpbSh3cF9zdHJpcF9hbGxfdGFncygkclsncG9zdF9leGNlcnB0J10pKTsKICAgICBpZigkcGFrPT09JycpICRwYWs9dHJpbSh3cF9zdHJpcF9hbGxfdGFncygkclsncG9zdF9jb250ZW50J10pKTsKICAgICAkcHZbJGJdW109YXJyYXkoJ2lkJz0+KGludCkkclsnSUQnXSwnc3QnPT4kclsncG9zdF9zdGF0dXMnXSwKICAgICAgICdkZW5nJz0+cm91bmQoJGRlbmdpbWFzLDIpLCdzYWsnPT4kc2FraW5pYWksCiAgICAgICAncGF2Jz0+bWJfc3Vic3RyKCR0LDAsNjApLAogICAgICAgJ2Rlc2MnPT5tYl9zdWJzdHIoJGQsMCwxNTApLAogICAgICAgJ3Bha2FpdGFsYXMnPT5tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJywkcGFrKSwwLDE1MCkpOwogICB9CiB9CiAkb1snZ3J1cGVzX3Zpc28nXT0kQjsgJG9bJ2dydXBlc19wdWJsaXNoJ109JHB1Ymxpc2g7CiAkb1snYmVfcGFrYWl0YWxvJ109JGJlX3Bha2FpdGFsbzsKICRvWydwYXZ5emR6aWFpJ109JHB2OwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H020'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H020 desc matavimas',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h020=H020'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h020.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h020 desc matavimas');
