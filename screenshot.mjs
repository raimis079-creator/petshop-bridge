process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const CODE=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3JlYzYnXSA/PyAnJykgIT09ICdSZWMwODE0ZScpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJJG89YXJyYXkoJ21hcmtlcic9PidLSUVLSU8gTEFVS0VMSU8gVkFSREFTJyk7CgkkZGlyPVdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS1taXgtYW5kLW1hdGNoLXByb2R1Y3RzJzsKCSRmPSRkaXIuJy9pbmNsdWRlcy9jbGFzcy13Yy1tbm0tY2hpbGQtaXRlbS5waHAnOwoJJGU9ZmlsZSgkZik7Cgkkb1snZ2V0X3F1YW50aXR5X2lucHV0X25hbWUnXT1pbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkZSwgODg1LCA0NSkpOwoJLyogcmVhbHVzIHZhcmRhcyBneXZhaSAqLwoJJHA9d2NfZ2V0X3Byb2R1Y3QoMzQ5MzIpOwoJJGNoPSRwLT5nZXRfY2hpbGRfaXRlbXMoKTsgJHBpcm1hcz1yZXNldCgkY2gpOwoJaWYgKCRwaXJtYXMpIHsKCQlmb3JlYWNoIChhcnJheSgnZ2V0X3F1YW50aXR5X2lucHV0X25hbWUnLCdnZXRfcXVhbnRpdHlfaW5wdXRfaWQnLCdnZXRfY2hpbGRfaXRlbV9pZCcsJ2dldF9wcm9kdWN0X2lkJykgYXMgJG0pIHsKCQkJJG9bJ2d5dmFpJ11bJG1dPSBtZXRob2RfZXhpc3RzKCRwaXJtYXMsJG0pID8gJHBpcm1hcy0+JG0oKSA6ICduZXJhJzsKCQl9CgkJJG9bJ3Zpc2lfbWV0b2RhaSddPWdldF9jbGFzc19tZXRob2RzKCRwaXJtYXMpOwoJfQoJLyogY29udGFpbmVyIHN0YXR1cyAvIHZhbGlkYWNpam9zIEpTIHBhcmFtZXRyYWkgKi8KCSRvWydkYXRhX2F0dHJpYnV0ZXMnXT0kcC0+Z2V0X2RhdGFfYXR0cmlidXRlcygpOwoJJG9bJ21pbiddPSRwLT5nZXRfbWluX2NvbnRhaW5lcl9zaXplKCk7ICRvWydtYXgnXT0kcC0+Z2V0X21heF9jb250YWluZXJfc2l6ZSgpOwoJJG9bJ3ByaWNlZCddPSRwLT5pc19wcmljZWRfcGVyX3Byb2R1Y3QoKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,j:await r.text()}; }
const out={};
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP REC6',code:CODE,scope:'global',active:true,priority:5})});
out.snip_status=cr.s;
let id=null; try{ id=JSON.parse(cr.j).id; }catch(e){}
out.snip_id=id;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_rec6=Rec0814e'); out.http=r.status; const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); } }catch(e){ out.err=String(e).slice(0,120); }
if(id){ await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec6.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rec',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec6.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status,JSON.stringify(out).length);
