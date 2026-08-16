process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdNQUcxJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQMUItTUFHSUMnKTsKICRwYz1XUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzJzsKIC8qIDEuIG1hZ2ljIGxvZ2luIGtsYXNlICovCiAkaz1AZmlsZV9nZXRfY29udGVudHMoJHBjLicvY2xhc3MtbWFnaWMtbG9naW4ucGhwJyk7CiBpZiAoJGspIHsKICAgJG9bJ21hZ2ljJ109YXJyYXkoJ0InPT5zdHJsZW4oJGspKTsKICAgaWYgKHByZWdfbWF0Y2hfYWxsKCIvcmVnaXN0ZXJfcmVzdF9yb3V0ZVwoXHMqJyhbXiddKyknXHMqLFxzKicoW14nXSspJy8iLCRrLCRtLFBSRUdfU0VUX09SREVSKSkgZm9yZWFjaCgkbSBhcyAkeCkgJG9bJ21hZ2ljJ11bJ3JvdXRlcyddW109JHhbMV0uJHhbMl07CiAgIGlmIChwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFx3KylccypcKC8nLCRrLCRmKSkgJG9bJ21hZ2ljJ11bJ2ZuJ109JGZbMV07CiAgIGlmIChwcmVnX21hdGNoX2FsbCgiLycoR0VUfFBPU1QpJy8iLCRrLCRtbSkpICRvWydtYWdpYyddWydtZXRvZGFpJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbW1bMV0pKTsKICAgZm9yZWFjaCAoYXJyYXkoJ3BlZWsnLCdjb25zdW1lJywndG9rZW4nLCdleHBpcmVzJywndXNlZF9hdCcsJ2FjdGlvbl90b2tlbnMnKSBhcyAkeikgewogICAgIGlmIChwcmVnX21hdGNoKCcvLnswLDgwfScuJHouJy57MCwxNjB9L3MnLCRrLCRjKSkgJG9bJ21hZ2ljJ11bJ2N0eCddWyR6XT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRjWzBdLDAsMjQwKSk7CiAgIH0KIH0KIC8qIDIuIGRyYWZ0cyBjbGFpbSBtZXRvZGFpICovCiAkZD1AZmlsZV9nZXRfY29udGVudHMoJHBjLicvY2xhc3MtcGV0LWRyYWZ0cy5waHAnKTsKIGlmICgkZCkgewogICBmb3JlYWNoIChhcnJheSgnYmVnaW5fY2xhaW0nLCdjb21wbGV0ZV9jbGFpbScsJ2Fib3J0X2NsYWltJywndGVybWluYXRlX2NsYWltJywncmVjb3Zlcl9zdGFsZV9jbGFpbXMnKSBhcyAkZm4pIHsKICAgICBpZiAocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrJy4kZm4uJ1xzKlwoW14pXSpcKVxzKlx7LycsJGQsJG0sUFJFR19PRkZTRVRfQ0FQVFVSRSkpIHsKICAgICAgICRvWydkcmFmdHMnXVskZm5dPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdWJzdHIoJGQsJG1bMF1bMV0sNzAwKSk7CiAgICAgfQogICB9CiAgIGlmIChwcmVnX21hdGNoX2FsbCgiLycocGVuZGluZ3xjbGFpbWluZ3xjbGFpbWVkfGV4cGlyZWR8YWJvcnRlZHxuZXcpJy8iLCRkLCRzdCkpICRvWydkcmFmdHNfYnVzZW5vcyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJHN0WzFdKSk7CiB9CiAvKiAzLiBtdSBwZXQtY2xhaW0gKi8KICRjPUBmaWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBldC1jbGFpbS5waHAnKTsKIGlmICgkYykgJG9bJ211X2NsYWltJ109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkYywwLDE4MDApKTsKIC8qIDQuIGRhYmFydGluZSBidWtsZSAqLwogJG9bJ2RyYWZ0c19kYiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiBGUk9NIHskUH1wc19wZXRfcHJvZmlsZV9kcmFmdHMgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICRvWyd0b2tlbnNfZGInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDT1VOVCgqKSBuIEZST00geyRQfXBzX2FjdGlvbl90b2tlbnMiLEFSUkFZX0EpOwogJHRrPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfYWN0aW9uX3Rva2VucyIpOwogJG9bJ3Rva2Vuc19jb2xzJ109JHRrOwogJG9bJ3Rva2Vuc190aXBhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERJU1RJTkNUICIuKGluX2FycmF5KCd0eXBlJywkdGspPyd0eXBlJzooaW5fYXJyYXkoJ2FjdGlvbicsJHRrKT8nYWN0aW9uJzonaWQnKSkuIiB0LCBDT1VOVCgqKSBuIEZST00geyRQfXBzX2FjdGlvbl90b2tlbnMgR1JPVVAgQlkgdCBMSU1JVCAxMCIsQVJSQVlfQSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'P1B-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1b.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p1b magic recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1b.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P1B MAGIC',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,7000));
  try{ const r=await fetch(WP+'/?ps_p0=MAG1'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
