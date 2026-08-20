process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE3MSddKSA/ICRfR0VUWydwc19oMTcxJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgyNDApOwogJG89YXJyYXkoJ3YnPT4nSDE3MScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidUSUtSQVMgUFVTTEFQSVMnKTsKCiAvKiBSYWltaW8gVVJMIDE6MSAqLwogJF9HRVQgPSBhcnJheSgncGFnZSc9Pidwcy1rYXRhbG9nYXMnLCdrcnV2YSc9PidwcmVreWJvamUnLCd2aWV3Jz0+J3plbWlhdV9yaWJvcycsJ3EnPT4nZXhjbHVzJyk7CiAkX1JFUVVFU1QgPSAkX0dFVDsKCiAkcmMgPSBuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0thdGFsb2dhcycpOwogLyoga3VyaXMgbWV0b2RhcyBwaWVzaWEgcHVzbGFwaSAqLwogJGthbmQ9YXJyYXkoKTsKIGZvcmVhY2goJHJjLT5nZXRNZXRob2RzKCkgYXMgJG0pewogICBpZigkbS0+aXNTdGF0aWMoKSAmJiBjb3VudCgkbS0+Z2V0UGFyYW1ldGVycygpKT09PTAgJiYKICAgICAgcHJlZ19tYXRjaCgnL14ocHVzbGFwaXN8cmVuZGVyfGxhbmdhc3xla3JhbmFzfHBhZ2V8cm9keXRpfGthdGFsb2dhcykkL2knLCRtLT5nZXROYW1lKCkpKSAka2FuZFtdPSRtLT5nZXROYW1lKCk7CiB9CiAkb1sna2FuZGlkYXRhaSddPSRrYW5kOwogaWYoISRrYW5kKXsKICAgJHY9YXJyYXkoKTsgZm9yZWFjaCgkcmMtPmdldE1ldGhvZHMoKSBhcyAkbSl7IGlmKCRtLT5pc1N0YXRpYygpICYmIGNvdW50KCRtLT5nZXRQYXJhbWV0ZXJzKCkpPT09MCkgJHZbXT0kbS0+Z2V0TmFtZSgpOyB9CiAgICRvWyd2aXNpX2JlX3BhcmFtJ109JHY7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OwogfQogJG09JHJjLT5nZXRNZXRob2QoJGthbmRbMF0pOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKIG9iX3N0YXJ0KCk7CiB0cnkgeyAkbS0+aW52b2tlKG51bGwpOyB9IGNhdGNoKFRocm93YWJsZSAkZSl7IGVjaG8gIlxuS0xBSURBOiAiLiRlLT5nZXRNZXNzYWdlKCk7IH0KICRodG1sPW9iX2dldF9jbGVhbigpOwogJG9bJ21ldG9kYXMnXT0ka2FuZFswXTsKICRvWydodG1sX2lsZ2lzJ109c3RybGVuKCRodG1sKTsKCiBpZihwcmVnX21hdGNoKCcvPGRpdiBjbGFzcz0iZnJsaW5lIGZybC1zYW50Ij4oLio/KTxcL2Rpdj4vcycsJGh0bWwsJHMpKXsKICAgJG9bJ1NBTlRSQVVLQSddPXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRzWzFdKSkpOwogfSBlbHNlIHsgJG9bJ1NBTlRSQVVLQSddPSdORVJBU1RBIGZybC1zYW50JzsgfQogJG9bJ3lyYV9maWx0cnVfbmVyYSddID0gKG1iX3N0cnBvcygkaHRtbCwnZmlsdHLFsyBuxJdyYScpIT09ZmFsc2UpOwogJG9bJ3lyYV9wYWllc2thX3p5bWUnXT0gKG1iX3N0cnBvcygkaHRtbCwncGFpZcWha2E6IGV4Y2x1cycpIT09ZmFsc2UpOwogJG9bJ3lyYV9laWxlX3p5bWUnXSAgID0gKG1iX3N0cnBvcygkaHRtbCwnxb5lbWlhdSBtYXLFvm9zIHJpYm9zJykhPT1mYWxzZSk7CiBpZihwcmVnX21hdGNoX2FsbCgnL2NsYXNzPSJjbGVhciIgaHJlZj0iKFteIl0rKSIvJywkaHRtbCwkbW0pKXsKICAgJG9bJ2NsZWFyX251b3JvZG9zJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR1KXtyZXR1cm4gaHRtbF9lbnRpdHlfZGVjb2RlKCR1KTt9LCRtbVsxXSk7CiB9CiAvKiBraWVrIHByZWtpdSByZWFsaWFpIHJhZG8gKi8KIGlmKHByZWdfbWF0Y2goJy9WaXNvOlxzKihbMC05XHNdKykvdScsd3Bfc3RyaXBfYWxsX3RhZ3MoJGh0bWwpLCR2dikpICRvWyd2aXNvJ109dHJpbSgkdnZbMV0pOwogaWYocHJlZ19tYXRjaCgnL1BhZ2FsIMWhaXVvcyBmaWx0cnVzIHByZWtpxbMgbsSXcmEvdScsJGh0bWwpKSAkb1sndHVzY2lhJ109J1RBSVAnOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H171'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H171 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h171=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h171.json', Buffer.from(JSON.stringify(out,null,1)), 'h171 Monge merge APPLY');
