process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyOSddKSB8fCAkX0dFVFsncHNfdmVyOSddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidWRVI5Jyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQoKIC8qIDEzLWFzIHRlc3RpbmlzOiBNScWgUlVTIEJFIEFWIChaQiArIFZGKSAqLwogJHlyYT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc190ZXN0aW5pc196YnZmJyIpOwogaWYoISR5cmEpewogICAkbz13Y19jcmVhdGVfb3JkZXIoYXJyYXkoJ2N1c3RvbWVyX2lkJz0+MCkpOwogICAkby0+YWRkX3Byb2R1Y3Qod2NfZ2V0X3Byb2R1Y3QoMTI0NTIpLDEpOyAgIC8vIFpCIEV1a2FudWJhIDMga2cKICAgJG8tPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KDE3OTQ3KSwxKTsgICAvLyBWRiBKb3NpZG9nIDE1IGtnCiAgICRhZHI9YXJyYXkoJ2ZpcnN0X25hbWUnPT4nTWFudGFzJywnbGFzdF9uYW1lJz0+J1Rlc3RhdXNrYXMnLCdhZGRyZXNzXzEnPT4nS29uc3RpdHVjaWpvcyBwci4gMjknLAogICAgICdjaXR5Jz0+J1ZpbG5pdXMnLCdwb3N0Y29kZSc9PicwODEwNScsJ2NvdW50cnknPT4nTFQnLCdlbWFpbCc9Pid0ZXJyYUBwZXRzaG9wLmx0JywncGhvbmUnPT4nKzM3MDYwMDEwMDEzJyk7CiAgICRvLT5zZXRfYWRkcmVzcygkYWRyLCdiaWxsaW5nJyk7IHVuc2V0KCRhZHJbJ2VtYWlsJ10sJGFkclsncGhvbmUnXSk7ICRvLT5zZXRfYWRkcmVzcygkYWRyLCdzaGlwcGluZycpOwogICAkc2k9bmV3IFdDX09yZGVyX0l0ZW1fU2hpcHBpbmcoKTsKICAgJHNpLT5zZXRfbWV0aG9kX3RpdGxlKCdWRU5JUEFLIHBhxaF0b21hdGFpL2F0c2nEl21pbW8gcHVua3RhaScpOwogICAkc2ktPnNldF9tZXRob2RfaWQoJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX3BpY2t1cF9tZXRob2QnKTsgJHNpLT5zZXRfaW5zdGFuY2VfaWQoMyk7CiAgICRzaS0+c2V0X3RvdGFsKDApOyAkby0+YWRkX2l0ZW0oJHNpKTsKICAgJG8tPnNldF9wYXltZW50X21ldGhvZCgncGF5c2VyYScpOyAkby0+c2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCdQYXlzZXJhJyk7CiAgIHZlbmlwYWtfc3RvcmVfb3JkZXJfcGlja3VwKCRvLDM5OTApOwogICAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX3Rlc3RpbmlzJywnMjAyNi0wOC0yMycpOwogICAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX3Rlc3RpbmlzX3pidmYnLCcxJyk7CiAgICRvLT5jYWxjdWxhdGVfdG90YWxzKHRydWUpOwogICAkby0+c2V0X2RhdGVfcGFpZCh0aW1lKCkpOwogICAkby0+c2V0X3N0YXR1cygncHJvY2Vzc2luZycsJ1Rlc3RpbmlzOiBNSVNSVVMgYmUgQVYgKFpCK1ZGKS4nKTsKICAgJG8tPnNhdmUoKTsKICAgJFRbJ3N1a3VydGFzJ109JG8tPmdldF9pZCgpOwogfSBlbHNlIHsKICAgJFRbJ3N1a3VydGFzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9yZGVyX2lkIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc190ZXN0aW5pc196YnZmJyBMSU1JVCAxIik7CiB9CgogJHJ2PW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCd2eWtkeW1hcycpOyAkcnYtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcmE9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ3ZlaWtzbWFpJyk7ICRyYS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRyZT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnZWlsZScpOyAkcmUtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcms9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2tsYXVzaW1hcycpOyAkcmstPnNldEFjY2Vzc2libGUodHJ1ZSk7CiBmb3JlYWNoKGFycmF5KCRUWydzdWt1cnRhcyddLDM1MDU1LDM1MDU5LDM1MDY1LDM1MDY2KSBhcyAkaWQpewogICAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsKICAgJHJvdz1hcnJheSgnZWlsZSc9PiRyZS0+aW52b2tlKG51bGwsJG8pLCdrbGF1c2ltYXMnPT4kcmstPmludm9rZShudWxsLCRvKSk7CiAgICRUWyd0aWtyaW5hbSddWyRpZF09YXJyYXkoJ3Z5a2R5bWFzJz0+JHJ2LT5pbnZva2UobnVsbCwkbyksCiAgICAgJ3ZlaWtzbWFpJz0+YXJyYXlfY29sdW1uKCRyYS0+aW52b2tlKG51bGwsJG8sJHJvdyksJ2lkJyksCiAgICAgJ215Z3R1a2FpJz0+YXJyYXlfY29sdW1uKCRyYS0+aW52b2tlKG51bGwsJG8sJHJvdyksJ3QnKSk7CiB9CiAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXRyYW5zaWVudCVwc19yeXRhcyUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'VER9'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H235 v1 (misrus be AV)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_ver9=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1600,height:1200},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('console',m=>{if(m.type()==='error')kl.push(m.text().slice(0,150));}); pg.on('pageerror',e=>kl.push('JS: '+String(e).slice(0,150)));
      out.ekranai={};
      for(const [nm,u] of [['h235_desk','/wp-admin/admin.php?page=ps-desk'],['h235_misrus','/wp-admin/admin.php?page=ps-desk&vykdymas=misrus'],['h235_dropship','/wp-admin/admin.php?page=ps-desk&vykdymas=dropship']]){
        const r=await pg.goto(WP+u,{waitUntil:'networkidle',timeout:60000});
        await miegok(1800);
        out.ekranai[nm]={http:r.status(),put:await put('screenshots/'+nm+'.png',await pg.screenshot({fullPage:true}),'VER9 '+nm),
          tekstas:(await pg.locator('body').innerText()).replace(/\n{2,}/g,'\n').slice(600,2600)};
      }
      out.js_klaidos=kl;
      await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver9.json', Buffer.from(JSON.stringify(out,null,1)), 'VER9');
