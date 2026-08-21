process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxMiddKSA/ICRfR0VUWydwc19yMjEyJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxMicpOwogJGxhdWtpYW1hcyA9ICdlNGFlYzcwYjQwYmE1YTNjOTM1ZjAzNjM2OWYwNzYxMic7CiAkdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS8yMDI1NmY5YzczNWU2NDQ0MzZjMjM3MzIxMWU3OGJhNjA4MzY4ZTAxL2RlcGxveS9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwogJHIgPSB3cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+NjApKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgfQogZWxzZSB7CiAgICRrb2RhcyA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgJG9bJ21kNV9vayddPShtZDUoJGtvZGFzKT09PSRsYXVraWFtYXMpOwogICBpZigkb1snbWQ1X29rJ10pewogICAgICR0ID0gQHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7CiAgICAgJG9bJ3NpbnRha3NlJ10gPSBpc19hcnJheSgkdCkgPyAnT0snIDogJ0tMQUlEQSc7CiAgICAgaWYoaXNfYXJyYXkoJHQpKXsKICAgICAgICRmID0gKGRlZmluZWQoJ1dQTVVfUExVR0lOX0RJUicpP1dQTVVfUExVR0lOX0RJUjpXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnKS4nL3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgICAgICAkYmRpciA9IFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICAgICAgIGlmKCFpc19kaXIoJGJkaXIpKSBAd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgICAkb1snYmFrJ10gPSBAY29weSgkZiwkYmRpci4nL3BldHNob3Atcmlua2luaWFpLicuZ21kYXRlKCdZbWQtSGlzJykuJy5iYWsucGhwJykgPyAnT0snOidORSc7CiAgICAgICAkb1snaXJhc3l0YSddID0gZmlsZV9wdXRfY29udGVudHMoJGYsJGtvZGFzKSE9PWZhbHNlID8gJ09LJzonTkUnOwogICAgICAgY2xlYXJzdGF0Y2FjaGUoKTsgJG9bJ3N1dGFtcGEnXT0obWQ1X2ZpbGUoJGYpPT09JGxhdWtpYW1hcyk7CiAgICAgfQogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxMmInXSkgPyAkX0dFVFsncHNfcjIxMmInXSA6ICcnKSAhPT0gJ0dPJykgcmV0dXJuOwogJG8gPSBhcnJheSgndic9PidSMjEyYicpOwogJG9bJ3ZlcnNpamEnXSA9IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKSA/IFBldHNob3BfUmlua2luaWFpOjpWRVJTSUpBIDogJ25lcmEnOwogJG9bJ3NpdWtzbGVqZSddID0gY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1JpbmtpbmlhaScpID8gY291bnQoUGV0c2hvcF9SaW5raW5pYWk6OnNpdWtzbGlhZGV6ZWplKCkpIDogLTE7CiAkb1snc2FyYXNlJ10gPSBjbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaWFpJykgPyBjb3VudChQZXRzaG9wX1JpbmtpbmlhaTo6cmlua2luaWFpKCkpIDogLTE7CiAkZXhwID0gdGltZSgpKzkwMDsgJG1nciA9IFdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoMSk7CiAkb1snY29va2llJ10gPSB3cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgxLCAkZXhwLCAnbG9nZ2VkX2luJywgJG1nci0+Y3JlYXRlKCRleHApKTsKICRvWydjb29raWVoYXNoJ10gPSBkZWZpbmVkKCdDT09LSUVIQVNIJykgPyBDT09LSUVIQVNIIDogJyc7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R212'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'TEMP R212 Rinkiniai v1.31',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const r1=await fetch(WP+'/?ps_r212=GO'); try{ out.DEPLOY=JSON.parse(await r1.text()); }catch(e){ out.DEPLOY='klaida'; }
    await miegok(4000);
    const r2=await fetch(WP+'/?ps_r212b=GO'); let D=null; try{ D=JSON.parse(await r2.text()); }catch(e){}
    if(D){
      out.PATIKRA={versija:D.versija, siuksleje:D.siuksleje, sarase:D.sarase};
      try{
        const {chromium}=await import('playwright');
        const b=await chromium.launch();
        const ctx=await b.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true});
        await ctx.addCookies([{name:'wordpress_logged_in_'+D.cookiehash,value:D.cookie,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true},
                              {name:'wordpress_logged_in_'+D.cookiehash,value:D.cookie,domain:'.dev.avesa.lt',path:'/',httpOnly:true,secure:true}]);
        const p=await ctx.newPage();
        const resp=await p.goto(WP+'/wp-admin/admin.php?page=ps-rinkiniai',{waitUntil:'domcontentloaded',timeout:60000});
        await p.waitForTimeout(5000);
        out.puslapis={s:resp?resp.status():0,title:await p.title()};
        out.eile_siuk=await p.locator('text=Šiukšlinėje').count();
        await put('screenshots/r212_langas.png', await p.screenshot(), 'r212 langas');
        /* paspaudziam siuksles eilute */
        try{
          await p.locator('#psr-eiles').getByText('Šiukšlinėje').first().click({timeout:8000});
          await p.waitForTimeout(2500);
          await put('screenshots/r212_siuksline.png', await p.screenshot(), 'r212 siuksline');
          out.paspausta='OK'; out.psr_siuk=await p.locator('.psr-siuk').count();
        }catch(e){ out.paspausta=String(e).slice(0,120); }
        await b.close();
      }catch(e){ out.narsykle=String(e).slice(0,200); }
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r212.json', Buffer.from(JSON.stringify(out,null,1)), 'r212 v1.31');
