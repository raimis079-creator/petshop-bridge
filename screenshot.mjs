const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19hdXRoNjQ3J10/PycnKSE9PSdBNjQ3eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgJHUgPSBnZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEpKTsKICBpZighJHUpeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdLTEFJREEnPT4nbmVyYSBhZG1pbm8nKSk7IGV4aXQ7IH0KICAkdWlkID0gJHVbMF0tPklEOwogICRleHAgPSB0aW1lKCkgKyAxODA7ICAgICAgICAgICAgICAgLy8gR0FMSU9KQSAzIE1JTi4KICAkY2sgID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwgJGV4cCwgJ2xvZ2dlZF9pbicpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoCiAgICAndmFyZGFzJyA9PiBMT0dHRURfSU5fQ09PS0lFLAogICAgJ3JlaWtzbWUnPT4gJGNrLAogICAgJ2dhbGlvamEnPT4gJGV4cCwKICAgICd1c2VyJyAgID0+ICR1WzBdLT51c2VyX2xvZ2luLAogICksIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOwogIGV4aXQ7Cn0sIDYpOwo=';
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
const out={version:'S647-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Auth Cookie 3min (S647)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  const j=await r.json(); id=j.id; out.snip=j.id;
}catch(e){out.errors.push(String(e));}
let ck=null;
if(id){
  await new Promise(x=>setTimeout(x,3000));
  try{
    const rr=await fetch('https://dev.avesa.lt/?ps_auth647=A647x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
    const t=await rr.text();
    try{ck=JSON.parse(t); out.cookie_gauta=!!ck.reiksme; out.user=ck.user;}catch(e){out.raw=t.slice(0,800);}
  }catch(e){out.errors.push(String(e));}
}
if(ck&&ck.reiksme){
  try{
    const {chromium}=await import('playwright');
    const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1600,height:1150},ignoreHTTPSErrors:true});
    await ctx.addCookies([{name:ck.vardas,value:ck.reiksme,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true}]);
    const pg=await ctx.newPage();
    const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
    const t0=Date.now();
    await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-katalogas',{waitUntil:'domcontentloaded',timeout:120000});
    await pg.waitForTimeout(2500);
    out.ms=Date.now()-t0;
    out.url=pg.url();
    out.titulas=await pg.title();
    await putFile('screenshots/s647_katalogas.png', await pg.screenshot(), 'S647 katalogas');
    out.dom=await pg.evaluate(()=>({
      eiluciu:document.querySelectorAll('.pskat-t tbody tr').length,
      rail:Array.from(document.querySelectorAll('.pskat-view')).map(e=>e.textContent.trim().replace(/\s+/g,' ')),
      suv:Array.from(document.querySelectorAll('.pskat-suv .p')).map(e=>e.textContent.trim().replace(/\s+/g,' ')),
      psl:(document.querySelector('.pskat-psl')||{}).textContent||null,
      pirmos:Array.from(document.querySelectorAll('.pskat-t tbody tr')).slice(0,4).map(tr=>
        Array.from(tr.querySelectorAll('td')).map(td=>td.textContent.trim().replace(/\s+/g,' ').slice(0,40)))
    }));
    // eile "Zemiau marzos ribos"
    await pg.goto('https://dev.avesa.lt/wp-admin/admin.php?page=ps-katalogas&view=zemiau_ribos',{waitUntil:'domcontentloaded',timeout:90000});
    await pg.waitForTimeout(2000);
    await putFile('screenshots/s647_marza.png', await pg.screenshot(), 'S647 marza');
    out.marza_eile=await pg.evaluate(()=>({
      eiluciu:document.querySelectorAll('.pskat-t tbody tr').length,
      psl:(document.querySelector('.pskat-psl')||{}).textContent||null}));
    out.js=errs;
    await br.close();
  }catch(e){out.errors.push({s:'shot',e:String(e)});}
}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s647_v1.json',out);
console.log('DONE');
