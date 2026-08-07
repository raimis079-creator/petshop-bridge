const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19hNjgxJ10/PycnKSE9PSdBNjgxeCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDI1MCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidBNjgxJyk7CiAgJHN0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAka29kYXM9JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRzdH0gV0hFUkUgaWQ9NTEyIik7CiAgJG9bJ3NuaXBfaWxnaXMnXT1tYl9zdHJsZW4oJGtvZGFzKTsKICAkb1snc25pcF9iNjQnXT1iYXNlNjRfZW5jb2RlKCRrb2Rhcyk7CiAgLy8ga29raW9zIGZ1bmtjaWpvcyBhcGlicmV6dG9zCiAgcHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhbYS16MC05X10rKVxzKlwoL2knLCRrb2RhcywkbSk7CiAgJG9bJ2Z1bmtjaWpvcyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsKICAvLyBtYXJrZXJpdSBzdGF0aXN0aWthIHZpc29tcyBwdWJsaXNoIHByZWtlbXMKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgJG1hcms9YXJyYXkoJ3N1ZGV0aXMnPT4nL3N1ZFx4ezAxMTd9dC9pdScsJ2FuYWxpdGluZSc9PicvYW5hbGl0aW4vaXUnLCdwcmllZGFpJz0+Jy9wcmllZFthdV0vaXUnLAogICAgJ3NlcmltYXMnPT4nL1x4ezAxNjF9XHh7MDExN31yaW18cmVrb21lbmR1b2phbWFzIGtpZWtpcy9pdScsJ2lzcGVqaW1haSc9PicvXHh7MDEyRn1zcFx4ezAxMTd9amltL2l1JywKICAgICdwYWdhbWludGEnPT4nL3BhZ2FtaW50YS9pdScsJ3BhZ3JpbmRpbmlzJz0+Jy9wYWdyaW5kaW5pcyBhcHJhXHh7MDE2MX15bWFzL2l1Jyk7CiAgJHN0Mj1hcnJheSgndmlzbyc9PjAsJ3R1c2NpYXMnPT4wLCdiZV9qb2tpbyc9PjApOwogIGZvcmVhY2goJG1hcmsgYXMgJGs9PiR2KSAkc3QyWyRrXT0wOwogICRraWVrX3Nla2NpanU9YXJyYXkoKTsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkcGlkKTsKICAgICRzdDJbJ3Zpc28nXSsrOwogICAgaWYodHJpbSh3cF9zdHJpcF9hbGxfdGFncygkYykpPT09JycpeyAkc3QyWyd0dXNjaWFzJ10rKzsgY29udGludWU7IH0KICAgICRuPTA7CiAgICBmb3JlYWNoKCRtYXJrIGFzICRrPT4kdil7IGlmKHByZWdfbWF0Y2goJHYsJGMpKXsgJHN0Mlska10rKzsgJG4rKzsgfSB9CiAgICBpZigkbj09PTApICRzdDJbJ2JlX2pva2lvJ10rKzsKICAgICRraWVrX3Nla2NpanVbJG5dPSgka2lla19zZWtjaWp1WyRuXT8/MCkrMTsKICB9CiAga3NvcnQoJGtpZWtfc2VrY2lqdSk7CiAgJG9bJ21hcmtlcmlhaSddPSRzdDI7CiAgJG9bJ2tpZWtfc2VrY2lqdSddPSRraWVrX3Nla2NpanU7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S681-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Markeriu Statistika (S681)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_a681=A681x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s681_v1.json',out);
console.log('DONE');
