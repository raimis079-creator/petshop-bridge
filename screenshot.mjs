process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'KONS-DIAG-6'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'kons diag',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const KODAS_B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2QnXSkgPyAkX0dFVFsncHNfZCddIDogJycpICE9PSAnS09OU1Y2JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyBAc2V0X3RpbWVfbGltaXQoNjAwKTsKICRvID0gYXJyYXkoJ3ZlcnNpamEnPT4nS09OUy1ESUFHLTYnKTsKICR0YXhfc2FyID0gYXJyYXkoJ3BhX21vbm9wcm90ZWluJywncGFfc3BlY2lhbGlfbWl0eWJhJywncGFfYmVfZ3J1ZHUnLCdwYV9iYWx0eW11X3NhbHRpbmlzJywncGFfYW16aXVzJywncGFfcGFrdW90ZXNfZHlkaXMnLCdwcm9kdWN0X2JyYW5kJyk7CiAkcSA9IG5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsJ25vX2ZvdW5kX3Jvd3MnPT50cnVlLAogICAndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4ndGVybV9pZCcsJ3Rlcm1zJz0+YXJyYXkoNzMsNzksODYpLCdpbmNsdWRlX2NoaWxkcmVuJz0+dHJ1ZSkpKSk7CiAkc2FuZD1hcnJheSgpOyAkYnJlbmQ9YXJyYXkoKTsgJHRydWt1bWFpPWFycmF5KCk7CiBmb3JlYWNoICgkcS0+cG9zdHMgYXMgJHBpZCkgewogICAkcyA9IHN0cnRvdXBwZXIoKHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSkgPzogJ0FWJyk7CiAgICRiID0gd3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncHJvZHVjdF9icmFuZCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKICAgJGIgPSAoIWlzX3dwX2Vycm9yKCRiKSAmJiAkYikgPyAkYlswXSA6ICcoYmUgYnJlbmRvKSc7CiAgIGlmICghaXNzZXQoJHNhbmRbJHNdKSkgeyAkc2FuZFskc109YXJyYXkoJ3Zpc28nPT4wKTsgZm9yZWFjaCgkdGF4X3NhciBhcyAkdCl7JHNhbmRbJHNdWyR0XT0wO30gfQogICBpZiAoIWlzc2V0KCRicmVuZFskYl0pKSB7ICRicmVuZFskYl09YXJyYXkoJ3Zpc28nPT4wKTsgZm9yZWFjaCgkdGF4X3NhciBhcyAkdCl7JGJyZW5kWyRiXVskdF09MDt9IH0KICAgJHNhbmRbJHNdWyd2aXNvJ10rKzsgJGJyZW5kWyRiXVsndmlzbyddKys7CiAgIGZvcmVhY2ggKCR0YXhfc2FyIGFzICR0KSB7CiAgICAgJG4gPSB3cF9nZXRfcG9zdF90ZXJtcygkcGlkLCR0LGFycmF5KCdmaWVsZHMnPT4naWRzJykpOwogICAgIGlmICghaXNfd3BfZXJyb3IoJG4pICYmICRuKSB7ICRzYW5kWyRzXVskdF0rKzsgJGJyZW5kWyRiXVskdF0rKzsgfQogICB9CiB9CiAkb1sncGFnYWxfc2FuZGVsaSddPSRzYW5kOwogdWFzb3J0KCRicmVuZCwgZnVuY3Rpb24oJGEsJGIpeyByZXR1cm4gJGJbJ3Zpc28nXSA8PT4gJGFbJ3Zpc28nXTsgfSk7CiAkb1sncGFnYWxfYnJlbmRhJ109JGJyZW5kOwoKIC8qIElEIHNhcmFzYWkgdGFpc3ltdWkgKi8KICR0ciA9IGFycmF5KCdiZV9tb25vJz0+YXJyYXkoKSwnYmVfbWl0eWJvcyc9PmFycmF5KCksJ2JlX2R5ZHppbyc9PmFycmF5KCksJ2JlX2FtemlhdXMnPT5hcnJheSgpLCdiZV9ncnVkdV9uZXJhJz0+YXJyYXkoKSwnYmVfYnJlbmRvJz0+YXJyYXkoKSk7CiBmb3JlYWNoICgkcS0+cG9zdHMgYXMgJHBpZCkgewogICAkdD1mdW5jdGlvbigkdHgpIHVzZSgkcGlkKXsgJG49d3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwkdHgsYXJyYXkoJ2ZpZWxkcyc9PidpZHMnKSk7IHJldHVybiAoIWlzX3dwX2Vycm9yKCRuKSYmJG4pOyB9OwogICBpZighJHQoJ3BhX21vbm9wcm90ZWluJykpICR0clsnYmVfbW9ubyddW109KGludCkkcGlkOwogICBpZighJHQoJ3BhX3NwZWNpYWxpX21pdHliYScpKSAkdHJbJ2JlX21pdHlib3MnXVtdPShpbnQpJHBpZDsKICAgaWYoISR0KCdwYV9wYWt1b3Rlc19keWRpcycpKSAkdHJbJ2JlX2R5ZHppbyddW109KGludCkkcGlkOwogICBpZighJHQoJ3BhX2Fteml1cycpKSAkdHJbJ2JlX2FtemlhdXMnXVtdPShpbnQpJHBpZDsKICAgaWYoISR0KCdwYV9iZV9ncnVkdScpKSAkdHJbJ2JlX2dydWR1X25lcmEnXVtdPShpbnQpJHBpZDsKICAgaWYoISR0KCdwcm9kdWN0X2JyYW5kJykpICR0clsnYmVfYnJlbmRvJ11bXT0oaW50KSRwaWQ7CiB9CiAkb1sna2lla2lhaSddPWFycmF5X21hcCgnY291bnQnLCR0cik7CiAkb1snaWRfc2FyYXNhaSddPSR0cjsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMTMxKTsK';
try{
  const kodas=Buffer.from(KODAS_B64,'base64').toString('utf8');
  const sid=await snip('TEMP KONS DIAG 6', kodas);
  out.snippet_id=sid;
  await new Promise(r=>setTimeout(r,5000));
  const r=await fetch(WP+'/?ps_d=KONSV6');
  const txt=await r.text();
  out.http=r.status;
  try{ out.data=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,3000); out.parse_err=String(e).slice(0,200); }
  await off(sid);
}catch(e){ out.bendra=String(e).slice(0,400); }
await irasyk();
console.log('ok');
