process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEU0QiBrbGllbnRhaSAxLjAuMSArIHZhbHltYXMKICovCmFkZF9hY3Rpb24oICd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CglpZiAoICEgaXNzZXQoICRfR0VUWydwc19lNGInXSApIHx8ICRfR0VUWydwc19lNGInXSAhPT0gJ0dPJyApIHsgcmV0dXJuOyB9CglnbG9iYWwgJHdwZGI7ICRvID0gYXJyYXkoICd2JyA9PiAnRTRCJyApOyAkVSA9ICR3cGRiLT5wcmVmaXggLiAncHNfZmFrdF91enNha3ltYWknOwoJJGYgPSBXUE1VX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtYXRhc2thaXRhLWtsaWVudGFpLnBocCc7CgkkZyA9IHdwX3JlbW90ZV9nZXQoICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvNThjOWUxMTE0NTNmMGI0YzllMGYxMWZiMGI3NjM0ZTE3NTUwOTQyNy9kZXBsb3kvcGV0c2hvcC1hdGFza2FpdGEta2xpZW50YWkuYjY0JywgYXJyYXkoICd0aW1lb3V0JyA9PiA0MCApICk7ICRjb2RlID0gaXNfd3BfZXJyb3IoICRnICkgPyBmYWxzZSA6IGJhc2U2NF9kZWNvZGUoIHRyaW0oIHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCAkZyApICksIHRydWUgKTsKCWlmICggISAkY29kZSB8fCBtZDUoICRjb2RlICkgIT09ICc0M2QxOTI2NTQ2ZDJlODA1M2YyNzhlNDdhYmIzN2NiNCcgKSB7ICRvWydrbGFpZGEnXSA9ICdwYXJzaXVzdGEgbmUgdGFpJzsgfQoJZWxzZSB7IHRyeSB7IHRva2VuX2dldF9hbGwoICRjb2RlLCBUT0tFTl9QQVJTRSApOyAkb1sncmFzeXRhJ10gPSBmaWxlX3B1dF9jb250ZW50cyggJGYsICRjb2RlICk7ICRvWydwbyddID0gbWQ1X2ZpbGUoICRmICk7IGlmICggZnVuY3Rpb25fZXhpc3RzKCAnb3BjYWNoZV9pbnZhbGlkYXRlJyApICkgeyBvcGNhY2hlX2ludmFsaWRhdGUoICRmLCB0cnVlICk7IH0gfSBjYXRjaCAoIFRocm93YWJsZSAkZSApIHsgJG9bJ2tsYWlkYSddID0gJ3Rva2VuJzsgfSB9Cgkkb1snaXN0cmludGEnXSA9ICR3cGRiLT5xdWVyeSggIkRFTEVURSBGUk9NICRVIFdIRVJFIGtsaWVudGFzX2VtYWlsX2hhc2ggTElLRSAnU0lOVF8lJyIgKTsKCSRvWydsaWtvJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhciggIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRVIFdIRVJFIGtsaWVudGFzX2VtYWlsX2hhc2ggTElLRSAnU0lOVF8lJyIgKTsKCSRvWyd1enNfdmlzbyddID0gKGludCkgJHdwZGItPmdldF92YXIoICJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVSIgKTsKCSR3cGRiLT5xdWVyeSggIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciICk7CgloZWFkZXIoICdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nICk7IGVjaG8gd3BfanNvbl9lbmNvZGUoICRvICk7IGV4aXQ7Cn0sIDUgKTsK'; const VER='E4B';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  /* 1. isjungiam senus TEMP */
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  /* 2. kuriam recon snippeta */
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E4B',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_e4b=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/e4b.json', Buffer.from(JSON.stringify(out,null,1)), VER);
