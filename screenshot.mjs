process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdSVU5BJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQMFYtQScpOwogLyogMS4gcGV0LWZvcm0uanMgcGlsbmFzICovCiAkcGY9V1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtY29yZS9hc3NldHMvcGV0LWZvcm0uanMnOwogJGs9ZmlsZV9nZXRfY29udGVudHMoJHBmKTsKICRvWydwZXRmb3JtJ109YXJyYXkoJ0InPT5zdHJsZW4oJGspLCdtZDUnPT5tZDUoJGspLCdiNjQnPT5iYXNlNjRfZW5jb2RlKCRrKSk7CiAvKiAyLiByZWZpbGwgZW5naW5lIOKAlCBrYWlwIGR1ZSBudXN0YXRvbWFzLCBhciB5cmEgZG9fYWN0aW9uLCBrYWlwIGxhaXNrYXMgKi8KICRyZT1AZmlsZV9nZXRfY29udGVudHMoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1yZWZpbGwtZW5naW5lLnBocCcpOwogaWYgKCRyZSkgewogICAkb1sncmVmaWxsX0InXT1zdHJsZW4oJHJlKTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCIvZG9fYWN0aW9uXChccyonKFteJ10rKScvIiwkcmUsJG0pKSAkb1sncmVmaWxsX2FjdGlvbnMnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzFdKSk7CiAgIGlmIChwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFx3KylccypcKC8nLCRyZSwkZm0pKSAkb1sncmVmaWxsX2ZuJ109JGZtWzFdOwogICBmb3JlYWNoIChhcnJheSgncmVmaWxsX2R1ZScsJ2VucXVldWUnLCdlbWl0JywncHNfZW1haWxfam9icycsJ3BzX3JlbWluZGVycycsJ3ByZWRpY3RlZCcpIGFzICR6eW0pIHsKICAgICBpZiAocHJlZ19tYXRjaCgnLy57MCwxMjB9Jy4kenltLicuezAsMjAwfS9zJywkcmUsJG1tKSkgJG9bJ3JlZmlsbF9jdHgnXVskenltXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRtbVswXSwwLDMwMCkpOwogICB9CiB9CiAkZXI9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWVzcC9pbmNsdWRlcy9jbGFzcy1ldmVudC1yZWdpc3RyeS5waHAnKTsKIGlmICgkZXIgJiYgcHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrZW1pdC8nLCRlcikpIHsKICAgJHA9c3RycG9zKCRlciwnZnVuY3Rpb24gZW1pdCcpOyAkb1snZW1pdCddPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdWJzdHIoJGVyLCRwLDkwMCkpOwogfQogLyogMy4gYW5vbmltaW5lcyBhbmtldG9zIHB1c2xhcGlzICovCiAkdWk9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcGV0LXVpLnBocCcpOwogJHRhZz0nJzsKIGlmICgkdWkgJiYgcHJlZ19tYXRjaCgiL2FkZF9zaG9ydGNvZGVcKFxzKicoW14nXSspJy8iLCR1aSwkc20pKSAkdGFnPSRzbVsxXTsKICRvWydzaG9ydGNvZGUnXT0kdGFnOwogaWYgKCR0YWcpIHsKICAgJHBnPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgSUQscG9zdF90aXRsZSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdHlwZSBJTiAoJ3BhZ2UnLCdwb3N0JykgQU5EIHBvc3RfY29udGVudCBMSUtFICVzIExJTUlUIDEiLCclWycuJHRhZy4nJScpLEFSUkFZX0EpOwogICBpZiAoJHBnKSB7ICRvWydhbm9uX3VybCddPWdldF9wZXJtYWxpbmsoJHBnWydJRCddKTsgJG9bJ2Fub25fdGl0bGUnXT0kcGdbJ3Bvc3RfdGl0bGUnXTsgfQogfQogLyogNC4gbWFyem9zIGxhdWthcyBrYW5kaWRhdGFtcyAoNyBwdW5rdHVpKSAqLwogJG9bJ2Nvc3RfbWV0YSddPWFycmF5KCk7CiBmb3JlYWNoIChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfcHNfc2F2aWthaW5hJywnX3piX2Nvc3QnLCdfdmZfY29zdCcpIGFzICRtaykgewogICAkb1snY29zdF9tZXRhJ11bJG1rXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9JXMgQU5EIG1ldGFfdmFsdWU8PicnIiwkbWspKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0V-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0v.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0v run a',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0v.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0V RUNA',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,7000));
  try{ const r=await fetch(WP+'/?ps_p0=RUNA'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
