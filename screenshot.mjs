process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBudW9sYWlkdSBrbGlrICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfZjE5ayddKT8kX0dFVFsncHNfZjE5ayddOicnKTsgaWYoJGYhPT0nUCcmJiRmIT09J0NMJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nS0xJSy0xJywnZmF6ZSc9PiRmKTsKICAkRU09J3BzbjNrbGlrQGd5dnVuYWkubHQnOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGlmKCRmPT09J1AnKXsKICAgICAgJHVpZD1lbWFpbF9leGlzdHMoJEVNKTsgaWYoISR1aWQpICR1aWQ9d3BfY3JlYXRlX3VzZXIoJ3BzbjNrbGlrJyx3cF9nZW5lcmF0ZV9wYXNzd29yZCgyMCksJEVNKTsKICAgICAgZGVsZXRlX3VzZXJfbWV0YSgkdWlkLCBQZXRzaG9wX1ByZW51bWVyYXRhOjpVU0VSX01FVEFfTlVPTEFJREEpOwogICAgICAkc2lkPVBldHNob3BfUHJlbnVtZXJhdGE6OnN1a3VydGkoYXJyYXkoJ2VtYWlsJz0+JEVNLCd1c2VyX2lkJz0+JHVpZCwKICAgICAgICAnaXRlbXMnPT5hcnJheShhcnJheSgncHJvZHVjdF9pZCc9PjM1MDk4LCdxdHknPT4yKSksJ2ludGVydmFsX2RheXMnPT4yOCwKICAgICAgICAnbmV4dF9jeWNsZV9kYXRlJz0+Z21kYXRlKCdZLW0tZCcsdGltZSgpKzEyKkRBWV9JTl9TRUNPTkRTKSkpOwogICAgICAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgICAkYWlkPSRhZG0/KGludCkkYWRtWzBdOjE7CiAgICAgICRvWydzaWQnXT0kc2lkOyAkb1sndWlkJ109JHVpZDsgJG9bJ2FpZCddPSRhaWQ7CiAgICAgICRvWydicnV0b19jdCddPVBldHNob3BfUHJlbnVtZXJhdGE6OnNpdW50b3Nfc3VtYV9icnV0b19jdCgkc2lkKTsKICAgICAgJG9bJ2Nvb2tpZV9uYW1lJ109TE9HR0VEX0lOX0NPT0tJRTsKICAgICAgJG9bJ2Nvb2tpZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCRhaWQsdGltZSgpKzE4MDAsJ2xvZ2dlZF9pbicpOwogICAgICAkb1sndXJsJ109YWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wZXRzaG9wLXByZW51bWVyYXRvcyZzaWQ9Jy4kc2lkKTsKICAgIH0gZWxzZSB7CiAgICAgICRpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMgV0hFUkUgZW1haWw9JXMiLCRFTSkpOwogICAgICBmb3JlYWNoKCRpZHMgYXMgJHgpewogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9uX2l0ZW1zIFdIRVJFIHN1YnNjcmlwdGlvbl9pZD0lZCIsJHgpKTsKICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbl9ldmVudHMgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwkeCkpOwogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBpZD0lZCIsJHgpKTsKICAgICAgfQogICAgICAkdWlkPWVtYWlsX2V4aXN0cygkRU0pOwogICAgICBpZigkdWlkKXsgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3VzZXIucGhwJzsgd3BfZGVsZXRlX3VzZXIoJHVpZCk7IH0KICAgICAgJG9bJ2lzdHJpbnRhJ109Y291bnQoJGlkcyk7CiAgICAgICRvWydsaWt1dGlzJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBlbWFpbD0lcyIsJEVNKSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='nuolklik-184708'; const GKEY='ps_f19k'; const OUT='analize/nuolklik.json';
const out={v:VER,zingsniai:[]};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
async function faze(f){ const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'f_'+f); const t=await d.text();
  try{ return JSON.parse(t); }catch(e){ return {zalias:t.slice(0,1200)}; } }
let sid=null, P=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
    for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
      await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){}
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  try{sid=JSON.parse(await c.text()).id; out.sid=sid;}catch(e){}
  await miegok(9000);
  P=await faze('P'); out.P=P;
  if(!P||!P.cookie) throw new Error('nera cookie is P fazes');

  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
  await ctx.addCookies([{name:P.cookie_name,value:P.cookie,domain:'dev.avesa.lt',path:'/'}]);
  const pg=await ctx.newPage();
  let nr=0;
  const Z=async(vardas,fn)=>{ nr++; try{ const r=await fn(pg); out.zingsniai.push({nr,vardas,ok:true,rez:r===undefined?null:r}); }
    catch(e){ out.zingsniai.push({nr,vardas,ok:false,klaida:String(e).slice(0,300)});
      try{ const b=await pg.screenshot({fullPage:false}); await put('analize/fail_'+nr+'.png',b,VER+' fail '+nr); }catch(x){} } };
  await ((async function(pg,Z,P,put,VER){
  const U=P.url;
  const N=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0173|\u0105/g,'a').toLowerCase();
  const EUR=ct=>(ct/100).toFixed(2).replace('.',',');
  const BRUTO=EUR(P.bruto_ct), K10=EUR(Math.round(P.bruto_ct*0.9)), S15=EUR(Math.round(P.bruto_ct*0.85));
  const body=async p=>N(await p.textContent('body'));
  const submit=async(p,veiksmas,reiksme)=>{
    const f=p.locator('form:has(input[value="'+veiksmas+'"])');
    await f.locator('input[name=nuolaida_pct]').fill(reiksme);
    await Promise.all([p.waitForNavigation({timeout:60000}),f.locator('button').click()]);
    await p.waitForTimeout(1200); };

  await Z('atidaryti detale',async p=>{ await p.goto(U,{waitUntil:'domcontentloaded',timeout:60000});
    await p.waitForTimeout(1500);
    const h=await p.textContent('h2'); if(!/Prenumerata #/.test(h||'')) throw new Error('ne detale: '+String(h).slice(0,80));
    return h.trim(); });

  await Z('abu nuolaidu blokai matomi',async p=>{ const t=await body(p);
    if(t.indexOf('kliento asmenine nuolaida')<0) throw new Error('nera kliento bloko');
    if(t.indexOf('sios prenumeratos nuolaida')<0) throw new Error('nera sub bloko');
    if(t.indexOf('klientui nereikia jokio kodo')<0) throw new Error('nera paaiskinimo');
    return true; });

  await Z('pradzioje nuolaidos nera, suma bruto',async p=>{ const t=await body(p);
    if(t.indexOf(BRUTO)<0) throw new Error('nerasta bruto '+BRUTO);
    if(t.indexOf(K10)>=0) throw new Error('rodoma nuolaidos suma nors nuolaidos nera');
    return BRUTO; });

  await Z('kliento nuolaida 10 issaugoti',async p=>{ await submit(p,'nuolaida_klientas','10');
    const t=await body(p);
    if(t.indexOf('galioja visoms')<0) throw new Error('nera patvirtinimo zinutes');
    return true; });

  await Z('kliento lygis taikomas: -10% ir suma',async p=>{ const t=await body(p);
    if(t.indexOf('kliento asmenine nuolaida')<0) throw new Error('nera saltinio');
    if(t.indexOf('-10 %')<0 && t.indexOf('\u221210 %')<0) throw new Error('nerodoma -10 %');
    if(t.indexOf(K10)<0) throw new Error('nerasta suma po nuolaidos '+K10);
    if(t.indexOf(BRUTO)<0) throw new Error('dingo perbraukta bruto kaina');
    return K10; });

  await Z('prenumeratos 15% permusa kliento lygi',async p=>{ await submit(p,'nuolaida_sub','15');
    const t=await body(p);
    if(t.indexOf('permu')<0) throw new Error('nera permusimo zinutes');
    if(t.indexOf(S15)<0) throw new Error('nerasta suma '+S15);
    if(t.indexOf(K10)>=0) throw new Error('vis dar rodoma kliento lygio suma '+K10);
    return S15; });

  await Z('sub 0 isjungia nors klientas turi 10',async p=>{ await submit(p,'nuolaida_sub','0');
    const t=await body(p);
    if(t.indexOf('isjungta butent siai prenumeratai')<0) throw new Error('nera isjungimo zymes');
    if(t.indexOf(K10)>=0||t.indexOf(S15)>=0) throw new Error('vis dar taikoma nuolaida');
    if(t.indexOf(BRUTO)<0) throw new Error('suma neatsistate i bruto');
    return BRUTO; });

  await Z('istustinus sub grizta kliento lygis',async p=>{ await submit(p,'nuolaida_sub','');
    const t=await body(p);
    if(t.indexOf('galioja kliento lygis')<0) throw new Error('nera isvalymo zinutes');
    if(t.indexOf(K10)<0) throw new Error('negrizo kliento lygio suma '+K10);
    return K10; });

  await Z('sarase yra nuolaidos stulpelis',async p=>{
    await p.goto(U.replace(/&sid=\d+/,'&t=sarasas'),{waitUntil:'domcontentloaded',timeout:60000});
    await p.waitForTimeout(1200);
    const t=await body(p);
    if(t.indexOf('nuolaida')<0) throw new Error('nera stulpelio antrastes');
    if(t.indexOf('10 %')<0) throw new Error('sarase nerodoma 10 %');
    return true; });

  await Z('ekrano nuotrauka',async p=>{
    await p.goto(U,{waitUntil:'domcontentloaded',timeout:60000});
    await p.waitForTimeout(1500);
    await put('analize/nuolaidos_admin.png',await p.screenshot({fullPage:true}),VER+' ekranas');
    return 'analize/nuolaidos_admin.png'; });
}))(pg,Z,P,put,VER);
  out.VISKAS_ZALIA=out.zingsniai.every(z=>z.ok);
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,600); }
try{ const r=await faze('CL'); out.CL=r; }catch(e){}
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
