process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdTQ0gyJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQMEYtU0NIRU1BMicpOwogJHBldHM9JFAuJ3BzX3BldHMnOwoKICRvWydjcmVhdGUnXT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBDUkVBVEUgVEFCTEUgJHBldHMiLCAxKTsKICRvWydjcmVhdGUnXT1zdWJzdHIoKHN0cmluZykkb1snY3JlYXRlJ10sIC0yMjApOwoKIC8qIHJlYWxpb3MgcmVpa3NtZXMgKFZJU09TIGVpbHV0ZXMsIGthZCBtYXR5dHVzaSBpciB0ZXN0aW5pdSBmb3JtYXRhcykgKi8KIGZvcmVhY2ggKGFycmF5KCdzcGVjaWVzJywnbGlmZV9zdGFnZScsJ2lzX3N0ZXJpbGlzZWQnLCdmZWVkaW5nX3R5cGUnLCdwcmltYXJ5X25lZWQnLCdob3VzaW5nJywnYWN0aXZpdHlfaGludCcsJ3N0YXR1cycsJ3NlbnNpdGl2aXRpZXMnLCdkb2dfc2l6ZScpIGFzICRMKSB7CiAgICRvWydyZWlrc21lcyddWyRMXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDT0FMRVNDRShgJExgLCc8TlVMTD4nKSB2LCBDT1VOVCgqKSBuIEZST00gJHBldHMgR1JPVVAgQlkgYCRMYCBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiLCBBUlJBWV9BKTsKIH0KICRvWydmcmVlX3RleHRfcHZ6J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBjdXJyZW50X2Zvb2RfZnJlZV90ZXh0IEZST00gJHBldHMgV0hFUkUgY3VycmVudF9mb29kX2ZyZWVfdGV4dCBJUyBOT1QgTlVMTCBBTkQgY3VycmVudF9mb29kX2ZyZWVfdGV4dDw+JycgTElNSVQgMTAiKTsKICRvWydicmFuZF92aXNpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY3VycmVudF9mb29kX2JyYW5kIHYsIENPVU5UKCopIG4gRlJPTSAkcGV0cyBXSEVSRSBjdXJyZW50X2Zvb2RfYnJhbmQgSVMgTk9UIE5VTEwgQU5EIGN1cnJlbnRfZm9vZF9icmFuZDw+JycgR1JPVVAgQlkgY3VycmVudF9mb29kX2JyYW5kIE9SREVSIEJZIG4gREVTQyBMSU1JVCA0MCIsIEFSUkFZX0EpOwoKIC8qIGRyYWZ0cyBwYXlsb2FkIOKAlCBUSUsgcmFrdGFpLCBqb2tpdSByZWlrc21pdSAoYXNtZW5zIGR1b21lbnlzKSAqLwogJGRyPSRQLidwc19wZXRfcHJvZmlsZV9kcmFmdHMnOwogJHJha3RhaT1hcnJheSgpOwogZm9yZWFjaCAoKGFycmF5KSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcGF5bG9hZF9qc29uIEZST00gJGRyIExJTUlUIDIwIikgYXMgJHBqKSB7CiAgICRhPWpzb25fZGVjb2RlKCRwaix0cnVlKTsgaWYoaXNfYXJyYXkoJGEpKXsgZm9yZWFjaChhcnJheV9rZXlzKCRhKSBhcyAkayl7ICRyYWt0YWlbJGtdPWlzc2V0KCRyYWt0YWlbJGtdKT8kcmFrdGFpWyRrXSsxOjE7IH0gfQogfQogJG9bJ2RyYWZ0X3Jha3RhaSddPSRyYWt0YWk7CiAkb1snZHJhZnRfdmVyc2lqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwYXlsb2FkX3ZlcnNpb24gdiwgQ09VTlQoKikgbiBGUk9NICRkciBHUk9VUCBCWSBwYXlsb2FkX3ZlcnNpb24iLCBBUlJBWV9BKTsKCiAvKiBSRUtVUlNJTkUgcmFzeXRvanUgcGFpZXNrYSB2aXNhbWUgd3AtY29udGVudCAoYmUgdXBsb2Fkcy9jYWNoZSkgKi8KICRyZXo9YXJyYXkoKTsgJHNrPTA7CiAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoV1BfQ09OVEVOVF9ESVIsIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiBmb3JlYWNoICgkaXQgYXMgJGZpKSB7CiAgIGlmICgkc2s+OTAwMCkgYnJlYWs7CiAgICRwPSRmaS0+Z2V0UGF0aG5hbWUoKTsKICAgaWYgKHN0cnBvcygkcCwnL3VwbG9hZHMvJykhPT1mYWxzZSB8fCBzdHJwb3MoJHAsJy9jYWNoZS8nKSE9PWZhbHNlIHx8IHN0cnBvcygkcCwnL3VwZ3JhZGUnKSE9PWZhbHNlKSBjb250aW51ZTsKICAgaWYgKHN1YnN0cigkcCwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAkc2srKzsKICAgJGs9QGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYoISRrKSBjb250aW51ZTsKICAgJG4xPXByZWdfbWF0Y2hfYWxsKCcvKFVQREFURXxJTlNFUlRccytJTlRPfFJFUExBQ0VccytJTlRPKVteO117MCw4MH1wc19wZXRzL2knLCRrLCRtKTsKICAgJG4yPXByZWdfbWF0Y2hfYWxsKCcvLT5ccyooaW5zZXJ0fHVwZGF0ZXxyZXBsYWNlKVxzKlwoXHMqW14sKV17MCw2MH1wc19wZXRzL2knLCRrLCRtMik7CiAgIGlmICgkbjF8fCRuMikgJHJleltzdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkcCldPSRuMSskbjI7CiB9CiAkb1snc2tlbnVvdGFfZmFpbHUnXT0kc2s7CiBhcnNvcnQoJHJleik7ICRvWydyYXN5dG9qYWknXT0kcmV6OwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'P0F-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0f.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0f schema2',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0f.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0F SCHEMA2',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,6000));
  try{ const r=await fetch(WP+'/?ps_p0=SCH2'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
