process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUxMCBTYWJsb251IHNhbmRhcm9zIHp2YWxneWJhIHYxLjAgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykgIT09ICdFMTAnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidFMTAtdjEuMCcpOwogIHRyeXsKICAgICRkaXIgPSBQRVRTSE9QX0NPUkVfRElSLid0ZW1wbGF0ZXMvZW1haWxzLyc7CiAgICAkb1sna2F0YWxvZ2FzJ109JGRpcjsKICAgICRvWyd5cmEnXT1pc19kaXIoJGRpcik/J1RBSVAnOidORSc7CiAgICBpZihpc19kaXIoJGRpcikpewogICAgICAkb1snZmFpbGFpJ109YXJyYXkoKTsKICAgICAgZm9yZWFjaChhcnJheV9kaWZmKHNjYW5kaXIoJGRpciksYXJyYXkoJy4nLCcuLicpKSBhcyAkZil7CiAgICAgICAgJG9bJ2ZhaWxhaSddWyRmXT1maWxlc2l6ZSgkZGlyLiRmKTsKICAgICAgfQogICAgfQogICAgLyogZmxvdyAtPiB0ZW1wbGF0ZSArIGtsYXNlICovCiAgICAkb1snZmxvd3MnXT1hcnJheSgpOwogICAgZm9yZWFjaChQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpmbG93cygpIGFzICRrPT4kYyl7CiAgICAgICRvWydmbG93cyddWyRrXT1hcnJheSgndGVtcGxhdGUnPT5pc3NldCgkY1sndGVtcGxhdGUnXSk/JGNbJ3RlbXBsYXRlJ106Jz8nLCdjbGFzcyc9Pmlzc2V0KCRjWydjbGFzcyddKT8kY1snY2xhc3MnXTonPycpOwogICAgfQogICAgLyogYmVuZHJpIHBhcnRpYWxzIC8gd3JhcHBlciAqLwogICAgZm9yZWFjaChhcnJheSgncGFydGlhbHMnLCdpbmMnLCdfd3JhcHBlci5waHAnLCd3cmFwcGVyLnBocCcsJ2hlYWRlci5waHAnLCdmb290ZXIucGhwJykgYXMgJHApewogICAgICBpZihmaWxlX2V4aXN0cygkZGlyLiRwKSkgJG9bJ2JlbmRyaSddW109JHA7CiAgICB9CiAgICAvKiBkdmllasWzIMWhYWJsb27FsyBwaWxuYXMgdHVyaW55cyAqLwogICAgJGltdGk9YXJyYXkoKTsKICAgIGZvcmVhY2goYXJyYXkoJ3dlbGNvbWUnLCdyZWZpbGwnLCdvcmRlci1zaGlwcGVkJywnb3JkZXItcGFpZCcsJ3dpbi1iYWNrLTYwJykgYXMgJHMpewogICAgICBpZihmaWxlX2V4aXN0cygkZGlyLiRzLicucGhwJykpICRpbXRpW109JHM7CiAgICAgIGlmKGNvdW50KCRpbXRpKT49MikgYnJlYWs7CiAgICB9CiAgICBpZighJGltdGkgJiYgaXNfZGlyKCRkaXIpKXsKICAgICAgJHZpcz1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X2RpZmYoc2NhbmRpcigkZGlyKSxhcnJheSgnLicsJy4uJykpLGZ1bmN0aW9uKCRmKXtyZXR1cm4gc3Vic3RyKCRmLC00KT09PScucGhwJzt9KSk7CiAgICAgICRpbXRpPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkZil7cmV0dXJuIHN1YnN0cigkZiwwLC00KTt9LCR2aXMpLDAsMik7CiAgICB9CiAgICBmb3JlYWNoKCRpbXRpIGFzICRzKXsgJG9bJ3R1cmlueXMnXVskc109ZmlsZV9nZXRfY29udGVudHMoJGRpci4kcy4nLnBocCcpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='E10-162038';
const GKEY='ps_bis';
const PHASES=["E10"];
const OUT='analize/e10.json';
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
