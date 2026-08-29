process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIHdlYmhvb2sgVVRDICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZTMnXSk/JF9HRVRbJ3BzX2UzJ106JycpIT09J1cxJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRTNXMScpOwogIHRyeXsKICAgIGZvcmVhY2goYXJyYXkoJ1BldHNob3BfRVNQX1dlYmhvb2tfUmVjZWl2ZXInLCdQZXRzaG9wX1dlYmhvb2tfUmVjZWl2ZXInLCdQZXRzaG9wX1NlbmRlcl9XZWJob29rX1JlY2VpdmVyJykgYXMgJGtsKXsKICAgICAgaWYoY2xhc3NfZXhpc3RzKCRrbCkpeyAkb1sna2xhc2UnXT0ka2w7ICRmPShuZXcgUmVmbGVjdGlvbkNsYXNzKCRrbCkpLT5nZXRGaWxlTmFtZSgpOyBicmVhazsgfQogICAgfQogICAgaWYoIWlzc2V0KCRmKSl7ICRvWydTVE9QJ109J2tsYXNlIG5lcmFzdGEnOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgJG9bJ2ZhaWxhcyddPSRmOyAkaz1maWxlX2dldF9jb250ZW50cygkZik7CiAgICBwcmVnX21hdGNoX2FsbCgnLy57MCw2MH0oZGVsaXZlcmVkX2F0fG9wZW5lZF9hdHxjbGlja2VkX2F0KS57MCw4MH0vJywkaywkbSk7CiAgICAkb1snaXJhc2FpJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKGFycmF5X21hcCgndHJpbScsJG1bMF0pKSwwLDgpOwogICAgJG9bJ2dtZGF0ZSddPXN1YnN0cl9jb3VudCgkaywnZ21kYXRlJyk7ICRvWydjdXJyZW50X3RpbWUnXT1zdWJzdHJfY291bnQoJGssJ2N1cnJlbnRfdGltZScpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='e3_wh-203950';
const GKEY='ps_e3';
const PHASES=["W1"];
const OUT='analize/e3_wh.json';
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
