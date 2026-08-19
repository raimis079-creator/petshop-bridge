process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDExOSddKSA/ICRfR0VUWydwc19oMTE5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTE5Jyk7CiAkaWQgPSAoaW50KSBnZXRfb3B0aW9uKCd3cF9wYWdlX2Zvcl9wcml2YWN5X3BvbGljeScpOwogJHAgPSBnZXRfcG9zdCgkaWQpOwogJG9bJ3ByaXZhY3knXSA9ICRwID8gYXJyYXkoJ2lkJz0+JGlkLCd0aXRsZSc9PiRwLT5wb3N0X3RpdGxlLCdzbHVnJz0+JHAtPnBvc3RfbmFtZSwKICAgICdidXNlbmEnPT4kcC0+cG9zdF9zdGF0dXMsJ3VybCc9PmdldF9wZXJtYWxpbmsoJGlkKSkgOiAnbmVyYXN0YXMnOwogLyogdmlzaSB0ZWlzaW5pYWkgcHVzbGFwaWFpICovCiAkb1sndGVpc2luaWFpJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgIlNFTEVDVCBJRCwgcG9zdF90aXRsZSwgcG9zdF9uYW1lLCBwb3N0X3N0YXR1cyBGUk9NIHskUH1wb3N0cwogICBXSEVSRSBwb3N0X3R5cGU9J3BhZ2UnIEFORCBwb3N0X3N0YXR1czw+J3RyYXNoJwogICAgIEFORCAocG9zdF90aXRsZSBMSUtFICclcml2YXR1bSUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWxhcHVrJScgT1IgcG9zdF90aXRsZSBMSUtFICclYWlzeWtsJScKICAgICAgICAgIE9SIHBvc3RfdGl0bGUgTElLRSAnJWFseWclJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVHRFBSJScgT1IgcG9zdF90aXRsZSBMSUtFICcldW9tZW4lJwogICAgICAgICAgT1IgcG9zdF90aXRsZSBMSUtFICclR3LEhcW+aW4lJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVBdHNpc2FrJScpCiAgIE9SREVSIEJZIElEIiwgQVJSQVlfQSk7CiAvKiBDb21wbGlhbnogbnVzdGF0eW1haSAqLwogZm9yZWFjaChhcnJheSgnY21wbHpfb3B0aW9uc193aXphcmQnLCdjb21wbGlhbnpfb3B0aW9uc193aXphcmQnLCdjbXBsel9wcml2YWN5X3N0YXRlbWVudF9wYWdlJywnY21wbHpfY29va2llX3BvbGljeV9wYWdlJykgYXMgJGspewogICAkdiA9IGdldF9vcHRpb24oJGspOwogICBpZigkdiAhPT0gZmFsc2UpICRvWydjbXBseiddWyRrXSA9IGlzX3NjYWxhcigkdikgPyAkdiA6ICdbbWFzeXZhcyAnLmNvdW50KChhcnJheSkkdikuJ10nOwogfQogJHcgPSBnZXRfb3B0aW9uKCdjb21wbGlhbnpfb3B0aW9uc193aXphcmQnKTsKIGlmKGlzX2FycmF5KCR3KSl7CiAgIGZvcmVhY2goJHcgYXMgJGs9PiR2KSBpZihzdHJpcG9zKCRrLCdwYWdlJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRrLCdwcml2YWN5JykhPT1mYWxzZSB8fCBzdHJpcG9zKCRrLCdwb2xpY3knKSE9PWZhbHNlKQogICAgICRvWydjbXBsel9wdXNsYXBpYWknXVska10gPSBpc19zY2FsYXIoJHYpID8gKHN0cmluZykkdiA6ICdbbV0nOwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H119'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H119 privacy psl',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h119=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h119.json', Buffer.from(JSON.stringify(out,null,1)), 'h119 privacy puslapis');
