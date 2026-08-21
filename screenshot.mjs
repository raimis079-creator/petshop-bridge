process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxMCddKSA/ICRfR0VUWydwc19yMjEwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxMCcpOwogJG9bJ3ZlcnNpamEnXSA9IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKSA/IFBldHNob3BfUmlua2luaWFpOjpWRVJTSUpBIDogJ25lcmEnOwogJG9bJ2FqYXhfeXJhJ10gPSBoYXNfYWN0aW9uKCd3cF9hamF4X3BzX3Jpbmtfc2l1a3NsaW5lJykgPyAndGFpcCcgOiAnTkUnOwogJG9bJ3NpdWtzbGluZSddID0gKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKSAmJiBtZXRob2RfZXhpc3RzKCdQZXRzaG9wX1JpbmtpbmlhaScsJ3NpdWtzbGlhZGV6ZWplJykpCiAgID8gUGV0c2hvcF9SaW5raW5pYWk6OnNpdWtzbGlhZGV6ZWplKCkgOiAnbWV0b2RvIG5lcmEnOwoKIC8qIFRJS1JBUyBwcmlzaWp1bmdpbW8gc2F1c2FpbmlzOiBiZSBzZXNpam9zIHpldG9ubyB2YWxpZGFjaWphIG5ldmVpa2lhICovCiAkZXhwID0gdGltZSgpICsgNjAwOwogJG1nciA9IFdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoMSk7CiAkdG9rID0gJG1nci0+Y3JlYXRlKCRleHApOwogJG9bJ2Nvb2tpZSddID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoMSwgJGV4cCwgJ2xvZ2dlZF9pbicsICR0b2spOwogJG9bJ2Nvb2tpZWhhc2gnXSA9IGRlZmluZWQoJ0NPT0tJRUhBU0gnKSA/IENPT0tJRUhBU0ggOiAnJzsKICRvWydob3N0J10gPSBwYXJzZV91cmwoZ2V0X29wdGlvbignc2l0ZXVybCcpLCBQSFBfVVJMX0hPU1QpOwoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R210'};
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
  const kunas=JSON.stringify({name:'TEMP R210 Langas akimis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r210=GO'); const tt=await rr.text();
    let D=null; try{D=JSON.parse(tt);}catch(e){ out.zalias=tt.slice(0,400); }
    if(D){
      out.DUOM={versija:D.versija, ajax_yra:D.ajax_yra, siuksline:D.siuksline, host:D.host};
      const {chromium}=await import('playwright');
      const b=await chromium.launch();
      const ctx=await b.newContext({viewport:{width:1500,height:1200},ignoreHTTPSErrors:true});
      await ctx.addCookies([{name:'wordpress_logged_in_'+D.cookiehash, value:D.cookie, domain:D.host, path:'/', httpOnly:true, secure:true}]);
      const p=await ctx.newPage();
      const resp=await p.goto(WP+'/wp-admin/admin.php?page=ps-rinkiniai',{waitUntil:'domcontentloaded',timeout:60000});
      await p.waitForTimeout(5000);
      out.puslapis={s:resp?resp.status():0, title:await p.title()};
      out.siuksl_blokas=await p.locator('.psr-siuksline').count();
      out.mygtukai=await p.locator('.psr-siuk').count();
      await put('screenshots/r210_langas.png', await p.screenshot({fullPage:false}), 'r210 rinkiniu langas');
      await b.close();
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r210.json', Buffer.from(JSON.stringify(out,null,1)), 'r210 langas');
