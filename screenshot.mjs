import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SNIP=Buffer.from("LyoqCiAqIFBldHNob3AgVG9wYmFyIHYyCiAqCiAqICgxKSB0b3BiYXJfcmlnaHQg4oCUIHBhc2FsaW5hbSBnbG9iYWxpYWkgdmlzYW1lIHNpdGUnZSAoYnV2byAiQWtjaWphOiAtMjAlIHNhdXNhbSBtYWlzdHVpIOKGkiIpCiAqICgyKSB0b3BiYXJfbGVmdCDigJQgcGFrZWljaWFtIGkgdmllbmluZ2EgZm9ybXVsdW90ZSwga3VyaSBzdXRhbXBhIHN1IGhvbWVwYWdlIHRydXN0IGJhcgogKi8KJE5FV19MRUZUID0gJzxzcGFuIGNsYXNzPSJwZXRzaG9wLXRvcGJhci1zaGlwcGluZyI+TmVtb2thbWFzIHByaXN0YXR5bWFzIMSvIHBhxaF0b21hdHVzIG51byAzMCDigqw8L3NwYW4+JzsKCi8vICgxKSByaWdodDogdHVzY2lhcwpmb3JlYWNoIChbJ3RvcGJhcl9yaWdodCcsJ3RvcF9iYXJfcmlnaHQnLCd0b3BiYXJfcmlnaHRfd2lkZ2V0X2h0bWwnLCd0b3BfYmFyX3JpZ2h0X3dpZGdldF9odG1sJ10gYXMgJG1vZCkgewogICAgYWRkX2ZpbHRlcigndGhlbWVfbW9kXycuJG1vZCwgJ19fcmV0dXJuX2VtcHR5X3N0cmluZycsIDk5KTsKfQoKLy8gKDIpIGxlZnQ6IG5hdWphIGZvcm11bHVvdGUKZm9yZWFjaCAoWyd0b3BiYXJfbGVmdCcsJ3RvcF9iYXJfbGVmdCcsJ3RvcGJhcl9sZWZ0X3dpZGdldF9odG1sJywndG9wX2Jhcl9sZWZ0X3dpZGdldF9odG1sJ10gYXMgJG1vZCkgewogICAgYWRkX2ZpbHRlcigndGhlbWVfbW9kXycuJG1vZCwgZnVuY3Rpb24oKSB1c2UgKCRORVdfTEVGVCkgeyByZXR1cm4gJE5FV19MRUZUOyB9LCA5OSk7Cn0=","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tbl',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
(async()=>{
  let out='';
  // Update snippet'a 610 su nauju kodu (+ pervardijam)
  const upd = api('/wp-json/code-snippets/v1/snippets/610','PUT',{
    name: 'Petshop Topbar v2',
    code: SNIP
  });
  try{ const j=JSON.parse(upd); out += 'update: code_error='+(j.code_error===null?'null (OK)':JSON.stringify(j.code_error))+' active='+j.active+'\n'; }
  catch(e){ out += 'UPD ERR: '+upd.slice(0,200)+'\n'; }
  await new Promise(r=>setTimeout(r,3000));

  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  await p.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(3000);
  const chk = await p.evaluate(()=>{
    const tl = document.querySelector('.html_topbar_left');
    const tr = document.querySelector('.html_topbar_right');
    const tb = document.querySelectorAll('.ph-tb-item');
    return {
      topbar_left: tl ? tl.innerText.trim() : 'NERA',
      topbar_right_exists: !!tr,
      trust_bar_items: [...tb].map(x=>x.innerText),
    };
  });
  out += '\nHomepage:\n'+JSON.stringify(chk,null,1)+'\n';
  // Screenshot top-bar zonos
  putBin('tbl_top.png', await p.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:60} }));
  // Homepage top+trust
  putBin('tbl_hero_trust.png', await p.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:900} }));
  await ctx.close();

  // Antra puslapis - globali patikra
  const ctx2 = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:100} });
  const p2 = await ctx2.newPage();
  await p2.goto(DEV+'/apie-mus/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p2.waitForTimeout(2000);
  const chk2 = await p2.evaluate(()=>{
    const tl = document.querySelector('.html_topbar_left');
    const tr = document.querySelector('.html_topbar_right');
    return { left: tl?tl.innerText.trim():'-', right_exists: !!tr };
  });
  out += '\n/apie-mus/ topbar:\n'+JSON.stringify(chk2,null,1)+'\n';
  await ctx2.close();

  // MOBILE trust bar patikra (kad 1fr 1fr veiktu tvarkingai)
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(3000);
  await pm.evaluate(()=>{ const t=document.querySelector('.ph-tb'); if(t) t.scrollIntoView({block:'center'}); });
  await pm.waitForTimeout(800);
  putBin('tbl_mobile.png', await pm.screenshot({ fullPage:false }));
  await cm.close();

  await b.close();
  putFile('tb_left.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
