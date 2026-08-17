process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX245NDEnXSk/JF9HRVRbJ3BzX245NDEnXTonJykhPT0nTjk0MScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJHI9JHdwZGItPmdldF9yZXN1bHRzKCIKICBTRUxFQ1QgcC5JRCBpZCwgcC5wb3N0X3RpdGxlIHQsIHAucG9zdF9zdGF0dXMgc3QsCiAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHNhbmQsCiAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3NrdScgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBza3UsCiAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX2VhbicgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBlYW4sCiAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3ByaWNlJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGthaW5hLAogICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19zdG9jaycgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBzdG9jaywKICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfdmZfcXR5JyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHZmcSwKICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfY29zdF9wcmljZScgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBjX2F2LAogICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J192Zl9jb3N0JyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGNfdmYsCiAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3piX2Nvc3QnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgY196YiwKICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfbGVnYWN5X21hbnVmYWN0dXJlcicgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBnYW0KICBGUk9NIHskUH1wb3N0cyBwIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRAogIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykKICBHUk9VUCBCWSBwLklEIiwgQVJSQVlfQSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCd2Jz0+J045NDEnLCduJz0+Y291bnQoJHIpLCdkJz0+JHIpKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'N941'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP N941',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_n941=N941');
  const buf=Buffer.from(await r.arrayBuffer());
  out.baitai=buf.length;
  const zlib=await import('zlib');
  out.put=await put('n941.json.gz', zlib.gzipSync(buf), 'n941 visos prekes');
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('n941.json', Buffer.from(JSON.stringify(out)), 'n941 meta');
