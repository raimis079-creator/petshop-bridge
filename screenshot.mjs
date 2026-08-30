process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI4ZCBBY3Rpb25fVG9rZW5zIGtsYXNlICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfbWw0J10pfHwkX0dFVFsncHNfbWw0J10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTUyOGQnKTsKICB0cnl7CiAgICAkcj1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnKTsKICAgICRvWydmYWlsYXMnXT1iYXNlbmFtZSgkci0+Z2V0RmlsZU5hbWUoKSk7CiAgICAkYz1maWxlKCRyLT5nZXRGaWxlTmFtZSgpKTsKICAgIC8vIGdlbmVyYXRlICsgY29uc3VtZSArIHBlZWsgcGlsbmFzIGtvZGFzCiAgICBmb3JlYWNoKGFycmF5KCdnZW5lcmF0ZScsJ2NvbnN1bWUnLCdwZWVrJykgYXMgJG1uKXsKICAgICAgJG09JHItPmdldE1ldGhvZCgkbW4pOwogICAgICAkb1skbW5dPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxpbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRjLCRtLT5nZXRTdGFydExpbmUoKS0xLCRtLT5nZXRFbmRMaW5lKCktJG0tPmdldFN0YXJ0TGluZSgpKzEpKSk7CiAgICB9CiAgICAkb1sna29uc3RhbnRvcyddPSRyLT5nZXRDb25zdGFudHMoKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRvWydsZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHdwZGItPnByZWZpeH1wc18ldG9rZW4lJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-194052';
const GKEY='ps_ml4';
const PHASES=["GO"];
const OUT='analize/s1528d_recon.json';
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
