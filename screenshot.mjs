process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2OCddKSA/ICRfR0VUWydwc19oMTY4J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2OCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidESUFHTk9TVElLQScpOwogJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfS2F0YWxvZ2FzJyk7CiAkb1snbWV0b2RhaSddPWFycmF5KCk7CiBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtKXsKICAgaWYocHJlZ19tYXRjaCgnL2ZpbHRyfHBhcmFtfGdhdXRpfGZffHF1ZXJ5fGFyZ3MvaScsJG0tPmdldE5hbWUoKSkpICRvWydtZXRvZGFpJ11bXT0kbS0+Z2V0TmFtZSgpLicoJy5jb3VudCgkbS0+Z2V0UGFyYW1ldGVycygpKS4nKSc7CiB9CiAvKiBzaW11bGl1b2phbSBSYWltaW8gVVJMICovCiAkX0dFVFsncGFnZSddPSdwcy1rYXRhbG9nYXMnOyAkX0dFVFsna3J1dmEnXT0ncHJla3lib2plJzsKICRfR0VUWyd2aWV3J109J3plbWlhdV9yaWJvcyc7ICRfR0VUWydxJ109J2V4Y2x1cyc7CiAkX1JFUVVFU1Q9JF9HRVQ7CgogLyogYmFuZG9tIHJhc3RpIG1ldG9kYSwga3VyaXMgZ3JhemluYSAkZiBtYXN5dmEgKi8KICRrYW5kPWFycmF5KCdmaWx0cnVfcmVpa3NtZXMnLCdmJywnZmlsdHJhaV9pc19nZXQnLCdnYXV0aV9maWx0cnVzJywnZmlsdHJ1X2dldCcsJ3BhaW10aV9maWx0cnVzJyk7CiBmb3JlYWNoKCRrYW5kIGFzICRrKXsgaWYoJHJjLT5oYXNNZXRob2QoJGspKXsgJG09JHJjLT5nZXRNZXRob2QoJGspOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgaWYoY291bnQoJG0tPmdldFBhcmFtZXRlcnMoKSk9PT0wKXsgJG9bJ3JhZG9fbWV0b2RhJ109JGs7ICRvWydmX21hc3l2YXMnXT0kbS0+aW52b2tlKG51bGwpOyBicmVhazsgfSB9IH0KCiAvKiBqZWkgbmVyYWRvIOKAlCBpZXNrb20gZWlsdXRlamUsIGt1ciAkZiA9IGFycmF5KCAuLi4gJ3ZpZXcnID0+ICovCiBpZighaXNzZXQoJG9bJ2ZfbWFzeXZhcyddKSl7CiAgICRlaWw9QGZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAgICRoPWFycmF5KCk7CiAgIGZvcmVhY2goJGVpbCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCIvXFxcJGZcXHMqPVxccyphcnJheXwndmlldydcXHMqPT5cXHMqXFxcJHxcXFwkZlxcWydxJ1xcXXwncSdcXHMqPT4vIiwkbCkpICRoW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxMzApKTsgfQogICAkb1snZl9wYWllc2thJ109YXJyYXlfc2xpY2UoJGgsMCw0MCk7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H168'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H168 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h168=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h168.json', Buffer.from(JSON.stringify(out,null,1)), 'h168 Monge merge APPLY');
