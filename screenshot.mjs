process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const D64=''; const V64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdJWlZHJykgcmV0dXJuOwogJG89YXJyYXkoJ3YnPT4nSVpWQUxHT1MnKTsKIC8qIDEuIGt1ciByZWdpc3RydW90YXMgbWVuaXUgcHVua3RhcyAqLwogJHJhc3RhPWFycmF5KCk7CiBmb3JlYWNoIChhcnJheShXUE1VX1BMVUdJTl9ESVIsIFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMnLCBXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1lc3AvaW5jbHVkZXMnKSBhcyAkZGlyKSB7CiAgIGZvcmVhY2ggKChhcnJheSlAc2NhbmRpcigkZGlyKSBhcyAkZikgewogICAgIGlmIChzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAkaz1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nLycuJGYpOyBpZighJGspIGNvbnRpbnVlOwogICAgIGlmIChzdHJpcG9zKCRrLCdhbmtldG9zIGl6dmFsZ29zJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRrLCdhbmtldG9zIMSvxb52YWxnb3MnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGssJ0F1Z2ludGluacWzIGFua2V0b3MnKSE9PWZhbHNlKSB7CiAgICAgICAkaW5mPWFycmF5KCdmYWlsYXMnPT5iYXNlbmFtZSgkZGlyKS4nLycuJGYsJ0InPT5zdHJsZW4oJGspKTsKICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgiL2FkZF9zdWJtZW51X3BhZ2VcKFteO117MCw0MDB9Oy9zIiwkaywkbSkpICRpbmZbJ21lbml1J109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkbVswXVswXSwwLDMwMCkpOwogICAgICAgaWYgKHByZWdfbWF0Y2hfYWxsKCIvY29uc3QgKFNMVUd8UEFSRU5UfENBUClccyo9XHMqJyhbXiddKyknLyIsJGssJGMsUFJFR19TRVRfT1JERVIpKSBmb3JlYWNoKCRjIGFzICR4KSAkaW5mWyR4WzFdXT0keFsyXTsKICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFx3KylccypcKC8nLCRrLCRmbSkpICRpbmZbJ2ZuJ109YXJyYXlfc2xpY2UoJGZtWzFdLDAsMjUpOwogICAgICAgLyoga2Egamkgcm9kbyDigJQgYW50cmFzdGVzIGlyIGgyL2gzIHRla3N0YWkgKi8KICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgiLzxoWzEyM11bXj5dKj4oW148J117Myw2MH0pPC8iLCRrLCRobSkpICRpbmZbJ2FudHJhc3RlcyddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkaG1bMV0pLDAsMTUpOwogICAgICAgaWYgKHByZWdfbWF0Y2hfYWxsKCIvZWNobyAnPGhbMjNdW14+XSo+KFtePCddezMsNzB9KS8iLCRrLCRoMikpICRpbmZbJ2gnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJGgyWzFdKSwwLDIwKTsKICAgICAgICRyYXN0YVtdPSRpbmY7CiAgICAgfQogICB9CiB9CiAkb1sncmFzdGEnXT0kcmFzdGE7CiAvKiAyLiB2aXNpIFBldHNob3AgYXRhc2thaXR1IHN1Ym1lbml1IHB1bmt0YWkgKi8KIGdsb2JhbCAkc3VibWVudTsKICRvWydzdWJtZW51J109aXNzZXQoJHN1Ym1lbnVbJ3BldHNob3AtcmVwb3J0cyddKT8kc3VibWVudVsncGV0c2hvcC1yZXBvcnRzJ106J25lcmEgKG1lbml1IGtyYXVuYW1hcyB2ZWxpYXUpJzsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0Z-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1l.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0z ivykiai deploy+verify',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1l.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s2=await snip('TEMP P0Z VERIFY9',V64);
  await new Promise(r=>setTimeout(r,7000));
  try{ out.verify=JSON.parse(await (await fetch(WP+'/?ps_p0=IZVG')).text()); }catch(e){ out.e2=String(e).slice(0,300); }
  await off(s2);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
