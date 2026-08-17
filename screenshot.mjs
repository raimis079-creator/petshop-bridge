process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdSRUNEJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1JFQ0QnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwoKICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykiKTsKICRpbj1pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJGlkcykpOwogJG09YXJyYXkoKTsKICRycz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X2lkLCBtZXRhX2tleSwgbWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkIElOICgkaW4pCiAgIEFORCBtZXRhX2tleSBJTignX3BzX3NhbmRlbGlzJywnX293bl9zdG9ja19xdHknLCdfc3RvY2snLCdfdmZfcXR5JywnX3piX3F0eScsJ19za3UnKSIsIEFSUkFZX0EpOwogZm9yZWFjaCgkcnMgYXMgJHIpeyAkbVskclsncG9zdF9pZCddXVskclsnbWV0YV9rZXknXV09JHJbJ21ldGFfdmFsdWUnXTsgfQoKICRkdmk9YXJyYXkoKTsgJHNhbnQ9YXJyYXkoKTsKIGZvcmVhY2goJG0gYXMgJGlkPT4keCl7CiAgICRzYW5kPWlzc2V0KCR4WydfcHNfc2FuZGVsaXMnXSk/JHhbJ19wc19zYW5kZWxpcyddOicobmVyYSknOwogICAkb3duID1pc3NldCgkeFsnX293bl9zdG9ja19xdHknXSk/KGZsb2F0KSR4Wydfb3duX3N0b2NrX3F0eSddOjA7CiAgICR2ZiAgPWlzc2V0KCR4WydfdmZfcXR5J10pPyhmbG9hdCkkeFsnX3ZmX3F0eSddOjA7CiAgICR6YiAgPWlzc2V0KCR4WydfemJfcXR5J10pPyhmbG9hdCkkeFsnX3piX3F0eSddOjA7CiAgICRzdCAgPWlzc2V0KCR4Wydfc3RvY2snXSk/KGZsb2F0KSR4Wydfc3RvY2snXTowOwogICAkdHVyaV9hdiA9ICgkb3duPjApOwogICAkdHVyaV90aWVrID0gKCR2Zj4wIHx8ICR6Yj4wKTsKICAgJGs9JHNhbmQuJ3xhdj0nLigkdHVyaV9hdj8xOjApLid8dGllaz0nLigkdHVyaV90aWVrPzE6MCk7CiAgICRzYW50WyRrXT1pc3NldCgkc2FudFska10pPyRzYW50WyRrXSsxOjE7CiAgIGlmICgkdHVyaV9hdiAmJiAkdHVyaV90aWVrKSB7CiAgICAgJGR2aVtdPWFycmF5KCdpZCc9PihpbnQpJGlkLCdzYW5kJz0+JHNhbmQsJ293bic9PiRvd24sJ3ZmJz0+JHZmLCd6Yic9PiR6Yiwnc3RvY2snPT4kc3QsCiAgICAgICAnc2t1Jz0+aXNzZXQoJHhbJ19za3UnXSk/JHhbJ19za3UnXTonJywgJ3QnPT5nZXRfdGhlX3RpdGxlKCRpZCkpOwogICB9CiB9CiAkb1snZHZpZ3VidSddPWNvdW50KCRkdmkpOyAkb1snZHZpZ3Vib3MnXT1hcnJheV9zbGljZSgkZHZpLDAsMjUpOwogYXJzb3J0KCRzYW50KTsgJG9bJ3NhbnRyYXVrYSddPWFycmF5X3NsaWNlKCRzYW50LDAsMjAsdHJ1ZSk7CiAvKiBraWVrIGlzIHZpc28gdHVyaSBfb3duX3N0b2NrX3F0eSB1enBpbGR5dGEgKGJldCBrb2tpYSByZWlrc21lKSAqLwogJG9bJ293bl9maWVsZF95cmEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyBBTkQgbWV0YV92YWx1ZTw+JyciKTsKICRvWydvd25fZ3QwJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgQU5EIENBU1QobWV0YV92YWx1ZSBBUyBERUNJTUFMKDEyLDIpKT4wIik7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'RECD'};
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
  const s=await snip('TEMP RECD',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=RECD')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('recd.json', Buffer.from(JSON.stringify(out)), 'recd');
console.log('ok');
