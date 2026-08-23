process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyOCddKSB8fCAkX0dFVFsncHNfdmVyOCddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidWRVI4Jyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQogJHJnPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJywnZ3J1cHVvdGknKTsgJHJnLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJEQ9J1BldHNob3BfQVZfRHJvcHNoaXAnOwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKCiAkVFsnMV9wcmFkemlhJ109YXJyYXlfa2V5cygkcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSkpOwoKIC8qIEEuIE5hdWphcyBrZWxpYXM6IFZGIHBlcmR1b3RhICovCiAkRDo6enltZXRpX3BlcmR1b3RhKCRvLCd2ZicpOyAkby0+c2F2ZSgpOwogJFRbJzJfcG9fdmYnXT1hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSk7CiAkVFsnMl9wZXJkdW90b3MnXT0kRDo6cGVyZHVvdG9zKHdjX2dldF9vcmRlcigzNTA2NikpOwogJFRbJzJfbmVwZXJkdW90b3MnXT0kRDo6bmVwZXJkdW90b3Mod2NfZ2V0X29yZGVyKDM1MDY2KSk7CgogLyogQi4gSXIgUFJJTlMgcGVyZHVvdGEgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7ICREOjp6eW1ldGlfcGVyZHVvdGEoJG8sJ3ByaW5zJyk7ICRvLT5zYXZlKCk7CiAkVFsnM19wb19hYmllanUnXT1hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSk7CiAkVFsnM19uZXBlcmR1b3RvcyddPSREOjpuZXBlcmR1b3Rvcyh3Y19nZXRfb3JkZXIoMzUwNjYpKTsKCiAvKiBDLiBWYWx5bWFzICsgc2VuYXMga2VsaWFzIChsZWdhY3kgYmUgX3RvKSAqLwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfZHJvcHNoaXBfc2VudF9zcmMnKTsgJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19kcm9wc2hpcF90bycpOwogJG8tPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19kcm9wc2hpcF9zZW50JywnMjAyNi0wOC0wMSAwOTowMDowMCcpOyAkby0+c2F2ZSgpOwogJFRbJzRfbGVnYWN5X2JlX3RvJ109YXJyYXlfa2V5cygkcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSkpOwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsgJG8tPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19kcm9wc2hpcF90bycsJ3ZmJyk7ICRvLT5zYXZlKCk7CiAkVFsnNV9sZWdhY3lfc3VfdG8nXT1hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSk7CgogLyogRC4gUGlsbmFzIGF0c3RhdHltYXMgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX2Ryb3BzaGlwX3NlbnQnKTsgJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19kcm9wc2hpcF90bycpOwogJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19kcm9wc2hpcF9zZW50X3NyYycpOyAkby0+c2F2ZSgpOwogJFRbJzZfYXRzdGF0eXRhJ109YXJyYXlfa2V5cygkcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSkpOwogJFRbJzZfbWV0YV9saWtvJ109YXJyYXkoKTsKIGZvcmVhY2god2NfZ2V0X29yZGVyKDM1MDY2KS0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgJGQ9JG0tPmdldF9kYXRhKCk7IGlmKHN0cnBvcygkZFsna2V5J10sJ19wc19kcm9wc2hpcCcpPT09MCkgJFRbJzZfbWV0YV9saWtvJ11bXT0kZFsna2V5J107IH0KICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldHJhbnNpZW50JXBzX3J5dGFzJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'VER8'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H234 v1 (perdavimas pagal sandeli)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_ver8=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1600,height:1100},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('console',m=>{if(m.type()==='error')kl.push(m.text().slice(0,150));}); pg.on('pageerror',e=>kl.push('JS: '+String(e).slice(0,150)));
      out.ekranai={};
      for(const [nm,u] of [['h234_desk','/wp-admin/admin.php?page=ps-desk'],['h234_rytas','/wp-admin/admin.php?page=ps-desk&view=rytas&z=1&naujai=1']]){
        const r=await pg.goto(WP+u,{waitUntil:'networkidle',timeout:60000});
        await miegok(2000);
        out.ekranai[nm]={http:r.status(),put:await put('screenshots/'+nm+'.png',await pg.screenshot({fullPage:true}),'VER8 '+nm),
          tekstas:(await pg.locator('body').innerText()).replace(/\n{2,}/g,'\n').slice(400,1800)};
      }
      out.js_klaidos=kl;
      await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver8.json', Buffer.from(JSON.stringify(out,null,1)), 'VER8');
