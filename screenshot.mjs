process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA4NCddKSA/ICRfR0VUWydwc19oMDg0J10gOiAnJykgIT09ICdSRUMnKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMTgwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICRvID0gYXJyYXkoJ3YnPT4nSDA4NCcpOwoKICRvWydkYl92YXJkYXMnXSAgICA9IERCX05BTUU7CiAkb1snZGJfdmFydG90b2phcyddPSBEQl9VU0VSOwogJG9bJ2RiX2hvc3RhcyddICAgID0gREJfSE9TVDsKICRvWydzZXJ2ZXJpcyddICAgICA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgVkVSU0lPTigpIik7CgogJGcgPSAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBHUkFOVFMiKTsKICRvWyd0ZWlzZXMnXSA9IGlzX2FycmF5KCRnKSA/IGFycmF5X21hcChmdW5jdGlvbigkeCl7IHJldHVybiBwcmVnX3JlcGxhY2UoJy9JREVOVElGSUVEIEJZLiokL2knLCdJREVOVElGSUVEIEJZICoqKicsJHgpOyB9LCAkZykgOiAnbmVwYXZ5a28nOwoKICRkYiA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIERBVEFCQVNFUyIpOwogJG9bJ21hdG9tb3NfZGInXSA9IGlzX2FycmF5KCRkYikgPyAkZGIgOiAnbmVwYXZ5a28nOwoKIC8vIGFyIGdhbGltYSBrdXJ0aSBsZW50ZWxlcyAoYXRzdGF0eW11aSBpIHRhIHBhY2lhIGJhemUgc3UgcHJlZmlrc3UpCiAkdCA9ICR3cGRiLT5xdWVyeSgiQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgeyRQfXBzX3Rlc3Rhc19oMDg0IChpZCBJTlQpIik7CiAkb1snbGVudGVsZXNfa3VyaW1hcyddID0gKCR0ID09PSBmYWxzZSkgPyAoJ05FOiAnLiR3cGRiLT5sYXN0X2Vycm9yKSA6ICdUQUlQJzsKICR3cGRiLT5xdWVyeSgiRFJPUCBUQUJMRSBJRiBFWElTVFMgeyRQfXBzX3Rlc3Rhc19oMDg0Iik7CgogLy8gYXIgZ2FsaW1hIGt1cnRpIGJhemUKICRjID0gJHdwZGItPnF1ZXJ5KCJDUkVBVEUgREFUQUJBU0UgSUYgTk9UIEVYSVNUUyBneXZ1bmFpMl9ydHN0X2gwODQiKTsKICRvWydiYXplc19rdXJpbWFzJ10gPSAoJGMgPT09IGZhbHNlKSA/ICgnTkU6ICcuJHdwZGItPmxhc3RfZXJyb3IpIDogJ1RBSVAnOwogaWYoJGMgIT09IGZhbHNlKSAkd3BkYi0+cXVlcnkoIkRST1AgREFUQUJBU0UgSUYgRVhJU1RTIGd5dnVuYWkyX3J0c3RfaDA4NCIpOwoKICRvWydsZW50ZWxpdV9raWVrJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLnRhYmxlcyBXSEVSRSB0YWJsZV9zY2hlbWE9JyIuREJfTkFNRS4iJyIpOwogJG9bJ2JhemVzX2tvZHVvdGUnXSA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgZGVmYXVsdF9jaGFyYWN0ZXJfc2V0X25hbWUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuc2NoZW1hdGEgV0hFUkUgc2NoZW1hX25hbWU9JyIuREJfTkFNRS4iJyIpOwogJG9bJ2JhemVzX2NvbGxhdGlvbiddPSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGRlZmF1bHRfY29sbGF0aW9uX25hbWUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuc2NoZW1hdGEgV0hFUkUgc2NoZW1hX25hbWU9JyIuREJfTkFNRS4iJyIpOwoKIC8vIG11c3UgbW9kdWxpcwogJG11ID0gV1BNVV9QTFVHSU5fRElSIC4gJy9wZXRzaG9wLXByaWV6aXVyYS5waHAnOwogJG9bJ3ByaWV6aXVyYV95cmEnXSAgPSBmaWxlX2V4aXN0cygkbXUpOwogJG9bJ3ByaWV6aXVyYV9tZDUnXSAgPSBmaWxlX2V4aXN0cygkbXUpID8gbWQ1X2ZpbGUoJG11KSA6IG51bGw7CiAkdXAgPSB3cF91cGxvYWRfZGlyKCk7CiAkb1sndmVsaWF2YV95cmEnXSA9IGZpbGVfZXhpc3RzKHRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSkuJ3BzLXByaWV6aXVyYS5mbGFnJyk7CgogLy8gYmFja3VwIHNrcmlwdGFzCiBmb3JlYWNoKGFycmF5KCdiYWNrdXAtcnVuLnBocCcsJ3dhdGNoLXJ1bi5waHAnKSBhcyAkZil7CiAgICRvWydza3JpcHRhaSddWyRmXSA9IGZpbGVfZXhpc3RzKEFCU1BBVEguJGYpID8gZmlsZXNpemUoQUJTUEFUSC4kZikgOiAnTkVSQSc7CiB9CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H084',wp:WP};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H084 atstatymo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s);
  await miegok(9000);
  const r=await fetch(WP+'/?ps_h084=REC'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,600); }
  const fr=await fetch(WP+'/',{redirect:'manual'}); out.frontas=fr.status;
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h084.json', Buffer.from(JSON.stringify(out,null,1)), 'h084 atstatymo recon');
