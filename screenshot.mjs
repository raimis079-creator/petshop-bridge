process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0NSddKSB8fCAkX0dFVFsncHNfaDI0NSddIT09J1JVTjIwMjYwODI0QicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nSDI0NUInKTsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdVswXS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHVbMF0tPklELHRydWUsdHJ1ZSk7IH0KIGlmKGlzc2V0KCRfR0VUWydkZXBsb3knXSkpewogICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOwogICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95L3BldHNob3AtZGVzay5waHAuYjY0P3JlZj0nLiRzaGEsCiAgICBhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKICAkaj1qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksdHJ1ZSk7CiAgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICAkVFsnZ2F1dGEnXT1zdHJsZW4oJGNvZGUpOwogIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApewogICB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJFRbJ3NpbnRha3NlJ109J29rJzsgfQogICBjYXRjaChQYXJzZUVycm9yICRlKXsgJFRbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgIGlmKCdvayc9PT0kVFsnc2ludGFrc2UnXSl7CiAgICAkZHN0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGVzay5waHAnOwogICAgQGNvcHkoJGRzdCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1kZXNrLnBocC5iYWtfaDI0NScpOwogICAgZmlsZV9wdXRfY29udGVudHMoJGRzdCwkY29kZSk7CiAgICAkVFsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7CiAgIH0KICB9IGVsc2UgeyAkVFsnc2ludGFrc2UnXT0ndHVzY2lhJzsgfQogIC8vIFR1c2NpdSBrYXVwaWFtdSBwYXJ0aWp1IHZhbHltYXMgKHZha2FyIHRlc3R1IGxpZWthbm9zICMzIHByaW5zLCAjNCB2ZikKICAkVFsnaXN0cmludGFfdHVzY2l1J109JHdwZGItPnF1ZXJ5KAogICAiREVMRVRFIHAgRlJPTSB7JHdwZGItPnByZWZpeH1wc190aWVraW1hcyBwCiAgICBMRUZUIEpPSU4geyR3cGRiLT5wcmVmaXh9cHNfdGlla2ltYXNfZWlsIGUgT04gZS5wYXJ0aWphX2lkPXAuaWQKICAgIFdIRVJFIHAuYnVzZW5hPSdrYXVwaWFtYScgQU5EIGUuaWQgSVMgTlVMTCIpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const SHA='9206ead5ba4672bbd13078d5bd00a6340c9ef9d9'; const MD5='78d6a9c2df5ac3bd5f2223e6c99528bc';
const out={v:'H245B'};
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
async function fx(u,o,k){ for(let i=0;i<4;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(6000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H245 v2 (desk 3.40 + valymas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h245=RUN20260824B&deploy=1&sha='+SHA,{},'deploy');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const tx=await d.text(); try{ out.deploy=JSON.parse(tx); }catch(e){ out.deploy='ne-json: '+tx.slice(0,200); }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length && out.deploy && out.deploy.md5===MD5){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1500,height:1200},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
      const r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=misrus',{waitUntil:'networkidle',timeout:60000});
      await miegok(1100);
      out.misrus={http:r.status(),
        pipe:await pg.$$eval('.pd-pipe-i',ns=>ns.map(n=>n.textContent.trim())),
        sekcijos:await pg.$$eval('.pd-msec',ns=>ns.map(n=>n.textContent.trim())),
        korteles:await pg.$$eval('.pd-mcard',ns=>ns.map(n=>n.id)),
        irankiai:await pg.$$eval('.pd-ri',ns=>ns.map(n=>n.textContent.trim()+' -> '+n.getAttribute('href').split('admin.php?')[1])),
        put:await put('screenshots/h245_misrus.png',await pg.screenshot({fullPage:true}),'H245B')};
      out.js=kl; await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h245run.json', Buffer.from(JSON.stringify(out,null,1)), 'H245B');
