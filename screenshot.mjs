process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2llczInXSA/PyAnJykgIT09ICdJZXMwODE0aCcpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgzMDApOwoJZ2xvYmFsICR3cGRiOwoJJG89YXJyYXkoJ21hcmtlcic9PidQSUxOSSBURUtTVEFJJyk7CgkkcmV4PScvW15cbjw+XXswLDUwfVtObl1lbW9rYW1bXlxuPD5dezAsODB9L3UnOwoKCWZvcmVhY2ggKGFycmF5KCd0aGVtZV9tb2RzX2ZsYXRzb21lLWNoaWxkJywnd29vY29tbWVyY2VfZnJlZV9zaGlwcGluZ18xX3NldHRpbmdzJykgYXMgJG9wKSB7CgkJJHY9Z2V0X29wdGlvbigkb3ApOyAkdD1pc19hcnJheSgkdik/d3BfanNvbl9lbmNvZGUoJHYpOihzdHJpbmcpJHY7CgkJaWYgKHByZWdfbWF0Y2hfYWxsKCRyZXgsJHQsJG0pKSB7ICRvWydvcHRpb25zJ11bJG9wXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoYXJyYXlfbWFwKCd0cmltJywkbVswXSkpLDAsNik7IH0KCX0KCWZvcmVhY2ggKGFycmF5KDE0ODk0LDM0NTE1LDM0NTI0LDM0NTk1LDM0NTQzLDMyMzMpIGFzICRwaWQpIHsKCQkkcD1nZXRfcG9zdCgkcGlkKTsgaWYoISRwKSBjb250aW51ZTsKCQlpZiAocHJlZ19tYXRjaF9hbGwoJHJleCwkcC0+cG9zdF9jb250ZW50LCRtKSkgewoJCQkkb1sncHVzbGFwaWFpJ11bJHAtPnBvc3RfdGl0bGVdPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZShhcnJheV9tYXAoJ3RyaW0nLCRtWzBdKSksMCw2KTsKCQl9Cgl9CgkvKiB0b3BiYXIgc25pcHBldCBwaWxuYXMgKi8KCSRzbmlwPSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKCSRjPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29kZSBGUk9NICRzbmlwIFdIRVJFIGlkPTYxMCIpOwoJaWYgKCRjICYmIHByZWdfbWF0Y2hfYWxsKCRyZXgsJGMsJG0pKSB7ICRvWydzbmlwcGV0XzYxMCddPWFycmF5X21hcCgndHJpbScsJG1bMF0pOyB9CgkvKiB2YWlraW5lcyB0ZW1vcyBwcm9ncmVzbyBqdW9zdGEgKi8KCSRmPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7CglpZiAoZmlsZV9leGlzdHMoJGYpICYmIHByZWdfbWF0Y2hfYWxsKCRyZXgsZmlsZV9nZXRfY29udGVudHMoJGYpLCRtKSkgeyAkb1sndGVtYV9mdW5jdGlvbnMnXT1hcnJheV9tYXAoJ3RyaW0nLCRtWzBdKTsgfQoJJGYyPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvYmFzZS5waHAnOwoJaWYgKGZpbGVfZXhpc3RzKCRmMikgJiYgcHJlZ19tYXRjaF9hbGwoJHJleCxmaWxlX2dldF9jb250ZW50cygkZjIpLCRtKSkgeyAkb1sncGRmX3Nhc2thaXRhJ109YXJyYXlfbWFwKCd0cmltJywkbVswXSk7IH0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,j:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP IES2',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.j).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_ies2=Ies0814h'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ies2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rec',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ies2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,JSON.stringify(out).length);
