process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIyNyddKSB8fCAkX0dFVFsncHNfaDIyNyddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyMjcnKTsKIGZvcmVhY2goYXJyYXkoMzUwMzUsMzUwMzYsMzUwMzcsMzUwMzgsMzUwNDEpIGFzICRpZCl7CiAgICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8peyAkVFsndXpzJ11bJGlkXT0nbmVyYSc7IGNvbnRpbnVlOyB9CiAgICRkPWpzb25fZGVjb2RlKChzdHJpbmcpJG8tPmdldF9tZXRhKCd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnKSwgdHJ1ZSk7CiAgICRzYWw9YXJyYXkoKTsKICAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJHM9JGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpOyBpZigkcykgJHNhbFskc109MTsgfQogICAkcGFzdGFib3M9YXJyYXkoKTsKICAgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjQpKSBhcyAkbil7ICRwYXN0YWJvc1tdPW1iX3N1YnN0cigkbi0+Y29udGVudCwwLDExMCk7IH0KICAgJFRbJ3V6cyddWyRpZF09YXJyYXkoCiAgICAgJ21hbmlmZXN0Jz0+JGRbJ21hbmlmZXN0J10gPz8gJycsCiAgICAgJ3BhY2tzJz0+JGRbJ3BhY2tfbnVtYmVycyddID8/IGFycmF5KCksCiAgICAgJ3NhbHRpbmlhaSc9PmFycmF5X2tleXMoJHNhbCksCiAgICAgJ3JlZ2lzdHJhcyc9PiRvLT5nZXRfbWV0YSgnX3BzX3NpdW50b3MnKSwKICAgICAncGFzdGFib3MnPT4kcGFzdGFib3MsCiAgICk7CiB9CiAkbj1nZXRfb3B0aW9uKCdzaG9wdXBfdmVuaXBha19zaGlwcGluZ19zZXR0aW5ncycsIGFycmF5KCkpOwogJFRbJ3BsdWdpbm9fbWFuaWZlc3RhcyddPSRuWydzaG9wdXBfdmVuaXBha19zaGlwcGluZ19maWVsZF9tYW5pZmVzdCddID8/ICgkblsnbWFuaWZlc3QnXSA/PyAncmFrdGFzIG5lcmFzdGFzOiAnLmltcGxvZGUoJywnLGFycmF5X2tleXMoKGFycmF5KSRuKSkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDUpOwo=';
const out={v:'H227'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H227 manifestai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h227=RUN');
    try{ out.DIEGIMAS=JSON.parse(await d.text()); }catch(e){ out.DIEGIMAS='klaida'; }
    await miegok(2000);
    const d2=await fetch(WP+'/?ps_h227=TEST');
    const t2=await d2.text();
    try{ out.TESTAI=JSON.parse(t2); }catch(e){ out.TESTAI='ne-json: '+t2.slice(0,400); }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h227.json', Buffer.from(JSON.stringify(out,null,1)), 'h227 manifestu reconas');
