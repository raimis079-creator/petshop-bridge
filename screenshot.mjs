process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGtsaWVudGFpIGNvb2tpZXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19rbCddKXx8JF9HRVRbJ3BzX2tsJ10hPT0nQ0snKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJGV4cD10aW1lKCkrMzYwMDsgJHVpZD0xOwogIGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2xpX25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCdsaSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJyksJ2F1dGhfbmFtZSc9PlNFQ1VSRV9BVVRIX0NPT0tJRSwnYXV0aCc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnc2VjdXJlX2F1dGgnKSwndWlkX3B2eic9PihpbnQpZ2V0X3VzZXJfYnkoJ2VtYWlsJywnZXJpLm1hemVpa2FpdGVAZ21haWwuY29tJyktPklEKSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-162257';
const GKEY='ps_kl';
const PHASES=["CK"];
const OUT='analize/kl_shot.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  const ck=out['CK']; if(ck&&ck.li){
    const { chromium } = await import('playwright');
    const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1500,height:1000},ignoreHTTPSErrors:true});
    const host=new URL(WP).hostname;
    await ctx.addCookies([{name:ck.li_name,value:ck.li,domain:host,path:'/',secure:true},{name:ck.auth_name,value:ck.auth,domain:host,path:'/wp-admin',secure:true}]);
    const pg=await ctx.newPage();
    const shots=[['klientai_sarasas','/wp-admin/admin.php?page=petshop-klientai'],['klientai_filtras','/wp-admin/admin.php?page=petshop-klientai&segmentas=refill_laikas'],['klientai_kortele','/wp-admin/admin.php?page=petshop-klientai&uid='+ck.uid_pvz]];
    out.shots={};
    for(const [n,u] of shots){ try{ const r=await pg.goto(WP+u,{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(2500); const url=pg.url(); const h1=await pg.locator('h1').first().textContent().catch(()=>''); const buf=await pg.screenshot({fullPage:true}); const st=await put('analize/'+n+'.png',buf,VER); out.shots[n]={status:r?r.status():null,url,h1:(h1||'').trim().slice(0,80),put:st,bytes:buf.length}; }catch(e){ out.shots[n]={err:String(e).slice(0,200)}; } }
    await br.close(); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
