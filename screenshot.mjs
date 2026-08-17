process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pID8gJF9HRVRbJ3BzX3N2J10gOiAnJykgIT09ICdTVlJFQzInKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoNjAwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nU1ZSRUMyJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKCiAvKiBLYW5kaWRhdGFpOiBWSVNLQVMgaXNza3lydXMgdmYgaXIgemIgKGp1b3MgcHJhbGVpZHppYW0gcGFnYWwgc2F2aW5pbmtvIG51cm9keW1hKSAqLwogJGlkcz0kd3BkYi0+Z2V0X2NvbCgiCiAgIFNFTEVDVCBwLklEIEZST00geyRQfXBvc3RzIHAKICAgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnCiAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykKICAgICBBTkQgKCBzLm1ldGFfdmFsdWUgSVMgTlVMTCBPUiBzLm1ldGFfdmFsdWUgTk9UIElOKCd2ZicsJ3piJykgKQogICBPUkRFUiBCWSBwLklEIik7CiAkb1sna2FuZGlkYXR1J109Y291bnQoJGlkcyk7CiBpZiAoISRpZHMpIHsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiAkaW49aW1wbG9kZSgnLCcsIGFycmF5X21hcCgnaW50dmFsJywkaWRzKSk7CiAkbWV0YT1hcnJheSgpOwogJHJzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsIG1ldGFfa2V5LCBtZXRhX3ZhbHVlIEZST00geyRQfXBvc3RtZXRhCiAgIFdIRVJFIHBvc3RfaWQgSU4gKCRpbikgQU5EIG1ldGFfa2V5IElOKCdfc2t1JywnX2VhbicsJ19wc19zYW5kZWxpcycsJ19jb3N0X3ByaWNlJywnX3piX2VhbicsJ192Zl9iYXJjb2RlJywnX2xlZ2FjeV9tYW51ZmFjdHVyZXInKSIsIEFSUkFZX0EpOwogZm9yZWFjaCAoJHJzIGFzICRyKSB7ICRtZXRhWyRyWydwb3N0X2lkJ11dWyRyWydtZXRhX2tleSddXSA9ICRyWydtZXRhX3ZhbHVlJ107IH0KCiAkdHQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsIHBvc3RfdGl0bGUsIHBvc3Rfc3RhdHVzIEZST00geyRQfXBvc3RzIFdIRVJFIElEIElOICgkaW4pIiwgQVJSQVlfQSk7CiAkb3V0PWFycmF5KCk7CiBmb3JlYWNoICgkdHQgYXMgJHQpIHsKICAgJGlkPShpbnQpJHRbJ0lEJ107ICRtPWlzc2V0KCRtZXRhWyRpZF0pPyRtZXRhWyRpZF06YXJyYXkoKTsKICAgJGM9aXNzZXQoJG1bJ19jb3N0X3ByaWNlJ10pPyhmbG9hdCkkbVsnX2Nvc3RfcHJpY2UnXTowOwogICAkb3V0W109YXJyYXkoCiAgICAgJ2lkJz0+JGlkLAogICAgICd0Jz0+JHRbJ3Bvc3RfdGl0bGUnXSwKICAgICAnc3QnPT4oJHRbJ3Bvc3Rfc3RhdHVzJ109PT0ncHVibGlzaCc/MTowKSwKICAgICAnc2t1Jz0+aXNzZXQoJG1bJ19za3UnXSk/JG1bJ19za3UnXTonJywKICAgICAnZWFuJz0+aXNzZXQoJG1bJ19lYW4nXSk/JG1bJ19lYW4nXTonJywKICAgICAnc2FuZCc9Pmlzc2V0KCRtWydfcHNfc2FuZGVsaXMnXSk/JG1bJ19wc19zYW5kZWxpcyddOicnLAogICAgICdjb3N0Jz0+JGMsCiAgICk7CiB9CiAkb1sncHJla2VzJ109JG91dDsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'SVREC2'};
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
  const s=await snip('TEMP SVREC2',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=SVREC2')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('svrec2.json', Buffer.from(JSON.stringify(out)), 'svrec2');
console.log('ok');
