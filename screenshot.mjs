process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI5OSddKSB8fCAkX0dFVFsncHNfaDI5OSddIT09J1JVTjIwMjYwODI1QUonKSByZXR1cm47CiAkVD1hcnJheSgndic9PidIMjk5QScpOyBnbG9iYWwgJHdwZGI7CiAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskd3BkYi0+dGVybXN9IHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfdHlwZScgQU5EIHQuc2x1Zz0nbWl4LWFuZC1tYXRjaCciKTsKIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkVFsnbW5tJ11bXT1hcnJheSgnaWQnPT4oaW50KSRpZCwncGF2Jz0+Z2V0X3RoZV90aXRsZSgkaWQpLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCkpOyB9CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSw1KTsK';
const out={v:'H299A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H299 v1 (visi MnM)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h299=RUN20260825AJ',{},'run'); const r=JSON.parse(await d.text());
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  out.tikrinta=[];
  for(const m of (r.mnm||[])){ try{ const x=await fetch(m.url,{headers:{'User-Agent':'Mozilla/5.0 Chrome/128'}}); const t=await x.text();
    out.tikrinta.push({id:m.id,pav:m.pav.slice(0,50),url:m.url.replace(WP,''),st:x.status,klase:/class="[^"]*ps-fiksuotas-rinkinys/.test(t),sudetis:t.includes('Rinkinio sudėtis'),js:t.includes('ps-rink-vitrina'),cc:x.headers.get('cache-control')}); }catch(e){ out.tikrinta.push({id:m.id,err:String(e).slice(0,80)}); } }
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h299run.json', Buffer.from(JSON.stringify(out,null,1)), 'H299A');
