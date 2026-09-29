process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM1YSBneXZ1bmFpLmx0IHNlbm8gcG9ydGFsbyByZWNvbiAocmVhZC1vbmx5OyBrb25maWd1IGZhaWxhaSBuZXNrYWl0b21pKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MzVhJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzM1YSddOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsgJHI9Wyd2Jz0+J1MxNzM1YScsJ2ZhemUnPT4kZl07ICRUMD1taWNyb3RpbWUodHJ1ZSk7CiAgJGxzPWZ1bmN0aW9uKCRwLCRtYXg9NjApeyAkbz1bXTsgaWYoIUBpc19kaXIoJHApKSByZXR1cm4gJ05FRElSJzsgZm9yZWFjaChAc2NhbmRpcigkcCk/OltdIGFzICRuKXsgaWYoJG49PScuJ3x8JG49PScuLicpIGNvbnRpbnVlOyAkcT0iJHAvJG4iOyAkb1tdPShpc19kaXIoJHEpPydEICc6J0YgJykuJG4uKGlzX2ZpbGUoJHEpPycgJy5yb3VuZChmaWxlc2l6ZSgkcSkvMTAyNCkuJ2snOicnKS4nICcuZGF0ZSgnWS1tLWQnLEBmaWxlbXRpbWUoJHEpKTsgaWYoY291bnQoJG8pPj0kbWF4KXskb1tdPScuLi4nO2JyZWFrO30gfSByZXR1cm4gJG87IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRyWyd1c2VyJ109Z2V0X2N1cnJlbnRfdXNlcigpOyAkclsnaG9tZSddPWdldGVudignSE9NRScpOyAkclsnYWJzcGF0aCddPUFCU1BBVEg7ICRyWydkb2Nfcm9vdCddPSRfU0VSVkVSWydET0NVTUVOVF9ST09UJ10/PycnOwogICAgJGg9ZGlybmFtZShkaXJuYW1lKHJ0cmltKEFCU1BBVEgsJy8nKSkpOwogICAgZm9yZWFjaChhcnJheV91bmlxdWUoWycvaG9tZS9neXZ1bmFpMicsZ2V0ZW52KCdIT01FJyksJGhdKSBhcyAkZCl7IGlmKCRkKSAkclsnbHM6Jy4kZF09JGxzKCRkKTsgfQogICAgZm9yZWFjaChbJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMnLCcvaG9tZS9neXZ1bmFpMi9iYWNrdXBzJywnL2hvbWUvZ3l2dW5haTIvcHVibGljX2h0bWwnXSBhcyAkZCkgJHJbJ2xzOicuJGRdPSRscygkZCw4MCk7CiAgICBpZihAaXNfZGlyKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zJykpIGZvcmVhY2goc2NhbmRpcignL2hvbWUvZ3l2dW5haTIvZG9tYWlucycpIGFzICRkb20peyBpZigkZG9tWzBdPT0nLicpIGNvbnRpbnVlOyAkclsnbHM6ZG9tYWlucy8nLiRkb21dPSRscygiL2hvbWUvZ3l2dW5haTIvZG9tYWlucy8kZG9tIiwzMCk7ICRwaD0iL2hvbWUvZ3l2dW5haTIvZG9tYWlucy8kZG9tL3B1YmxpY19odG1sIjsgaWYoaXNfZGlyKCRwaCkpICRyWydsczpkb21haW5zLycuJGRvbS4nL3B1YmxpY19odG1sJ109JGxzKCRwaCw4MCk7IH0KICB9CiAgaWYoJGY9PT0nMicpewogICAgJGNhbmRzPVtdOyBmb3JlYWNoKGdsb2IoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvKi9wdWJsaWNfaHRtbCcpIGFzICRwKSAkY2FuZHNbXT0kcDsgJGNhbmRzW109Jy9ob21lL2d5dnVuYWkyL3B1YmxpY19odG1sJzsKICAgIGZvcmVhY2goJGNhbmRzIGFzICRwKXsgaWYoIWlzX2RpcigkcCkpIGNvbnRpbnVlOwogICAgICAkeD1bJ3dwJz0+ZmlsZV9leGlzdHMoIiRwL3dwLWNvbmZpZy5waHAiKSwnam9vbWxhJz0+ZmlsZV9leGlzdHMoIiRwL2NvbmZpZ3VyYXRpb24ucGhwIikmJmlzX2RpcigiJHAvYWRtaW5pc3RyYXRvciIpLCdkcnVwYWwnPT5pc19kaXIoIiRwL3NpdGVzL2RlZmF1bHQiKSwnbGFyYXZlbCc9PmlzX2RpcigiJHAvLi4vYXBwIiksJ2luZGV4X3lyYSc9PmZpbGVfZXhpc3RzKCIkcC9pbmRleC5waHAiKV07CiAgICAgICR4WydrYXRhbG9nYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKHNjYW5kaXIoJHApLGZ1bmN0aW9uKCRuKXVzZSgkcCl7cmV0dXJuICRuWzBdIT0nLicmJmlzX2RpcigiJHAvJG4iKTt9KSk7CiAgICAgIGlmKGlzX2RpcigiJHAvd3AtY29udGVudC90aGVtZXMiKSkgJHhbJ3dwX3RlbW9zJ109YXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoc2NhbmRpcigiJHAvd3AtY29udGVudC90aGVtZXMiKSxbJy4nLCcuLiddKSk7CiAgICAgIGlmKGlzX2RpcigiJHAvd3AtY29udGVudC9wbHVnaW5zIikpICR4Wyd3cF9wbHVnaW5haSddPWFycmF5X3ZhbHVlcyhhcnJheV9kaWZmKHNjYW5kaXIoIiRwL3dwLWNvbnRlbnQvcGx1Z2lucyIpLFsnLicsJy4uJ10pKTsKICAgICAgJGNudD0wOyAkbmV3ZXN0PTA7ICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJHAsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpLFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3I6OlNFTEZfRklSU1QpOyBmb3JlYWNoKCRpdCBhcyAkZmkpeyAkY250Kys7ICRtdD0kZmktPmdldE1UaW1lKCk7IGlmKCRtdD4kbmV3ZXN0KSRuZXdlc3Q9JG10OyBpZigkY250PjMwMDAwKSBicmVhazsgfQogICAgICAkeFsnZmFpbHUnXT0kY250LigkY250PjMwMDAwPycrJzonJyk7ICR4WyduYXVqYXVzaWFzJ109ZGF0ZSgnWS1tLWQnLCRuZXdlc3QpOyAkclsnY21zOicuJHBdPSR4OyB9CiAgICBnbG9iYWwgJHdwZGI7ICRyWydkYl9kYWJhcnRpbmUnXT1EQl9OQU1FOyAkclsnZGJfbWF0b21vcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIERBVEFCQVNFUyIpOwogICAgZm9yZWFjaCgkclsnZGJfbWF0b21vcyddIGFzICRkYil7IGlmKCRkYj09PURCX05BTUV8fGluX2FycmF5KCRkYixbJ2luZm9ybWF0aW9uX3NjaGVtYScsJ215c3FsJywncGVyZm9ybWFuY2Vfc2NoZW1hJywnc3lzJ10pKSBjb250aW51ZTsgJHJbJ2RiOicuJGRiXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0YWJsZV9uYW1lIHQsIHRhYmxlX3Jvd3MgbiwgUk9VTkQoKGRhdGFfbGVuZ3RoK2luZGV4X2xlbmd0aCkvMTAyNC8xMDI0LDEpIG1iIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLnRhYmxlcyBXSEVSRSB0YWJsZV9zY2hlbWE9JyIuZXNjX3NxbCgkZGIpLiInIE9SREVSIEJZIG4gREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7IH0KICAgICRhcmNoPVtdOyBmb3JlYWNoKFsnL2hvbWUvZ3l2dW5haTIvYmFja3VwcycsJy9ob21lL2d5dnVuYWkyJywnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9neXZ1bmFpLmx0JywnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9wZXRzaG9wLmx0JywnL2hvbWUvZ3l2dW5haTIvYWRtaW5fYmFja3VwcyddIGFzICRkKXsgZm9yZWFjaChnbG9iKCIkZC8qLnt0YXIsZ3osemlwLHNxbCx0YXIuZ3osdGd6fSIsR0xPQl9CUkFDRSk/OltdIGFzICRhKSAkYXJjaFtdPSRhLicgJy5yb3VuZChmaWxlc2l6ZSgkYSkvMTA0ODU3NikuJ01CICcuZGF0ZSgnWS1tLWQnLGZpbGVtdGltZSgkYSkpOyB9ICRyWydhcmNoeXZhaSddPSRhcmNoOwogICAgJHJbJ2RmX2hvbWVfTUInXT1yb3VuZChAZGlza19mcmVlX3NwYWNlKCcvaG9tZS9neXZ1bmFpMicpLzEwNDg1NzYpOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICAkclsndHJ1a21lX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJFQwLDEpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-065616';
const GKEY='ps_s1735a';
const PHASES=["1", "2"];
const OUT='analize/s1735_a.json';
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
