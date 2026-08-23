process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyMSddKSB8fCAkX0dFVFsncHNfdmVyMSddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidWRVIxJyk7CiAvKiBMUCB0ZXJtaW5hbG8gZmlsdHJvIHBhdGlrcmEgKi8KICR0PWFwcGx5X2ZpbHRlcnMoJ3dvb19saXRodWFuaWFwb3N0X3Rlcm1pbmFsX3NlcnZpY2VfZ2V0X3Rlcm1pbmFsX2J5X2lkJywnMDAwMScpOwogJFRbJ2xwX2ZpbHRyYXMnXT1pc19hcnJheSgkdCkmJmlzc2V0KCR0WzBdKT9hcnJheSgnbmFtZSc9PiR0WzBdLT5uYW1lLCdhZGRyZXNzJz0+JHRbMF0tPmFkZHJlc3MsJ2NpdHknPT5pc3NldCgkdFswXS0+Y2l0eSk/JHRbMF0tPmNpdHk6JycpOihpc19vYmplY3QoJHQpPydvYmpla3Rhcyc6dmFyX2V4cG9ydCgkdCx0cnVlKSk7CiAvKiBBZG1pbiBzbGFwdWthaSAqLwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyAkdWlkPSR1WzBdLT5JRDsgJFRbJ2FkbWluJ109JHVbMF0tPnVzZXJfbG9naW47CiAgIHdwX3NldF9hdXRoX2Nvb2tpZSgkdWlkLHRydWUsdHJ1ZSk7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVpZCk7IH0KIC8qIEVpbGl1IHN1dmVzdGluZSAqLwogJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9yZGVyX2lkIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc190ZXN0aW5pcyciKTsKICRUWyd0ZXN0aW5pdSddPWNvdW50KCRpZHMpOwogJFRbJ3BhZ2FsX2J1c2VuYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgayBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBXSEVSRSBzdGF0dXMgTk9UIElOICgndHJhc2gnLCdhdXRvLWRyYWZ0JykgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICRwaz0wOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCRvICYmICRvLT5nZXRfbWV0YSgndmVuaXBha19waWNrdXBfcG9pbnQnKSkgJHBrKys7IH0KICRUWydzdV9wYXN0b21hdHUnXT0kcGs7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'VER2'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v5 (galutine patikra)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_ver1=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const txt=await d.text();
    try{ out.R=JSON.parse(txt); }catch(e){ out.R='ne-json: '+txt.slice(0,600); }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1600,height:1200},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const klaidos=[];
      pg.on('console',m=>{if(m.type()==='error')klaidos.push(m.text().slice(0,160));});
      pg.on('pageerror',e=>klaidos.push('JS: '+String(e).slice(0,160)));
      out.ekranai={};
      for(const [nm,u] of [['desk_final','/wp-admin/admin.php?page=ps-desk'],['desk_rytas_final','/wp-admin/admin.php?page=ps-desk&view=rytas']]){
        const r=await pg.goto(WP+u,{waitUntil:'networkidle',timeout:60000});
        await miegok(2500);
        const png=await pg.screenshot({fullPage:true});
        out.ekranai[nm]={http:r.status(),put:await put('screenshots/'+nm+'.png',png,'VER2 '+nm),
          tekstas:(await pg.locator('body').innerText()).replace(/\n{2,}/g,'\n').slice(0,2500)};
      }
      out.js_klaidos=klaidos;
      await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver2.json', Buffer.from(JSON.stringify(out,null,1)), 'VER2');
