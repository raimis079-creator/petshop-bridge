process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3JlYzQnXSA/PyAnJykgIT09ICdSZWMwODE0dycpIHJldHVybjsKCSRvPWFycmF5KCdtYXJrZXInPT4nTU5NIENBUlQgRk9STUFUQVMnKTsKCSRkaXI9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLW1peC1hbmQtbWF0Y2gtcHJvZHVjdHMnOwoJJGY9JGRpci4nL2luY2x1ZGVzL2NsYXNzLXdjLW1ubS1jYXJ0LnBocCc7CglpZiAoZmlsZV9leGlzdHMoJGYpKSB7ICRlPWZpbGUoJGYpOyAkb1snY2FydF82MF8xNDAnXT1pbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkZSw1OSw4NSkpOyB9CgkvKiB2YWxpZGFjaWpvcyB0cmFpdGFzIOKAlCBpcyBrdXIgaW1hbWFzIGNvbmZpZyAqLwoJJHQ9JGRpci4nL2luY2x1ZGVzL3RyYWl0cy90cmFpdC13Yy1tbm0tY29udGFpbmVyLXZhbGlkYXRpb24ucGhwJzsKCWlmIChmaWxlX2V4aXN0cygkdCkpIHsKCQkkZT1maWxlKCR0KTsKCQlmb3JlYWNoICgkZSBhcyAkaT0+JGwpIHsgaWYgKHByZWdfbWF0Y2goJy9mdW5jdGlvbiAoZ2V0X3Bvc3RlZF9jb250YWluZXJfY29uZmlndXJhdGlvbnxzZXRfY29udGFpbmVyX2NvbmZpZ3VyYXRpb258dmFsaWRhdGVfY29udGFpbmVyX2NvbmZpZ3VyYXRpb24pLycsJGwsJG0pKSB7CgkJCSRvWyd0cmFpdF8nLiRtWzFdXT1pbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkZSwkaSwzMikpOyB9IH0KCX0KCS8qIHBhZ2FsYmluZXMgZnVua2Npam9zICovCgkkYz0kZGlyLicvaW5jbHVkZXMvd2MtbW5tLWNvcmUtZnVuY3Rpb25zLnBocCc7CglpZiAoZmlsZV9leGlzdHMoJGMpKSB7ICR0Mj1maWxlX2dldF9jb250ZW50cygkYyk7IHByZWdfbWF0Y2hfYWxsKCcvZnVuY3Rpb24gKHdjX21ubV9bYS16X10qY29uZmlnW2Etel9dKilccypcKC8nLCR0MiwkbSk7ICRvWydjb25maWdfZnVua2Npam9zJ109JG1bMV07IH0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,j:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP REC4',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.j).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_rec4=Rec0814w'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec4.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rec',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec4.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,JSON.stringify(out).length);
