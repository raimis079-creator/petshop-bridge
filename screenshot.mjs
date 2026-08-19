process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEyMCddKSA/ICRfR0VUWydwc19oMTIwJ10gOiAnJykgIT09ICdBUFBMWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxNTApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTIwJyk7CiAkdXAgPSB3cF91cGxvYWRfZGlyKCk7ICRiayA9IHRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSkuJ3BzLWJhY2t1cHMnOwogaWYoIWlzX2RpcigkYmspKSBAbWtkaXIoJGJrLCAwNzU1LCB0cnVlKTsKCiAkc2VuYXMgPSAoaW50KSBnZXRfb3B0aW9uKCd3cF9wYWdlX2Zvcl9wcml2YWN5X3BvbGljeScpOwogJG5hdWphcyA9IDM0NTI1OwoKIC8qIHBhdGlrcmEgcHJpZXMga2VpY2lhbnQgKi8KICRwID0gZ2V0X3Bvc3QoJG5hdWphcyk7CiBpZighJHAgfHwgJHAtPnBvc3Rfc3RhdHVzICE9PSAncHVibGlzaCcgfHwgJHAtPnBvc3RfdHlwZSAhPT0gJ3BhZ2UnKXsKICAgJG9bJ05VVFJBVUtUQSddID0gJ3B1c2xhcGlzIDM0NTI1IG5ldGlua2FtYXM6ICcuKCRwID8gJHAtPnBvc3Rfc3RhdHVzLicvJy4kcC0+cG9zdF90eXBlIDogJ25lcmFzdGFzJyk7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OwogfQogQGZpbGVfcHV0X2NvbnRlbnRzKCRiay4nL3ByaXZhY3lfcGFnZV9oMTIwLmpzb24nLCB3cF9qc29uX2VuY29kZShhcnJheSgnYnV2byc9PiRzZW5hcywnbmF1amEnPT4kbmF1amFzLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpKSk7CiAkb1sna29waWphJ10gPSBmaWxlX2V4aXN0cygkYmsuJy9wcml2YWN5X3BhZ2VfaDEyMC5qc29uJykgPyAnb2snIDogJ05FUEFWWUtPJzsKCiB1cGRhdGVfb3B0aW9uKCd3cF9wYWdlX2Zvcl9wcml2YWN5X3BvbGljeScsICRuYXVqYXMpOwogJG9bJ2J1dm8nXSA9ICRzZW5hczsKICRvWydkYWJhciddID0gKGludCkgZ2V0X29wdGlvbignd3BfcGFnZV9mb3JfcHJpdmFjeV9wb2xpY3knKTsKICRvWydwdXNsYXBpcyddID0gYXJyYXkoJ3RpdGxlJz0+JHAtPnBvc3RfdGl0bGUsICdzbHVnJz0+JHAtPnBvc3RfbmFtZSwgJ2J1c2VuYSc9PiRwLT5wb3N0X3N0YXR1cywgJ3VybCc9PmdldF9wZXJtYWxpbmsoJG5hdWphcykpOwogJG9bJ3dwX2Z1bmtjaWphJ10gPSBmdW5jdGlvbl9leGlzdHMoJ2dldF9wcml2YWN5X3BvbGljeV91cmwnKSA/IGdldF9wcml2YWN5X3BvbGljeV91cmwoKSA6ICduL2EnOwoKIC8qIGFyIFdvb0NvbW1lcmNlIHRla3N0dW9zZSB5cmEgW3ByaXZhY3lfcG9saWN5XSB6eW1hICovCiBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9jaGVja291dF9wcml2YWN5X3BvbGljeV90ZXh0Jywnd29vY29tbWVyY2VfcmVnaXN0cmF0aW9uX3ByaXZhY3lfcG9saWN5X3RleHQnKSBhcyAkayl7CiAgICR0ID0gKHN0cmluZykgZ2V0X29wdGlvbigkayk7CiAgICRvWyd3Y190ZWtzdGFpJ11bJGtdID0gYXJyYXkoJ3R1cmlfenltZSc9PiAoc3RycG9zKCR0LCdwcml2YWN5X3BvbGljeScpIT09ZmFsc2UgPyAnVEFJUCcgOiAnbmUnKSwgJ3Rla3N0YXMnPT5tYl9zdWJzdHIoJHQsMCwxMjApKTsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H120'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H120 privacy APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h120=APPLY'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  await new Promise(r=>setTimeout(r,1500));
  for(const p of ['/privatumo-politika/','/slapuku-politika/','/taisykles/','/grazinimas/']){
    try{ const r=await fetch(WP+p,{redirect:'manual'}); out['URL'+p]=r.status; }catch(e){ out['URL'+p]='klaida'; }
  }
  out.frontas=(await fetch(WP+'/',{redirect:'manual'})).status;
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h120.json', Buffer.from(JSON.stringify(out,null,1)), 'h120 privacy puslapio taisymas');
