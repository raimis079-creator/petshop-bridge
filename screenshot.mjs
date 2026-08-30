process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZyb250IGRpYWdub3N0aWthICovCmFkZF9hY3Rpb24oJ3dwX2Zvb3RlcicsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc2RiZyddKSkgcmV0dXJuOwogIGdsb2JhbCAkcHJvZHVjdDsgZ2xvYmFsICR3cF9maWx0ZXI7CiAgJHBpZD1nZXRfdGhlX0lEKCk7ICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICRoYT1oYXNfYWN0aW9uKCd3b29jb21tZXJjZV9iZWZvcmVfYWRkX3RvX2NhcnRfYnV0dG9uJywgYXJyYXkoJ1BldHNob3BfUHJlbnVtZXJhdGFfS2F0YWxvZ2FzJywncGFzaXJpbmtpbWFzJykpOwogICRkPWFycmF5KAogICAgJ3BpZCc9PiRwaWQsJ2lzX3Byb2R1Y3QnPT5pc19wcm9kdWN0KCk/MTowLAogICAgJ2tsYXNlJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1ByZW51bWVyYXRhX0thdGFsb2dhcycpPzE6MCwKICAgICdpanVuZ3RhJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1ByZW51bWVyYXRhX0thdGFsb2dhcycpJiZQZXRzaG9wX1ByZW51bWVyYXRhX0thdGFsb2dhczo6aWp1bmd0YSgpPzE6MCwKICAgICdnYWxpbWEnPT4oJHAmJmNsYXNzX2V4aXN0cygnUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXMnKSYmUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OmdhbGltYSgkcGlkKSk/MTowLAogICAgJ3NrdSc9PiRwPyRwLT5nZXRfc2t1KCk6Jy0nLAogICAgJ2hvb2tfcmVnJz0+JGhhPT09ZmFsc2U/J05FJzokaGEsCiAgICAnaG9va19maXJlZCc9PmRpZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX2JlZm9yZV9hZGRfdG9fY2FydF9idXR0b24nKSwKICAgICdzYXJhc2UnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfUHJlbnVtZXJhdGFfS2F0YWxvZ2FzJyk/anNvbl9lbmNvZGUoUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OnNrdV9zYXJhc2FzKCkpOictJywKICApOwogIGVjaG8gIlxuPCEtLSBQU0RCRyAiLmpzb25fZW5jb2RlKCRkKS4iIC0tPlxuIjsKfSw5OSk7CmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZjE5J10pPyRfR0VUWydwc19mMTknXTonJykhPT0nVE4nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidEQkctMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGsgT04gay5wb3N0X2lkPXAuSUQgQU5EIGsubWV0YV9rZXk9J19wcmljZScgQU5EIGsubWV0YV92YWx1ZT4wIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgcC5JRCBERVNDIExJTUlUIDEiKTsKICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHNrdT1zdHJ0b3VwcGVyKHRyaW0oJHByLT5nZXRfc2t1KCkpKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskd3BkYi0+b3B0aW9uc30gU0VUIG9wdGlvbl92YWx1ZT0lcyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfc2t1JyIsc2VyaWFsaXplKGFycmF5KCRza3UpKSkpOwogICAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5vcHRpb25zfSBTRVQgb3B0aW9uX3ZhbHVlPSd0YWlwJyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfaWp1bmd0YSciKTsKICAgIGRlbGV0ZV90cmFuc2llbnQoJ3BzX3ByZW5fc2t1X2lkJyk7IHdwX2NhY2hlX2ZsdXNoKCk7CiAgICAkZz13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoYXJyYXkoJ3BzZGJnJz0+JzEnLCdwc25jJz0+dGltZSgpKSxnZXRfcGVybWFsaW5rKCRwaWQpKSwKICAgICAgYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7CiAgICBwcmVnX21hdGNoKCcvUFNEQkcgKFx7Lio/XH0pIC0tPi8nLCRoLCRtKTsKICAgICRvWydkYmcnXT1pc3NldCgkbVsxXSk/anNvbl9kZWNvZGUoJG1bMV0sdHJ1ZSk6J05FUkFTVEEnOwogICAgJG9bJ2Jsb2thc19odG1sJ109c3RycG9zKCRoLCdwcy1wcmVuLWJsb2thcycpIT09ZmFsc2U/J1JPRE9NQVMnOidORVJPRE9NQVMnOwogICAgLy8gYXRzdGF0b20KICAgICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+b3B0aW9uc30gU0VUIG9wdGlvbl92YWx1ZT0nbmUnIFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9panVuZ3RhJyIpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyR3cGRiLT5vcHRpb25zfSBTRVQgb3B0aW9uX3ZhbHVlPSVzIFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9za3UnIixzZXJpYWxpemUoYXJyYXkoKSkpKTsKICAgIGRlbGV0ZV90cmFuc2llbnQoJ3BzX3ByZW5fc2t1X2lkJyk7IHdwX2NhY2hlX2ZsdXNoKCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='f19_dbg-102542';
const GKEY='ps_f19';
const PHASES=["TN"];
const OUT='analize/f19_dbg_1788085542.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
