process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDExMSddKSA/ICRfR0VUWydwc19oMTExJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTExJyk7CiAvKiBXb3JkUHJlc3MgcGF0cyAzMDEtaW5hIGkgbmF1amEgYWRyZXNhLCBqZWkgcG9zdG1ldGEgX3dwX29sZF9zbHVnIHR1cmkgc2VuYWppICovCiBmb3JlYWNoKGFycmF5KDEyPT4nY2FydCcsIDEzPT4nY2hlY2tvdXQnKSBhcyAkaWQ9PiRzZW5hcyl7CiAgICRlc2FtaSA9IGdldF9wb3N0X21ldGEoJGlkLCAnX3dwX29sZF9zbHVnJywgZmFsc2UpOwogICBpZihpbl9hcnJheSgkc2VuYXMsIChhcnJheSkkZXNhbWksIHRydWUpKXsgJG9bJ21ldGEnXVskaWRdPSdqYXUgYnV2byc7IGNvbnRpbnVlOyB9CiAgICRyID0gYWRkX3Bvc3RfbWV0YSgkaWQsICdfd3Bfb2xkX3NsdWcnLCAkc2VuYXMpOwogICAkb1snbWV0YSddWyRpZF0gPSAkciA/ICgncHJpZMSXdGE6ICcuJHNlbmFzKSA6ICdORVBBVllLTyc7CiB9CiBmb3JlYWNoKGFycmF5KDEyLDEzKSBhcyAkaWQpICRvWydwYXRpa3JhJ11bJGlkXSA9IGdldF9wb3N0X21ldGEoJGlkLCAnX3dwX29sZF9zbHVnJywgZmFsc2UpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H111'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
async function tikr(p){ try{const r=await fetch(WP+p,{redirect:'manual'}); return {http:r.status, loc:(r.headers.get('location')||'').replace(WP,'')||null};}catch(e){return {klaida:String(e).slice(0,70)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H111 old slug',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h111=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,500)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  await miegok(1500);
  out.PATIKRA={
    cart_senas: await tikr('/cart/'),
    checkout_senas: await tikr('/checkout/'),
    krepselis: await tikr('/krepselis/'),
    kasa: await tikr('/kasa/'),
    paskyra: await tikr('/paskyra/'),
    parduotuve: await tikr('/parduotuve/')
  };
  out.frontas=(await fetch(WP+'/',{redirect:'manual'})).status;
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h111.json', Buffer.from(JSON.stringify(out,null,1)), 'h111 old slug 301');
