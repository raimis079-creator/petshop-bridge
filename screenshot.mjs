process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1MCddKSB8fCAkX0dFVFsncHNfaDI1MCddIT09J1JVTjIwMjYwODI0RycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNTBBJywnZmFpbGFpJz0+YXJyYXkoKSk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsKICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWRlc2sucGhwJywncGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnLCdwZXRzaG9wLWF2LXRpZWtpbWFzLnBocCcpIGFzICRmKXsKICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kc2hhLAogICAgIGFycmF5KCd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidwcycsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nKSkpOwogICAkaj1qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksdHJ1ZSk7CiAgICRjb2RlPWJhc2U2NF9kZWNvZGUodHJpbShpc3NldCgkalsnY29udGVudCddKT9iYXNlNjRfZGVjb2RlKCRqWydjb250ZW50J10pOicnKSk7CiAgICRpbmY9YXJyYXkoJ2dhdXRhJz0+c3RybGVuKCRjb2RlKSk7CiAgIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApewogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRjb2RlLCBUT0tFTl9QQVJTRSk7ICRpbmZbJ3NpbnRha3NlJ109J29rJzsgfQogICAgY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7CiAgICAgJGRzdD1XUE1VX1BMVUdJTl9ESVIuJy8nLiRmOwogICAgIEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDI1MCcpOwogICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOwogICAgICRpbmZbJ21kNSddPW1kNV9maWxlKCRkc3QpOwogICAgfQogICB9IGVsc2UgeyAkaW5mWydzaW50YWtzZSddPSd0dXNjaWEnOyB9CiAgICRUWydmYWlsYWknXVskZl09JGluZjsKICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const SHA='d23bfef0784948a4bdcd292394f53311e8ec8506'; const MD5={"petshop-desk.php": "4034d65f7033c464a2c796075e41f122", "petshop-av-dropship.php": "383b608a03991b2492695378a9548380", "petshop-av-tiekimas.php": "03aa64ebbf1293a00db0600c738ba426"};
const out={v:'H250A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H250 v1 (3 failai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h250=RUN20260824G&deploy=1&sha='+SHA,{},'deploy');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const tx=await d.text(); try{ out.deploy=JSON.parse(tx); }catch(e){ out.deploy='ne-json: '+tx.slice(0,250); }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    let visi=true;
    if(out.deploy&&out.deploy.failai){ for(const k in MD5){ if(!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } } else visi=false;
    out.md5_ok=visi;
    if(cookies.length && visi){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1500,height:1200},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
      const r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
      await miegok(900);
      out.desk={http:r.status(), irankiai:await pg.$$eval('.pd-ri',ns=>ns.map(n=>n.textContent.trim()))};
      const r2=await pg.goto(WP+'/wp-admin/admin.php?page=ps-laiskai',{waitUntil:'networkidle',timeout:60000});
      await miegok(800);
      out.laiskai={http:r2.status(), fatal:(await pg.content()).includes('Fatal error'),
        h1:await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'?'),
        eiluciu:await pg.$$eval('tbody tr',ns=>ns.length).catch(()=>0),
        put:await put('screenshots/h250_laiskai.png',await pg.screenshot({fullPage:true}),'H250A')};
      const r3=await pg.goto(WP+'/wp-admin/admin.php?page=ps-dropship&src=belcor_tofu',{waitUntil:'networkidle',timeout:60000});
      await miegok(900);
      out.dropship={http:r3.status(), fatal:(await pg.content()).includes('Fatal error'),
        varneles:await pg.$$eval('form label',ns=>ns.map(n=>n.textContent.trim()+'='+(n.querySelector('input')&&n.querySelector('input').checked?'ON':'OFF'))),
        put:await put('screenshots/h250_dropship.png',await pg.screenshot({fullPage:true}),'H250A')};
      out.js=kl; await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h250run.json', Buffer.from(JSON.stringify(out,null,1)), 'H250A');
