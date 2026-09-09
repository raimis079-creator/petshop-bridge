process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzMgYyDigJQgRTogbnVyYXN5bW8gbGlrdWNpbyBpcmFzeW1hczsgVDogcGF0aWtyYSArIDIgcHJla2l1IGR1b21lbnlzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZiA9IGlzc2V0KCRfR0VUWydwc19zMTY3M2MnXSkgPyAkX0dFVFsncHNfczE2NzNjJ10gOiAnJzsKICBpZiAoJGYhPT0nRScgJiYgJGYhPT0nVCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNjczIGMnLCdmYXplJz0+JGYpOwogICRwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAgdHJ5ewogICAgaWYoJGY9PT0nRScpewogICAgICAkYz1maWxlX2dldF9jb250ZW50cygkcCk7ICRvWydtZDVfcHJpZXMnXT1tZDUoJGMpOwogICAgICAkc2VuYXM9Ilx0XHRcdFx0XHRpZiAoICEgaXNfd3BfZXJyb3IoIFwkciApICkge1xuXHRcdFx0XHRcdFx0XCRwWydwZXJfcGFydGlqYSddID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICggaXNzZXQoIFwkclsnbGlrdXRpcyddICkgKSB7IFwkcFsndGFwbyddID0gKGludCkgXCRyWydsaWt1dGlzJ107IH1cblx0XHRcdFx0XHR9IjsKICAgICAgJG5hdWphcz0iXHRcdFx0XHRcdGlmICggISBpc193cF9lcnJvciggXCRyICkgKSB7XG5cdFx0XHRcdFx0XHQvKiB2OC41IChTMTY3Myk6IGBudXJhc3l0aSgpYCByYXPQviBUSUsgaSBgcHNfcGFydGlqb3Mua2lla2lzX2xpa29gLlxuXHRcdFx0XHRcdFx0ICAgQW5rc2NpYXUgY2lhIGJ1dm8gYHBlcl9wYXJ0aWphID0gdHJ1ZWAsIHRvZGVsIGxpa3V0aXMgTkVCVVZPXG5cdFx0XHRcdFx0XHQgICBpcmFzb21hczogcGFydGlqb3MgbnVrcmlzZGF2byBpa2kgMywgbyBBViBrb3J0ZWzEl2plIGxpa2Rhdm8gMTQuXG5cdFx0XHRcdFx0XHQgICBQcmllZGltYXMgKGBwcmlpbXRpKClgKSBsaWt1dGkgcGFrZWxpYSBwYXRzIOKAlCBtYXppbmltYXMgbmUuICovXG5cdFx0XHRcdFx0XHRpZiAoIGlzc2V0KCBcJHJbJ2xpa3V0aXMnXSApICkgeyBcJHBbJ3RhcG8nXSA9IChpbnQpIFwkclsnbGlrdXRpcyddOyB9XG5cdFx0XHRcdFx0fSI7CiAgICAgICRuPXN1YnN0cl9jb3VudCgkYywkc2VuYXMpOyAkb1sncmFkaW5pYWknXT0kbjsKICAgICAgaWYoJG4hPT0xKXsgJG9bJ0tMQUlEQSddPSdyYWRvICcuJG47IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgJGM9c3RyX3JlcGxhY2UoJHNlbmFzLCRuYXVqYXMsJGMpOwogICAgICBpZighQHRva2VuX2dldF9hbGwoJGMsIFRPS0VOX1BBUlNFKSl7ICRvWydLTEFJREEnXT0nVE9LRU5fUEFSU0UnOyB3cF9zZW5kX2pzb24oJG8pOyB9CiAgICAgICRiYWs9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRiYWspKSBAbWtkaXIoJGJhaywwNzU1LHRydWUpOwogICAgICBmaWxlX3B1dF9jb250ZW50cygkYmFrLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwLmJha19zMTY3MycsIGZpbGVfZ2V0X2NvbnRlbnRzKCRwKSk7CiAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRwLCRjKTsgJG9bJ21kNV9wbyddPW1kNShmaWxlX2dldF9jb250ZW50cygkcCkpOwoKICAgICAgLyogRHVvbWVueXM6IGR2aSBwcmVrZXMsIGt1cmlvc2UgbGlrdXRpcyBsaWtvIHNlbmFzIHBvIG51cmFzeW1vLiAqLwogICAgICAkdD0kd3BkYi0+cHJlZml4Lidwc19wYXJ0aWpvcyc7CiAgICAgIGZvcmVhY2goYXJyYXkoMTczMzksMTczNTQpIGFzICRwaWQpewogICAgICAgICRzdW09KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShraWVraXNfbGlrbyksMCkgRlJPTSAkdCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBhdHNhdWt0YT0wIiwkcGlkKSk7CiAgICAgICAgJG9bJ3RhaXN5dGEnXVskcGlkXT1hcnJheSgnYnV2byc9PmdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCd0YXBvJz0+JHN1bSk7CiAgICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsJHN1bSk7CiAgICAgICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NvdXJjZXMnKSkgUGV0c2hvcF9Tb3VyY2VzOjpzaW5jaHJvbml6dW90aSgkcGlkKTsKICAgICAgfQogICAgfSBlbHNlIHsKICAgICAgJHQ9JHdwZGItPnByZWZpeC4ncHNfcGFydGlqb3MnOwogICAgICAkYmFrPShhcnJheSkgZ2V0X29wdGlvbigncHNfczE2NzFfYXRzYXJnaW5lJyxhcnJheSgpKTsKICAgICAgJGJsb2dpPWFycmF5KCk7CiAgICAgIGZvcmVhY2goYXJyYXlfbWFwKCdpbnR2YWwnLGFycmF5X2tleXMoJGJhaykpIGFzICRwaWQpewogICAgICAgICRzdW09KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShraWVraXNfbGlrbyksMCkgRlJPTSAkdCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBhdHNhdWt0YT0wIiwkcGlkKSk7CiAgICAgICAgaWYoJHN1bSE9PShpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSkpICRibG9naVtdPSRwaWQ7CiAgICAgIH0KICAgICAgJG9bJ25lc3V0YW1wYSddPSRibG9naTsKICAgICAgZm9yZWFjaChhcnJheSgxNzMzOSwxNzM1NCkgYXMgJHBpZCl7CiAgICAgICAgJG9bJ3B2eiddWyRwaWRdPWFycmF5KCdhdic9PmdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpLAogICAgICAgICAgJ3BhcnRpam9zJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShraWVraXNfbGlrbyksMCkgRlJPTSAkdCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBhdHNhdWt0YT0wIiwkcGlkKSksCiAgICAgICAgICAncGFyZHVvZGFtYSc9PlBldHNob3BfU3RvY2tfU2VydmljZTo6cGFyZHVvZGFtYSgkcGlkKVsncXR5J10pOwogICAgICB9CiAgICAgICRvWydmcm9udCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjE1KSkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-190346';
const GKEY='ps_s1673c';
const PHASES=["E", "T"];
const OUT='analize/s1673_c.json';
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
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
