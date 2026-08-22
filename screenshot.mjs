process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyogR2F1ZHlrbGU6IHBhZ2F1bmEg4oCeUGFzc2luZyBudWxsIiBwZWRzYWthIGFkbWluIGxhbmdlIGlyIGlyYcWhbyBpIG9wY2lqYS4gKi8KYWRkX2FjdGlvbigncGx1Z2luc19sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzX2FkbWluKCkpIHJldHVybjsKIHNldF9lcnJvcl9oYW5kbGVyKGZ1bmN0aW9uKCRuciwgJHppbiwgJGZhaWxhcywgJGVpbCl7CiAgIGlmKHN0cnBvcygkemluLCAnUGFzc2luZyBudWxsJykgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7CiAgICRidCA9IGRlYnVnX2JhY2t0cmFjZShERUJVR19CQUNLVFJBQ0VfSUdOT1JFX0FSR1MsIDMwKTsKICAgJGtlbGlhcyA9IGFycmF5KCk7CiAgIGZvcmVhY2goJGJ0IGFzICRrKXsKICAgICBpZihlbXB0eSgka1snZnVuY3Rpb24nXSkpIGNvbnRpbnVlOwogICAgICRmID0gaXNzZXQoJGtbJ2ZpbGUnXSkgPyBiYXNlbmFtZSgka1snZmlsZSddKSA6ICc/JzsKICAgICAkbCA9IGlzc2V0KCRrWydsaW5lJ10pID8gJGtbJ2xpbmUnXSA6ICc/JzsKICAgICAka2VsaWFzW10gPSAoaXNzZXQoJGtbJ2NsYXNzJ10pID8gJGtbJ2NsYXNzJ10uJzo6JyA6ICcnKS4ka1snZnVuY3Rpb24nXS4nIEAgJy4kZi4nOicuJGw7CiAgIH0KICAgJHBhcmFzYXMgPSBtZDUoaW1wbG9kZSgnfCcsIGFycmF5X3NsaWNlKCRrZWxpYXMsIDAsIDYpKSk7CiAgICRzZW5hcyA9IGdldF9vcHRpb24oJ3BzX3IyMzBfcGFnYXV0YScsIGFycmF5KCkpOwogICBpZighaXNfYXJyYXkoJHNlbmFzKSkgJHNlbmFzID0gYXJyYXkoKTsKICAgaWYoaXNzZXQoJHNlbmFzWyRwYXJhc2FzXSkpeyAkc2VuYXNbJHBhcmFzYXNdWydraWVrJ10rKzsgfQogICBlbHNlaWYoY291bnQoJHNlbmFzKSA8IDYpewogICAgICRzZW5hc1skcGFyYXNhc10gPSBhcnJheSgna2llayc9PjEsICd6aW51dGUnPT5tYl9zdWJzdHIoJHppbiwwLDkwKSwKICAgICAgICd1cmwnPT5tYl9zdWJzdHIoJF9TRVJWRVJbJ1JFUVVFU1RfVVJJJ10gPz8gJycsIDAsIDkwKSwKICAgICAgICdrZWxpYXMnPT5hcnJheV9zbGljZSgka2VsaWFzLCAwLCAxMikpOwogICB9IGVsc2UgeyByZXR1cm4gdHJ1ZTsgfQogICB1cGRhdGVfb3B0aW9uKCdwc19yMjMwX3BhZ2F1dGEnLCAkc2VuYXMsIGZhbHNlKTsKICAgcmV0dXJuIHRydWU7CiB9LCBFX0FMTCk7Cn0sIDEpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gaXNzZXQoJF9HRVRbJ3BzX3IyMzAnXSkgPyAkX0dFVFsncHNfcjIzMCddIDogJyc7CiBpZigkciAhPT0gJ1NLQUlUWVRJJyAmJiAkciAhPT0gJ1ZBTFlUSScpIHJldHVybjsKIGlmKCRyID09PSAnVkFMWVRJJyl7IGRlbGV0ZV9vcHRpb24oJ3BzX3IyMzBfcGFnYXV0YScpOyAkbyA9IGFycmF5KCd2Jz0+J1IyMzAnLCdpc3ZhbHl0YSc9PidPSycpOyB9CiBlbHNlIHsgJG8gPSBhcnJheSgndic9PidSMjMwJywgJ3BhZ2F1dGEnPT5nZXRfb3B0aW9uKCdwc19yMjMwX3BhZ2F1dGEnLCAnZGFyIG5pZWtvJykpOyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R230'};
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
  /* ar gaudykle jau yra */
  const f0=await fetch(SNIP,{headers:A}); let visi=[]; try{visi=JSON.parse(await f0.text());}catch(e){}
  const esama=Array.isArray(visi)?visi.find(s=>String(s.name||'').indexOf('ZZ R230')===0):null;
  let id=null;
  if(esama){
    await fetch(SNIP+'/'+esama.id,{method:'POST',headers:A,body:JSON.stringify({id:esama.id,code:Buffer.from(B64,'base64').toString('utf8'),active:true})});
    id=esama.id; out.atnaujinta=id;
  } else {
    const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'ZZ R230 Null gaudykle',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:1})});
    let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
    id=j&&j.id?j.id:null; out.sukurta=id||{s:c.status,t:ct.slice(0,200)};
  }
  if(id){
    await miegok(6000);
    const v=await fetch(WP+'/?ps_r230=VALYTI'); try{ out.valymas=JSON.parse(await v.text()); }catch(e){}
    const s=await fetch(WP+'/?ps_r230=SKAITYTI'); try{ out.busena=JSON.parse(await s.text()); }catch(e){}
    out.gaudykle='AKTYVI — laukiam paspaudimo';
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r230.json', Buffer.from(JSON.stringify(out,null,1)), 'r230 gaudykle');
