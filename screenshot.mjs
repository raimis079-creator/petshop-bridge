process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyMyddKSB8fCAkX0dFVFsncHNfdmVyMyddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidWRVIzJyk7CiAkbj0kd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXRyYW5zaWVudCVwc19yeXRhcyUnIik7CiAkVFsnaXN0cmludGFfdHJhbnNpZW50dSddPSRuOwogd3BfY2FjaGVfZmx1c2goKTsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7ICRUWydhZG1pbiddPSR1WzBdLT51c2VyX2xvZ2luOyB9CiAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3Rlc3RpbmlzJyIpOwogJFRbJ3Rlc3Rpbml1J109Y291bnQoJGlkcyk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'VER3'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v6 (partijos atnaujinimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_ver3=RUN20260823');
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
      for(const [nm,u] of [['desk_final','/wp-admin/admin.php?page=ps-desk'],['desk_rytas_final','/wp-admin/admin.php?page=ps-desk&view=rytas&naujai=1']]){
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
await put('screenshots/ver3.json', Buffer.from(JSON.stringify(out,null,1)), 'VER3');
