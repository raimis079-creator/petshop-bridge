process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZvdG8gVVJMIG1ha2V0dWkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdVRicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0ZPVE8tMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJHBpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHByIE9OIHByLnBvc3RfaWQ9cC5JRCBBTkQgcHIubWV0YV9rZXk9J19wcmljZScgQU5EIHByLm1ldGFfdmFsdWU+MAogICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHN0IE9OIHN0LnBvc3RfaWQ9cC5JRCBBTkQgc3QubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBzdC5tZXRhX3ZhbHVlPSdpbnN0b2NrJwogICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNrIE9OIHNrLnBvc3RfaWQ9cC5JRCBBTkQgc2subWV0YV9rZXk9J19za3UnIEFORCBzay5tZXRhX3ZhbHVlPD4nJwogICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIHAuSUQgREVTQyBMSU1JVCA2Iik7CiAgICAkb1sncHJla2VzJ109YXJyYXkoKTsKICAgIGZvcmVhY2goJHBpZHMgYXMgJHBpZCl7CiAgICAgICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgICAkaW1nPXdwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkcC0+Z2V0X2ltYWdlX2lkKCksJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCcpOwogICAgICAkb1sncHJla2VzJ11bXT1hcnJheSgnaWQnPT4oaW50KSRwaWQsJ3Bhdic9PiRwLT5nZXRfbmFtZSgpLCdrYWluYSc9PihmbG9hdCkkcC0+Z2V0X3ByaWNlKCksJ2ltZyc9PiRpbWcpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='f19_foto-131335';
const GKEY='ps_f19';
const PHASES=["UF"];
const OUT='analize/f19_foto_1788095614.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
