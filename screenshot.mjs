process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIE1lbnUgUmVjb24yCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19tZW51cjInXSkgfHwgJF9HRVRbJ3BzX21lbnVyMiddIT09J0dPJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidNRU5VUjInKTsKICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOwogJHA9c3RycG9zKCRjLCdhZGRfbWVudV9wYWdlJyk7CiAkb1sna2F0YWxvZ2FzX2lzdCddPXN1YnN0cigkYyxtYXgoMCwkcC0yMDApLDcwMCk7CiAvLyBzdWJtZW51IHJlZ2lzdHJhY2lqb3MgLSBrb2tpZSBwYXJlbnQgc2x1ZydhaSBuYXVkb2phbWkKIHByZWdfbWF0Y2hfYWxsKCIvYWRkX3N1Ym1lbnVfcGFnZVwoXHMqJyhbXiddKyknLyIsJGMsJG0pOwogJG9bJ2thdGFsb2dhc19wYXJlbnRzJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVsxXSkpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=' ; const VER='MENUR2';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Menu Recon2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  const r=await fx(WP+'/?ps_menur2=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
  for(const p of ['/','/krepselis/']){
    try{ const pr=await fetch(WP+p,{redirect:'manual'}); out.zingsniai.push('psl:'+p+'='+pr.status); }catch(e){ out.zingsniai.push('psl:'+p+'=ERR'); }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/menur2.json', Buffer.from(JSON.stringify(out,null,1)), VER);
