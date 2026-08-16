process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdNOFIzJykgcmV0dXJuOwogJG89YXJyYXkoJ3YnPT4nUDBLLU04UkVDMycpOwogJHBjPVdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWNvcmUnOwogZm9yZWFjaCAoYXJyYXkoJ2luY2x1ZGVzL2NsYXNzLXBldC1wcm9maWxlLnBocCcsJ2luY2x1ZGVzL2NsYXNzLXBldC1kcmFmdHMucGhwJywnaW5jbHVkZXMvY2xhc3MtcGV0LXVpLnBocCcpIGFzICRmbikgewogICAkaz1AZmlsZV9nZXRfY29udGVudHMoJHBjLicvJy4kZm4pOyBpZighJGspeyAkb1skZm5dPSdORVJBJzsgY29udGludWU7IH0KICAgJGluZj1hcnJheSgnQic9PnN0cmxlbigkaykpOwogICBpZiAocHJlZ19tYXRjaF9hbGwoIi9yZWdpc3Rlcl9yZXN0X3JvdXRlXChccyonKFteJ10rKSdccyosXHMqJyhbXiddKyknW14pXSo/J2NhbGxiYWNrJ1xzKj0+XHMqYXJyYXlcKFxzKlteLF0rLFxzKicoXHcrKScvcyIsJGssJG0sUFJFR19TRVRfT1JERVIpKSB7CiAgICAgZm9yZWFjaCgkbSBhcyAkbW0peyAkaW5mWydyb3V0ZXMnXVtdPSRtbVsxXS4kbW1bMl0uJyAtPiAnLiRtbVszXTsgfQogICB9IGVsc2VpZiAocHJlZ19tYXRjaF9hbGwoIi9yZWdpc3Rlcl9yZXN0X3JvdXRlXChccyonKFteJ10rKSdccyosXHMqJyhbXiddKyknLyIsJGssJG0sUFJFR19TRVRfT1JERVIpKSB7CiAgICAgZm9yZWFjaCgkbSBhcyAkbW0peyAkaW5mWydyb3V0ZXMnXVtdPSRtbVsxXS4kbW1bMl07IH0KICAgfQogICBpZiAocHJlZ19tYXRjaF9hbGwoIi9kb19hY3Rpb25cKFxzKicoW14nXSspJy8iLCRrLCRkbSkpICRpbmZbJ2RvX2FjdGlvbnMnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRkbVsxXSkpOwogICBpZiAocHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhcdyspXHMqXCgvJywkaywkZm0pKSAkaW5mWydmbiddPWFycmF5X3NsaWNlKCRmbVsxXSwwLDQwKTsKICAgJG9bJGZuXT0kaW5mOwogfQogJGs9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcGV0LWNsYWltLnBocCcpOwogaWYgKCRrKSB7ICRpbmY9YXJyYXkoJ0InPT5zdHJsZW4oJGspKTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCIvZG9fYWN0aW9uXChccyonKFteJ10rKScvIiwkaywkZG0pKSAkaW5mWydkb19hY3Rpb25zJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZG1bMV0pKTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCIvcmVnaXN0ZXJfcmVzdF9yb3V0ZVwoXHMqJyhbXiddKyknXHMqLFxzKicoW14nXSspJy8iLCRrLCRtLFBSRUdfU0VUX09SREVSKSkgeyBmb3JlYWNoKCRtIGFzICRtbSl7ICRpbmZbJ3JvdXRlcyddW109JG1tWzFdLiRtbVsyXTsgfSB9CiAgIGlmIChwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFx3KylccypcKC8nLCRrLCRmbSkpICRpbmZbJ2ZuJ109YXJyYXlfc2xpY2UoJGZtWzFdLDAsMzApOwogICAkb1snbXVfcGV0X2NsYWltJ109JGluZjsKIH0KIC8qIHBldC1mb3JtLmpzIGlua2FyYWkgKi8KICRqcz1AZmlsZV9nZXRfY29udGVudHMoJHBjLicvYXNzZXRzL3BldC1mb3JtLmpzJyk7CiBpZiAoJGpzKSB7ICRqaT1hcnJheSgnQic9PnN0cmxlbigkanMpKTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCcvZGF0YS1zdGVwWyJcJ1xdPV0qLycsJGpzLCRtKSkgJGppWydkYXRhX3N0ZXAnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSksMCw4KTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCcvW1wnIl1cLj8ocHNwZXRbXHctXSspLycsJGpzLCRtKSkgJGppWydrbGFzZXMnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzFdKSksMCwzMCk7CiAgIGlmIChwcmVnX21hdGNoX2FsbCgnL1wvd3AtanNvblwvW1x3XC8uKCk/PD5cXFxcLV0rfGFkbWluLWFqYXhcLnBocC8nLCRqcywkbSkpICRqaVsnZW5kcG9pbnRhaSddPWFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMF0pKSwwLDE1KTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCcvcGFnZWhpZGV8YmVmb3JldW5sb2FkfHZpc2liaWxpdHljaGFuZ2V8c2VuZEJlYWNvbi8nLCRqcywkbSkpICRqaVsndW5sb2FkJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVswXSkpOwogICBpZiAocHJlZ19tYXRjaF9hbGwoJy8oPzpDdXN0b21FdmVudHxkaXNwYXRjaEV2ZW50KVwoXHMqKD86bmV3XHMrQ3VzdG9tRXZlbnRcKFxzKik/W1wnIl0oW1x3Oi4tXSspLycsJGpzLCRtKSkgJGppWydldmVudHMnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzFdKSksMCwxNSk7CiAgIGlmIChwcmVnX21hdGNoX2FsbCgnL3N0ZXBccypbOj1dXHMqKFxkKykvJywkanMsJG0pKSAkamlbJ3N0ZXBfbnInXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzFdKSksMCwxMik7CiAgIGlmIChwcmVnX21hdGNoX2FsbCgnL25hbWU9W1wnIl0oW1x3XFtcXV8tXSspW1wnIl0vJywkanMsJG0pKSAkamlbJ2lucHV0X25hbWVzJ109YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVsxXSkpLDAsMzApOwogICAkb1sncGV0X2Zvcm1fanMnXT0kamk7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'P0K-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0k.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0k m8 recon3',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0k.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  // 1. isjungiam visus likusius TEMP snippetus
  const lst=await api('/wp-json/code-snippets/v1/snippets');
  let arr=[]; try{arr=JSON.parse(lst.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of arr){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); out.temp_isjungta.push(s.id); } }
  // 2. recon snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0K M8REC3',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,7000));
  try{ const r=await fetch(WP+'/?ps_p0=M8R3'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
