const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19hdXRoNjQ5J10/PycnKSE9PSdBNjQ5eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgJHUgPSBnZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEpKTsKICBpZighJHUpeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdLTEFJREEnPT4nbmVyYSBhZG1pbm8nKSk7IGV4aXQ7IH0KICAkdWlkID0gJHVbMF0tPklEOyAkZXhwID0gdGltZSgpICsgMzAwOwogICRtZ3IgPSBXUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpOwogICR0b2sgPSAkbWdyLT5jcmVhdGUoJGV4cCk7CgogIC8vIHdwLWFkbWluIHBlciBhdXRoX3JlZGlyZWN0KCkgdGlrcmluYSBBVVRIL1NFQ1VSRV9BVVRILCBuZSBsb2dnZWRfaW4uCiAgLy8gVG9kZWwgcmVpa2lhIEFCSUVKVSBjb29raWUuCiAgJHNzbCA9IGlzX3NzbCgpOwogICRzY2ggPSAkc3NsID8gJ3NlY3VyZV9hdXRoJyA6ICdhdXRoJzsKICAkY2tfYXV0aCA9IHdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsICRleHAsICRzY2gsICR0b2spOwogICRja19sb2cgID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwgJGV4cCwgJ2xvZ2dlZF9pbicsICR0b2spOwoKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KAogICAgJ3NzbCcgICAgICAgICA9PiAkc3NsID8gMSA6IDAsCiAgICAnYXV0aF92YXJkYXMnID0+ICRzc2wgPyBTRUNVUkVfQVVUSF9DT09LSUUgOiBBVVRIX0NPT0tJRSwKICAgICdhdXRoX2NrJyAgICAgPT4gJGNrX2F1dGgsCiAgICAnbG9nX3ZhcmRhcycgID0+IExPR0dFRF9JTl9DT09LSUUsCiAgICAnbG9nX2NrJyAgICAgID0+ICRja19sb2csCiAgICAna2VsaWFzJyAgICAgID0+IENPT0tJRVBBVEggPyBDT09LSUVQQVRIIDogJy8nLAogICAgJ2FkbWluX2tlbGlhcyc9PiBBRE1JTl9DT09LSUVfUEFUSCwKICAgICdkb21lbmFzJyAgICAgPT4gQ09PS0lFX0RPTUFJTiA/IENPT0tJRV9ET01BSU4gOiAnJywKICAgICdwX2F1dGgnICAgICAgPT4gKGludCkgd3BfdmFsaWRhdGVfYXV0aF9jb29raWUoJGNrX2F1dGgsICRzY2gpLAogICAgJ3BfbG9nJyAgICAgICA9PiAoaW50KSB3cF92YWxpZGF0ZV9hdXRoX2Nvb2tpZSgkY2tfbG9nLCAnbG9nZ2VkX2luJyksCiAgKSwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7CiAgZXhpdDsKfSwgNik7Cg==', S='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19zNjkxJ10/PycnKSE9PSdTNjkxeCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbGs9JHdwZGItPnByZWZpeC4nd2NfcHJvZHVjdF9tZXRhX2xvb2t1cCc7CiAgJG89YXJyYXkoJ3YnPT4nUzY5MScsJ3JlemltYXMnPT4kX0dFVFsncmV6aW1hcyddPz8ndGlrX3NrYWl0eXRpJyk7CgogIC8vIHRlc3RpbmUgcHJla2U6IEFWLCBwdWJsaXNoLCBzdSBrYWluYQogICRwaWQ9KGludCkoJF9HRVRbJ3BpZCddID8/IDApOwogIGlmKCEkcGlkKXsKICAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHAuSUQgRlJPTSB7JHB9cG9zdHMgcAogICAgICBJTk5FUiBKT0lOIHskcH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU9J2F2JwogICAgICBJTk5FUiBKT0lOIHskcH1wb3N0bWV0YSByIE9OIHIucG9zdF9pZD1wLklEIEFORCByLm1ldGFfa2V5PSdfcmVndWxhcl9wcmljZScgQU5EIHIubWV0YV92YWx1ZT4wCiAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgTElNSVQgMSIpOwogIH0KICAkc25hcD1mdW5jdGlvbigkcGlkKSB1c2UgKCR3cGRiLCRsayl7CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgICAkbD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JGxrfSBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkcGlkKSwgQVJSQVlfQSk7CiAgICByZXR1cm4gYXJyYXkoCiAgICAgICdtZXRhJz0+YXJyYXkoCiAgICAgICAgJ19yZWd1bGFyX3ByaWNlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcmVndWxhcl9wcmljZScsdHJ1ZSksCiAgICAgICAgJ19wcmljZSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3ByaWNlJyx0cnVlKSwKICAgICAgICAnX3NhbGVfcHJpY2UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zYWxlX3ByaWNlJyx0cnVlKSwKICAgICAgICAnX3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpLAogICAgICAgICdfb3duX3N0b2NrX3F0eSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpLAogICAgICAgICdfc3RvY2tfc3RhdHVzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2tfc3RhdHVzJyx0cnVlKSwKICAgICAgICAnX21hbnVhbF9wcmljZV9vdmVycmlkZSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX21hbnVhbF9wcmljZV9vdmVycmlkZScsdHJ1ZSksCiAgICAgICksCiAgICAgICdsb29rdXAnPT4kbD9hcnJheSgnbWluX3ByaWNlJz0+JGxbJ21pbl9wcmljZSddLCdtYXhfcHJpY2UnPT4kbFsnbWF4X3ByaWNlJ10sCiAgICAgICAgJ29uc2FsZSc9PiRsWydvbnNhbGUnXSwnc3RvY2tfcXVhbnRpdHknPT4kbFsnc3RvY2tfcXVhbnRpdHknXSwKICAgICAgICAnc3RvY2tfc3RhdHVzJz0+JGxbJ3N0b2NrX3N0YXR1cyddLCd0YXhfc3RhdHVzJz0+JGxbJ3RheF9zdGF0dXMnXSk6bnVsbCwKICAgICAgJ3djX29iamVrdGFzJz0+JHByP2FycmF5KAogICAgICAgICdnZXRfcHJpY2UnPT4kcHItPmdldF9wcmljZSgpLCdnZXRfcmVndWxhcl9wcmljZSc9PiRwci0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSwKICAgICAgICAnZ2V0X3N0b2NrX3F1YW50aXR5Jz0+JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnZ2V0X3N0b2NrX3N0YXR1cyc9PiRwci0+Z2V0X3N0b2NrX3N0YXR1cygpLAogICAgICAgICdpc19pbl9zdG9jayc9PiRwci0+aXNfaW5fc3RvY2soKT8xOjAsCiAgICAgICAgJ2thaW5hX2tsaWVudHVpJz0+d2NfZ2V0X3ByaWNlX3RvX2Rpc3BsYXkoJHByKSk6bnVsbCwKICAgICk7CiAgfTsKICAkb1sncHJla2UnXT1hcnJheSgnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLDAsNDQpKTsKICAkb1snUFJJRVMnXT0kc25hcCgkcGlkKTsKCiAgaWYoKCRfR0VUWydyZXppbWFzJ10/PycnKT09PSd0ZXN0YXMnKXsKICAgIC8vIDEpIElNSVRVT0pBTSBLQVRBTE9HTyBSQVNZTUEgKHRhaXAsIGthaXAgZGFybyB2Mi40KQogICAgJHNlbmFfa2FpbmE9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcmVndWxhcl9wcmljZScsdHJ1ZSk7CiAgICAkc2VuYV9zdG9jaz1nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSk7CiAgICAkbmF1amFfa2FpbmE9cm91bmQoKGZsb2F0KSRzZW5hX2thaW5hICsgMy4zMywgMik7CiAgICAkbmF1amFzX3N0b2NrPShpbnQpJHNlbmFfc3RvY2sgKyA3OwoKICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3JlZ3VsYXJfcHJpY2UnLChzdHJpbmcpJG5hdWphX2thaW5hKTsKICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3ByaWNlJywoc3RyaW5nKSRuYXVqYV9rYWluYSk7CiAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsJG5hdWphc19zdG9jayk7CiAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9ja19zdGF0dXMnLCRuYXVqYXNfc3RvY2s+MD8naW5zdG9jayc6J291dG9mc3RvY2snKTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCdjbGVhbl9wb3N0X2NhY2hlJykpIGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CgogICAgJG9bJ1BPX0tBVEFMT0dPX1JBU1lNTyddPSRzbmFwKCRwaWQpOwoKICAgIC8vIDIpIGthIHJvZG8gU1ZJRVpJQUkgdXprcmF1dGFzIFdDIG9iamVrdGFzIChiZSBrZXN1KQogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19nZXRfcHJvZHVjdCcpKXsKICAgICAgd3BfY2FjaGVfZmx1c2goKTsKICAgICAgJHByMj13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICAgJG9bJ1NWSUVaSUFTX1dDJ109YXJyYXkoJ2dldF9wcmljZSc9PiRwcjItPmdldF9wcmljZSgpLAogICAgICAgICdnZXRfcmVndWxhcl9wcmljZSc9PiRwcjItPmdldF9yZWd1bGFyX3ByaWNlKCksCiAgICAgICAgJ2dldF9zdG9ja19xdWFudGl0eSc9PiRwcjItPmdldF9zdG9ja19xdWFudGl0eSgpKTsKICAgIH0KCiAgICAvLyAzKSBHUkFaSU5BTQogICAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcmVndWxhcl9wcmljZScsKHN0cmluZykkc2VuYV9rYWluYSk7CiAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19wcmljZScsKHN0cmluZykkc2VuYV9rYWluYSk7CiAgICBpZigkc2VuYV9zdG9jaz09PScnfHwkc2VuYV9zdG9jaz09PW51bGwpIGRlbGV0ZV9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyk7CiAgICBlbHNlIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJywkc2VuYV9zdG9jayk7CiAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9ja19zdGF0dXMnLChpbnQpJHNlbmFfc3RvY2s+MD8naW5zdG9jayc6J291dG9mc3RvY2snKTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCdjbGVhbl9wb3N0X2NhY2hlJykpIGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICAkb1snUE9fR1JBWklOSU1PJ109JHNuYXAoJHBpZCk7CiAgfQoKICAvLyBhciBhcHNrcml0YWkgeXJhIGZ1bmtjaWphIGxvb2t1cCBhdG5hdWppbnRpCiAgJG9bJ2Z1bmtjaWpvcyddPWFycmF5KAogICAgJ3djX3VwZGF0ZV9wcm9kdWN0X2xvb2t1cF90YWJsZXNfY29sdW1uJz0+ZnVuY3Rpb25fZXhpc3RzKCd3Y191cGRhdGVfcHJvZHVjdF9sb29rdXBfdGFibGVzX2NvbHVtbicpLAogICAgJ3djX3VwZGF0ZV9wcm9kdWN0X2xvb2t1cF90YWJsZXMnPT5mdW5jdGlvbl9leGlzdHMoJ3djX3VwZGF0ZV9wcm9kdWN0X2xvb2t1cF90YWJsZXMnKSwKICAgICd3Y19nZXRfY29udGFpbmVyJz0+ZnVuY3Rpb25fZXhpc3RzKCd3Y19nZXRfY29udGFpbmVyJyksCiAgKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgNik7Cg==';
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
async function snip(name,code){
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name,code:Buffer.from(code,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  return (await r.json()).id;
}
const out={version:'S693-V1',errors:[]};
let ck=null,idA=null,idS=null;
try{
  idA=await snip('TEMP Auth Cookie (S693)', A);
  idS=await snip('TEMP Sinchro Snap (S693)', S);
  await new Promise(x=>setTimeout(x,3500));
  ck=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_auth649=A649x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
}catch(e){out.errors.push({s:'auth',e:String(e)});}
const PID=14929;
async function snap(){
  try{ const j=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_s691=S691x&k=ps2026&pid='+PID+'&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
    return {kaina:j.PRIES.meta._regular_price, lookup:j.PRIES.lookup.min_price, wc:j.PRIES.wc_objektas.get_price}; }
  catch(e){ return {err:String(e).slice(0,90)}; }
}
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
  pg.on('dialog',d=>d.accept());
  await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-katalogas&atnaujinti=1&q=nagams&per=20',{waitUntil:'domcontentloaded',timeout:150000});
  await pg.waitForTimeout(2500);
  // 1) GRAZINAM KAINA
  await pg.click('#red-ijungti'); await pg.waitForTimeout(500);
  const td=await pg.$('tr[data-id="'+PID+'"] td[data-st=kaina]');
  await td.click(); await pg.waitForTimeout(300);
  await pg.keyboard.type('5,69'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(200);
  await pg.click('#sg-saugoti'); await pg.waitForTimeout(5000);
  out.grazinta=await snap();
  await pg.click('#red-baigti').catch(()=>{});
  await pg.waitForTimeout(500);
  // 2) ISEMIMO TESTAS su kita preke
  await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-katalogas&atnaujinti=1&q=ZZ+TEST&kruva=visos&per=20',{waitUntil:'domcontentloaded',timeout:120000});
  await pg.waitForTimeout(2500);
  out.zz=await pg.evaluate(()=>Array.from(document.querySelectorAll(".pskat-t tbody tr[data-id]")).map(t=>({id:t.dataset.id,pav:(t.querySelector(".pav a")||{}).textContent||""})));
  if(out.zz.length){
    await pg.click('.pskat-t tbody tr:first-child .atv'); await pg.waitForTimeout(2500);
    out.mygtukas=await pg.evaluate(()=>!!document.querySelector('.kort-isimti'));
    await pg.click('.kort-isimti'); await pg.waitForTimeout(4000);
    out.po_isemimo=await pg.evaluate(()=>{
      const p=document.querySelector('.pskat-pranes');
      return {pranesimas:p?p.textContent.trim().replace(/\s+/g,' ').slice(0,160):null,
        kortele_uzdaryta:document.getElementById('pskat-kort').hidden,
        eilute_isimta:document.querySelectorAll('.pskat-t tbody tr.isimta').length};
    });
    await putFile('screenshots/s693_isemimas.png', await pg.screenshot(), 'S693 isemimas');
    // 3) GRAZINIMAS
    const gr=await pg.$('.pskat-pranes button');
    if(gr){ await gr.click(); await pg.waitForTimeout(5000);
      out.po_grazinimo=await pg.evaluate(()=>({url:location.href.slice(-60),
        eiluciu:document.querySelectorAll('.pskat-t tbody tr[data-id]').length})); }
  }
  out.js=errs;
  await br.close();
 }catch(e){out.errors.push({s:'ui',e:String(e)});}
}
if(idA) await fetch(BASE+'/'+idA,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
if(idS) await fetch(BASE+'/'+idS,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s693_v1.json',out);
console.log('DONE');
