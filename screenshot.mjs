process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyOSddKSA/ICRfR0VUWydwc19yMjI5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyOScpOwoKICRwYWdhdXRhID0gYXJyYXkoKTsKIHNldF9lcnJvcl9oYW5kbGVyKGZ1bmN0aW9uKCRuciwgJHppbiwgJGZhaWxhcywgJGVpbCkgdXNlICgmJHBhZ2F1dGEpewogICBpZihzdHJwb3MoJHppbiwgJ1Bhc3NpbmcgbnVsbCcpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlOwogICAkYnQgPSBkZWJ1Z19iYWNrdHJhY2UoREVCVUdfQkFDS1RSQUNFX0lHTk9SRV9BUkdTLCAyNSk7CiAgICRrZWxpYXMgPSBhcnJheSgpOwogICBmb3JlYWNoKCRidCBhcyAkayl7CiAgICAgaWYoZW1wdHkoJGtbJ2Z1bmN0aW9uJ10pKSBjb250aW51ZTsKICAgICAkZiA9IGlzc2V0KCRrWydmaWxlJ10pID8gYmFzZW5hbWUoJGtbJ2ZpbGUnXSkgOiAnPyc7CiAgICAgJGwgPSBpc3NldCgka1snbGluZSddKSA/ICRrWydsaW5lJ10gOiAnPyc7CiAgICAgJGtsID0gaXNzZXQoJGtbJ2NsYXNzJ10pID8gJGtbJ2NsYXNzJ10uJzo6JyA6ICcnOwogICAgICRrZWxpYXNbXSA9ICRrbC4ka1snZnVuY3Rpb24nXS4nIEAgJy4kZi4nOicuJGw7CiAgIH0KICAgLyogaW1hbSBUSUsgbXVzdSBrb2RhIOKAlCBicmFuZHVvbGlvIHRyaXVrc21hIHByYWxlaWR6aWFtICovCiAgICRtdXN1ID0gYXJyYXkoKTsKICAgZm9yZWFjaCgka2VsaWFzIGFzICR4KXsgaWYoc3RyaXBvcygkeCwncGV0c2hvcCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkeCwnZmxhdHNvbWUnKSE9PWZhbHNlKSAkbXVzdVtdID0gJHg7IH0KICAgJHBhcmFzYXMgPSBtZDUoaW1wbG9kZSgnfCcsIGFycmF5X3NsaWNlKCRrZWxpYXMsIDAsIDYpKSk7CiAgIGlmKCFpc3NldCgkcGFnYXV0YVskcGFyYXNhc10pKXsKICAgICAkcGFnYXV0YVskcGFyYXNhc10gPSBhcnJheSgnemludXRlJz0+bWJfc3Vic3RyKCR6aW4sMCw5MCksICdraWVrJz0+MCwKICAgICAgICdtdXN1Jz0+YXJyYXlfc2xpY2UoJG11c3UsIDAsIDYpLCAndmlzYXMnPT5hcnJheV9zbGljZSgka2VsaWFzLCAwLCAxMCkpOwogICB9CiAgICRwYWdhdXRhWyRwYXJhc2FzXVsna2llayddKys7CiAgIHJldHVybiB0cnVlOwogfSwgRV9BTEwpOwoKIC8qIGF0a3VyaWFtIHRhIHBhdGksIGthIGRhcm8gYWRtaW4gbGFuZ2FzICovCiB3cF9zZXRfY3VycmVudF91c2VyKDEpOwogJG9bJ3ZhcnRvdG9qYXMnXSA9IHdwX2dldF9jdXJyZW50X3VzZXIoKS0+dXNlcl9sb2dpbjsKICRvWydrbGFzZSddID0gY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thdGFsb2dhcycpID8gJ3lyYScgOiAnTkVSQSc7CgogaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thdGFsb2dhcycpKXsKICAgJHIgPSBuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0thdGFsb2dhcycpOwogICAkb1snbWV0b2RhaSddID0gYXJyYXkoKTsKICAgZm9yZWFjaCgkci0+Z2V0TWV0aG9kcygpIGFzICRtKXsKICAgICBpZigkbS0+Y2xhc3MgIT09ICdQZXRzaG9wX0thdGFsb2dhcycpIGNvbnRpbnVlOwogICAgICRvWydtZXRvZGFpJ11bXSA9ICgkbS0+aXNTdGF0aWMoKT8nc3RhdGljICc6JycpLiRtLT5nZXROYW1lKCkuJygnLmNvdW50KCRtLT5nZXRQYXJhbWV0ZXJzKCkpLicpJzsKICAgfQogICAvKiBiYW5kb20gZHVvbWVudSByaW5rZWphIOKAlCB0aWsgc2thaXR5bWFzICovCiAgIGZvcmVhY2goYXJyYXkoJ2R1b21lbnlzJywnZWlsdXRlcycsJ3ByZWtlcycsJ3Jpbmt0aScsJ3NhcmFzYXMnKSBhcyAka2FuZCl7CiAgICAgaWYoJHItPmhhc01ldGhvZCgka2FuZCkpewogICAgICAgdHJ5ewogICAgICAgICAkbSA9ICRyLT5nZXRNZXRob2QoJGthbmQpOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICAgICAgb2Jfc3RhcnQoKTsKICAgICAgICAgJHJleiA9ICRtLT5nZXROdW1iZXJPZlJlcXVpcmVkUGFyYW1ldGVycygpPT09MAogICAgICAgICAgID8gKCRtLT5pc1N0YXRpYygpID8gJG0tPmludm9rZShudWxsKSA6IG51bGwpIDogbnVsbDsKICAgICAgICAgb2JfZW5kX2NsZWFuKCk7CiAgICAgICAgICRvWydiYW5keXRhJ10gPSAka2FuZDsKICAgICAgICAgJG9bJ3JlenVsdGF0b190aXBhcyddID0gaXNfYXJyYXkoJHJleikgPyAnYXJyYXkoJy5jb3VudCgkcmV6KS4nKScgOiBnZXR0eXBlKCRyZXopOwogICAgICAgICBicmVhazsKICAgICAgIH1jYXRjaChUaHJvd2FibGUgJGUpeyBAb2JfZW5kX2NsZWFuKCk7ICRvWydiYW5keXRhX2tsYWlkYSddID0gJGthbmQuJzogJy5tYl9zdWJzdHIoJGUtPmdldE1lc3NhZ2UoKSwwLDE1MCk7IH0KICAgICB9CiAgIH0KIH0KCiByZXN0b3JlX2Vycm9yX2hhbmRsZXIoKTsKICRvWydwYWdhdXRhJ10gPSBhcnJheV92YWx1ZXMoJHBhZ2F1dGEpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R229'};
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
  const kunas=JSON.stringify({name:'ZZ R229 Null pedsakas 2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r229=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,500); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r229.json', Buffer.from(JSON.stringify(out,null,1)), 'r229 nakties ataskaita');
