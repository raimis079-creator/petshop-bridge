process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdLQVQyJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0tBVDInLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAkTD1leHBsb2RlKCJcbiIsJHMpOwogJGdydXBlcz1hcnJheSgKICAnc3RvcmFnZScgICA9PiAnL2xvY2FsU3RvcmFnZXxzZXNzaW9uU3RvcmFnZXxwc19rYXRfc3RhdGV8aGlzdG9yeVwucmVwbGFjZVN0YXRlfGhpc3RvcnlcLnB1c2hTdGF0ZS9pJywKICAncGFpZXNrYScgICA9PiAnL3R5cGU9LnNlYXJjaC58bmFtZT0ucS58aWQ9LmthdC1xLnxwbGFjZWhvbGRlcnxwcy1wYWllc2thfHBhaWVza2EvaScsCiAgJ2dldF9xJyAgICAgPT4gJy9cJF9HRVRcW1xzKi4ocXxzfHBhaWVza2F8c2VhcmNoKS5ccypcXXxcJF9SRVFVRVNUXFsvaScsCiAgJ3RyYW5zaWVudCcgPT4gJy9zZXRfdHJhbnNpZW50fGdldF90cmFuc2llbnQvaScsCiApOwogZm9yZWFjaCgkZ3J1cGVzIGFzICRrPT4kcmUpewogICAkaD1hcnJheSgpOwogICBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihwcmVnX21hdGNoKCRyZSwkbG4pKXsgJHQ9dHJpbSgkbG4pOyBpZigkdCE9PScnJiZzdHJsZW4oJHQpPDI2MCkgJGhbXT1hcnJheSgkaSsxLCR0KTsgfSB9CiAgICRvWyRrLidfbiddPWNvdW50KCRoKTsgJG9bJGtdPWFycmF5X3NsaWNlKCRoLDAsMzApOwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'KAT2'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP KAT2',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=KAT2')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('kat2.json', Buffer.from(JSON.stringify(out)), 'kat2');
console.log('ok');
