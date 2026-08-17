process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdTVlExJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1NWUTEnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JFB9cG9zdHMgcAogICBKT0lOIHskUH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU9J3F1YXR0cm8nCiAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykiKTsKICRvWydxdWF0dHJvX24nXT1jb3VudCgkaWRzKTsKIGlmKCEkaWRzKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRpbj1pbXBsb2RlKCcsJywgYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpKTsKICRtZXRhPWFycmF5KCk7CiAkcnM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCwgbWV0YV9rZXksIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZCBJTiAoJGluKQogICBBTkQgbWV0YV9rZXkgSU4oJ19za3UnLCdfZWFuJywnX2Nvc3RfcHJpY2UnLCdfY29zdF9wcmljZV9zb3VyY2UnLCdfcmVndWxhcl9wcmljZScsJ19zdG9jaycsJ19vd25fc3RvY2tfcXR5JywnX21hbnVhbF9wcmljZV9vdmVycmlkZScpIiwgQVJSQVlfQSk7CiBmb3JlYWNoKCRycyBhcyAkcil7ICRtZXRhWyRyWydwb3N0X2lkJ11dWyRyWydtZXRhX2tleSddXT0kclsnbWV0YV92YWx1ZSddOyB9CiAkdHQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsIHBvc3RfdGl0bGUsIHBvc3Rfc3RhdHVzIEZST00geyRQfXBvc3RzIFdIRVJFIElEIElOICgkaW4pIiwgQVJSQVlfQSk7CiAkb3V0PWFycmF5KCk7CiBmb3JlYWNoKCR0dCBhcyAkdCl7ICRpZD0oaW50KSR0WydJRCddOyAkbT1pc3NldCgkbWV0YVskaWRdKT8kbWV0YVskaWRdOmFycmF5KCk7CiAgICRvd249aXNzZXQoJG1bJ19vd25fc3RvY2tfcXR5J10pPyhmbG9hdCkkbVsnX293bl9zdG9ja19xdHknXTowOyAkc3Q9aXNzZXQoJG1bJ19zdG9jayddKT8oZmxvYXQpJG1bJ19zdG9jayddOjA7CiAgICRvdXRbXT1hcnJheSgnaWQnPT4kaWQsJ3QnPT4kdFsncG9zdF90aXRsZSddLCdzdCc9PigkdFsncG9zdF9zdGF0dXMnXT09PSdwdWJsaXNoJz8xOjApLAogICAgICdza3UnPT5pc3NldCgkbVsnX3NrdSddKT8kbVsnX3NrdSddOicnLCdlYW4nPT5pc3NldCgkbVsnX2VhbiddKT8kbVsnX2VhbiddOicnLAogICAgICdjb3N0Jz0+aXNzZXQoJG1bJ19jb3N0X3ByaWNlJ10pPyhmbG9hdCkkbVsnX2Nvc3RfcHJpY2UnXTowLAogICAgICdzcmMnPT5pc3NldCgkbVsnX2Nvc3RfcHJpY2Vfc291cmNlJ10pPyRtWydfY29zdF9wcmljZV9zb3VyY2UnXTonJywKICAgICAna2FpbmEnPT5pc3NldCgkbVsnX3JlZ3VsYXJfcHJpY2UnXSk/KGZsb2F0KSRtWydfcmVndWxhcl9wcmljZSddOjAsCiAgICAgJ2xpayc9Pigkb3duPjA/JG93bjokc3QpLAogICAgICdsb2NrJz0+aXNzZXQoJG1bJ19tYW51YWxfcHJpY2Vfb3ZlcnJpZGUnXSk/JG1bJ19tYW51YWxfcHJpY2Vfb3ZlcnJpZGUnXTonJyk7CiB9CiAkb1sncHJla2VzJ109JG91dDsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'SVQ1'};
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
  const s=await snip('TEMP SVQ1',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=SVQ1')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('svq1.json', Buffer.from(JSON.stringify(out)), 'svq1');
console.log('ok');
