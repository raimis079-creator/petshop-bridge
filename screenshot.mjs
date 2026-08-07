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
const out={version:'S689-V1',errors:[]};
let id=null,ck=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Auth Cookie (S689)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id;
  await new Promise(x=>setTimeout(x,3000));
  ck=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_auth649=A649x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
}catch(e){out.errors.push(String(e));}
if(ck&&ck.auth_ck){
 try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1500,height:950},ignoreHTTPSErrors:true});
  await ctx.addCookies([
    {name:ck.log_vardas,value:ck.log_ck,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true},
    {name:ck.auth_vardas,value:ck.auth_ck,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true},
    {name:ck.auth_vardas,value:ck.auth_ck,domain:'dev.avesa.lt',path:'/wp-admin',httpOnly:true,secure:true}]);
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-katalogas&per=20',{waitUntil:'domcontentloaded',timeout:150000});
  await pg.waitForTimeout(3000);
  out.js=errs;
  out.paruosta=await pg.evaluate(()=>({
    deb_elementas:!!document.querySelector('.pskat-deb'),
    data_p_kiek:document.querySelectorAll('[data-p]').length,
    cursor_help:(()=>{const e=document.querySelector('[data-p]');return e?getComputedStyle(e).cursor:null;})()
  }));
  // UŽVEDAM PELĘ ant maržos plokštelės
  const t=await pg.$('.pskat-t .marza');
  if(t){
    await t.hover(); await pg.waitForTimeout(700);
    out.hover_marza=await pg.evaluate(()=>{
      const d=document.querySelector('.pskat-deb');
      return d?{display:getComputedStyle(d).display,tekstas:d.textContent.slice(0,90)}:null;
    });
    await putFile('screenshots/s689_hover.png', await pg.screenshot(), 'S689 hover');
  } else out.hover_marza='marzos plokstele nerasta';
  // ant bukles tasko
  const b=await pg.$('.pskat-t .bukle');
  if(b){
    await b.hover(); await pg.waitForTimeout(700);
    out.hover_bukle=await pg.evaluate(()=>{
      const d=document.querySelector('.pskat-deb');
      return d?{display:getComputedStyle(d).display,tekstas:d.textContent.slice(0,90)}:null;
    });
  }
  // ant sandelio
  const s=await pg.$('.pskat-t .sand');
  if(s){ await s.hover(); await pg.waitForTimeout(700);
    out.hover_sand=await pg.evaluate(()=>{const d=document.querySelector('.pskat-deb');
      return d?{display:getComputedStyle(d).display,tekstas:d.textContent.slice(0,90)}:null;});
  }
  await br.close();
 }catch(e){out.errors.push({s:'ui',e:String(e)});}
}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s689_v1.json',out);
console.log('DONE');
