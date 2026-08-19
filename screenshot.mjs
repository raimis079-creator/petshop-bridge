process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEyNyddKSA/ICRfR0VUWydwc19oMTI3J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTI3Jyk7CiAka2wgPSAnQXV0b21hdHRpY1xXb29Db21tZXJjZVxJbnRlcm5hbFxEYXRhU3RvcmVzXE9yZGVyc1xPcmRlcnNUYWJsZURhdGFTdG9yZSc7CiB0cnkgewogICAkcmMgPSBuZXcgUmVmbGVjdGlvbk1ldGhvZCgka2wsICdnZXRfdW5wYWlkX29yZGVyc19nbXQnKTsKICAgJGVpbCA9IGZpbGUoJHJjLT5nZXRGaWxlTmFtZSgpLCBGSUxFX0lHTk9SRV9ORVdfTElORVMpOwogICAkayA9IGFycmF5KCk7CiAgIGZvcigkaT0kcmMtPmdldFN0YXJ0TGluZSgpLTE7ICRpIDwgbWluKCRyYy0+Z2V0RW5kTGluZSgpLCBjb3VudCgkZWlsKSk7ICRpKyspCiAgICAgJGtbXSA9ICgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRlaWxbJGldLDAsMTkwKSk7CiAgICRvWydnZXRfdW5wYWlkX29yZGVyc19nbXQnXSA9ICRrOwogfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAvKiBSRUFMVVMgYmFuZHltYXM6IGthIGdyYXppbmEgREFCQVIgc3UgOTAgbWluIHJpYmEgKi8KICRkcyA9IFdDX0RhdGFfU3RvcmU6OmxvYWQoJ29yZGVyJyk7CiAkcmliYSA9IHN0cnRvdGltZSgnLTkwIE1JTlVURVMnLCBjdXJyZW50X3RpbWUoJ3RpbWVzdGFtcCcpKTsKICRzYXIgPSAkZHMtPmdldF91bnBhaWRfb3JkZXJzKCRyaWJhKTsKICRvWydncmF6aW5hX2RhYmFyJ10gPSBhcnJheSgpOwogZm9yZWFjaCgoYXJyYXkpJHNhciBhcyAkaWQpewogICAkdSA9IHdjX2dldF9vcmRlcigkaWQpOwogICBpZighJHUpIGNvbnRpbnVlOwogICAkb1snZ3JhemluYV9kYWJhciddW10gPSBhcnJheSgnbnInPT4kaWQsJ2J1c2VuYSc9PiR1LT5nZXRfc3RhdHVzKCksJ2J1ZGFzJz0+JHUtPmdldF9wYXltZW50X21ldGhvZCgpLAogICAgICdzdWt1cnRhJz0+KHN0cmluZykkdS0+Z2V0X2RhdGVfY3JlYXRlZCgpKTsKIH0KICRvWydncmF6aW5hX2tpZWsnXSA9IGNvdW50KChhcnJheSkkc2FyKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H127'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H127 unpaid statusai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h127=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h127.json', Buffer.from(JSON.stringify(out,null,1)), 'h127 unpaid statusai');
