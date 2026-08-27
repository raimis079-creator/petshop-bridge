process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFBhcmQgMy40LjEKICovCmFkZF9hY3Rpb24oICd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CglpZiAoICEgaXNzZXQoICRfR0VUWydwc19wMzQxJ10gKSApIHsgcmV0dXJuOyB9CgkkayA9IChzdHJpbmcpICRfR0VUWydwc19wMzQxJ107IGlmICggISBpbl9hcnJheSggJGssIGFycmF5KCAnREVQJywgJ1ZFUicgKSwgdHJ1ZSApICkgeyByZXR1cm47IH0KCWdsb2JhbCAkd3BkYjsgJG8gPSBhcnJheSggJ3YnID0+ICdFNTYnLCAnaycgPT4gJGsgKTsKCSRmYWlsYWkgPSBhcnJheSgKCQkncGV0c2hvcC1hdGFza2FpdGEtcGFyZGF2aW1haS5waHAnID0+IGFycmF5KCAnYmIwZGE4NTA1ZGQ1MjA0MDFlODdmMzVjNjEzNTIzMjknLCAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlLzZmNjJkZDk5MmFhODExNmFhYWU4ZjIyMjNkOGY5MjBmYzdmMjcwMWUvZGVwbG95L3BldHNob3AtYXRhc2thaXRhLXBhcmRhdmltYWkuYjY0JyApCgkpOwoJaWYgKCAnREVQJyA9PT0gJGsgKSB7CgkJZm9yZWFjaCAoICRmYWlsYWkgYXMgJGZuID0+ICR4ICkgewoJCQkkZiA9IFdQTVVfUExVR0lOX0RJUiAuICcvJyAuICRmbjsgJHIgPSBhcnJheSggJ3ByaWVzJyA9PiBmaWxlX2V4aXN0cyggJGYgKSA/IG1kNV9maWxlKCAkZiApIDogbnVsbCApOwoJCQkkZyA9IHdwX3JlbW90ZV9nZXQoICR4WzFdLCBhcnJheSggJ3RpbWVvdXQnID0+IDQwICkgKTsgJGNvZGUgPSBpc193cF9lcnJvciggJGcgKSA/IGZhbHNlIDogYmFzZTY0X2RlY29kZSggdHJpbSggd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoICRnICkgKSwgdHJ1ZSApOwoJCQlpZiAoICEgJGNvZGUgfHwgbWQ1KCAkY29kZSApICE9PSAkeFswXSApIHsgJHJbJ2tsYWlkYSddID0gJ3BhcnNpdXN0YSBuZSB0YWknOyAkb1sgJGZuIF0gPSAkcjsgY29udGludWU7IH0KCQkJdHJ5IHsgdG9rZW5fZ2V0X2FsbCggJGNvZGUsIFRPS0VOX1BBUlNFICk7IH0gY2F0Y2ggKCBUaHJvd2FibGUgJGUgKSB7ICRyWydrbGFpZGEnXSA9ICd0b2tlbjogJyAuICRlLT5nZXRNZXNzYWdlKCk7ICRvWyAkZm4gXSA9ICRyOyBjb250aW51ZTsgfQoJCQlpZiAoICRyWydwcmllcyddICkgeyAkYmQgPSBXUF9DT05URU5UX0RJUiAuICcvdXBsb2Fkcy9wcy1iYWNrdXBzJzsgaWYgKCAhIGlzX2RpciggJGJkICkgKSB7IHdwX21rZGlyX3AoICRiZCApOyB9IGNvcHkoICRmLCAkYmQgLiAnLycgLiAkZm4gLiAnLmJha19lNTZfJyAuIGdtZGF0ZSggJ1ltZF9IaScgKSApOyB9CgkJCSRyWydyYXN5dGEnXSA9IGZpbGVfcHV0X2NvbnRlbnRzKCAkZiwgJGNvZGUgKTsgJHJbJ3BvJ10gPSBtZDVfZmlsZSggJGYgKTsgaWYgKCBmdW5jdGlvbl9leGlzdHMoICdvcGNhY2hlX2ludmFsaWRhdGUnICkgKSB7IG9wY2FjaGVfaW52YWxpZGF0ZSggJGYsIHRydWUgKTsgfQoJCQkkb1sgJGZuIF0gPSAkcjsKCQl9Cgl9IGVsc2UgewoJCSRvWyd2ZXInXSA9IFBldHNob3BfQXRhc2thaXRhX1BhcmRhdmltYWk6OlZFUlNJSkE7ICRvWydhdiddID0gUGV0c2hvcF9BdGFza2FpdGFfUGFyZGF2aW1haTo6dGlla2Vqb192YXJkYXMoICdhdicgKTsKCQkkd3BkYi0+cXVlcnkoICJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIiApOwoJfQoJaGVhZGVyKCAnQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyApOyBlY2hvIHdwX2pzb25fZW5jb2RlKCAkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSB8IEpTT05fVU5FU0NBUEVEX1NMQVNIRVMgKTsgZXhpdDsKfSwgNSApOwo='; const VER='P341';
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP P341 deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_p341=DEP',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.dep=JSON.parse(t); }catch(e){ out.dep_zalias=t.slice(0,1200); }
  await miegok(6000);
  const r2=await fx(WP+'/?ps_p341=VER',{headers:{'Cache-Control':'no-cache'}},'ver');
  const t2=await r2.text();
  try{ out.ver=JSON.parse(t2); }catch(e){ out.ver_zalias=t2.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/p341.json', Buffer.from(JSON.stringify(out,null,1)), VER);
