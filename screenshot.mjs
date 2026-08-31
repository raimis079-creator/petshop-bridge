process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGxhaXNrbyBsb2dvIDYgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19sZyddKXx8JF9HRVRbJ3BzX2xnJ10hPT0nVicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgpOwogICRiZXN0PW51bGw7IGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL3RlbXBsYXRlcy9lbWFpbHMvKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJHU9c3RycG9zKCRzLCdQZXRzaG9wX0VtYWlsX0xheW91dCcpIT09ZmFsc2U7ICRvWyd0cGwnXVtdPWJhc2VuYW1lKCRmKS4nICcuc3RybGVuKCRzKS4nIGxheW91dD0nLigkdT8nWSc6J04nKTsgaWYoJHUgJiYgKCEkYmVzdHx8c3RybGVuKCRzKTxzdHJsZW4oZmlsZV9nZXRfY29udGVudHMoJGJlc3QpKSkpICRiZXN0PSRmOyB9CiAgJG9bJ2V4YW1wbGVfbmFtZSddPWJhc2VuYW1lKCRiZXN0KTsgJG9bJ2V4YW1wbGUnXT1maWxlX2dldF9jb250ZW50cygkYmVzdCk7CiAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnKTsgJHNyYz1maWxlX2dldF9jb250ZW50cygkcmMtPmdldEZpbGVOYW1lKCkpOyBpZihwcmVnX21hdGNoKCcvLnswLDUwMH10ZW1wbGF0ZXNcL2VtYWlscy57MCw3MDB9L3MnLCRzcmMsJG0pKSAkb1snZGlzcGF0Y2hfaW5jbHVkZSddPSRtWzBdOwogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-074949';
const GKEY='ps_lg';
const PHASES=["V"];
const OUT='analize/lg_recon6.json';
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
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
