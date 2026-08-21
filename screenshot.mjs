process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwNCddKSA/ICRfR0VUWydwc19yMjA0J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwNCcpOwoKIC8qIDEuIFZpc2kgbWVuaXUgaXIganUgcHVua3RhaSwga3VyaXVvc2UgbWluaW1hcyDigJ5TdXNpZGVrIiBhcmJhIOKAnnJpbmtpbiIgKi8KICRtZW5pdSA9IHdwX2dldF9uYXZfbWVudXMoKTsKICRzYXIgPSBhcnJheSgpOwogZm9yZWFjaCgkbWVuaXUgYXMgJG0pewogICAkaXRlbXMgPSB3cF9nZXRfbmF2X21lbnVfaXRlbXMoJG0tPnRlcm1faWQpOwogICBpZighJGl0ZW1zKSBjb250aW51ZTsKICAgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsKICAgICBpZihzdHJpcG9zKCRpdC0+dGl0bGUsJ3VzaWQnKSA9PT0gZmFsc2UgJiYgc3RyaXBvcygkaXQtPnRpdGxlLCdpbmtpbicpID09PSBmYWxzZSkgY29udGludWU7CiAgICAgJHNhcltdID0gYXJyYXkoCiAgICAgICAnbWVuaXUnPT4kbS0+bmFtZSwKICAgICAgICdkYl9pZCc9PihpbnQpJGl0LT5kYl9pZCwKICAgICAgICd0ZXZhcyc9PihpbnQpJGl0LT5tZW51X2l0ZW1fcGFyZW50LAogICAgICAgJ3RpdGxlJz0+JGl0LT50aXRsZSwKICAgICAgICd0eXBlJz0+JGl0LT50eXBlLAogICAgICAgJ29iamVjdCc9PiRpdC0+b2JqZWN0LAogICAgICAgJ29iamVjdF9pZCc9PihpbnQpJGl0LT5vYmplY3RfaWQsCiAgICAgICAndXJsJz0+JGl0LT51cmwsCiAgICAgICAndGFpa2luaW9fYnVzZW5hJz0+KCRpdC0+b2JqZWN0X2lkICYmIGdldF9wb3N0KCRpdC0+b2JqZWN0X2lkKSkgPyBnZXRfcG9zdF9zdGF0dXMoJGl0LT5vYmplY3RfaWQpIDogJ05FUkEgSVJBU08nLAogICAgICAgJ3RhaWtpbmlvX251b3JvZGEnPT4oJGl0LT5vYmplY3RfaWQgJiYgZ2V0X3Bvc3QoJGl0LT5vYmplY3RfaWQpKSA/IGdldF9wZXJtYWxpbmsoJGl0LT5vYmplY3RfaWQpIDogJycsCiAgICAgKTsKICAgfQogfQogJG9bJ21lbml1X3B1bmt0YWknXSA9ICRzYXI7CgogLyogMi4gTGF1a2FpOiBpZWppbWFpLCBtYXRvbXVtYXMsIG51b3JvZG9zICovCiAkaWRzID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19sYXVrYXMnIEFORCBtZXRhX3ZhbHVlPSd5ZXMnIik7CiAkciA9IGFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJHAgPSB3Y19nZXRfcHJvZHVjdCgkaWQpOwogICAkcltdID0gYXJyYXkoCiAgICAgJ0lEJz0+KGludCkkaWQsCiAgICAgJ3Bhdic9PmdldF90aGVfdGl0bGUoJGlkKSwKICAgICAnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJGlkKSwKICAgICAnZ3J1cGUnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfTGF1a2FpJykgPyBQZXRzaG9wX0xhdWthaTo6Z3J1cGUoJGlkKSA6ICcnLAogICAgICdpZWppbWFzJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfaWVqaW1hcycsdHJ1ZSksCiAgICAgJ21hdG9tdW1hcyc9PiRwID8gJHAtPmdldF9jYXRhbG9nX3Zpc2liaWxpdHkoKSA6ICcnLAogICAgICdudW9yb2RhJz0+Z2V0X3Blcm1hbGluaygkaWQpLAogICAgICdzbHVnJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbmFtZScsJGlkKSwKICAgKTsKIH0KICRvWydsYXVrYWknXSA9ICRyOwoKIC8qIDMuIEFyIGVnemlzdHVvamEgcHVzbGFwaWFpL2thdGVnb3Jpam9zIHRva2lhaXMgc2x1ZydhaXMgKi8KICR0aWtyaW50aSA9IGFycmF5KCdzdXNpZGVrLWtvbnNlcnZ1LXJpbmtpbmktc3VuaW1zJywnc3VzaWRlay1rb25zZXJ2dS1yaW5raW5pLWthdGVtcycsCiAgICdzdXNpZGVrLXNrYW5lc3R1LXJpbmtpbmktc3VuaW1zJywnc3VzaWRlay1za2FuZXN0dS1yaW5raW5pLWthdGVtcycsJ3N1c2lkZWsta3JhbXRhbHUtcmlua2luaS1zdW5pbXMnKTsKICR0ID0gYXJyYXkoKTsKIGZvcmVhY2goJHRpa3JpbnRpIGFzICRzKXsKICAgJHBnID0gZ2V0X3BhZ2VfYnlfcGF0aCgkcywgT0JKRUNULCBhcnJheSgncGFnZScsJ3Byb2R1Y3QnKSk7CiAgICR0cm0gPSBnZXRfdGVybV9ieSgnc2x1ZycsJHMsJ3Byb2R1Y3RfY2F0Jyk7CiAgICR0WyRzXSA9IGFycmF5KCdpcmFzYXMnPT4kcGc/KCRwZy0+cG9zdF90eXBlLicjJy4kcGctPklELicgJy4kcGctPnBvc3Rfc3RhdHVzKTonbmUnLCAna2F0ZWdvcmlqYSc9PiR0cm0/KCd0ZXJtIycuJHRybS0+dGVybV9pZCk6J25lJyk7CiB9CiAkb1snc2x1Z19wYXRpa3JhJ10gPSAkdDsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKIGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R204'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'TEMP R204 Meniu recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r204=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,500); }
    /* HTTP statusai kiekvienam meniu URL */
    if(out.DUOM && out.DUOM.meniu_punktai){
      out.statusai=[];
      for(const it of out.DUOM.meniu_punktai){
        if(!it.url || it.url.indexOf('http')!==0) continue;
        try{ const q=await fetch(it.url,{redirect:'manual'}); out.statusai.push({t:it.title, url:it.url, s:q.status, loc:q.headers.get('location')||''}); }
        catch(e){ out.statusai.push({t:it.title, url:it.url, klaida:String(e).slice(0,80)}); }
      }
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r204.json', Buffer.from(JSON.stringify(out,null,1)), 'r204 meniu recon');
