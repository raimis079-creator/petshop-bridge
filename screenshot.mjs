process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2FrJ10gPz8gJycpICE9PSAnQWswODE0eicpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJZ2xvYmFsICR3cGRiOwoJJG89YXJyYXkoJ21hcmtlcic9PidBS0NJSkEgWllNRVMgU0FMVElOSVMnKTsKCSRzbmlwPSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKCWZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLGNvZGUgRlJPTSAkc25pcCBXSEVSRSBjb2RlIExJS0UgJyVBa2NpamElJyIsIEFSUkFZX0EpIGFzICRyKSB7CgkJcHJlZ19tYXRjaF9hbGwoJy9bXlxuXXswLDYwfUFrY2lqYVteXG5dezAsODB9L3UnLCRyWydjb2RlJ10sJG0pOwoJCSRvWydzbmlwcGV0cyddW109YXJyYXkoJ2lkJz0+KGludCkkclsnaWQnXSwncGF2Jz0+JHJbJ25hbWUnXSwnYWt0eXZ1cyc9PihpbnQpJHJbJ2FjdGl2ZSddLAoJCQkndmlldG9zJz0+YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCd0cmltJywkbVswXSksMCwzKSk7Cgl9Cglmb3JlYWNoIChhcnJheShXUE1VX1BMVUdJTl9ESVIsIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpKSBhcyAkZGlyKSB7CgkJaWYgKCFpc19kaXIoJGRpcikpIGNvbnRpbnVlOwoJCSRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOwoJCWZvcmVhY2ggKCRpdCBhcyAkZikgewoJCQlpZiAoISRmLT5pc0ZpbGUoKSB8fCAkZi0+Z2V0RXh0ZW5zaW9uKCkhPT0ncGhwJykgY29udGludWU7CgkJCSR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKCQkJaWYgKHN0cnBvcygkdCwnQWtjaWphJyk9PT1mYWxzZSkgY29udGludWU7CgkJCXByZWdfbWF0Y2hfYWxsKCcvW15cbl17MCw2MH1Ba2NpamFbXlxuXXswLDgwfS91JywkdCwkbSk7CgkJCSRvWydmYWlsYWknXVtiYXNlbmFtZSgkZi0+Z2V0UGF0aG5hbWUoKSldPWFycmF5X3NsaWNlKGFycmF5X21hcCgndHJpbScsJG1bMF0pLDAsMyk7CgkJfQoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,j:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP AK',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.j).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_ak=Ak0814z'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ak.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rec',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ak.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,JSON.stringify(out).length);
