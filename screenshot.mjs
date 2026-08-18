process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5OTInXSk/JF9HRVRbJ3BzX2c5OTInXTonJykgIT09ICdHOTkyJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidHOTkyJyk7ICRUWD0ncHJvZHVjdF9icmFuZCc7CgogJHNlbmE9d3BfZ2V0X3Bvc3RfdGVybXMoMTYxMzIsJFRYLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAkb1snYnV2byddPShpc19hcnJheSgkc2VuYSkmJiRzZW5hKT8kc2VuYVswXTonJzsKCiAkdD1nZXRfdGVybV9ieSgnbmFtZScsJ1NJTElDQSBHRUwnLCRUWCk7CiBpZighJHQpeyAkcj13cF9pbnNlcnRfdGVybSgnU0lMSUNBIEdFTCcsJFRYKTsgaWYoaXNfd3BfZXJyb3IoJHIpKXsgJG9bJ05VVFJBVUtUQSddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfSAkdD1nZXRfdGVybSgkclsndGVybV9pZCddLCRUWCk7ICRvWydzdWt1cnRhcyddPTE7IH0KIHdwX3NldF9vYmplY3RfdGVybXMoMTYxMzIsIGFycmF5KChpbnQpJHQtPnRlcm1faWQpLCAkVFgsIGZhbHNlKTsKCiAvKiBWZXRmYXJtYXMgdGVybWluYXMg4oCUIGplaSBsaWtvIHR1c2NpYXMsIHNhbGluYW0gKi8KICR2PWdldF90ZXJtX2J5KCduYW1lJywnVmV0ZmFybWFzJywkVFgpOwogaWYoJHYpewogICAkb1sndmV0ZmFybWFzX3ByZWtpdSddPShpbnQpJHYtPmNvdW50OwogICAkbGlrbz1nZXRfb2JqZWN0c19pbl90ZXJtKGFycmF5KCR2LT50ZXJtX2lkKSwkVFgpOwogICAkb1sndmV0ZmFybWFzX2xpa28nXT1jb3VudCgkbGlrbyk7CiAgIGlmKGNvdW50KCRsaWtvKT09PTApeyB3cF9kZWxldGVfdGVybSgkdi0+dGVybV9pZCwkVFgpOyAkb1sndmV0ZmFybWFzX2lzdHJpbnRhcyddPTE7IH0KIH0KICRwbz13cF9nZXRfcG9zdF90ZXJtcygxNjEzMiwkVFgsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKICRvWydkYWJhciddPShpc19hcnJheSgkcG8pJiYkcG8pPyRwb1swXTonJzsKICRvWyd6ZW5rbHUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9dGVybV90YXhvbm9teSBXSEVSRSB0YXhvbm9teT0nJFRYJyIpOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G992'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G992 silica',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g992=G992')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g992.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g992');
