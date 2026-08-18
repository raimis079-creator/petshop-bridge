process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5MzAnXSk/JF9HRVRbJ3BzX2c5MzAnXTonJykgIT09ICdHOTMwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5MzAnKTsKCiAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J193ZWlnaHQnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgc3YsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19za3UnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgc2t1LAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgc2FuZAogIEZST00geyRQfXBvc3RzIHAgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5IElOICgnX3dlaWdodCcsJ19za3UnLCdfcHNfc2FuZGVsaXMnKQogIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgcC5JRCIsIEFSUkFZX0EpOwoKICRlaWw9YXJyYXkoKTsKIGZvcmVhY2goJHJvd3MgYXMgJHIpewogICAkaWQ9KGludCkkclsnSUQnXTsKICAgJGt0PWdldF90aGVfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcpOyAka2F0PScnOwogICBpZigka3QgJiYgIWlzX3dwX2Vycm9yKCRrdCkpeyAkZz0tMTsgZm9yZWFjaCgka3QgYXMgJHQpeyAkeD1jb3VudChnZXRfYW5jZXN0b3JzKCR0LT50ZXJtX2lkLCdwcm9kdWN0X2NhdCcpKTsgaWYoJHg+JGcpeyRnPSR4OyRrYXQ9JHQtPm5hbWU7fSB9IH0KICAgJHBhaz0nJzsgJHR0PXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncGFfcGFrdW90ZXNfZHlkaXMnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgIGlmKCR0dCAmJiAhaXNfd3BfZXJyb3IoJHR0KSkgJHBhaz1pbXBsb2RlKCcsICcsJHR0KTsKICAgJGVpbFtdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+JHJbJ3Bvc3RfdGl0bGUnXSwnc3YnPT4kclsnc3YnXSwnc2t1Jz0+JHJbJ3NrdSddLAogICAgICdzYW5kJz0+JHJbJ3NhbmQnXSwna2F0Jz0+JGthdCwncGFrJz0+JHBhayk7CiB9CiAkb1sna2llayddPWNvdW50KCRlaWwpOwogJG9bJ2I2NCddPWJhc2U2NF9lbmNvZGUoZ3plbmNvZGUod3BfanNvbl9lbmNvZGUoJGVpbCksNikpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G930'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G930 svoriai',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g930=G930')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g930.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g930');
