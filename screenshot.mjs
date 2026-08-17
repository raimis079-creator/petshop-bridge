process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3Q5MzMnXSk/JF9HRVRbJ3BzX3Q5MzMnXTonJykhPT0nVDkzMycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidUOTMzJyk7CiAvKiAxLiBWQUxZTUFTIHBpcm1pYXVzaWEgKi8KICRsaWtvPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9zdGF0dXMscG9zdF90eXBlIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdGl0bGUgTElLRSAnJVBTLVRFU1QtOTMyJSciLCBBUlJBWV9BKTsKICRvWydyYXN0YSddPSRsaWtvOwogZm9yZWFjaCgkbGlrbyBhcyAkcil7CiAgICRwcj13Y19nZXRfcHJvZHVjdCgoaW50KSRyWydJRCddKTsKICAgaWYoJHByKSAkcHItPmRlbGV0ZSh0cnVlKTsgZWxzZSB3cF9kZWxldGVfcG9zdCgoaW50KSRyWydJRCddLCB0cnVlKTsKIH0KICRvWydsaWtvX3BvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdGl0bGUgTElLRSAnJVBTLVRFU1QtOTMyJSciKTsKIC8qIDIuIFBBUkFTQUkgLSBuZSBzcGV0aSAqLwogZm9yZWFjaChhcnJheSgnc2V0X2NoaWxkX2l0ZW1zJywnc2F2ZV9jaGlsZF9pdGVtcycsJ2dldF9jaGlsZF9pdGVtcycsJ2lzX2FsbG93ZWRfY2hpbGRfcHJvZHVjdCcpIGFzICRtKXsKICAgaWYobWV0aG9kX2V4aXN0cygnV0NfUHJvZHVjdF9NaXhfYW5kX01hdGNoJywkbSkpewogICAgICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdXQ19Qcm9kdWN0X01peF9hbmRfTWF0Y2gnLCRtKTsKICAgICAkcGFyPWFycmF5KCk7IGZvcmVhY2goJHItPmdldFBhcmFtZXRlcnMoKSBhcyAkcCkgJHBhcltdPSckJy4kcC0+Z2V0TmFtZSgpLigkcC0+aXNPcHRpb25hbCgpPyc9Jy5qc29uX2VuY29kZSgkcC0+aXNEZWZhdWx0VmFsdWVBdmFpbGFibGUoKT8kcC0+Z2V0RGVmYXVsdFZhbHVlKCk6bnVsbCk6JycpOwogICAgICRvWydwYXJhc2FpJ11bJG1dPWFycmF5KCd2aWV0YSc9PiRyLT5pc1B1YmxpYygpPydwdWJsaWMnOidwcml2YXRlJywncGFyJz0+aW1wbG9kZSgnLCAnLCRwYXIpLCdlaWwnPT4kci0+Z2V0U3RhcnRMaW5lKCkpOwogICB9CiB9CiAvKiBzZXRfY2hpbGRfaXRlbXMga29kYXMgKi8KICRmPVdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS1taXgtYW5kLW1hdGNoLXByb2R1Y3RzL2luY2x1ZGVzL2NsYXNzLXdjLXByb2R1Y3QtbWl4LWFuZC1tYXRjaC5waHAnOwogaWYoaXNfcmVhZGFibGUoJGYpKXsKICAgJGw9ZmlsZSgkZik7CiAgIGZvcmVhY2goYXJyYXkoJ3NldF9jaGlsZF9pdGVtcycsJ3NhdmVfY2hpbGRfaXRlbXMnKSBhcyAkbSl7CiAgICAgaWYoaXNzZXQoJG9bJ3BhcmFzYWknXVskbV0pKXsKICAgICAgICRzPSRvWydwYXJhc2FpJ11bJG1dWydlaWwnXS0xOwogICAgICAgJG9bJ2tvZGFzJ11bJG1dPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGwsJHMsNDIpKTsKICAgICB9CiAgIH0KIH0KIC8qIDMuIGthaXAgZXNhbWFzIHJpbmtpbnlzIGxhaWtvIHZhaWt1cyAqLwogJHBpZD0zNDE1MzsKICR0PSR3cGRiLT5wcmVmaXguJ3djX21ubV9jaGlsZF9pdGVtcyc7CiBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIik9PT0kdCl7CiAgICRvWydsZW50ZWxlX3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gYCR0YCIpOwogICAkb1sncHZ6X3ZhaWthaSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSBgJHRgIFdIRVJFIGNvbnRhaW5lcl9pZD0lZCBMSU1JVCA0IiwkcGlkKSwgQVJSQVlfQSk7CiB9IGVsc2UgJG9bJ2xlbnRlbGUnXT0nbmVyYSAnLiR0OwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'T933'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP T933',B64);
  out.snip=s;
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_t933=T933');
  out.http=r.status;
  const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,1200); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('t933.json', Buffer.from(JSON.stringify(out)), 't933 valymas');
