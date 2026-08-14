process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3ZmMiddID8/ICcnKSAhPT0gJ1ZmMngwODE1JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDMwMCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0FOVEtBSU5JVSBMRU5URUxFJyk7CgoJLyogMSkgZ2V0X21hcmt1cF90YWJsZSDigJQgcGF0aSBsZW50ZWxlICovCglpZiAobWV0aG9kX2V4aXN0cygnUGV0c2hvcF9QcmljaW5nJywnZ2V0X21hcmt1cF90YWJsZScpKSB7CgkJJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUHJpY2luZycsJ2dldF9tYXJrdXBfdGFibGUnKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7CgkJdHJ5IHsgJG9bJ21hcmt1cF90YWJsZSddPSRyLT5pc1N0YXRpYygpID8gJHItPmludm9rZShudWxsKSA6ICduZXN0YXRpbmlzJzsgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydtYXJrdXBfdGFibGUnXT0na2xhaWRhOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KCQkkb1sna29kYXNfdGFibGUnXT1pbXBsb2RlKCcnLCBhcnJheV9zbGljZShmaWxlKCRyLT5nZXRGaWxlTmFtZSgpKSwgJHItPmdldFN0YXJ0TGluZSgpLTEsIG1pbig2MCwkci0+Z2V0RW5kTGluZSgpLSRyLT5nZXRTdGFydExpbmUoKSsxKSkpOwoJfQoJaWYgKG1ldGhvZF9leGlzdHMoJ1BldHNob3BfUHJpY2luZycsJ2dldF9kZWZhdWx0X21hcmt1cCcpKSB7CgkJJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUHJpY2luZycsJ2dldF9kZWZhdWx0X21hcmt1cCcpOyAkci0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKCQl0cnkgeyAkb1snZGVmYXVsdF9tYXJrdXAnXT0kci0+aXNTdGF0aWMoKT8kci0+aW52b2tlKG51bGwpOiduZXN0YXRpbmlzJzsgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7fQoJfQoJLyogMikgZ2V0X21hcmt1cCBsb2dpa2EgKi8KCWlmIChtZXRob2RfZXhpc3RzKCdQZXRzaG9wX1ByaWNpbmcnLCdnZXRfbWFya3VwJykpIHsKCQkkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9QcmljaW5nJywnZ2V0X21hcmt1cCcpOwoJCSRvWydrb2Rhc19nZXRfbWFya3VwJ109aW1wbG9kZSgnJywgYXJyYXlfc2xpY2UoZmlsZSgkci0+Z2V0RmlsZU5hbWUoKSksICRyLT5nZXRTdGFydExpbmUoKS0xLCBtaW4oNDUsJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsKCX0KCS8qIDMpIFZGOiB0aWVrZWpvIG51b2xhaWRvcyBpciBtYXJrdXAgKi8KCWZvcmVhY2ggKGFycmF5KCdnZXRfc3VwcGxpZXJfZGlzY291bnQnLCdnZXRfbWFya3VwJywnZ2V0X21hcmt1cF90YWJsZScsJ2FwcGx5X3N1cHBsaWVyX2Rpc2NvdW50JykgYXMgJG0pIHsKCQlpZiAoIW1ldGhvZF9leGlzdHMoJ1BldHNob3BfUHJpY2luZ19WRicsJG0pKSBjb250aW51ZTsKCQkkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9QcmljaW5nX1ZGJywkbSk7CgkJJG9bJ3ZmX2tvZGFzJ11bJG1dPWltcGxvZGUoJycsIGFycmF5X3NsaWNlKGZpbGUoJHItPmdldEZpbGVOYW1lKCkpLCAkci0+Z2V0U3RhcnRMaW5lKCktMSwgbWluKDU1LCRyLT5nZXRFbmRMaW5lKCktJHItPmdldFN0YXJ0TGluZSgpKzEpKSk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP VFM2',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_vf2=Vf2x0815'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vfm2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vfm2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
