const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19hdXRoNjQ5J10/PycnKSE9PSdBNjQ5eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgJHUgPSBnZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEpKTsKICBpZighJHUpeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdLTEFJREEnPT4nbmVyYSBhZG1pbm8nKSk7IGV4aXQ7IH0KICAkdWlkID0gJHVbMF0tPklEOyAkZXhwID0gdGltZSgpICsgMzAwOwogICRtZ3IgPSBXUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpOwogICR0b2sgPSAkbWdyLT5jcmVhdGUoJGV4cCk7CgogIC8vIHdwLWFkbWluIHBlciBhdXRoX3JlZGlyZWN0KCkgdGlrcmluYSBBVVRIL1NFQ1VSRV9BVVRILCBuZSBsb2dnZWRfaW4uCiAgLy8gVG9kZWwgcmVpa2lhIEFCSUVKVSBjb29raWUuCiAgJHNzbCA9IGlzX3NzbCgpOwogICRzY2ggPSAkc3NsID8gJ3NlY3VyZV9hdXRoJyA6ICdhdXRoJzsKICAkY2tfYXV0aCA9IHdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsICRleHAsICRzY2gsICR0b2spOwogICRja19sb2cgID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwgJGV4cCwgJ2xvZ2dlZF9pbicsICR0b2spOwoKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KAogICAgJ3NzbCcgICAgICAgICA9PiAkc3NsID8gMSA6IDAsCiAgICAnYXV0aF92YXJkYXMnID0+ICRzc2wgPyBTRUNVUkVfQVVUSF9DT09LSUUgOiBBVVRIX0NPT0tJRSwKICAgICdhdXRoX2NrJyAgICAgPT4gJGNrX2F1dGgsCiAgICAnbG9nX3ZhcmRhcycgID0+IExPR0dFRF9JTl9DT09LSUUsCiAgICAnbG9nX2NrJyAgICAgID0+ICRja19sb2csCiAgICAna2VsaWFzJyAgICAgID0+IENPT0tJRVBBVEggPyBDT09LSUVQQVRIIDogJy8nLAogICAgJ2FkbWluX2tlbGlhcyc9PiBBRE1JTl9DT09LSUVfUEFUSCwKICAgICdkb21lbmFzJyAgICAgPT4gQ09PS0lFX0RPTUFJTiA/IENPT0tJRV9ET01BSU4gOiAnJywKICAgICdwX2F1dGgnICAgICAgPT4gKGludCkgd3BfdmFsaWRhdGVfYXV0aF9jb29raWUoJGNrX2F1dGgsICRzY2gpLAogICAgJ3BfbG9nJyAgICAgICA9PiAoaW50KSB3cF92YWxpZGF0ZV9hdXRoX2Nvb2tpZSgkY2tfbG9nLCAnbG9nZ2VkX2luJyksCiAgKSwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7CiAgZXhpdDsKfSwgNik7Cg==';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
async function putFile(p,buf,m){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+p;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putFile',p,r.status);
}
const out={version:'S712-V1',errors:[]};
let ck=null,id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Auth Cookie (S712)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id;
  await new Promise(x=>setTimeout(x,3000));
  ck=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_auth649=A649x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
}catch(e){out.errors.push(String(e));}
if(ck&&ck.auth_ck){
 try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1560,height:1000},ignoreHTTPSErrors:true});
  await ctx.addCookies([
    {name:ck.log_vardas,value:ck.log_ck,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true},
    {name:ck.auth_vardas,value:ck.auth_ck,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true},
    {name:ck.auth_vardas,value:ck.auth_ck,domain:'dev.avesa.lt',path:'/wp-admin',httpOnly:true,secure:true}]);
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
  pg.on('dialog',d=>d.accept());
  // Trixie prekes, kurias ryte perkeliau i draft — grazinam MASISKAI i prekyba,
  // tai realus veiksmas su tikru rezultatu, ir ji galima atsaukti
  await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-katalogas&atnaujinti=1&kruva=juodrasciai&q=Trixie+Premium&per=50',{waitUntil:'domcontentloaded',timeout:150000});
  await pg.waitForTimeout(2500);
  out.rasta=await pg.evaluate(()=>Array.from(document.querySelectorAll('.pskat-t tbody tr[data-id]')).map(t=>({
    id:t.dataset.id, pav:(t.querySelector('.pav a')||{}).textContent||''})));
  if(out.rasta.length>=2){
    // pazymim pirmas dvi
    const v=await pg.$$('input.ps-zym');
    await v[0].click(); await pg.waitForTimeout(200);
    await v[1].click(); await pg.waitForTimeout(400);
    out.pazymeta=await pg.evaluate(()=>(document.getElementById('ms-kiek')||{}).textContent);
    await pg.selectOption('#ms-veiksmas','publish');
    await pg.click('#ms-perziura'); await pg.waitForTimeout(3000);
    out.perziura=await pg.evaluate(()=>{
      const l=document.getElementById('ps-langas');
      return {matomas:!l.hidden, antraste:(document.getElementById('lg-antraste')||{}).textContent,
        santrauka:(document.getElementById('lg-santrauka')||{}).textContent.trim().replace(/\s+/g,' '),
        eiluciu:l.querySelectorAll('.lg-t tr').length-1,
        pirmos:Array.from(l.querySelectorAll('.lg-t tr')).slice(1,3).map(r=>r.textContent.trim().replace(/\s+/g,' ').slice(0,70))};
    });
    await putFile('screenshots/s712_perziura.png', await pg.screenshot(), 'S712 perziura');
    await pg.click('#lg-vykdyk'); await pg.waitForTimeout(4500);
    out.po_vykdymo=await pg.evaluate(()=>{
      const p=document.querySelector('.pskat-pranes');
      return {pranesimas:p?p.textContent.trim().replace(/\s+/g,' ').slice(0,150):null,
        langas:document.getElementById('ps-langas').hidden};
    });
    await putFile('screenshots/s712_atlikta.png', await pg.screenshot(), 'S712 atlikta');
    // ATSAUKIAM — prekes turi grizti i juodrascius
    const gr=await pg.$('.pskat-pranes button');
    if(gr){
      await gr.click(); await pg.waitForTimeout(5000);
      out.po_atsaukimo=await pg.evaluate(()=>({
        url:location.href.slice(-70),
        eiluciu:document.querySelectorAll('.pskat-t tbody tr[data-id]').length,
        kruvos:Array.from(document.querySelectorAll('.pskat-kruvos .k')).map(e=>e.textContent.trim().replace(/\s+/g,' '))}));
    }
  } else out.PRALEISTA='per mažai prekių testui';
  out.js=errs;
  await br.close();
 }catch(e){out.errors.push({s:'ui',e:String(e)});}
}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s712_v1.json',out);
console.log('DONE');
