process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3BkZiddID8/ICcnKSAhPT0gJ1BkZjA4MTRnJykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDI0MCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J1BERiBTQVNLQUlUT1MgRUlMVVRFJyk7CgkkZj1nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzL2Jhc2UucGhwJzsKCSRvWydmYWlsYXMnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmKTsKCSRvWyd5cmEnXT1maWxlX2V4aXN0cygkZik7CglpZiAoJG9bJ3lyYSddKSB7CgkJJGVpbD1maWxlKCRmKTsKCQkkb1snZWlsdWNpdSddPWNvdW50KCRlaWwpOwoJCWZvcmVhY2ggKCRlaWwgYXMgJGk9PiRsKSB7CgkJCWlmIChzdHJpcG9zKCRsLCdzaGlwcGluZ19tZXRob2RfbGFiZWwnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ05lbW9rYW1hcycpIT09ZmFsc2UgfHwgc3RyaXBvcygkbCwnZ2V0X3NoaXBwaW5nX21ldGhvZCcpIT09ZmFsc2UpIHsKCQkJCSRvWydyYWRpbmlhaSddW109KCRpKzEpLic6ICcucnRyaW0oJGwpOwoJCQl9CgkJfQoJCS8qIGtvbnRla3N0YXMgYXBpZSBwaXJtYSByYWRpbmkgKi8KCQlmb3JlYWNoICgkZWlsIGFzICRpPT4kbCkgewoJCQlpZiAoc3RyaXBvcygkbCwnc2hpcHBpbmdfbWV0aG9kX2xhYmVsJykhPT1mYWxzZSkgeyAkb1sna29udGVrc3RhcyddPWltcGxvZGUoJycsIGFycmF5X3NsaWNlKCRlaWwsIG1heCgwLCRpLTE0KSwgMjYpKTsgYnJlYWs7IH0KCQl9Cgl9CgkvKiBhciBzYWJsb25hcyBhcHNrcml0YWkgbmF1ZG9qYW1hcyDigJQgV0NETiBudXN0YXR5bWFpICovCgkkb1snd2NkbiddPWdldF9vcHRpb24oJ3djZG5fc2V0dGluZ3MnKTsKCS8qIHJlYWx1cyB1enNha3ltYWk6IGtva3Mgc2hpcHBpbmcgbWV0aG9kIGlyYXN5dGFzICovCgkkdXpzPXdjX2dldF9vcmRlcnMoYXJyYXkoJ2xpbWl0Jz0+OCwnb3JkZXJieSc9PidkYXRlJywnb3JkZXInPT4nREVTQycpKTsKCWZvcmVhY2ggKCR1enMgYXMgJHUpIHsKCQkkbT1hcnJheSgpOwoJCWZvcmVhY2ggKCR1LT5nZXRfaXRlbXMoJ3NoaXBwaW5nJykgYXMgJGl0KSB7ICRtW109JGl0LT5nZXRfbWV0aG9kX3RpdGxlKCkuJyAvICcuJGl0LT5nZXRfbWV0aG9kX2lkKCkuJyA9ICcud2NfZm9ybWF0X2RlY2ltYWwoJGl0LT5nZXRfdG90YWwoKSwyKTsgfQoJCSRvWyd1enNha3ltYWknXVtdPWFycmF5KCdpZCc9PiR1LT5nZXRfaWQoKSwnbWV0b2RhaSc9PiRtID86ICduZXJhIGVpbHV0ZXMnKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,j:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP PDF',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.j).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_pdf=Pdf0814g'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pdf.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rec',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pdf.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,JSON.stringify(out).length);
