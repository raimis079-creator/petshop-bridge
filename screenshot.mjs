process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdSRUNDJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1JFQ0MnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7ICRMPWV4cGxvZGUoIlxuIiwkcyk7CiAkYmxrPWZ1bmN0aW9uKCRhLCRsZW4pIHVzZSgkTCl7ICRyPWFycmF5KCk7IGZvcigkaT0kYS0xOyRpPG1pbigkYS0xKyRsZW4sY291bnQoJEwpKTskaSsrKSAkcltdPSgkaSsxKS4nOiAnLnJ0cmltKCRMWyRpXSk7IHJldHVybiAkcjsgfTsKICRvWydwdXNsYXBpcyddPSRibGsoNDY3OCw5OCk7CiAvKiBsYXVrxbMgcmFrdGFpIGVpbHV0xJdqZSAkclsuLi5dICovCiBwcmVnX21hdGNoX2FsbCgiL1xcXCRyXFtccyonKFthLXowLTlfXSspJ1xzKlxdL2kiLCRzLCRtKTsKICRjPWFycmF5X2NvdW50X3ZhbHVlcygkbVsxXSk7IGFyc29ydCgkYyk7CiAkb1sncl9sYXVrYWknXT0kYzsKIC8qIGt1ciB0cmFuc2llbnRvIGtlxaFhcyBpciBhciBmaWx0cmFzIHRhaWtvbWFzIHBvIGtlc28gKi8KICRoPWFycmF5KCk7CiBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihwcmVnX21hdGNoKCcvcHNfa2F0X2R1b21lbnlzfGZ1bmN0aW9uIHN1cmlua3RpfHJldHVybiBcJHJlenxcJHJlelxbXF0vaScsJGxuKSl7ICRoW109YXJyYXkoJGkrMSx0cmltKCRsbikpOyB9IH0KICRvWydrZXNhcyddPWFycmF5X3NsaWNlKCRoLDAsMTUpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'RECC'};
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
  const s=await snip('TEMP RECC',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=RECC')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('recc.json', Buffer.from(JSON.stringify(out)), 'recc');
console.log('ok');
