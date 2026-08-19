process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEwNSddKSA/ICRfR0VUWydwc19oMTA1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTA1Jyk7CiAkb1snc2thaXRpa2xpdV9EQiddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnXF90cmFuc2llbnRcX3BzXF9sZ25cXyUnIik7CiAkbXUgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxvZ2luLXNhcmdhcy5waHAnOwogJG9bJ211X3lyYSddPWZpbGVfZXhpc3RzKCRtdSk7ICRvWydtdV9tZDUnXT1maWxlX2V4aXN0cygkbXUpP21kNV9maWxlKCRtdSk6bnVsbDsKICRvWydrbGFzZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9QcmlzaWp1bmdpbW9fU2FyZ2FzJyk/J3V6a3JhdXRhJzonTkVVWktSQVVUQSc7CiBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUHJpc2lqdW5naW1vX1NhcmdhcycpKXsKICAgJGIgPSBQZXRzaG9wX1ByaXNpanVuZ2ltb19TYXJnYXM6OmJ1a2xlKCk7CiAgICRvWydzZXJ2ZXJpb19idWtsZSddPSRiOwogfQogJHVwPXdwX3VwbG9hZF9kaXIoKTsKICRvWyd2ZWxpYXZhJ109ZmlsZV9leGlzdHModHJhaWxpbmdzbGFzaGl0KCR1cFsnYmFzZWRpciddKS4ncHMtbG9naW4tc2FyZ2FzLm9mZicpPydZUkEgKHNhcmdhcyBpc2p1bmd0YXMpJzonbmVyYSAoc2FyZ2FzIGRpcmJhKSc7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H105'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  out.login_GET = await (async()=>{ try{const r=await fetch(WP+'/wp-login.php'); const t=await r.text();
    return {http:r.status, pristabdyta:/pristabdytas|Per daug/i.test(t)?'TAIP':'ne'};}catch(e){return {klaida:String(e).slice(0,90)};} })();

  await miegok(1200);
  out.vienas_bandymas = await (async()=>{ try{
    const b=new URLSearchParams({log:'nesamas_testas_h105', pwd:'blogas-1', 'wp-submit':'Prisijungti', testcookie:'1'});
    const r=await fetch(WP+'/wp-login.php',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString(),redirect:'manual'});
    const t=await r.text();
    return {http:r.status, uzrakinta:/Per daug nesėkmingų|pristabdytas/i.test(t)?'TAIP':'ne',
            iprasta_klaida:/Klaida|neteisingas|nežinomas|Unknown|incorrect/i.test(t)?'taip':'ne'};
  }catch(e){ return {klaida:String(e).slice(0,90)}; } })();

  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H105 sargo bukle',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h105=GO'); const tt=await rr.text();
  try{ out.SERVERIS=JSON.parse(tt); }catch(e){ out.SERVERIS={ZALIAS:tt.slice(0,400)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  out.frontas=(await fetch(WP+'/',{redirect:'manual'})).status;
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h105.json', Buffer.from(JSON.stringify(out,null,1)), 'h105 sargo bukle po valymo');
