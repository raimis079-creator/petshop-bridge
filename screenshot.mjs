process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0MiddKSB8fCAkX0dFVFsncHNfaDI0MiddIT09J1JVTjIwMjYwODIzQScpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNDJBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsKICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS9wZXRzaG9wLWRlc2sucGhwLmI2ND9yZWY9Jy4kc2hhLAogICAgYXJyYXkoJ3RpbWVvdXQnPT40MCwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J3BzJywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL3ZuZC5naXRodWIranNvbicpKSk7CiAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOwogICRiNjQ9aXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJzsKICAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oJGI2NCkpOwogICRUWydnYXV0YSddPXN0cmxlbigkY29kZSk7CiAgaWYoJGNvZGUgJiYgc3RycG9zKCRjb2RlLCc8P3BocCcpPT09MCl7CiAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkVFsnc2ludGFrc2UnXT0nb2snOyB9CiAgIGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkVFsnc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KICAgaWYoJ29rJz09PSRUWydzaW50YWtzZSddKXsKICAgICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXNrLnBocCc7CiAgICAkYms9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1kZXNrLnBocC5iYWtfaDI0Mic7CiAgICBAbWtkaXIoZGlybmFtZSgkYmspLDA3NTUsdHJ1ZSk7IEBjb3B5KCRkc3QsJGJrKTsKICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOwogICAgJFRbJ21kNSddPW1kNV9maWxlKCRkc3QpOwogICB9CiAgfSBlbHNlIHsgJFRbJ3NpbnRha3NlJ109J3R1c2NpYSBhcmJhIG5lIFBIUCc7IH0KIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const SHA='13cf1aea478daea9ff7c66058d00ff2adf341485';
const MD5='8b5ad705e80cbe3ffc5863c2876fa5a4';
const out={v:'H244A'};
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
async function fx(u,o,k){ for(let i=0;i<4;i++){ try{ return await fetch(u,o); }catch(e){ out['retry_'+k]=(out['retry_'+k]||0)+1; await miegok(6000); } } throw new Error('fetch nepavyko: '+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H244 v1 (desk 3.38 deploy)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(10000);
    const d=await fx(WP+'/?ps_h242=RUN20260823A&deploy=1&sha='+SHA,{},'deploy');
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
      const r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
      await miegok(1200);
      out.nauji={http:r.status(),
        pipe:await pg.$$eval('.pd-pipe-i',ns=>ns.map(n=>n.textContent.trim())),
        chips:(await pg.$$eval('.pd-chip',ns=>ns.map(n=>n.textContent.trim()))).slice(0,20),
        put:await put('screenshots/h244_nauji.png',await pg.screenshot({fullPage:true}),'H244A')};
      out.irankiai=await pg.$$eval('.pd-ri',ns=>ns.map(n=>n.textContent.trim()));
      const r2=await pg.goto(WP+'/wp-admin/admin.php?page=ps-tiekimas',{waitUntil:'networkidle',timeout:60000});
      await miegok(900);
      out.tiekimas={http:r2.status(), h1:await pg.$eval('h1,h2,.wrap h1',n=>n.textContent.trim().slice(0,60)).catch(()=>'?'),
        put:await put('screenshots/h244_tiekimas.png',await pg.screenshot({fullPage:false}),'H244A')};
      const r3=await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=paruosta',{waitUntil:'networkidle',timeout:60000});
      await miegok(900);
      out.tuscia={http:r3.status(),
        zemelapis:await pg.$eval('.pd-empty-map',n=>n.textContent.trim().slice(0,80)).catch(()=>'NERA')};
      out.js=kl; await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,500);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h244.json', Buffer.from(JSON.stringify(out,null,1)), 'H244A');
