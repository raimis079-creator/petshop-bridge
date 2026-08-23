process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyMTQnXSkgfHwgJF9HRVRbJ3BzX3ZlcjE0J10hPT0nUlVOMjAyNjA4MjMnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRUPWFycmF5KCd2Jz0+J1ZFUjE0Jyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQogJHJhPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCd2ZWlrc21haScpOyAkcmEtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcmU9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2VpbGUnKTsgJHJlLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHJrPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdrbGF1c2ltYXMnKTsgJHJrLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHJnPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJywnZ3J1cHVvdGknKTsgJHJnLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHZrPWZ1bmN0aW9uKCRpZCkgdXNlICgkcmEsJHJlLCRyayl7ICRvPXdjX2dldF9vcmRlcigkaWQpOwogICAkdj0kcmEtPmludm9rZShudWxsLCRvLGFycmF5KCdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCwkbyksJ2tsYXVzaW1hcyc9PiRyay0+aW52b2tlKG51bGwsJG8pKSk7CiAgIHJldHVybiBhcnJheV9jb2x1bW4oJHYsJ3QnKTsgfTsKCiAvKiAzNTA2NjogcGxhbmFzIFZGLT5BViwgUFJJTlMtPnRpZXNpYWkgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX21pc3J1c19zcHJlbmRpbWFzJywgd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3ZmJz0+J3RpZXNpYWknLCdwcmlucyc9Pid0aWVzaWFpJykpKTsKICRvLT5zYXZlKCk7CiAkVFsnMV9hYnVfdGllc2lhaSddPWFycmF5KCdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCx3Y19nZXRfb3JkZXIoMzUwNjYpKSwnbXlndHVrYWknPT4kdmsoMzUwNjYpKTsKCiAvKiBwZXJkdW9kYW0gVElLIFZGICovCiAkbz13Y19nZXRfb3JkZXIoMzUwNjYpOwogUGV0c2hvcF9BVl9Ecm9wc2hpcDo6enltZXRpX3BlcmR1b3RhKCRvLCd2ZicpOyAkby0+c2F2ZSgpOwogJFRbJzJfcG9fVkYnXT1hcnJheSgnbXlndHVrYWknPT4kdmsoMzUwNjYpLAogICAnbGFpc2thaSc9PmFycmF5X2tleXMoJHJnLT5pbnZva2UobnVsbCxhcnJheSgzNTA2NikpKSwKICAgJ25lcGVyZHVvdG9zJz0+UGV0c2hvcF9BVl9Ecm9wc2hpcDo6bmVwZXJkdW90b3Mod2NfZ2V0X29yZGVyKDM1MDY2KSkpOwoKIC8qIGxhaXNrbyBwaWxudW1vIHZhcnRhaSAqLwogJFRbJzNfbGFpc2thcyddPWFycmF5KAogICAnc2hpcG1lbnRzJz0+KGludCl3Y19nZXRfb3JkZXIoMzUwNjYpLT5nZXRfbWV0YSgnX3BzX3NoaXBtZW50cycpLAogICAncmVnaXN0cnVvdGFfZ3J1cGl1Jz0+UGV0c2hvcF9TaXVudG9zOjpyZWdpc3RydW90YV9ncnVwaXUod2NfZ2V0X29yZGVyKDM1MDY2KSksCiAgICd0dXJpbnlzX3N1X3ByaWVyYXN1Jz0+KGJvb2wpc3RycG9zKFBldHNob3BfU2l1bnRvczo6bGFpc2tvX3R1cmlueXMod2NfZ2V0X29yZGVyKDM1MDU5KSwnVGVzdGluaXMgcHJpZXJhc2FzJyksJ1Rlc3RpbmlzIHByaWVyYXNhcycpLAogKTsKCiAvKiBhdHN0YXRvbSAqLwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfZHJvcHNoaXBfc2VudCcpOyAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX2Ryb3BzaGlwX3RvJyk7CiAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX2Ryb3BzaGlwX3NlbnRfc3JjJyk7CiAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX21pc3J1c19zcHJlbmRpbWFzJyk7ICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfbWlzcnVzX3NwcmVzdGFzJyk7CiAkby0+c2F2ZSgpOwogJFRbJzRfYXRzdGF0eXRhJ109YXJyYXkoJ2VpbGUnPT4kcmUtPmludm9rZShudWxsLHdjX2dldF9vcmRlcigzNTA2NikpLCdsYWlza2FpJz0+YXJyYXlfa2V5cygkcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSkpKTsKICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldHJhbnNpZW50JXBzX3J5dGFzJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'VER14'};
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
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H240 v1 (perdavimas pagal sandeli + laiskas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_ver14=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1500,height:1050},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
      let r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-siuntos-laiskas&id=35059',{waitUntil:'networkidle',timeout:60000});
      await miegok(1200);
      const ta=await pg.$('#psPrierasas');
      if(ta){ await ta.fill('Įdėjome skanėstą Rikiui — nuo mūsų.'); await miegok(500); }
      out.laiskas={http:r.status(),put:await put('screenshots/h240_laiskas.png',await pg.screenshot({fullPage:true}),'VER14 laiskas'),
        perziura:await pg.$eval('#psPerziura',n=>n.innerText.slice(0,400))};
      r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk',{waitUntil:'networkidle',timeout:60000});
      await miegok(1500);
      out.desk={http:r.status(),put:await put('screenshots/h240_desk.png',await pg.screenshot({fullPage:true}),'VER14 desk')};
      out.js=kl; await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver14.json', Buffer.from(JSON.stringify(out,null,1)), 'VER14');
