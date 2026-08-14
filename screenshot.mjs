process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3ZhbCddID8/ICcnKSAhPT0gJ1ZhbDA4MTVlJykgcmV0dXJuOwoJJG89YXJyYXkoJ21hcmtlcic9PidURVNUSU5JTyBTQUxJTklNQVMnKTsKCSRpZD0zNDkzOTsKCSRwPWdldF9wb3N0KCRpZCk7Cgkkb1sncmFzdGFzJ109ICRwID8gYXJyYXkoJ3Bhdic9PiRwLT5wb3N0X3RpdGxlLCdidXNlbmEnPT4kcC0+cG9zdF9zdGF0dXMsJ2xhdWthcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzJyx0cnVlKSkgOiAnbmVyYSc7CglpZiAoJHAgJiYgZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXMnLHRydWUpPT09J3llcycgJiYgc3RycG9zKCRwLT5wb3N0X3RpdGxlLCdURVNUJyk9PT0wKSB7CgkJZ2xvYmFsICR3cGRiOwoJCSR3cGRiLT5kZWxldGUoJHdwZGItPnByZWZpeC4nd2NfbW5tX2NoaWxkX2l0ZW1zJywgYXJyYXkoJ2NvbnRhaW5lcl9pZCc9PiRpZCksIGFycmF5KCclZCcpKTsKCQkkb1snaXN0cmludGEnXT0gKGJvb2wpIHdwX2RlbGV0ZV9wb3N0KCRpZCwgdHJ1ZSk7Cgl9IGVsc2UgeyAkb1snaXN0cmludGEnXT0nbmVsaWVjaWF1IOKAlCBuZXRpa28gc8SFbHlnb3MnOyB9Cgkkb1snbGlrbyddPSBnZXRfcG9zdCgkaWQpID8gJ0RBUiBZUkEnIDogJ25lYmVyYSc7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP VAL',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_val=Val0815e'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/val.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/val.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
