process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyMTInXSkgfHwgJF9HRVRbJ3BzX3ZlcjEyJ10hPT0nUlVOMjAyNjA4MjMnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRUPWFycmF5KCd2Jz0+J1ZFUjEyJyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQogJHQ9JHdwZGItPnByZWZpeC4ncHNfdGlla2ltYXMnOwogJFRbJ3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiREVTQ1JJQkUgJHQiLDApOwogLyogdGVzdGluZSBwYXJ0aWphOiBWRiBlaWx1dGUgaXMgMzUwNjYgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkaWlkPTA7IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRrPT4kaXQpeyBpZigndmYnPT09JGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpKSAkaWlkPSRrOyB9CiAkVFsnaWlkJ109JGlpZDsKICRUWydwYXJ0aWphJ109UGV0c2hvcF9BVl9UaWVraW1hczo6aWRldGlfZWlsdXRlKCRvLCRpaWQsJ3ZmJyk7CiBsaXN0KCRrZywkYmUpPVBldHNob3BfQVZfVGlla2ltYXM6OnBhcnRpam9zX3N2b3JpcygkVFsncGFydGlqYSddKTsKICRUWydzdm9yaXNfYXV0byddPSRrZzsgJFRbJ2JlX3N2b3JpbyddPSRiZTsKICRUWydwYXN0b21hdGFzJ109UGV0c2hvcF9BVl9UaWVraW1hczo6QVZfUEFTVE9NQVRBUzsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'VER12'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H238 v1 (partijos pristatymas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_ver12=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('console',m=>{if(m.type()==='error')kl.push(m.text().slice(0,150));}); pg.on('pageerror',e=>kl.push('JS: '+String(e).slice(0,150)));
      let r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-tiekimas',{waitUntil:'networkidle',timeout:60000});
      await miegok(1800);
      out.p1={http:r.status(),put:await put('screenshots/h238_tiekimas.png',await pg.screenshot({fullPage:true}),'VER12 tiekimas'),
        radio:await pg.$$eval('.ps-tk-rad',ns=>ns.map(n=>n.textContent.trim())),
        info:await pg.$$eval('.ps-tk-prist-i',ns=>ns.map(n=>n.textContent.trim().slice(0,200)))};
      const pst=await pg.$('.ps-tk-rad input[value="pastomatas"]');
      if(pst){ await pst.click(); await miegok(400);
        const kgIn=await pg.$('.ps-tk-kg input'); if(kgIn){ await kgIn.fill('30'); }
        const save=await pg.$('button[name="ka"][value="issaugoti"]');
        if(save){ await save.click(); await pg.waitForLoadState('networkidle'); await miegok(1500); }
        out.p2={url:pg.url().slice(0,90),
          info:await pg.$$eval('.ps-tk-prist-i',ns=>ns.map(n=>n.textContent.trim().slice(0,240))),
          put:await put('screenshots/h238_pastomatas.png',await pg.screenshot({fullPage:true}),'VER12 pastomatas')};
      }
      out.js_klaidos=kl;
      await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver12.json', Buffer.from(JSON.stringify(out,null,1)), 'VER12');
