process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI4ayBudW9yb2R1IGtsaWsgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19ucmsnXSk/JF9HRVRbJ3BzX25yayddOicnKTsgaWYoJGYhPT0nUCcmJiRmIT09J0NMJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nTlJLLTEnLCdmYXplJz0+JGYpOwogICRFTT0ncHNuM251b3JrQGd5dnVuYWkubHQnOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGlmKCRmPT09J1AnKXsKICAgICAgJHVpZD1lbWFpbF9leGlzdHMoJEVNKTsgaWYoISR1aWQpICR1aWQ9d3BfY3JlYXRlX3VzZXIoJ3BzbjNudW9yaycsd3BfZ2VuZXJhdGVfcGFzc3dvcmQoMjApLCRFTSk7CiAgICAgICRzaWQ9UGV0c2hvcF9QcmVudW1lcmF0YTo6c3VrdXJ0aShhcnJheSgnZW1haWwnPT4kRU0sJ3VzZXJfaWQnPT4kdWlkLAogICAgICAgICdpdGVtcyc9PmFycmF5KGFycmF5KCdwcm9kdWN0X2lkJz0+MzUwOTgsJ3F0eSc9PjIpKSwnaW50ZXJ2YWxfZGF5cyc9PjI4LAogICAgICAgICduZXh0X2N5Y2xlX2RhdGUnPT5nbWRhdGUoJ1ktbS1kJyx0aW1lKCkrMTAqREFZX0lOX1NFQ09ORFMpKSk7CiAgICAgICRvWydzaWQnXT0kc2lkOyAkb1sndWlkJ109JHVpZDsKICAgICAgJG9bJ3VybCddPXBzX3ByZW5fbnVvcm9kYSgkc2lkLCdhdHNhdWt0aScpOwogICAgfSBlbHNlIHsKICAgICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBlbWFpbD0lcyIsJEVNKSk7CiAgICAgIGZvcmVhY2goJGlkcyBhcyAkeCl7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25faXRlbXMgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwkeCkpOwogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9uX2V2ZW50cyBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCR4KSk7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIFdIRVJFIGlkPSVkIiwkeCkpOwogICAgICB9CiAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfYWN0aW9uX3Rva2VucyBXSEVSRSBwdXJwb3NlPSdwcmVuX3ZlaWtzbWFzJyIpOwogICAgICAkdT1lbWFpbF9leGlzdHMoJEVNKTsgaWYoJHUpeyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB3cF9kZWxldGVfdXNlcigkdSk7IH0KICAgICAgJG9bJ2xpa3V0aXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIFdIRVJFIGVtYWlsPSVzIiwkRU0pKTsKICAgICAgJG9bJ3Rva2VuYWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19hY3Rpb25fdG9rZW5zIFdIRVJFIHB1cnBvc2U9J3ByZW5fdmVpa3NtYXMnIik7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='nuorodos-klik-1';
const out={v:VER,zingsniai:[]};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function faze(f){ const d=await fetch(WP+'/?ps_nrk='+f,{headers:{'User-Agent':'Mozilla/5.0'}}); const t=await d.text();
  try{ return JSON.parse(t); }catch(e){ return {zalias:t.slice(0,800)}; } }
let sid=null;
try{
  const l=await fetch(SNIP,{headers:A}); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  sid=JSON.parse(await c.text()).id; out.sid=sid;
  await miegok(9000);
  const P=await faze('P'); out.P=P;
  if(!P||!P.url) throw new Error('nera url is P');
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:900,height:900}});
  const pg=await ctx.newPage();
  let nr=0;
  const Z=async(vardas,fn)=>{ nr++; try{ const r=await fn(pg); out.zingsniai.push({nr,vardas,ok:true,rez:r===undefined?null:r}); }
    catch(e){ out.zingsniai.push({nr,vardas,ok:false,klaida:String(e).slice(0,250)});
      try{ const b=await pg.screenshot(); await put('analize/nrk_fail_'+nr+'.png',b,VER); }catch(x){} } };

  await Z('atidaryti laisko nuoroda (be slapuku)',async p=>{
    await p.goto(P.url,{waitUntil:'domcontentloaded',timeout:60000});
    const t=await p.textContent('body');
    if(!/Prenumeratos valdymas/.test(t)) throw new Error('ne patvirtinimo psl: '+t.slice(0,100));
    if(!/atsaukti prenumerata/i.test(t)) throw new Error('nera veiksmo pavadinimo');
    return 'patvirtinimo puslapis';
  });
  await Z('paspausti Testi -> prisijungimas -> paskyra',async p=>{
    await Promise.all([p.waitForNavigation({timeout:60000}),p.click('button[type=submit]')]);
    await p.waitForTimeout(2000);
    const u=p.url();
    if(!/paskyra\/prenumeratos/.test(u)) throw new Error('ne paskyroje: '+u);
    if(!/sid='+P.sid/.test(u)&&!new RegExp('sid='+P.sid).test(u)) throw new Error('be sid: '+u);
    return u;
  });
  await Z('detale atsidariusi ir prisijungta',async p=>{
    const t=await p.textContent('body');
    if(!/Prenumerata/.test(t)) throw new Error('nera detales');
    if(/Prisijungti|prisijungimo/i.test((await p.title())||'')) throw new Error('login titulas');
    const b=await p.screenshot({fullPage:true});
    await put('analize/nuorodos_klik.png',b,VER);
    return 'ok';
  });
  await Z('pakartotinis nuorodos paspaudimas (jau prisijungus) -> tiesiai i paskyra',async p=>{
    await p.goto(P.url,{waitUntil:'domcontentloaded',timeout:60000});
    await p.waitForTimeout(1500);
    const u=p.url();
    if(!/paskyra\/prenumeratos/.test(u)) throw new Error('nenuvede: '+u);
    return u;
  });
  await br.close();
  out.VISKAS_ZALIA=out.zingsniai.every(z=>z.ok);
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ out.CL=await faze('CL'); }catch(e){}
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/nuorodos_klik.json',Buffer.from(JSON.stringify(out,null,1)),VER);
console.log('ok');
