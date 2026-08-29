process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUxNiBNZW5pdSByZWdpc3RyYWNpamEgc3UgdGVpc2VtaXMgdjEuMCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J0UxNicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0UxNi12MS4wJyk7CiAgdHJ5ewogICAgJGFkbT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ2ZpZWxkcyc9PidJRCcpKTsKICAgICRvWydhZG1pbl9pZCddPWlzc2V0KCRhZG1bMF0pPyhpbnQpJGFkbVswXTowOwogICAgaWYoJG9bJ2FkbWluX2lkJ10peyB3cF9zZXRfY3VycmVudF91c2VyKCRvWydhZG1pbl9pZCddKTsgfQogICAgJG9bJ2dhbGknXT1jdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpPydUQUlQJzonTkUnOwogICAgZ2xvYmFsICRtZW51LCRzdWJtZW51OyAkbWVudT1hcnJheSgpOyAkc3VibWVudT1hcnJheSgpOwogICAgZG9fYWN0aW9uKCdhZG1pbl9tZW51Jyk7CiAgICAkb1sndGV2YXMnXT1udWxsOwogICAgaWYoaXNfYXJyYXkoJG1lbnUpKSBmb3JlYWNoKCRtZW51IGFzICRtKXsgaWYoaXNzZXQoJG1bMl0pJiYkbVsyXT09PSdwZXRzaG9wLWxhbmdhaScpICRvWyd0ZXZhcyddPWFycmF5KCdwYXYnPT4kbVswXSwnc2x1Zyc9PiRtWzJdLCdjYXAnPT4kbVsxXSk7IH0KICAgICRvWydzdWJtZW5pdSddPWlzc2V0KCRzdWJtZW51WydwZXRzaG9wLWxhbmdhaSddKT9hcnJheV9tYXAoZnVuY3Rpb24oJHMpe3JldHVybiBhcnJheSgncGF2Jz0+JHNbMF0sJ3NsdWcnPT4kc1syXSk7fSwkc3VibWVudVsncGV0c2hvcC1sYW5nYWknXSk6J05FUkEnOwogICAgJG9bJ2tpdGlfcGV0c2hvcCddPWFycmF5KCk7CiAgICBpZihpc19hcnJheSgkbWVudSkpIGZvcmVhY2goJG1lbnUgYXMgJG0peyBpZihpc3NldCgkbVsyXSkmJnN0cnBvcygkbVsyXSwncGV0c2hvcCcpIT09ZmFsc2UpICRvWydraXRpX3BldHNob3AnXVtdPSRtWzJdOyB9CiAgICAvKiBjYWxsYmFjaydhaSBrdmllxI1pYW1pPyB0aWsgcGF0aWtyYSwga2FkIG1ldG9kYWkgeXJhICovCiAgICAkb1snbWV0b2RhaSddPWFycmF5KAogICAgICAnYXB6dmFsZ2EnPT5tZXRob2RfZXhpc3RzKCdQZXRzaG9wX0xhbmdhaV9BZG1pbicsJ2VrcmFuYXNfYXB6dmFsZ2EnKT8neXJhJzonTkUnLAogICAgICAnbGFpc2thaSc9Pm1ldGhvZF9leGlzdHMoJ1BldHNob3BfTGFuZ2FpX0FkbWluJywnZWtyYW5hc19sYWlza2FpJyk/J3lyYSc6J05FJywKICAgICk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='E16-163711';
const GKEY='ps_bis';
const PHASES=["E16"];
const OUT='analize/e16.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
