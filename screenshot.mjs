process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const DEP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRtPWlzc2V0KCRfR0VUWydwc19kZXA5MDInXSk/JF9HRVRbJ3BzX2RlcDkwMiddOicnOyBpZigkbT09PScnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogJHRtcD1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMta2F0LXY4Ny50bXAnOwogaWYoJG09PT0nUkVDVicpewogICRiPWZpbGVfZ2V0X2NvbnRlbnRzKCdwaHA6Ly9pbnB1dCcpOwogIGZpbGVfcHV0X2NvbnRlbnRzKCR0bXAsJGIpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4nREVQOTAyJywnZ2F1dGEnPT5zdHJsZW4oJGIpLCdtZDUnPT5tZDVfZmlsZSgkdG1wKSkpOyBleGl0OwogfQogaWYoJG09PT0nQVBQTFknKXsKICAkZXhwPWlzc2V0KCRfR0VUWydtZDUnXSk/JF9HRVRbJ21kNSddOicnOwogICRvPWFycmF5KCd2Jz0+J0RFUDkwMicpOwogIGlmKCFmaWxlX2V4aXN0cygkdG1wKSl7JG9bJ2tsYWlkYSddPSduZXJhIHRtcCc7ZWNobyB3cF9qc29uX2VuY29kZSgkbyk7ZXhpdDt9CiAgaWYobWQ1X2ZpbGUoJHRtcCkhPT0kZXhwKXskb1sna2xhaWRhJ109J21kNSBuZXN1dGFtcGEnOyRvWyd5cmEnXT1tZDVfZmlsZSgkdG1wKTtlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTtleGl0O30KICAkY29kZT1maWxlX2dldF9jb250ZW50cygkdG1wKTsKICB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyRvWydrbGFpZGEnXT0nc2ludGFrc2U6ICcuJGUtPmdldE1lc3NhZ2UoKTtlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTtleGl0O30KICAkdD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogICRiZGlyPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsgaWYoIWlzX2RpcigkYmRpcikpIG1rZGlyKCRiZGlyLDA3NTUsdHJ1ZSk7CiAgY29weSgkdCwkYmRpci4nL3BldHNob3Ata2F0YWxvZ2FzLnBocC5iYWtfczkwMicpOwogICRvWydiYWtfbWQ1J109bWQ1X2ZpbGUoJGJkaXIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAuYmFrX3M5MDInKTsKICBmaWxlX3B1dF9jb250ZW50cygkdCwkY29kZSk7CiAgJG9bJ2lyYXN5dGFfbWQ1J109bWQ1X2ZpbGUoJHQpOyAkb1snb2snXT0oJG9bJ2lyYXN5dGFfbWQ1J109PT0kZXhwKTsKICB1bmxpbmsoJHRtcCk7CiAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OwogfQp9LCAxMzEpOwo=';
const CK='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdWSVM4NCcpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nVklTODQnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJGFkbT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEpKTsgJHVpZD0kYWRtPyRhZG1bMF0tPklEOjE7CiAkb1snY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOyAkb1snY29va2llX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCx0aW1lKCkrOTAwLCdsb2dnZWRfaW4nKTsKICRvWydzZWNfbmFtZSddPVNFQ1VSRV9BVVRIX0NPT0tJRTsgJG9bJ3NlY192YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsdGltZSgpKzkwMCwnc2VjdXJlX2F1dGgnKTsKICRvWydhdXRoX25hbWUnXT1BVVRIX0NPT0tJRTsgJG9bJ2F1dGhfdmFsdWUnXT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLHRpbWUoKSs5MDAsJ2F1dGgnKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const NAUJAS_MD5='361abecd00dc4b3aaf942b4421b7c72b';
const out={versija:'DEP902'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  // 1. failas is repo
  const fr=await fetch(`https://api.github.com/repos/${REPO}/contents/deploy/kat_v87.php`,{headers:{'Authorization':'Bearer '+TOK,'Accept':'application/vnd.github.raw','User-Agent':'b'}});
  const fbuf=Buffer.from(await fr.arrayBuffer());
  out.failas=fbuf.length;
  // 2. deploy snippetas
  const s=await snip('TEMP DEP902',DEP);
  await new Promise(r=>setTimeout(r,6000));
  // 3. RECV
  const rr=await fetch(WP+'/?ps_dep902=RECV',{method:'POST',body:fbuf});
  out.recv=JSON.parse(await rr.text());
  // 4. APPLY
  const ar=await fetch(WP+'/?ps_dep902=APPLY&md5='+NAUJAS_MD5);
  out.apply=JSON.parse(await ar.text());
  await off(s);
  if(!out.apply.ok){ throw new Error('APPLY nepavyko'); }
  // 5. VIZUALI PATIKRA
  const s2=await snip('TEMP VIS84B',CK);
  await new Promise(r=>setTimeout(r,4000));
  const prep=JSON.parse(await (await fetch(WP+'/?ps_sv=VIS84')).text());
  await off(s2);
  const { chromium }=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1680,height:950}});
  const ck=[{name:prep.cookie_name,value:prep.cookie_value,domain:'dev.avesa.lt',path:'/'}];
  if(prep.sec_name) ck.push({name:prep.sec_name,value:prep.sec_value,domain:'dev.avesa.lt',path:'/'});
  if(prep.auth_name) ck.push({name:prep.auth_name,value:prep.auth_value,domain:'dev.avesa.lt',path:'/wp-admin'});
  await ctx.addCookies(ck);
  const p=await ctx.newPage();
  out.js=[]; p.on('pageerror',e=>out.js.push(String(e).slice(0,160)));
  await p.goto(WP+'/wp-admin/admin.php?page=ps-katalogas',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(r=>setTimeout(r,3500));
  out.virsuje = await p.evaluate(()=>{
    const L=document.querySelector('.pskat-lent-lauk');
    const eil=L?L.querySelectorAll('tbody tr').length:0;
    return { eiluciu_dom:eil, lauko_h:L?L.clientHeight:null, lauko_scrollH:L?L.scrollHeight:null,
      body_slenka: document.documentElement.scrollHeight>window.innerHeight,
      psvirs: getComputedStyle(document.documentElement).getPropertyValue('--ps-virsus').trim() };
  });
  await put('v87_virsus.png', await p.screenshot({fullPage:false}), 'v87 virsus');
  // paslenkam iki apacios - suvestine ir puslapiavimas
  await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  await new Promise(r=>setTimeout(r,900));
  out.apacia = await p.evaluate(()=>{
    const S=document.querySelector('.pskat-suv'), P=document.querySelector('.pskat-psl');
    const v=el=>{ if(!el) return null; const r=el.getBoundingClientRect(); return r.top>=0 && r.bottom<=window.innerHeight+2; };
    const R=document.querySelector('.pskat-rail'); const rr=R?R.getBoundingClientRect():null;
    return { suv_matoma:v(S), psl_matomas:v(P), rail_top: rr?Math.round(rr.top):null };
  });
  await put('v87_apacia.png', await p.screenshot({fullPage:false}), 'v87 apacia');
  // vidurys - sticky patikra
  await p.evaluate(()=>window.scrollTo(0,1200));
  await new Promise(r=>setTimeout(r,700));
  out.vidurys = await p.evaluate(()=>{
    const B=document.querySelector('.pskat-bar'), R=document.querySelector('.pskat-rail');
    const rb=B?B.getBoundingClientRect():null, rr=R?R.getBoundingClientRect():null;
    return { bar_top: rb?Math.round(rb.top):null, rail_top: rr?Math.round(rr.top):null };
  });
  await put('v87_vidurys.png', await p.screenshot({fullPage:false}), 'v87 vidurys');
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('dep902.json', Buffer.from(JSON.stringify(out)), 'dep902');
