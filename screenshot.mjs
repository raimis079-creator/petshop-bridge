process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3N2b3JpcyddID8/ICcnKSAhPT0gJ1N2MDgxNScpIHJldHVybjsKCSRpZHMgPSBhcnJheSgxOTU3MCwxOTU2MiwxOTU4MiwxOTU3OCwxOTUwNCwxOTQ5NiwxOTQ4OCwxOTQ3OSk7IC8vIEdDIDgwMGcKCSRpZHMyID0gYXJyYXkoMTk1NzQsMTk1NjYsMTk1ODYsMTk1OTQsMTk1MDAsMTk1MDgsMTk0OTIsMTk0ODMpOyAvLyBHQyA0MDBnCgkkb3V0ID0gYXJyYXkoKTsKCWZvcmVhY2ggKGFycmF5X21lcmdlKCRpZHMsJGlkczIpIGFzICRwaWQpIHsKCQkkcCA9IHdjX2dldF9wcm9kdWN0KCRwaWQpOwoJCWlmICghJHApIGNvbnRpbnVlOwoJCSRvdXRbXSA9IGFycmF5KCdpZCc9PiRwaWQsJ3Bhdic9PmdldF90aGVfdGl0bGUoJHBpZCksCgkJCSdfd2VpZ2h0X3Jhdyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3dlaWdodCcsdHJ1ZSksCgkJCSd3ZWlnaHRfd2MnPT4kcC0+Z2V0X3dlaWdodCgpLAoJCQknc2l1bnRpbW9fa2xhc2UnPT4kcC0+Z2V0X3NoaXBwaW5nX2NsYXNzKCkpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSwgMTMxKTsK','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP SVORIS',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_svoris=Sv0815'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,200); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/svoris.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/svoris.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
