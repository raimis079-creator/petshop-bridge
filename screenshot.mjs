process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2F1c3lzJ10gPz8gJycpICE9PSAnQXVzMDgxNScpIHJldHVybjsKCWdsb2JhbCAkd3BkYjsKCSRzYXYgPSBmdW5jdGlvbigkcGlkKXsKCQlmb3JlYWNoIChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JykgYXMgJHIpIHsKCQkJJHYgPSBnZXRfcG9zdF9tZXRhKCRwaWQsJHIsdHJ1ZSk7CgkJCWlmICgkdiE9PScnICYmICR2IT09ZmFsc2UgJiYgJHYhPT1udWxsKSByZXR1cm4gKGZsb2F0KSR2OwoJCX0KCQlyZXR1cm4gbnVsbDsKCX07CgkkaWRzID0gZ2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9PjIwMCwnZmllbGRzJz0+J2lkcycsCgkJJ3MnPT4nYXVzaXMnKSk7CgkkaWRzMiA9IGdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4yMDAsJ2ZpZWxkcyc9PidpZHMnLAoJCSdzJz0+J2F1c2llcycpKTsKCSRpZHMgPSBhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoJGlkcywkaWRzMikpOwoJJG91dD1hcnJheSgpOwoJZm9yZWFjaCAoJGlkcyBhcyAkcGlkKSB7CgkJJHBpZD0oaW50KSRwaWQ7CgkJJHNhbmQgPSBnZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSkgPzogJz8nOwoJCWlmICgkc2FuZCE9PSdhdicpIGNvbnRpbnVlOwoJCSRwID0gd2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CgkJaWYgKCEkcCkgY29udGludWU7CgkJJG91dFtdID0gYXJyYXkoJ2lkJz0+JHBpZCwncGF2Jz0+Z2V0X3RoZV90aXRsZSgkcGlkKSwna2FpbmEnPT4oZmxvYXQpJHAtPmdldF9wcmljZSgpLAoJCQknc2F2Jz0+JHNhdigkcGlkKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9ja19zdGF0dXMnLHRydWUpKTsKCX0KCXVzb3J0KCRvdXQsIGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuICgkYVsnc2F2J10/Pzk5OSkgPD0+ICgkYlsnc2F2J10/Pzk5OSk7IH0pOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnbic9PmNvdW50KCRvdXQpLCdwcmVrZXMnPT4kb3V0KSk7IGV4aXQ7Cn0sIDEzMSk7Cg==','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP AUSYS',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_ausys=Aus0815'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,200); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ausys.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ausys.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
