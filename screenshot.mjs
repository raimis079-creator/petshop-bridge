process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2Y5MjInXSk/JF9HRVRbJ3BzX2Y5MjInXTonJykhPT0nRjkyMicpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg5MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidGOTIyJywndHMnPT5kYXRlKCdIOmk6cycpKTsKIGlmKCFjbGFzc19leGlzdHMoJ1BldHNob3BfRnVsZmlsbG1lbnRfU291cmNlJykpeyAkb1sna2xhaWRhJ109J2tsYXNlcyBuZXJhJzsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiAkZWlsPSR3cGRiLT5nZXRfcmVzdWx0cygiCiAgIFNFTEVDVCBwLklEIGlkLCBwLnBvc3Rfc3RhdHVzIHN0LCBDT0FMRVNDRShtLm1ldGFfdmFsdWUsJycpIHNhbmQKICAgRlJPTSB7JFB9cG9zdHMgcCBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycKICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnKQogICBPUkRFUiBCWSBwLklEIiwgQVJSQVlfQSk7CiAkb1sncHJla2l1J109Y291bnQoJGVpbCk7CgogJG1hdHJpY2E9YXJyYXkoKTsgJG5lc3V0PWFycmF5KCk7ICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRuPTA7ICRtYXhtZW09MDsKIGZvcmVhY2goJGVpbCBhcyAkcil7CiAgICRwaWQ9KGludCkkclsnaWQnXTsKICAgJGY9UGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2U6OnJlc29sdmUoJHBpZCk7CiAgICRyZXM9JGZbJ3NvdXJjZSddOyAkc2FuZD0kclsnc2FuZCddPT09Jyc/Jyh0dXNjaWEpJzokclsnc2FuZCddOwogICAkaz0kc2FuZC4nIC0+ICcuJHJlczsKICAgaWYoIWlzc2V0KCRtYXRyaWNhWyRrXSkpICRtYXRyaWNhWyRrXT1hcnJheSgnbic9PjAsJ3B1Ymxpc2gnPT4wLCdkcmFmdCc9PjAsJ3ByaWV6Jz0+YXJyYXkoKSk7CiAgICRtYXRyaWNhWyRrXVsnbiddKys7CiAgICRtYXRyaWNhWyRrXVskclsnc3QnXV0rKzsKICAgJHByPSRmWydyZWFzb24nXTsKICAgJG1hdHJpY2FbJGtdWydwcmlleiddWyRwcl09KGlzc2V0KCRtYXRyaWNhWyRrXVsncHJpZXonXVskcHJdKT8kbWF0cmljYVska11bJ3ByaWV6J11bJHByXTowKSsxOwogICAvKiBuZXN1dGFwaW1hczogYXY8LT5sZWdhY3kgeXJhIHRhcyBwYXRzIGRhbHlrYXMga2l0dSB2YXJkdSAqLwogICAkbm9ybSA9ICgkcmVzPT09J2xlZ2FjeScpID8gJ2F2JyA6ICRyZXM7CiAgIGlmKCRub3JtICE9PSAkclsnc2FuZCddKXsKICAgICAkbmVzdXRbXT1hcnJheSgkcGlkLCRyWydzdCddLCRyWydzYW5kJ10sJHJlcywkcHIpOwogICB9CiAgIC8qIEFUTUlOVElTOiBTNjQ2IHBhbW9rYSAtIGtlc2EgdmFsb20ga2FzIHByZWtlICovCiAgIHdwX2NhY2hlX2RlbGV0ZSgkcGlkLCdwb3N0X21ldGEnKTsgd3BfY2FjaGVfZGVsZXRlKCRwaWQsJ3Bvc3RzJyk7CiAgIGNsZWFuX29iamVjdF90ZXJtX2NhY2hlKCRwaWQsJ3Byb2R1Y3QnKTsKICAgJG4rKzsKICAgaWYoJG4lNDAwPT09MCl7ICRtPW1lbW9yeV9nZXRfdXNhZ2UodHJ1ZSk7IGlmKCRtPiRtYXhtZW0pJG1heG1lbT0kbTsgfQogfQogJG9bJ3RydWttZV9zJ109cm91bmQobWljcm90aW1lKHRydWUpLSR0MCwxKTsKICRvWydhdG1pbnRpc19tYiddPXJvdW5kKG1heCgkbWF4bWVtLG1lbW9yeV9nZXRfcGVha191c2FnZSh0cnVlKSkvMTA0ODU3NiwxKTsKIGFyc29ydCgkbWF0cmljYSk7CiAkb1snbWF0cmljYSddPSRtYXRyaWNhOwogJG9bJ25lc3V0YXBpbXUnXT1jb3VudCgkbmVzdXQpOwogJG9bJ25lc3V0J109JG5lc3V0OwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'F922'};
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
  const s=await snip('TEMP F922',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_f922=F922')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,900); }
  await off(s);
  await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('f922.json', Buffer.from(JSON.stringify(out)), 'f922 diff');
