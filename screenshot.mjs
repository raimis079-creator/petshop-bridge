process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX21pYW1vciddID8/ICcnKSAhPT0gJ01pYTA4MTUnKSByZXR1cm47CglnbG9iYWwgJHdwZGI7Cgkkc2F2ID0gZnVuY3Rpb24oJHBpZCl7CgkJZm9yZWFjaCAoYXJyYXkoJ19jb3N0X3ByaWNlJywnX3ZmX2Nvc3QnLCdfemJfY29zdCcpIGFzICRyKSB7CgkJCSR2ID0gZ2V0X3Bvc3RfbWV0YSgkcGlkLCRyLHRydWUpOwoJCQlpZiAoJHYhPT0nJyAmJiAkdiE9PWZhbHNlICYmICR2IT09bnVsbCkgcmV0dXJuIChmbG9hdCkkdjsKCQl9CgkJcmV0dXJuIG51bGw7Cgl9OwoJJGlkcyA9IGdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4yMDAsJ2ZpZWxkcyc9PidpZHMnLCdzJz0+J01pYW1vcicpKTsKCSRvdXQ9YXJyYXkoKTsKCWZvcmVhY2ggKCRpZHMgYXMgJHBpZCkgewoJCSRwaWQ9KGludCkkcGlkOwoJCSRwID0gd2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CgkJaWYgKCEkcCkgY29udGludWU7CgkJJGd5diA9IHdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncGFfZ3l2dW5vX3J1c2lzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwoJCSRwZCA9IHdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncGFfcGFrdW90ZXNfZHlkaXMnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CgkJJGJ0ID0gd3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwYV9iYWx0eW11X3NhbHRpbmlzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwoJCSRvdXRbXSA9IGFycmF5KCdpZCc9PiRwaWQsJ3Bhdic9PmdldF90aGVfdGl0bGUoJHBpZCksJ2thaW5hJz0+KGZsb2F0KSRwLT5nZXRfcHJpY2UoKSwKCQkJJ3Nhdic9PiRzYXYoJHBpZCksJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksCgkJCSdneXYnPT4oIWlzX3dwX2Vycm9yKCRneXYpKT8kZ3l2OmFycmF5KCksJ2R5ZGlzJz0+KCFpc193cF9lcnJvcigkcGQpKT8kcGQ6YXJyYXkoKSwKCQkJJ2JhbHQnPT4oIWlzX3dwX2Vycm9yKCRidCkpPyRidDphcnJheSgpLCAnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9ja19zdGF0dXMnLHRydWUpKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ24nPT5jb3VudCgkb3V0KSwncHJla2VzJz0+JG91dCkpOyBleGl0Owp9LCAxMzEpOwo=','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP MIAMOR',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_miamor=Mia0815'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,200); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/miamor.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/miamor.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
